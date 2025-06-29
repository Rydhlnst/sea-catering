"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

import { createSubscription } from "@/lib/actions/subscription.action";
import { SerializedPlan } from "@/lib/validations";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface SubscriptionFormProps {
  plans: SerializedPlan[];
}

type MealType = "Breakfast" | "Lunch" | "Dinner";
type DeliveryDay =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export function SubscriptionForm({ plans }: SubscriptionFormProps) {
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SerializedPlan | null>(null);
  const [mealTypes, setMealTypes] = useState<Set<MealType>>(new Set());
  const [deliveryDays, setDeliveryDays] = useState<Set<DeliveryDay>>(new Set());
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const mealOptions: MealType[] = ["Breakfast", "Lunch", "Dinner"];
  const dayOptions: DeliveryDay[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const totalPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    const mealCount = mealTypes.size;
    const dayCount = deliveryDays.size;
    return selectedPlan.price * mealCount * dayCount * 4;
  }, [selectedPlan, mealTypes, deliveryDays]);

  const toggleSet = <T extends string>(
    set: React.Dispatch<React.SetStateAction<Set<T>>>,
    value: T
  ) => {
    set((prev) => {
      const next = new Set(prev);
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!selectedPlan) return;
    setIsSubmitting(true);

    const payload = {
      plan: selectedPlan._id,
      mealTypes: Array.from(mealTypes),
      deliveryDays: Array.from(deliveryDays),
      address,
      allergies,
    };

    console.log("📦 Sending:", payload);

    try {
      const res = await createSubscription(payload);
      console.log("📥 Response:", res);

      if (res.success) {
        toast.success("Langganan Berhasil!", {
          description: "Selamat! Anda akan diarahkan ke dashboard Anda.",
        });
        router.push("/dashboard");
      } else {
        toast.error("Gagal Membuat Langganan", {
          description: res.error || "Terjadi kesalahan tak terduga.",
        });
      }
    } catch (err) {
      console.error("🔥 Error:", err);
      toast.error("Gagal Terhubung", {
        description: "Tidak dapat menghubungi server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {/* Kembali */}
        {step > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((prev) => prev - 1)}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        )}

        {/* Step 1: Pilih Plan */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 1: Pilih Paket</h2>
              <p className="text-muted-foreground">
                Pilih paket yang paling sesuai dengan tujuan Anda.
              </p>
            </div>
            <RadioGroup
              onValueChange={(id) =>
                setSelectedPlan(plans.find((p) => p._id === id) || null)
              }
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {plans.map((plan) => (
                <Label key={plan._id} htmlFor={plan._id}>
                  <Card className="group cursor-pointer overflow-hidden transition-all group-has-[:checked]:border-primary group-has-[:checked]:shadow-lg">
                    <CardHeader className="p-0">
                      <div className="relative h-40 w-full">
                        <Image
                          src={plan.image || "https://placehold.co/600x400/orange/white?text=Katering"}
                          alt={plan.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <RadioGroupItem value={plan._id} id={plan._id} />
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="text-xl font-bold">
                        Rp {plan.price.toLocaleString("id-ID")}
                        <span className="text-muted-foreground text-sm"> /porsi</span>
                      </div>
                    </CardContent>
                  </Card>
                </Label>
              ))}
            </RadioGroup>
            <Button
              className="w-full"
              size="lg"
              disabled={!selectedPlan}
              onClick={() => setStep(2)}
            >
              Lanjut
            </Button>
          </div>
        )}

        {/* Step 2: Jadwal */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 2: Atur Jadwal</h2>
              <p className="text-muted-foreground">
                Pilih jenis makanan dan hari pengiriman.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Tipe Makanan</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {mealOptions.map((meal) => (
                  <div key={meal} className="flex items-center space-x-2">
                    <Checkbox
                      id={meal}
                      checked={mealTypes.has(meal)}
                      onCheckedChange={() => toggleSet(setMealTypes, meal)}
                    />
                    <Label htmlFor={meal}>{meal}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Hari Pengiriman</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {dayOptions.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={deliveryDays.has(day)}
                      onCheckedChange={() => toggleSet(setDeliveryDays, day)}
                    />
                    <Label htmlFor={day}>{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={mealTypes.size === 0 || deliveryDays.size === 0}
              onClick={() => setStep(3)}
            >
              Lanjut
            </Button>
          </div>
        )}

        {/* Step 3: Detail */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 3: Detail Pengiriman</h2>
              <p className="text-muted-foreground">
                Isi alamat lengkap dan pantangan makanan.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea
                id="address"
                placeholder="Contoh: Jl. Merdeka No. 10, Medan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Alergi / Pantangan (Opsional)</Label>
              <Input
                id="allergies"
                placeholder="Contoh: Alergi udang, tidak suka pedas"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
              />
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!address.trim()}
              onClick={() => setStep(4)}
            >
              Lanjut ke Konfirmasi
            </Button>
          </div>
        )}

        {/* Step 4: Konfirmasi */}
        {step === 4 && selectedPlan && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 4: Konfirmasi</h2>
              <p className="text-muted-foreground">Periksa kembali sebelum lanjut.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan Langganan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Paket:</strong> {selectedPlan.name}</p>
                <p><strong>Tipe Makanan:</strong> {Array.from(mealTypes).join(", ")}</p>
                <p><strong>Hari:</strong> {Array.from(deliveryDays).join(", ")}</p>
                <p><strong>Alamat:</strong> {address}</p>
                {allergies && <p><strong>Alergi:</strong> {allergies}</p>}
                <hr />
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Estimasi Total per Bulan</p>
                  <p className="text-2xl font-bold">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSubmit}
            >
              {isSubmitting ? "Memproses..." : "Konfirmasi & Lanjutkan"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
