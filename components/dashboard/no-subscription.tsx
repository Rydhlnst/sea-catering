"use client";

import { PackagePlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function NoSubscription() {
  return (
    <div className="w-full rounded-2xl border bg-background p-8 shadow-sm">
      <div className="flex flex-col items-center gap-6 md:flex-row md:items-start md:justify-between">
        {/* Left Content */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-semibold">
            Anda Belum Memiliki Langganan Aktif
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md">
            Mulai perjalanan hidup sehat Anda hari ini dengan paket katering
            terbaik dari kami. Mudah, lezat, dan diantar langsung ke pintu Anda.
          </p>
        </div>

        {/* Icon + CTA */}
        <div className="flex flex-col items-center gap-4">
          <div className="rounded-full bg-primary/10 p-4">
            <PackagePlus className="h-8 w-8 text-primary" />
          </div>
          <Button asChild size="lg" className="w-full md:w-auto">
            <Link href="/subscribe">Lihat Paket & Berlangganan Sekarang</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
