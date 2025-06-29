import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User.model";
import Subscription from "@/models/Subscription.model";
import { ActiveSubscription } from "@/components/dashboard/active-subscription";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { NoSubscription } from "@/components/dashboard/no-subscription";

export default async function DashboardPage() {
  // 1. Cek autentikasi
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Koneksi DB
  await dbConnect();

  // 3. Cek role admin
  if (session.user.role === "admin") {
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

  // 4. Ambil user berdasarkan email dari sesi
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    console.error("User tidak ditemukan untuk email:", session.user.email);
    return <NoSubscription />;
  }

  // 5. Ambil langganan berdasarkan user._id
  const subscription = await Subscription.findOne({ user: user._id }).populate("plan");


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

      {subscription ? (
        <ActiveSubscription subscription={JSON.parse(JSON.stringify(subscription))} />
      ) : (
        <NoSubscription />
      )}
    </div>
  );
}
