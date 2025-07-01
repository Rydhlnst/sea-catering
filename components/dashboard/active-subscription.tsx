"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ISubscriptionDoc } from "@/models/Subscription.model";
import {
  CheckCircle,
  PauseCircle,
  XCircle,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  cancelSubscription,
  pauseSubscription,
  resumeSubscription,
} from "@/lib/actions/subscription.action";

// Tipe yang sudah dipopulasi (populated) untuk plan agar bisa langsung diakses
interface PopulatedSubscription extends Omit<ISubscriptionDoc, "plan"> {
  plan: {
    _id: string;
    name: string;
    price: number;
  } | null;
}

interface ActiveSubscriptionProps {
  subscription: PopulatedSubscription;
}

export function ActiveSubscription({ subscription }: ActiveSubscriptionProps) {
  // React hook useTransition untuk async UI update yang tidak blocking
  const [isPending, startTransition] = useTransition();

  const isActive = subscription.status === "active";
  const isPaused = subscription.status === "paused";

  // Pause action
  const handlePause = () =>
    startTransition(async () => {
      await pauseSubscription(); // Panggil server action
    });

  // Cancel action
  const handleCancel = () =>
    startTransition(async () => {
      await cancelSubscription(); // Akan menghapus subscription
    });

  // Resume action
  const handleResumed = () =>
    startTransition(async () => {
      await resumeSubscription(); // Ubah status menjadi active
    });

  return (
    <Card className="shadow-sm border-muted bg-background">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          {/* Judul dan deskripsi */}
          <div>
            <CardTitle className="text-xl">Your Subscription</CardTitle>
            <CardDescription>
              Details of your active meal plan subscription.
            </CardDescription>
          </div>

          {/* Badge status (Active, Paused, Cancelled) */}
          <div className="flex items-center gap-2">
            {isActive ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Active
              </Badge>
            ) : isPaused ? (
              <Badge variant="secondary" className="flex items-center gap-1">
                <PauseCircle className="w-4 h-4" />
                Paused
              </Badge>
            ) : (
              <Badge variant="outline" className="flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Cancelled
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
        {/* Info paket */}
        <InfoBox label="Plan">
          <p className="text-lg font-semibold text-foreground">
            {subscription.plan?.name ?? "Unavailable"}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeof subscription.plan?.price === "number"
              ? `Rp${subscription.plan.price.toLocaleString("id-ID")}/week`
              : "Price not available"}
          </p>
        </InfoBox>

        {/* Info alamat pengiriman */}
        <InfoBox label="Delivery Address">
          <p className="text-base text-foreground">{subscription.address}</p>
        </InfoBox>

        {/* Info jenis makanan */}
        <InfoBox label="Meal Schedule">
          <div className="flex flex-wrap gap-2">
            {subscription.mealTypes.map((meal) => (
              <Badge key={meal} variant="outline">
                {meal}
              </Badge>
            ))}
          </div>
        </InfoBox>

        {/* Info hari pengiriman */}
        <InfoBox label="Delivery Days">
          <div className="flex flex-wrap gap-2">
            {subscription.deliveryDays.map((day) => (
              <Badge key={day} variant="outline">
                {day}
              </Badge>
            ))}
          </div>
        </InfoBox>

        {/* Info alergi */}
        {subscription.allergies && (
          <InfoBox label="Allergies" className="md:col-span-2">
            <p className="text-base text-destructive">
              {subscription.allergies}
            </p>
          </InfoBox>
        )}
      </CardContent>

      {/* Tombol aksi (Pause, Resume, Cancel) */}
      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        {isActive && (
          <Button variant="outline" onClick={handlePause} disabled={isPending}>
            Pause
          </Button>
        )}

        {isPaused && (
          <Button
            variant="outline"
            onClick={handleResumed}
            disabled={isPending}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Resume
          </Button>
        )}

        {(isActive || isPaused) && (
          <Button
            variant="destructive"
            onClick={handleCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

// Komponen reusable untuk info box di dalam grid
function InfoBox({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-md border bg-muted p-4 space-y-1", className)}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
