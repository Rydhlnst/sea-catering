"use client";

import { useEffect, useState } from "react";
import { subDays } from "date-fns";
import { DateRange } from "react-day-picker";

import { getAdminStats } from "@/lib/actions/admin.action";
import { DateRangePicker } from "@/components/date-picker";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AddPlanForm } from "./add-plan-form";

interface AdminStats {
  newSubscriptions: number;
  mrr: number;
  reactivations: number;
  totalActive: number;
}

export function AdminDashboard() {
  const [range, setRange] = useState<DateRange>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

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
    <div className="space-y-10">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Statistik Langganan</h2>
        <p className="text-sm text-muted-foreground">
          Filter berdasarkan rentang tanggal
        </p>
        <DateRangePicker range={range} setRange={setRange} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading || !stats
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[100px] rounded-xl" />
            ))
          : (
            <>
              <StatCard title="Langganan Baru" value={stats.newSubscriptions} />
              <StatCard title="MRR" value={`Rp${stats.mrr.toLocaleString("id-ID")}`} />
              <StatCard title="Reaktivasi" value={stats.reactivations} />
              <StatCard title="Total Aktif" value={stats.totalActive} />
            </>
          )}
      </div>

      {/* Tambah Paket */}
      <AddPlanForm />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground font-medium">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
