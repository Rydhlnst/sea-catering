"use server";

import { auth } from "@/auth";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";
import User from "@/models/User.model";
import { revalidatePath } from "next/cache";

// Type for the expected subscription form data
interface SubscriptionData {
  plan: string;
  mealTypes: ("Breakfast" | "Lunch" | "Dinner")[];
  deliveryDays: string[];
  address: string;
  allergies?: string;
}

// Standardized response type for the action
interface ActionResponse {
  success: boolean;
  error?: string;
}

/**
 * Server action to create a new subscription for a logged-in user.
 * - Verifies authentication
 * - Ensures the user doesn't already have an active subscription
 * - Saves the subscription and updates the user's record
 * - Revalidates the dashboard page to reflect the new subscription
 */
export async function createSubscription(
  data: SubscriptionData
): Promise<ActionResponse> {
  try {
    // Step 1: Verify user authentication
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { success: false, error: "You must be logged in to subscribe." };
    }

    // Step 2: Connect to the MongoDB database
    await dbConnect();

    // Step 3: Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found in the database." };
    }

    const userId = user._id;

    // Step 4: Check if the user already has an active subscription
    const existing = await Subscription.findOne({ user: userId });
    if (existing) {
      return {
        success: false,
        error: "You already have an active subscription.",
      };
    }

    // Step 5: Create a new subscription document
    const newSubscription = await Subscription.create({
      user: userId,
      plan: data.plan,
      mealTypes: data.mealTypes,
      deliveryDays: data.deliveryDays,
      address: data.address,
      allergies: data.allergies,
    });

    // Step 6: Update the user's `subscriptions` array with the new subscription
    await User.findByIdAndUpdate(userId, {
      $push: { subscriptions: newSubscription._id },
    });

    // Step 7: Revalidate the dashboard page to reflect the new data
    revalidatePath("/dashboard");

    // Log success for debugging purposes
    console.log("Subscription successfully created:", newSubscription._id);

    return { success: true };
  } catch (error) {
    // Handle and log server-side or database errors
    console.error("createSubscription error:", error);
    return {
      success: false,
      error: "An error occurred while creating the subscription. Please try again.",
    };
  }
}
