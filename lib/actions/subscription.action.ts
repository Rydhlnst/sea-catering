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

export async function pauseSubscription(): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { success: false, error: "You must be logged in." };
    }

    await dbConnect();
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const subscription = await Subscription.findOne({
      user: user._id,
      status: "active",
    });

    if (!subscription) {
      return { success: false, error: "No active subscription found." };
    }

    subscription.status = "paused";
    subscription.pausedAt = new Date();
    await subscription.save();

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("pauseSubscription error:", error);
    return {
      success: false,
      error: "Failed to pause the subscription. Please try again.",
    };
  }
}

export async function cancelSubscription(): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { success: false, error: "You must be logged in." };
    }

    await dbConnect();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const subscription = await Subscription.findOne({
      user: user._id,
      status: { $in: ["active", "paused"] },
    });

    if (!subscription) {
      return { success: false, error: "No subscription found to cancel." };
    }

    // Step 1: Mark as cancelled
    subscription.status = "cancelled";
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Step 2: Remove subscription from user's list (if stored as reference)
    await User.findByIdAndUpdate(user._id, {
      $pull: { subscriptions: subscription._id },
    });

    // Step 3: Delete the subscription document from DB
    await Subscription.deleteOne({ _id: subscription._id });

    // Step 4: Revalidate dashboard page
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("cancelSubscription error:", error);
    return {
      success: false,
      error: "Failed to cancel the subscription. Please try again.",
    };
  }
}

export async function resumeSubscription(): Promise<ActionResponse> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!userEmail) {
      return { success: false, error: "You must be logged in." };
    }

    await dbConnect();

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return { success: false, error: "User not found." };
    }

    const subscription = await Subscription.findOne({
      user: user._id,
      status: "paused",
    });

    if (!subscription) {
      return {
        success: false,
        error: "No paused subscription found to resume.",
      };
    }

    subscription.status = "active";
    subscription.updatedAt = new Date();
    await subscription.save();

    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("resumeSubscription error:", error);
    return {
      success: false,
      error: "Failed to resume the subscription. Please try again.",
    };
  }
}