"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { AuthCredentials } from "@/types/action";
import User from "@/models/User.model";
import Account from "@/models/Account.model";

const DASHBOARD_URL = "/dashboard";

type SignUpParams = AuthCredentials & { callbackUrl?: string };
type SignInParams = Pick<AuthCredentials, "email" | "password"> & { callbackUrl?: string };

export async function signUpWithCredentials(
  params: SignUpParams
): Promise<ActionResponse> {
  const { callbackUrl, ...credentials } = params;
  const validationResult = await action({
    params: credentials,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password, phoneNumber } =
    validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) throw new Error("User with this email already exists");

    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) throw new Error("Username already exists");

    const existingPhoneNumber = await User.findOne({ phoneNumber }).session(
      session
    );
    if (existingPhoneNumber) throw new Error("Phone number is already in use");

    const hashedPassword = await bcrypt.hash(password, 12);

    const [newUser] = await User.create(
      [{ username, name, email, phoneNumber }],
      { session }
    );

    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    );

    // Langkah penting: commit transaksi SEBELUM memanggil signIn
    await session.commitTransaction();

    // Panggil signIn SETELAH transaksi selesai.
    // Error redirect dari sini akan ditangani oleh blok catch di bawah.
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    // Kode ini tidak akan tercapai jika signIn berhasil
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Cek apakah transaksi masih aktif sebelum mencoba abort.
    // Jika sudah di-commit, session.inTransaction() akan false.
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Tangani error redirect secara khusus
    if (
      error.type === "CredentialsSignin" ||
      error.message?.includes("NEXT_REDIRECT")
    ) {
      throw error; // Biarkan Next.js yang menangani redirect
    }
    
    // Untuk semua error lain, kembalikan respons error yang diformat
    return handleError(error) as ErrorResponse;
  } finally {
    // Selalu tutup session di akhir
    await session.endSession();
  }
}

// Tidak ada perubahan yang diperlukan di signInWithCredentials karena tidak menggunakan transaksi
export async function signInWithCredentials(
  params: SignInParams
): Promise<ActionResponse> {
  const { callbackUrl, ...credentials } = params;
  const validationResult = await action({
    params: credentials,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) throw new NotFoundError("User not found");

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) throw new NotFoundError("Account not found");

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password
    );
    if (!passwordMatch) throw new Error("Password does not match");

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (
      error.type === "CredentialsSignin" ||
      error.message?.includes("NEXT_REDIRECT")
    ) {
      throw error;
    }
    return handleError(error) as ErrorResponse;
  }
}