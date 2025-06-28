import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Subscription from "@/models/Subscription.model"; // Import model Subscription Anda
import dbConnect from "@/lib/mongoose";
import { ActiveSubscription } from "@/components/dashboard/active-subscription";
import { NoSubscription } from "@/components/dashboard/no-subscription";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }
  const userId = session.user.id;

  await dbConnect();
  const userSubscription = await Subscription.findOne({ user: userId }).populate("plan");
  // .populate("plan") akan mengambil detail dari model "Plan" Anda

  return (
    <div className="container max-w-7xl px-4 mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Selamat Datang, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Kelola informasi langganan katering Anda di sini.
        </p>
      </div>

      {/* 4. Render komponen secara kondisional berdasarkan data langganan
           - Jika userSubscription ada -> tampilkan ActiveSubscription
           - Jika tidak ada -> tampilkan NoSubscription
      */}
      {userSubscription ? (
        <ActiveSubscription subscription={JSON.parse(JSON.stringify(userSubscription))} />
      ) : (
        <NoSubscription />
      )}
    </div>
  );
}