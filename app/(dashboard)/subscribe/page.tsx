
// import Plan from "@/models/Plan.model";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionForm } from "@/components/form/Subscription-form";
import dbConnect from "@/lib/mongoose";
import Plan from "@/models/Plan.model";

export default async function SubscribePage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/subscribe");
  }

  await dbConnect();

  const rawPlans = await Plan.find({}).sort({ price: 1 }).lean();

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

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pilih Paket Langganan Anda</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mulai perjalanan hidup sehat Anda bersama kami.
        </p>
      </div>

      <SubscriptionForm plans={plans} />
    </div>
  );}