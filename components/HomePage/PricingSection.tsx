"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check } from "phosphor-react";

const PricingSection = () => {
  return (
    <section className="py-32 md:pb-20 md:pt-32 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-4xl text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold mb-4">
            Plan Selection
          </h2>
          <p className="text-muted-foreground text-base sm:text-lg">
            Choose the meal package that suits your needs. All plans are customizable for breakfast, lunch, or dinner and delivered right to your place!
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          {/* Plan Item Template */}
          {[
            {
              title: "Diet Plan",
              price: "Rp30.000",
              bg: "bg-background",
              features: [
                "Controlled calories (≤ 500 kcal)",
                "Ideal for weight loss programs",
                "Low in sugar & carbs",
              ],
            },
            {
              title: "Protein Plan",
              price: "Rp40.000",
              bg: "bg-background",
              features: [
                "High protein (≥ 25g)",
                "Supports muscle growth & recovery",
                "Great for active lifestyles & gym-goers",
              ],
            },
            {
              title: "Royal Plan",
              price: "Rp60.000",
              bg: "bg-muted",
              features: [
                "Premium & exclusive menu",
                "Organic & imported ingredients",
                "Served by professional chefs",
                "Perfect for events or luxury needs",
              ],
            },
          ].map((plan) => (
            <div
              key={plan.title}
              className={`flex w-full flex-col rounded-xl border p-6 shadow-sm hover:shadow-md transition ${plan.bg}`}
            >
              <Badge className="mb-6 w-fit">{plan.title}</Badge>
              <span className="text-2xl sm:text-3xl font-semibold">{plan.price}</span>
              <p className="text-muted-foreground text-sm">per meal</p>
              <Separator className="my-5" />
              <div className="flex flex-col justify-between gap-8 sm:gap-16 h-full">
                <ul className="space-y-4 text-muted-foreground text-sm sm:text-base">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="size-4 mt-1 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className="w-full mt-4 sm:mt-0">Choose Plan</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
