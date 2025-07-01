/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Package } from "phosphor-react";

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

    try {
      const res = await createSubscription(payload);

      if (res.success) {
        toast.success("Subscription Created", {
          description: "You will be redirected to your dashboard.",
        });
        router.push("/dashboard");
      } else {
        toast.error("Failed to subscribe", {
          description: res.error || "An unexpected error occurred.",
        });
      }
    } catch (err) {
      console.error("🔥 Error:", err);
      toast.error("Connection Failed", {
        description: "Unable to reach the server.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6 space-y-6">
        {step > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStep((prev) => prev - 1)}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        {/* Step 1: Plan Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Step 1: Choose a Plan</h2>
              <p className="text-muted-foreground">
                Select the most suitable package for your goal.
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
                  <Card className="group cursor-pointer transition-all group-has-[:checked]:border-primary group-has-[:checked]:shadow-lg w-full">
                    <CardHeader className="flex items-center justify-center h-40">
                      <Package size={96} className="text-primary" weight="duotone" />
                    </CardHeader>
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-xl">{plan.name}</CardTitle>
                        <RadioGroupItem value={plan._id} id={plan._id} />
                      </div>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="text-xl font-bold">
                        Rp {plan.price.toLocaleString("id-ID")}
                        <span className="text-sm text-muted-foreground"> /portion</span>
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
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Schedule */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Step 2: Set Your Schedule</h2>
              <p className="text-muted-foreground">
                Choose meal types and delivery days.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Meal Types</h3>
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
              <h3 className="font-medium">Delivery Days</h3>
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
              Continue
            </Button>
          </div>
        )}

        {/* Step 3: Details */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Step 3: Delivery Details</h2>
              <p className="text-muted-foreground">
                Enter your address and allergy notes.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                placeholder="e.g., 123 Freedom St, Medan"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies / Preferences (optional)</Label>
              <Input
                id="allergies"
                placeholder="e.g., allergic to shrimp, no spicy food"
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
              Continue to Confirmation
            </Button>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && selectedPlan && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold">Step 4: Confirmation</h2>
              <p className="text-muted-foreground">Please review your details before proceeding.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Subscription Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>Plan:</strong> {selectedPlan.name}</p>
                <p><strong>Meal Types:</strong> {Array.from(mealTypes).join(", ")}</p>
                <p><strong>Days:</strong> {Array.from(deliveryDays).join(", ")}</p>
                <p><strong>Address:</strong> {address}</p>
                {allergies && <p><strong>Allergies:</strong> {allergies}</p>}
                <hr />
                <div className="text-right space-y-1">
                  <p className="text-sm text-muted-foreground">Estimated Monthly Total</p>
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
              {isSubmitting ? "Processing..." : "Confirm & Subscribe"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
