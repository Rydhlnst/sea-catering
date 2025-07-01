"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/auth";
import dbConnect from "../mongoose";
import Subscription from "@/models/Subscription.model";
import Testimonial from "@/models/Testimonial.model";
import User from "@/models/User.model";

// Zod validation schema for testimonial input
const TestimonialValidationSchema = z.object({
  message: z
    .string()
    .min(10, { message: "Testimonial message must be at least 10 characters long." })
    .max(1000, { message: "Testimonial message must be at most 1000 characters." }),
  rating: z.coerce
    .number()
    .min(1, { message: "Minimum rating is 1." })
    .max(5, { message: "Maximum rating is 5." }),
  subscriptionId: z.string().nonempty({ message: "Subscription ID is required." }),
});

type CreateTestimonialParams = z.infer<typeof TestimonialValidationSchema>;

/**
 * Server action to create a new testimonial from an authenticated user.
 * Ensures the subscription belongs to the current user and hasn't been reviewed yet.
 */
export async function createTestimonial(params: CreateTestimonialParams) {
  // 1. Get current session and extract user email
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    console.warn("[TESTIMONIAL_CREATE] Failed: No user email in session.");
    return { error: "Access denied. Invalid user session." };
  }

  try {
    // 2. Validate input using Zod
    const { subscriptionId, message, rating } = TestimonialValidationSchema.parse(params);

    // 3. Validate MongoDB ObjectId format
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      console.warn(`[TESTIMONIAL_CREATE] Failed: Invalid subscriptionId format. ID: ${subscriptionId}`);
      return { error: "Invalid Subscription ID." };
    }

    // 4. Connect to MongoDB
    await dbConnect();

    // 5. Find user by email (ensures user exists)
    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user || !user._id) {
      return { error: "User not found in database." };
    }

    // 6. Verify that the subscription belongs to the current user
    const userSubscription = await Subscription.findOne({
      _id: subscriptionId,
      user: user._id,
    });

    if (!userSubscription) {
      console.warn("[TESTIMONIAL_CREATE] Failed: Subscription not found or does not belong to the user.");
      return {
        error: "Verification failed. Subscription not found or not associated with your account.",
      };
    }

    // 7. Check if the user has already submitted a testimonial for this subscription
    const existingTestimonial = await Testimonial.findOne({
      user: user._id,
      subscription: subscriptionId,
    });

    if (existingTestimonial) {
      return { error: "You have already submitted a testimonial for this subscription." };
    }

    // 8. Save testimonial to database (marked as featured by default)
    const created = await Testimonial.create({
      user: user._id,
      subscription: subscriptionId,
      message,
      rating,
      featured: true, // Marked as featured so it can appear on homepage
    });

    console.log("[TESTIMONIAL_CREATE] Testimonial successfully created:", created._id);

    // 9. Revalidate testimonial dashboard page to immediately show new data
    revalidatePath("/dashboard/testimonials");

    return { success: "Thank you! Your testimonial has been submitted successfully." };
  } catch (error) {
    // Handle Zod validation errors
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      console.error("[TESTIMONIAL_CREATE] Zod Validation Error:", errorMessage);
      return { error: `Invalid data: ${errorMessage}` };
    }

    // Handle other server or DB errors
    console.error("[TESTIMONIAL_CREATE] Server Error:", error);
    return { error: "A server error occurred. Please try again later." };
  }
}
