import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User.model";
import Subscription from "@/models/Subscription.model";
import { ActiveSubscription } from "@/components/dashboard/active-subscription";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { NoSubscription } from "@/components/dashboard/no-subscription";

export default async function DashboardPage() {
  // 1. Check authentication
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. Connect to the database
  await dbConnect();

  // 3. Check for admin role
  if (session.user.role === "admin") {
    return (
      <div className="container max-w-7xl px-4 mx-auto py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, Admin {session.user.name}!
          </h1>
          <p className="text-muted-foreground">
            View statistics and manage customer subscriptions for SEA Catering.
          </p>
        </div>
        <AdminDashboard />
      </div>
    );
  }

  // 4. Find user based on session email
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    console.error("User not found for email:", session.user.email);
    return <NoSubscription />;
  }

  // 5. Find subscription by user._id and populate the associated plan
  const subscription = await Subscription.findOne({ user: user._id }).populate("plan");

  return (
    <div className="container max-w-7xl px-4 mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome, {session.user.name}!
        </h1>
        <p className="text-muted-foreground">
          Manage your catering subscription information here.
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
