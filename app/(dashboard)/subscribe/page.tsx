
// import Plan from "@/models/Plan.model";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { SubscriptionForm } from "@/components/form/Subscription-form";
import dbConnect from "@/lib/mongoose";
import { staticPlans } from "@/lib/data";

export default async function SubscribePage() {
  const session = await auth();

  if (!session) {
    redirect("/login?callbackUrl=/subscribe");
  }

  await dbConnect();

  // const plans = await Plan.find({}).sort({ price: 1 }); Kalau sudah ada admin page

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Pilih Paket Langganan Anda</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Mulai perjalanan hidup sehat Anda bersama kami.
        </p>
      </div>
      
      <SubscriptionForm plans={JSON.parse(JSON.stringify(staticPlans))} />
    </div>
  );
}