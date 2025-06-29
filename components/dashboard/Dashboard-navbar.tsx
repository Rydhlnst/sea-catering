"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react"; // ✅ import ini
import { cn } from "@/lib/utils";
import { LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "../ui/button";

const navItems = [
  { href: "/dashboard", label: "Beranda", icon: LayoutDashboard },
];

export function DashboardNavbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4">
          <Link
            href="/dashboard"
            className="text-xl font-semibold tracking-tight"
          >
            SEA Catering
          </Link>

          <nav className="flex items-center gap-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-muted",
                  pathname === item.href && "bg-muted font-semibold"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}

            {/* ✅ Tombol Logout */}
            <Button
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
