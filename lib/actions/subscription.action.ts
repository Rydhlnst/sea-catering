"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";
import User from "@/models/User.model";
import { revalidatePath } from "next/cache";

interface SubscriptionData {
  plan: string;
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
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { success: false, error: "Anda harus login untuk berlangganan." };
    }

    await dbConnect();

    // Cari user berdasarkan email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "Pengguna tidak ditemukan." };
    }

    const userId = user._id;

    // Cek apakah user sudah punya langganan
    const existing = await Subscription.findOne({ user: userId });
    if (existing) {
      return {
        success: false,
        error: "Anda sudah memiliki langganan aktif.",
      };
    }

    // Buat subscription baru
    const newSubscription = await Subscription.create({
      user: userId,
      plan: data.plan,
      mealTypes: data.mealTypes,
      deliveryDays: data.deliveryDays,
      address: data.address,
      allergies: data.allergies,
    });

    // Tambahkan subscription ke field `subscriptions` milik user
    await User.findByIdAndUpdate(userId, {
      $push: { subscriptions: newSubscription._id },
    });

    // Revalidate halaman dashboard
    revalidatePath("/dashboard");

    console.log("✅ Langganan berhasil dibuat:", newSubscription._id);

    return { success: true };
  } catch (error) {
    console.error("createSubscription error:", error);
    return {
      success: false,
      error: "Terjadi kesalahan saat membuat langganan. Silakan coba lagi.",
    };
  }
}
