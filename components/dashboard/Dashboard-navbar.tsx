"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
// import { LogOut, LayoutDashboard, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import { Chat, Layout, SignOut } from "phosphor-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Layout },
];

export function DashboardNavbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

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

          <nav className="flex items-center gap-2 md:gap-4">
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
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            ))}

            {session?.user?.role !== "admin" && (
              <Link
                href="/dashboard/testimonials"
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-muted",
                  pathname === "/dashboard/testimonials" && "bg-muted font-semibold"
                )}
              >
                <Chat className="h-4 w-4" />
                <span className="hidden md:inline">Testimonial</span>
              </Link>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-3"
            >
              <SignOut className="h-4 w-4" />
              <span className="hidden md:inline">Logout</span>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}