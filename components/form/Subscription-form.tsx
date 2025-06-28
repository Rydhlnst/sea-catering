"use client";
import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { SerializedPlan } from "@/lib/validations";
import Image from "next/image";
import { createSubscription } from "@/lib/actions/subscription.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SubscriptionFormProps {
  plans: SerializedPlan[];
}

type MealType = "Breakfast" | "Lunch" | "Dinner";
type DeliveryDay = "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

export function SubscriptionForm({ plans }: SubscriptionFormProps) {
      const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<SerializedPlan | null>(null);
  const [mealTypes, setMealTypes] = useState<Set<MealType>>(new Set());
  const [deliveryDays, setDeliveryDays] = useState<Set<DeliveryDay>>(new Set());
  const [address, setAddress] = useState("");
  const [allergies, setAllergies] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = useMemo(() => {
    if (!selectedPlan || mealTypes.size === 0 || deliveryDays.size === 0) {
      return 0;
    }
    const weeklyPrice = selectedPlan.price * mealTypes.size * deliveryDays.size;
    return weeklyPrice * 4;
  }, [selectedPlan, mealTypes, deliveryDays]);

  const handleCheckboxChange = <T extends string>(setter: React.Dispatch<React.SetStateAction<Set<T>>>, value: T) => {
    setter(prev => {
      const newSet = new Set(prev);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return newSet;
    });
  };
  

  const handleSubmit = async () => {
    if (!selectedPlan) return;

    setIsSubmitting(true);

    const subscriptionData = {
      plan: selectedPlan?._id,
      mealTypes: Array.from(mealTypes),
      deliveryDays: Array.from(deliveryDays),
      address,
      allergies,
    };
    
        try {
        const result = await createSubscription(subscriptionData);

        if (result.success) {
            toast.success("Langganan Berhasil!", {
            description: "Selamat! Anda akan diarahkan ke dashboard Anda.",
            });
            router.push("/dashboard");
        } else {
            toast.error("Gagal Membuat Langganan", {
            description: result.error || "Terjadi kesalahan yang tidak diketahui.",
            });
        }
        } catch (error) {
        console.log(error)
        toast.error("Gagal Terhubung", {
            description: "Tidak dapat menghubungi server. Silakan periksa koneksi Anda.",
        });
        } finally {
      setIsSubmitting(false); 
      }
  };

  const mealOptions: MealType[] = ["Breakfast", "Lunch", "Dinner"];
  const dayOptions: DeliveryDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        {/* Navigasi Kembali */}
        {step > 1 && (
          <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        )}

        {/* --- LANGKAH 1: PILIH PAKET --- */}
         {step === 1 && (
        <div className="space-y-8">
            <div className="text-center">
            <h2 className="text-2xl font-semibold tracking-tight">Langkah 1: Pilih Paket Anda</h2>
            <p className="text-muted-foreground">Pilih paket yang paling sesuai dengan tujuan Anda.</p>
            </div>
            
            <RadioGroup
            onValueChange={(planId) => setSelectedPlan(plans.find((p) => p._id === planId) || null)}
            className="grid grid-cols-1 gap-6 md:grid-cols-3"
            >
            {plans.map((plan) => (
                <Label
                key={plan._id}
                htmlFor={plan._id}
                className="group block cursor-pointer"
                >
                <Card className="overflow-hidden transition-all group-has-[:checked]:border-primary group-has-[:checked]:shadow-xl">
                    <CardHeader className="p-0">
                    {/* Bagian Gambar */}
                    <div className="relative h-40 w-full">
                        <Image
                        src={plan.image || "https://placehold.co/600x400/orange/white?text=Katering"}
                        alt={`Gambar untuk paket ${plan.name}`}
                        fill
                        className="object-cover"
                        />
                    </div>
                    </CardHeader>
                    <CardContent className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                        {/* Judul dan Tombol Radio */}
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <RadioGroupItem value={plan._id} id={plan._id} />
                    </div>
                    
                    {/* Deskripsi */}
                    <CardDescription className="mb-4 min-h-[60px]">
                        {plan.description}
                    </CardDescription>

                    {/* Harga */}
                    <div className="text-2xl font-bold">
                        Rp {plan.price.toLocaleString("id-ID")}
                        <span className="text-base font-normal text-muted-foreground">/porsi</span>
                    </div>
                    </CardContent>
                </Card>
                </Label>
            ))}
            </RadioGroup>
            
            <Button onClick={() => setStep(2)} disabled={!selectedPlan} className="w-full" size="lg">
            Lanjut
            </Button>
        </div>
        )}

        {/* --- LANGKAH 2: ATUR JADWAL --- */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 2: Atur Jadwal Anda</h2>
              <p className="text-muted-foreground">Pilih makanan dan hari pengiriman.</p>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Pilih Tipe Makanan:</h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {mealOptions.map(meal => (
                  <div key={meal} className="flex items-center space-x-2">
                    <Checkbox id={meal} checked={mealTypes.has(meal)} onCheckedChange={() => handleCheckboxChange(setMealTypes, meal)} />
                    <Label htmlFor={meal} className="cursor-pointer">{meal}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">Pilih Hari Pengiriman (min. 1):</h3>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
                {dayOptions.map(day => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox id={day} checked={deliveryDays.has(day)} onCheckedChange={() => handleCheckboxChange(setDeliveryDays, day)} />
                    <Label htmlFor={day} className="cursor-pointer">{day}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button onClick={() => setStep(3)} disabled={mealTypes.size === 0 || deliveryDays.size === 0} className="w-full">Lanjut</Button>
          </div>
        )}

        {/* --- LANGKAH 3: DETAIL PENGIRIMAN --- */}
        {step === 3 && (
          <div className="space-y-6">
             <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 3: Detail Pengiriman</h2>
              <p className="text-muted-foreground">Beritahu kami ke mana harus mengirim makanan Anda.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Contoh: Jl. Merdeka No. 10, Kel. Sejahtera, Kec. Bahagia, Kota Medan, 20123" />
            </div>
             <div className="space-y-2">
              <Label htmlFor="allergies">Alergi atau Pantangan Makanan (Opsional)</Label>
              <Input id="allergies" value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="Contoh: Alergi udang, tidak suka pedas" />
            </div>
            <Button onClick={() => setStep(4)} disabled={!address.trim()} className="w-full">Lanjut ke Konfirmasi</Button>
          </div>
        )}

        {/* --- LANGKAH 4: KONFIRMASI --- */}
        {step === 4 && (
          <div className="space-y-6">
             <div className="text-center">
              <h2 className="text-2xl font-semibold">Langkah 4: Konfirmasi Pesanan Anda</h2>
              <p className="text-muted-foreground">Mohon periksa kembali detail pesanan Anda sebelum melanjutkan.</p>
            </div>
            <Card>
              <CardHeader><CardTitle>Ringkasan Langganan</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <p><strong>Paket:</strong> {selectedPlan?.name}</p>
                <p><strong>Jadwal Makan:</strong> {Array.from(mealTypes).join(", ")}</p>
                <p><strong>Hari Pengiriman:</strong> {Array.from(deliveryDays).join(", ")}</p>
                <p><strong>Alamat:</strong> {address}</p>
                {allergies && <p><strong>Alergi:</strong> {allergies}</p>}
                <hr/>
                <div className="text-right">
                    <p className="text-muted-foreground">Estimasi Biaya Bulanan:</p>
                    <p className="text-2xl font-bold">Rp {totalPrice.toLocaleString("id-ID")}</p>
                </div>
              </CardContent>
            </Card>
            <Button 
                onClick={handleSubmit} 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
            >
                {isSubmitting ? "Memproses..." : "Konfirmasi & Lanjutkan ke Pembayaran"}
            </Button>
                </div>
            )}
      </CardContent>
    </Card>
  );
}