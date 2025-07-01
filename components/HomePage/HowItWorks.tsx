"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ClipboardText, CookingPot, Truck } from "@phosphor-icons/react"

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
]

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <section className="py-20 px-4 md:px-8 lg:px-24 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-12">
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-2">
              Just Three Steps
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-prose">
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
                <span className="mr-1">{index + 1}.</span> {step.title.split(" ")[0]}
              </Button>
            ))}
          </div>
        </div>

        {/* Card Content */}
        <Card className="grid grid-cols-1 lg:grid-cols-2 gap-10 p-6 md:p-10 lg:p-12">
          {/* Text & CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col justify-center gap-4 text-center lg:text-left"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-foreground">
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

          {/* Icon */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`icon-${activeStep}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center w-full h-full"
            >
              {(() => {
                const Icon = steps[activeStep].icon
                return (
                  <Icon
                    size={140}
                    weight="duotone"
                    className="text-primary transition-transform duration-300"
                  />
                )
              })()}
            </motion.div>
          </AnimatePresence>
        </Card>
      </div>
    </section>
  )
}
