"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";
import { AddPlanSchema } from "../validations";
import { revalidatePath } from "next/cache";
import Plan from "@/models/Plan.model";

export interface AdminStats {
  newSubscriptions: number;
  mrr: number;
  reactivations: number;
  totalActive: number;
}

export async function getAdminStats(from: Date, to: Date): Promise<AdminStats> {
  await dbConnect();

  // 1. Ambil semua langganan baru dalam rentang waktu
  const subscriptions = await Subscription.find({
    createdAt: { $gte: from, $lte: to },
  }).populate("plan");

  // 2. Hitung jumlah langganan baru
  const newSubscriptions = subscriptions.length;

  // 3. Hitung pendapatan bulanan (MRR)
  const mrr = subscriptions.reduce((total, sub) => {
    const price =
      typeof sub.plan === "object" && "price" in sub.plan ? sub.plan.price : 0;
    return total + (price ?? 0);
  }, 0);

  // 4. Dapatkan total langganan aktif
  const totalActive = await Subscription.countDocuments({ active: true });

  return {
    newSubscriptions,
    mrr,
    reactivations: 0, // 🔧 Belum diimplementasi
    totalActive,
  };
}

export async function addPlan(formData: FormData) {
  const session = await auth();
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  const raw = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
  };

  const parsed = AddPlanSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid input");

  await dbConnect();

  const exists = await Plan.findOne({ name: parsed.data.name });
  if (exists) throw new Error("Plan already exists");

  await Plan.create(parsed.data);
  revalidatePath("/dashboard");

  return { success: true };
}