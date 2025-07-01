"use client";

import { PackagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * NoSubscription Component
 *
 * Displayed when the user has no active subscription.
 * Encourages the user to view and subscribe to available plans.
 */
export function NoSubscription() {
  return (
    <div className="w-full rounded-2xl border bg-background p-8 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold">
            You Don’t Have an Active Subscription
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            Start your healthy lifestyle journey today with our best catering plans.
            Convenient, delicious, and delivered straight to your door.
          </p>
        </div>

        {/* Right Section: Icon + Call to Action */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <PackagePlus className="h-8 w-8 text-primary" />
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/subscribe">View Plans & Subscribe Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
