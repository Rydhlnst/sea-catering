"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ISubscriptionDoc } from "@/models/Subscription.model";


interface PopulatedSubscription extends Omit<ISubscriptionDoc, "plan"> {
  plan: {
    _id: string;
    name: string;
    price: number;
  };
}

interface ActiveSubscriptionProps {
  subscription: PopulatedSubscription;
}

export function ActiveSubscription({ subscription }: ActiveSubscriptionProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Langganan Anda</CardTitle>
            <CardDescription>Detail paket katering aktif Anda.</CardDescription>
          </div>
          <Badge variant={subscription.active ? "default" : "secondary"}>
            {subscription.active ? "Aktif" : "Tidak Aktif"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1 rounded-md border p-4">
          <p className="text-sm font-medium text-muted-foreground">Paket</p>
          <p className="text-lg font-semibold">{subscription.plan.name}</p>
        </div>
        <div className="space-y-1 rounded-md border p-4">
          <p className="text-sm font-medium text-muted-foreground">Alamat Pengiriman</p>
          <p className="text-base">{subscription.address}</p>
        </div>
        <div className="space-y-1 rounded-md border p-4">
          <p className="text-sm font-medium text-muted-foreground">Jadwal Makan</p>
          <div className="flex flex-wrap gap-2">
            {subscription.mealTypes.map((meal) => (
              <Badge key={meal} variant="outline">{meal}</Badge>
            ))}
          </div>
        </div>
        <div className="space-y-1 rounded-md border p-4">
          <p className="text-sm font-medium text-muted-foreground">Hari Pengiriman</p>
           <div className="flex flex-wrap gap-2">
            {subscription.deliveryDays.map((day) => (
              <Badge key={day} variant="outline">{day}</Badge>
            ))}
          </div>
        </div>
        {subscription.allergies && (
          <div className="space-y-1 rounded-md border p-4 md:col-span-2">
            <p className="text-sm font-medium text-muted-foreground">Catatan Alergi</p>
            <p className="text-base">{subscription.allergies}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline">Ubah Langganan</Button>
        <Button variant="destructive">Batalkan Langganan</Button>
      </CardFooter>
    </Card>
  );
}