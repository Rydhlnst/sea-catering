"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ClipboardText, CookingPot, Truck } from "@phosphor-icons/react";

const steps = [
  {
    icon: ClipboardText,
    title: "Choose Your Plan",
    description:
      "Select a catering package that fits your lifestyle and schedule, from daily to monthly options.",
    cta: "View Plans",
  },
  {
    icon: CookingPot,
    title: "Customize Meals",
    description:
      "Easily tailor your meals based on preferences, allergies, or specific nutrition goals.",
    cta: "Customize Menu",
  },
  {
    icon: Truck,
    title: "Get It Delivered",
    description:
      "Your healthy meals are delivered fresh to your door every day, ready to enjoy.",
    cta: "Start Subscription",
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section className="bg-background py-20 px-6 md:px-12 lg:px-24">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-6 mb-12">
        <div className="flex-1">
          <h2 className="text-4xl md:text-5xl font-extrabold text-foreground mb-2">
            Just Three Steps
          </h2>
          <p className="text-muted-foreground text-lg">
            Enjoy healthy catering with zero hassle — just pick, personalize, and receive it daily.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {steps.map((step, index) => (
            <Button
              key={index}
              onClick={() => setActiveStep(index)}
              variant={index === activeStep ? "outline" : "ghost"}
              className={cn(
                "text-sm font-medium transition-all",
                index === activeStep
                  ? "border-foreground text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="mr-1">{index + 1}.</span>{" "}
              {step.title.split(" ")[0]}
            </Button>
          ))}
        </div>
      </div>

      {/* Content */}
      <Card className="max-w-6xl mx-auto p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 items-center gap-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col justify-center gap-4 text-center lg:text-left"
          >
            <h3 className="text-3xl font-bold text-foreground">
              {steps[activeStep].title}
            </h3>
            <p className="text-muted-foreground text-base leading-relaxed">
              {steps[activeStep].description}
            </p>
            <Button variant="default" className="mt-4 w-max mx-auto lg:mx-0">
              {steps[activeStep].cta}
            </Button>
          </motion.div>
        </AnimatePresence>

        <motion.div
          key={`icon-${activeStep}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="flex items-center justify-center w-full h-full"
        >
          {(() => {
            const Icon = steps[activeStep].icon;
            return (
              <Icon
                size={160}
                weight="duotone"
                className="text-primary transition-all duration-300"
              />
            );
          })()}
        </motion.div>
      </Card>
    </section>
  );
}
