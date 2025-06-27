import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import User from "@/models/User.model";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();

        const users = await User.find();

        return NextResponse.json({success: true, data: users}, {status:200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Create User
export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();

    // Validasi dengan Zod
    const validatedData = UserSchema.safeParse(body);

    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const { email, username, phoneNumber } = validatedData.data;

    // Cek apakah email sudah digunakan
    if (email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ValidationError({ email: ["Email already in use"] });
      }
    }

    // Cek username sudah digunakan
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      throw new ValidationError({ username: ["Username already taken"] });
    }

    // Cek nomor HP sudah digunakan
    const existingPhone = await User.findOne({ phoneNumber });
    if (existingPhone) {
      throw new ValidationError({ phoneNumber: ["Phone number already registered"] });
    }

    // Simpan user
    const newUser = await User.create(validatedData.data);

    return NextResponse.json({ success: true, data: newUser }, { status: 201 });

  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}