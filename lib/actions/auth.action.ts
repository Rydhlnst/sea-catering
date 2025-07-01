"use server";

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";

import action from "../handlers/action";
import handleError from "../handlers/error";
import { SignInSchema, SignUpSchema } from "../validations";
import { ActionResponse, ErrorResponse } from "@/types/global";
import { AuthCredentials } from "@/types/action";
import User from "@/models/User.model";
import Account from "@/models/Account.model";

const DASHBOARD_URL = "/dashboard";

type SignUpParams = AuthCredentials & { callbackUrl?: string };
type SignInParams = Pick<AuthCredentials, "email" | "password"> & { callbackUrl?: string };

/**
 * Mendaftarkan pengguna baru dengan kredensial.
 * Menggunakan transaksi database untuk memastikan integritas data.
 * Otomatis login setelah pendaftaran berhasil.
 */
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
    // Validasi data unik di dalam transaksi
    const existingUser = await User.findOne({ 
        $or: [{ email }, { username }, { phoneNumber }] 
    }).session(session);

    if (existingUser) {
      if (existingUser.email === email) throw new Error("Email ini sudah terdaftar.");
      if (existingUser.username === username) throw new Error("Username ini sudah digunakan.");
      if (existingUser.phoneNumber === phoneNumber) throw new Error("Nomor telepon ini sudah digunakan.");
    }

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

    // Commit transaksi untuk menyimpan pengguna ke DB secara permanen
    await session.commitTransaction();

    // Panggil signIn untuk otomatis login.
    // signIn akan melempar error redirect khusus jika berhasil, yang akan ditangkap di bawah.
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    // Baris ini secara teknis tidak akan pernah tercapai karena `signIn` akan melempar error.
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Jika error berasal dari `signIn`, itu adalah error redirect yang valid.
    // Biarkan Next.js yang menanganinya dengan melemparnya kembali.
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }
    
    // Untuk semua error lain (misal: "Email sudah terdaftar"), format dengan handler.
    return handleError(error) as ErrorResponse;
  } finally {
    // Pastikan sesi selalu ditutup untuk mencegah kebocoran koneksi.
    await session.endSession();
  }
}

/**
 * Memproses login pengguna dengan kredensial.
 * Fungsi ini mendelegasikan semua logika otentikasi ke fungsi 'authorize' di auth.ts.
 */
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
    // 💡 PERBAIKAN: Langsung panggil signIn.
    // Tidak perlu lagi memeriksa user, account, atau password di sini.
    // Semua logika itu seharusnya sudah ada di dalam fungsi 'authorize' di auth.ts.
    // Ini membuat 'authorize' sebagai satu-satunya sumber kebenaran untuk login.
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Sama seperti signUp, tangani error redirect dari signIn.
    // Error lain (seperti 'CredentialsSignin' yang dilempar dari 'authorize') 
    // akan ditangani di sini dan diformat oleh handleError.
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // `handleError` akan menangkap error `CredentialsSignin` dan mengambil pesan yang relevan.
    return handleError(error) as ErrorResponse;
  }
}