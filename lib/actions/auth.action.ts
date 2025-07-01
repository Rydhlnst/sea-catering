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
import { UnauthorizedError, ValidationError } from "../http-errors";
import { cleanObject } from "../utils/object";

const DASHBOARD_URL = "/dashboard";

type SignUpParams = AuthCredentials & { callbackUrl?: string };
type SignInParams = Pick<AuthCredentials, "email" | "password"> & {
  callbackUrl?: string;
};

/**
 * Registers a new user using credentials.
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
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    }).session(session);

    if (existingUser) {
      const fieldErrors: Record<string, string[]> = {};
      if (existingUser.email === email)
        fieldErrors.email = ["This email is already registered."];
      if (existingUser.username === username)
        fieldErrors.username = ["This username is already taken."];
      if (existingUser.phoneNumber === phoneNumber)
        fieldErrors.phoneNumber = ["This phone number is already used."];
      throw new ValidationError(fieldErrors);
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const cleanedUserData = cleanObject({ name, username, email, phoneNumber });

    const [newUser] = await User.create([cleanedUserData], { session });

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

    await session.commitTransaction();

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

/**
 * Handles login process using user credentials.
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
    const account = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    }).populate("userId");

    if (!account || !account.password || !account.userId) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }

    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    return handleError(error) as ErrorResponse;
  }
}
