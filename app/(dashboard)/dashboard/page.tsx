import { auth } from "@/auth";
import { redirect } from "next/navigation";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User.model";
import Subscription from "@/models/Subscription.model";
import { ActiveSubscription } from "@/components/dashboard/active-subscription";
import { AdminDashboard } from "@/components/dashboard/admin/admin-dashboard";
import { NoSubscription } from "@/components/dashboard/no-subscription";

/**
 * DashboardPage is the protected dashboard route.
 * It loads different content depending on whether the user is an admin or a regular user.
 */
export default async function DashboardPage() {
  // 1. Check if the user is authenticated
  const session = await auth();
  if (!session?.user?.email) {
    // Redirect to login page if not authenticated
    redirect("/login");
  }

  // 2. Establish a connection to the MongoDB database
  await dbConnect();

  // 3. If the user is an admin, show the admin dashboard
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

  // 4. Find the authenticated user from the database using their email
  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    console.error("User not found for email:", session.user.email);
    return <NoSubscription />;
  }

  // 5. Look for the user's subscription and populate the related plan document
  const subscription = await Subscription.findOne({ user: user._id }).populate("plan");

  // 6. If there is no subscription or the subscription is cancelled, show fallback UI
  if (!subscription || subscription.status === "cancelled") {
    return (
      <div className="container max-w-7xl px-4 mx-auto py-8">
        <NoSubscription />
      </div>
    );
  }

  // 7. Render the dashboard with active subscription details for the user
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
        // Serialize subscription object to prevent serialization error on server components
        <ActiveSubscription subscription={JSON.parse(JSON.stringify(subscription))} />
      ) : (
        <NoSubscription />
      )}
    </div>
  );
}
