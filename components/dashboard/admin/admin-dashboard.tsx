"use client";

import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { getAdminStats } from "@/lib/actions/admin.action";

// UI Components
import { DateRangePicker } from "@/components/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AddPlanForm } from "./add-plan-form";

// Icons from Phosphor
import {
  UserPlus,
  ChartLineUp,
  ClockClockwise,
  ShieldCheck,
} from "phosphor-react";

interface AdminStats {
  newSubscriptions: number;
  mrr: number;
  reactivations: number;
  totalActive: number;
}

// Main Admin Dashboard component
export function AdminDashboard() {
  // Date range state for filtering
  const [range, setRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Stats data state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch statistics on date range change
  useEffect(() => {
    async function fetchStats() {
      if (!range.from || !range.to) return;
      setLoading(true);
      try {
        const res = await getAdminStats(range.from, range.to);
        setStats(res);
      } catch (err) {
        console.error("Failed to fetch admin stats:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [range]);

  return (
    <div className="space-y-8">
      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats and Date Picker */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Statistics</CardTitle>
              <div className="flex items-center space-x-2 pt-2">
                <DateRangePicker range={range} setRange={setRange} />
                {range.from && range.to && (
                  <Badge variant="secondary">
                    {format(range.from, "dd MMM yy")} – {format(range.to, "dd MMM yy")}
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Statistic Cards */}
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            {loading || !stats ? (
              // Skeleton loading while fetching
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-[126px] rounded-xl" />
              ))
            ) : (
              <>
                <StatCard
                  title="New Subscriptions"
                  value={stats.newSubscriptions}
                  icon={<UserPlus size={24} />}
                  accentColor="text-blue-500 bg-blue-50"
                />
                <StatCard
                  title="MRR (Monthly Recurring Revenue)"
                  value={`Rp${stats.mrr.toLocaleString("id-ID")}`}
                  icon={<ChartLineUp size={24} />}
                  accentColor="text-green-600 bg-green-50"
                />
                <StatCard
                  title="Reactivations"
                  value={stats.reactivations}
                  icon={<ClockClockwise size={24} />}
                  accentColor="text-orange-500 bg-orange-50"
                />
                <StatCard
                  title="Total Active Subscribers"
                  value={stats.totalActive}
                  icon={<ShieldCheck size={24} />}
                  accentColor="text-indigo-500 bg-indigo-50"
                />
              </>
            )}
          </div>
        </div>

        {/* Right Column: Add New Plan Form */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Add New Plan</CardTitle>
              <p className="text-sm text-muted-foreground pt-1">
                Create a new subscription plan for customers.
              </p>
            </CardHeader>
            <CardContent>
              <AddPlanForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Component: Reusable card to show individual stat block
function StatCard({
  title,
  value,
  icon,
  accentColor,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: string;
}) {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-300 ease-in-out">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <div className="text-3xl font-bold">{value}</div>
          </div>
          <div className={`p-3 rounded-lg ${accentColor}`}>
            {icon}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
