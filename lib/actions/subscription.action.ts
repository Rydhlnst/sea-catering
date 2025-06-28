"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose"
import Subscription from "@/models/Subscription.model";
import { revalidatePath } from "next/cache";

interface SubscriptionData {
  plan: string; // Ini akan menjadi plan ID
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
  // 1. Dapatkan sesi pengguna untuk keamanan
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Anda harus login untuk berlangganan." };
  }
  const userId = session.user.id;

  try {
    await dbConnect();

    // 2. Cek apakah pengguna sudah memiliki langganan aktif
    const existingSubscription = await Subscription.findOne({ user: userId });
    if (existingSubscription) {
      return {
        success: false,
        error: "Anda sudah memiliki langganan aktif.",
      };
    }

    // 3. Buat dokumen langganan baru di database
    await Subscription.create({
      user: userId,
      plan: data.plan,
      mealTypes: data.mealTypes,
      deliveryDays: data.deliveryDays,
      address: data.address,
      allergies: data.allergies,
      active: true,
    });

    revalidatePath("/dashboard");

    return { success: true };
    
  } catch (error) {
    console.error("Error creating subscription:", error);
    // Mengembalikan pesan error yang lebih umum ke client
    return {
      success: false,
      error: "Terjadi kesalahan saat membuat langganan Anda. Silakan coba lagi.",
    };
  }
}