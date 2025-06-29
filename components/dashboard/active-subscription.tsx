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

interface PopulatedSubscription extends Omit<ISubscriptionDoc, "plan"> {
  plan: {
    _id: string;
    name: string;
    price: number;
  } | null; // Antisipasi jika tidak ter-populate
}

interface ActiveSubscriptionProps {
  subscription: PopulatedSubscription;
}

export function ActiveSubscription({ subscription }: ActiveSubscriptionProps) {
  const isActive = subscription.status === "active";

  return (
    <Card className="border-muted shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Langganan Anda</CardTitle>
            <CardDescription>
              Detail paket katering aktif Anda.
            </CardDescription>
          </div>
          <Badge variant={isActive ? "default" : "secondary"}>
            {isActive ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4 md:grid-cols-2">
        <InfoBox label="Paket">
          <p className="text-lg font-semibold">
            {subscription.plan?.name ?? "Tidak tersedia"}
          </p>
          <p className="text-sm text-muted-foreground">
            {typeof subscription.plan?.price === "number"
              ? `Rp${subscription.plan.price.toLocaleString("id-ID")}/minggu`
              : "Harga tidak tersedia"}
          </p>
        </InfoBox>

        <InfoBox label="Alamat Pengiriman">
          <p className="text-base">{subscription.address}</p>
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
            <p className="text-base">{subscription.allergies}</p>
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
    <div className={`rounded-md border p-4 space-y-1 ${className ?? ""}`}>
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}
