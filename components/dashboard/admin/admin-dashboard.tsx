"use client";

import { useEffect, useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays } from "date-fns";

import { Loader2 } from "lucide-react";
import { getAdminStats } from "@/lib/actions/admin.action";
import { DateRangePicker } from "@/components/date-picker";

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
    const fetchStats = async () => {
      if (range.from && range.to) {
        setLoading(true);
        const data = await getAdminStats(range.from, range.to);
        setStats(data);
        setLoading(false);
      }
    };
    fetchStats();
  }, [range]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Statistik Langganan</h2>
        <p className="text-sm text-muted-foreground">
          Filter berdasarkan rentang tanggal
        </p>
      </div>

      <DateRangePicker range={range} setRange={setRange} />

      {loading || !stats ? (
        <div className="flex justify-center items-center p-12">
          <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card title="Langganan Baru" value={stats.newSubscriptions} />
          <Card title="MRR" value={`Rp${stats.mrr.toLocaleString("id-ID")}`} />
          <Card title="Reaktivasi" value={stats.reactivations} />
          <Card title="Total Aktif" value={stats.totalActive} />
        </div>
      )}
    </div>
  );
}

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="p-4 border rounded-xl shadow-sm bg-white dark:bg-zinc-900">
      <p className="text-sm text-muted-foreground">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
    </div>
  );
}
