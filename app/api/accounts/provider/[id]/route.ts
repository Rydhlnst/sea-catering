
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import Account from "@/models/Account.model";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";


// GET /API/USER/[id]
export async function GET(_: Request, { params }: {params: Promise<{id: string}>}) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const account = await Account.findById(id);

        if (!account) throw new NotFoundError("Account");
        return NextResponse.json({success: true, data: account}, {status: 200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Delete 
export async function DELETE(_: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        const account = await Account.findByIdAndDelete(id);

        if (!account) throw new NotFoundError("Account");
        return NextResponse.json({success: true, data: account}, {status: 204})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}

// Update
export async function PUT(request: Request, {params}: {params: Promise<{id: string}>}) {
    const {id} = await params;
    if(!id) throw new NotFoundError("Account");

    try {
        await dbConnect();

        // Mengambil inputan dari body 
        const body = await request.json();

        // Akan divalidasi datanya dari userschemanya
        const validatedData = AccountSchema.partial().safeParse(body);

        if(!validatedData.success) throw new ValidationError(validatedData.error.flatten().fieldErrors)

        const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {new: true})

        if (!updatedAccount) throw new NotFoundError("Account");
        return NextResponse.json({success: true, data: updatedAccount}, {status: 200})
    } catch (error) {
        return handleError(error, "api") as APIErrorResponse
    }
}