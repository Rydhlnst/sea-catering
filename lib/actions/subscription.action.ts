"use server";

import mongoose from "mongoose";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";
import { revalidatePath } from "next/cache";
import User from "@/models/User.model";

interface SubscriptionData {
  plan: string; // Plan ObjectId as string
  mealTypes: ("Breakfast" | "Lunch" | "Dinner")[];
  deliveryDays: string[];
  address: string;
  allergies?: string;
}

interface ActionResponse {
  success: boolean;
  error?: string;
}

export async function createSubscription(
  data: SubscriptionData
): Promise<ActionResponse> {
  try {
    const session = await auth();

    // Pastikan user login
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Anda harus login untuk berlangganan.",
      };
    }

    // Validasi ID pengguna
    const userId = session.user.id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return {
        success: false,
        error: "ID pengguna tidak valid.",
      };
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Koneksi ke database
    await dbConnect();

    // Cek jika user sudah memiliki langganan aktif
    const existing = await Subscription.findOne({
      user: userObjectId,
      status: "active",
    });

    if (existing) {
      return {
        success: false,
        error: "Anda sudah memiliki langganan aktif.",
      };
    }

    // Buat subscription baru
    const newSubscription = await Subscription.create({
      user: userObjectId,
      plan: new mongoose.Types.ObjectId(data.plan),
      mealTypes: data.mealTypes,
      deliveryDays: data.deliveryDays,
      address: data.address,
      allergies: data.allergies,
      status: "active",
    });

    // Tambahkan subscription ke array `subscriptions` di model User
    await User.findByIdAndUpdate(userObjectId, {
      $push: { subscriptions: newSubscription._id },
    });

    // Revalidate halaman dashboard agar data langganan terbaru muncul
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("[SUBSCRIPTION_ERROR]", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat membuat langganan. Silakan coba lagi.",
    };
  }
}
