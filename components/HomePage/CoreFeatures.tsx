"use client";

import {
  CookingPot,
  Truck,
  CalendarCheck,
  MapTrifold,
} from "phosphor-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface CoreFeatureSectionProps {
  heading?: string;
  description?: string;
  feature1?: Feature;
  feature2?: Feature;
  feature3?: Feature;
  feature4?: Feature;
}

const CoreFeatureSection = ({
  heading = "SEA Catering Core Features",
  description = "We offer a healthy catering service with a flexible, personalized, and fully integrated subscription system.",
  feature1 = {
    title: "Personalized Meal Plan",
    description:
      "Define your daily nutritional needs and we'll create a customized meal plan just for you.",
    icon: <CookingPot size={64} className="text-primary" />,
  },
  feature2 = {
    title: "Fresh Daily Delivery",
    description:
      "Your meals are delivered fresh every day to your home or office, ready to enjoy.",
    icon: <Truck size={64} className="text-primary" />,
  },
  feature3 = {
    title: "Flexible Subscription",
    description:
      "Subscribe daily, weekly, or monthly according to your needs and budget.",
    icon: <CalendarCheck size={64} className="text-primary" />,
  },
  feature4 = {
    title: "Real-time Order Tracking",
    description:
      "Track your orders and deliveries in real-time directly from your customer dashboard.",
    icon: <MapTrifold size={64} className="text-primary" />,
  },
}: CoreFeatureSectionProps) => {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-24 flex flex-col items-center gap-6">
          <h1 className="text-center text-3xl font-semibold lg:max-w-3xl md:text-4xl">
            {heading}
          </h1>
          <p className="text-center text-lg font-medium text-muted-foreground md:max-w-4xl lg:text-xl">
            {description}
          </p>
        </div>

        {/* Grid Layout */}
        <div className="relative flex justify-center">
          <div className="border-muted2 relative flex w-full flex-col border md:w-1/2 lg:w-full">
            <div className="relative flex flex-col lg:flex-row">
              <FeatureCard {...feature1} full />
              <FeatureCard {...feature2} />
            </div>
            <div className="border-muted2 relative flex flex-col border-t border-solid lg:flex-row">
              <FeatureCard {...feature3} />
              <FeatureCard {...feature4} full />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeatureCard = ({
  title,
  description,
  icon,
  full,
}: Feature & { full?: boolean }) => {
  return (
    <div
      className={`border-muted2 flex flex-col justify-between border-solid p-10 ${
        full ? "lg:w-3/5 lg:border-r" : "lg:w-2/5"
      } ${!full ? "border-b lg:border-b-0" : ""}`}
    >
      <div className="flex flex-col items-start gap-4">
        <div>{icon}</div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default CoreFeatureSection;
