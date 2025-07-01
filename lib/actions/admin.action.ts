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

/**
 * Fetches key admin metrics for the dashboard within a given date range.
 * 
 * @param from - Start date for filtering new subscriptions
 * @param to - End date for filtering new subscriptions
 * @returns Aggregated statistics including number of new subscriptions, MRR, total active subscriptions, and reactivations (placeholder).
 */
export async function getAdminStats(from: Date, to: Date): Promise<AdminStats> {
  // Establish DB connection
  await dbConnect();

  // 1. Retrieve all subscriptions created in the given date range
  const subscriptions = await Subscription.find({
    createdAt: { $gte: from, $lte: to },
  }).populate("plan");

  // 2. Count how many new subscriptions were created
  const newSubscriptions = subscriptions.length;

  // 3. Calculate Monthly Recurring Revenue (MRR)
  const mrr = subscriptions.reduce((total, sub) => {
    const price =
      typeof sub.plan === "object" && "price" in sub.plan ? sub.plan.price : 0;
    return total + (price ?? 0);
  }, 0);

  // 4. Count all currently active subscriptions
  const totalActive = await Subscription.countDocuments({ active: true });

  return {
    newSubscriptions,
    mrr,
    reactivations: 0, // Currently unused; logic for reactivations is pending
    totalActive,
  };
}

/**
 * Adds a new meal plan to the database.
 * - Only accessible by admin users
 * - Validates input from form data using Zod
 * - Prevents duplicate plan names
 * 
 * @param formData - Incoming FormData containing `name` and `price`
 * @returns Success status if creation is successful
 * @throws Error if user is unauthorized, validation fails, or plan already exists
 */
export async function addPlan(formData: FormData) {
  const session = await auth();

  // Ensure only admin can perform this action
  if (session?.user.role !== "admin") {
    throw new Error("Unauthorized");
  }

  // Parse raw form values
  const raw = {
    name: formData.get("name"),
    price: Number(formData.get("price")),
  };

  // Validate input using Zod schema
  const parsed = AddPlanSchema.safeParse(raw);
  if (!parsed.success) throw new Error("Invalid input");

  await dbConnect();

  // Prevent duplicate plan name
  const exists = await Plan.findOne({ name: parsed.data.name });
  if (exists) throw new Error("Plan already exists");

  // Create the new plan
  await Plan.create(parsed.data);

  // Revalidate dashboard to reflect new plan
  revalidatePath("/dashboard");

  return { success: true };
}
