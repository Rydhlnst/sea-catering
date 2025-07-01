// import Plan from "@/models/Plan.model";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionForm } from "@/components/form/Subscription-form";
import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan.model";

export default async function SubscribePage() {
  // 1. Check if user is authenticated
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/subscribe");
  }

  // 2. Connect to MongoDB
  await dbConnect();

  // 3. Fetch all plans from database, sorted by price
  const rawPlans = await Plan.find({}).sort({ price: 1 }).lean();

  // 4. Normalize plan data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const plans = (rawPlans as any[]).map(plan => ({
    _id: plan._id.toString(),
    name: plan.name,
    price: plan.price,
    description: plan.description || "",
    image: plan.image || "",
    createdAt: plan.createdAt?.toISOString(),
    updatedAt: plan.updatedAt?.toISOString(),
  }));

  // 5. Render subscription form with plan options
  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Choose Your Subscription Plan</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Start your healthy lifestyle journey with us.
        </p>
      </div>

      <SubscriptionForm plans={plans} />
    </div>
  );
}
