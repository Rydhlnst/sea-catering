// app/dashboard/layout.tsx
import { DashboardNavbar } from "@/components/dashboard/Dashboard-navbar";
import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/20">
      <DashboardNavbar />
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
