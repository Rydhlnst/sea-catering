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
        $or: [{ email }, { username }, { phoneNumber }] 
    }).session(session);

    if (existingUser) {
      if (existingUser.email === email) throw new Error("This email is already registered.");
      if (existingUser.username === username) throw new Error("This username is already taken.");
      if (existingUser.phoneNumber === phoneNumber) throw new Error("This phone number is already used.");
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

    // This line is technically never reached because signIn throws a redirect
    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Rollback transaction if an error occurs
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    // Pass through redirect errors triggered by signIn
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // For all other errors (e.g., validation), format with custom error handler
    return handleError(error) as ErrorResponse;
  } finally {
    // Always end the session to prevent connection leaks
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
    // Step 2: Delegate authentication to NextAuth signIn function
    // All logic (user lookup, password check) is handled inside the custom `authorize`
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DASHBOARD_URL,
    });

    return { success: true };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Allow NEXT_REDIRECT errors to propagate
    if (error.message?.includes("NEXT_REDIRECT")) {
      throw error;
    }

    // Handle authentication failures and other issues
    return handleError(error) as ErrorResponse;
  }
}
