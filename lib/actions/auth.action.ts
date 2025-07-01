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


const DASHBOARD_URL = "/dashboard";

type SignUpParams = AuthCredentials & { callbackUrl?: string };
type SignInParams = Pick<AuthCredentials, "email" | "password"> & {
  callbackUrl?: string;
};

/**
 * Registers a new user using credentials.
 * - Validates input using Zod
 * - Checks for uniqueness of email, username, and phone number
 * - Creates both User and Account documents in a transaction
 * - Automatically signs in the user upon success
 */
export async function signUpWithCredentials(
  params: SignUpParams
): Promise<ActionResponse> {
  const { callbackUrl, ...credentials } = params;

  // Step 1: Validate input with schema
  const validationResult = await action({
    params: credentials,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password, phoneNumber } =
    validationResult.params!;

  // Step 2: Start a MongoDB session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Step 3: Check for existing user by email, username, or phone number
    const existingUser = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    }).session(session);

    if (existingUser) {
      const fieldErrors: Record<string, string[]> = {};
      if (existingUser.email === email) fieldErrors.email = ["This email is already registered."];
      if (existingUser.username === username) fieldErrors.username = ["This username is already taken."];
      if (existingUser.phoneNumber === phoneNumber) fieldErrors.phoneNumber = ["This phone number is already used."];
      throw new ValidationError(fieldErrors);
    }

    // Step 4: Hash password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    // Step 5: Create User document
    const [newUser] = await User.create(
      [{ username, name, email, phoneNumber }],
      { session }
    );

    // Step 6: Create corresponding Account for authentication
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

    // Step 7: Commit the transaction
    await session.commitTransaction();

    // Step 8: Automatically sign in the user after successful registration
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
 * - Validates input with schema
 * - Delegates login logic to the `authorize` function defined in `auth.ts`
 * - Handles redirect and error responses
 */
export async function signInWithCredentials(
  params: SignInParams
): Promise<ActionResponse> {
  const { callbackUrl, ...credentials } = params;

  // Step 1: Validate email and password with schema
  const validationResult = await action({
    params: credentials,
    schema: SignInSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    // Step 2: Check if user and account exist
    const account = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    }).populate("userId");

    if (!account || !account.password || !account.userId) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }

    // Step 3: Verify password using bcrypt
    const isValid = await bcrypt.compare(password, account.password);
    if (!isValid) {
      throw new UnauthorizedError("Email or password is incorrect.");
    }

    // Step 4: Proceed with signIn
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
