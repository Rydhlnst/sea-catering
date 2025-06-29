import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import Subscription from "@/models/Subscription.model";
import { ActiveSubscription } from "@/components/dashboard/active-subscription";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { NoSubscription } from "@/components/dashboard/no-subscription";


export default async function DashboardPage() {
  const session = await auth();

  // Jika belum login → redirect
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Pastikan DB siap
  await dbConnect();

  console.log(session)

  // Jika ADMIN, render admin dashboard
  if (session?.user?.role === "admin") {
    return (
      <div className="container max-w-7xl px-4 mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Selamat Datang, Admin {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            Lihat statistik dan kelola langganan pelanggan SEA Catering.
          </p>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // Jika USER, render dashboard langganan biasa
  const userId = session.user.id;
  const userSubscription = await Subscription.findOne({ user: userId }).populate("plan");

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

      {userSubscription ? (
        <ActiveSubscription subscription={JSON.parse(JSON.stringify(userSubscription))} />
      ) : (
        <NoSubscription />
      )}
    </div>
  );
}
