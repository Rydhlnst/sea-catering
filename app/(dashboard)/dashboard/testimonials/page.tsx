import { Types } from "mongoose";
import { auth } from "@/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package, Calendar, CheckCircle } from "lucide-react";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Subscription, { ISubscriptionDoc } from "@/models/Subscription.model";
import Testimonial from "@/models/Testimonial.model";
import { TestimonialTrigger } from "@/components/dashboard/TestimonialTrigger";
import User from "@/models/User.model";

interface PopulatedSubscription extends Omit<ISubscriptionDoc, "plan"> {
  _id: Types.ObjectId;
  createdAt: Date;
  plan: Types.ObjectId | { name: string };
}

export default async function TestimonialPage() {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Connect to database
  await dbConnect();

  // 3. Find the user from the email
  const user = await User.findOne({ email: session.user.email });

  if (!user || !user._id) {
    throw new Error("User not found or invalid ID");
  }

  // 4. Fetch subscriptions belonging to the user
  const subscriptions = await Subscription.find({
    user: user._id,
  })
    .populate("plan", "name") // only populate `name` field of plan
    .sort({ createdAt: -1 }) // most recent first
    .lean<PopulatedSubscription[]>();

  // 5. Fetch testimonials written by this user
  const userTestimonials = await Testimonial.find({
    user: user._id,
  })
    .select("subscription")
    .lean();

  // 6. Track which subscription IDs have been reviewed
  const reviewedSubscriptionIds = new Set(
    userTestimonials.map((t) => t.subscription?.toString())
  );

  return (
    <div className="container max-w-7xl px-4 mx-auto py-8 space-y-8">
      {subscriptions.length === 0 ? (
        <p>You don&apos;t have any subscription history yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {subscriptions.map((sub) => {
            const hasBeenReviewed = reviewedSubscriptionIds.has(
              sub._id.toString()
            );

            const planName =
              typeof sub.plan === "object" && "name" in sub.plan
                ? sub.plan.name
                : "Plan name not available";

            return (
              <Card
                key={sub._id.toString()}
                className="flex flex-col justify-between shadow-sm p-4 rounded-md bg-white border basis-full sm:basis-[48%] lg:basis-[31%]"
              >
                <CardHeader className="p-0 space-y-3">
                  <div className="flex items-center gap-2 text-primary">
                    <Package className="h-5 w-5" />
                    <CardTitle className="text-lg font-semibold">
                      {planName}
                    </CardTitle>
                  </div>
                  <CardDescription className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Subscription Date:{" "}
                      {new Date(sub.createdAt).toLocaleDateString("en-US")}
                    </span>
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-4">
                  {hasBeenReviewed ? (
                    <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                      <CheckCircle className="h-5 w-5" />
                      <span>You have already submitted a review</span>
                    </div>
                  ) : (
                    <TestimonialTrigger subscriptionId={sub._id.toString()} />
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
