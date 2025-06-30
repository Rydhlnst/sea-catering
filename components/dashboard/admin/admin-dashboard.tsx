"use client";

import { useEffect, useState } from "react";
import { subDays, format } from "date-fns";
import { DateRange } from "react-day-picker";
import { getAdminStats } from "@/lib/actions/admin.action";
import { DateRangePicker } from "@/components/date-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AddPlanForm } from "./add-plan-form";

import {
  Users,
  TrendingUp,
  RefreshCw,
  CheckCircle,
} from "lucide-react";

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
        <h2 className="text-3xl font-bold tracking-tight">Statistik Langganan</h2>
        <p className="text-muted-foreground text-sm">Pantau pertumbuhan pelanggan dan metrik utama</p>
        <DateRangePicker range={range} setRange={setRange} />
        {range.from && range.to && (
          <Badge variant="outline" className="mt-2">
            {format(range.from, "dd MMM yyyy")} – {format(range.to, "dd MMM yyyy")}
          </Badge>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {loading || !stats ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))
        ) : (
          <>
            <StatCard
              title="Langganan Baru"
              value={stats.newSubscriptions}
              icon={<Users className="w-5 h-5 text-primary" />}
            />
            <StatCard
              title="MRR"
              value={`Rp${stats.mrr.toLocaleString("id-ID")}`}
              icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            />
            <StatCard
              title="Reaktivasi"
              value={stats.reactivations}
              icon={<RefreshCw className="w-5 h-5 text-orange-500" />}
            />
            <StatCard
              title="Total Aktif"
              value={stats.totalActive}
              icon={<CheckCircle className="w-5 h-5 text-blue-500" />}
            />
          </>
        )}
      </div>

      {/* Form Tambah Paket */}
      <div>
        <h3 className="text-xl font-semibold">Tambah Paket Baru</h3>
        <p className="text-sm text-muted-foreground mb-4">Lengkapi detail paket untuk ditampilkan pada laman pelanggan.</p>
        <AddPlanForm />
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  );
}
