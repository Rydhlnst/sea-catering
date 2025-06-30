"use client";

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
import { CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils"; // pastikan kamu punya helper `cn`

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
  const isActive = subscription.status === "active";

  return (
    <Card className="shadow-sm border-muted bg-background">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="text-xl">Langganan Anda</CardTitle>
            <CardDescription>
              Detail paket katering aktif yang sedang berjalan.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {isActive ? (
              <Badge variant="default" className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Aktif
              </Badge>
            ) : (
              <Badge variant="secondary" className="flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                Tidak Aktif
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-6 md:grid-cols-2 pt-6">
        <InfoBox label="Paket">
          <p className="text-lg font-semibold text-foreground">
            {subscription.plan?.name ?? "Tidak tersedia"}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeof subscription.plan?.price === "number"
              ? `Rp${subscription.plan.price.toLocaleString("id-ID")}/minggu`
              : "Harga tidak tersedia"}
          </p>
        </InfoBox>

        <InfoBox label="Alamat Pengiriman">
          <p className="text-base text-foreground">{subscription.address}</p>
        </InfoBox>

        <InfoBox label="Jadwal Makan">
          <div className="flex flex-wrap gap-2">
            {subscription.mealTypes.map((meal) => (
              <Badge key={meal} variant="outline">
                {meal}
              </Badge>
            ))}
          </div>
        </InfoBox>

        <InfoBox label="Hari Pengiriman">
          <div className="flex flex-wrap gap-2">
            {subscription.deliveryDays.map((day) => (
              <Badge key={day} variant="outline">
                {day}
              </Badge>
            ))}
          </div>
        </InfoBox>

        {subscription.allergies && (
          <InfoBox label="Catatan Alergi" className="md:col-span-2">
            <p className="text-base text-destructive">
              {subscription.allergies}
            </p>
          </InfoBox>
        )}
      </CardContent>

      <CardFooter className="flex justify-end gap-2 border-t pt-4">
        <Button variant="outline">Ubah Langganan</Button>
        <Button variant="destructive">Batalkan Langganan</Button>
      </CardFooter>
    </Card>
  );
}

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
    <div
      className={cn(
        "rounded-md border bg-muted p-4 space-y-1",
        className
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
