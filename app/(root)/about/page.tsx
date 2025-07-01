"use client"

import React from "react"
import {
  Leaf,
  CookingPot,
  Heartbeat,
  Package,
  ArrowRight,
} from "@phosphor-icons/react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import FinalCTASection from "@/components/HomePage/FinalCTASection"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-0 bg-background lg:h-screen flex items-center">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left Column: Image */}
              <div className="flex items-center justify-center">
                <Image
                  src="/chef.svg"
                  alt="Healthy subscription meals from SEA Catering"
                  width={600}
                  height={600}
                  className="w-full max-w-md lg:max-w-full"
                  priority
                />
              </div>

              {/* Right Column: Text and CTA */}
              <div className="flex flex-col justify-center space-y-6">
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tighter text-left leading-tight">
                    <span className="block text-foreground">SEAMLESS</span>
                    <span className="block text-primary">HEALTHY LIVING</span>
                  </h1>
                </div>

                <div className="flex justify-start">
                  <Button asChild size="lg" className="h-12 text-base px-8">
                    <Link href="/menu">
                      Explore Menu
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>

                <p className="max-w-[600px] text-muted-foreground md:text-lg text-left">
                  SEA Catering offers convenient and delicious monthly healthy meal subscriptions. Choose a meal plan that fits your needs — Diet, Protein, or Royal — and enjoy regular weekly deliveries right to your doorstep.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Story */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 sm:px-0 md:gap-16 md:grid-cols-2">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Our Mission
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
                  To Make Healthy Eating Effortless
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  We believe that a healthy lifestyle shouldn&apos;t be a chore. Our mission is to empower you to achieve your wellness goals by removing the hassle of meal planning, prepping, and cooking. We handle the details so you can focus on living your best life.
                </p>
              </div>

              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">
                  Our Story
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tighter">
                  Born from a Passion for Health
                </h2>
                <p className="text-muted-foreground md:text-lg">
                  SEA Catering was founded by a team of health enthusiasts who struggled to find convenient, truly healthy meal options in a fast-paced world. We set out to create a service we wished existed—one that combines culinary excellence with nutritional science.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Approach Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary text-primary-foreground px-3 py-1 text-sm">
                  Our Approach
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter">
                  The Pillars of Our Promise
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We are committed to quality and transparency in every meal we create.
                </p>
              </div>
            </div>

            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-4 mt-12">
              <Card className="text-center">
                <CardHeader>
                  <Leaf className="w-10 h-10 mx-auto text-primary" />
                  <CardTitle className="mt-4">Fresh Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    We source the highest-quality, local, and organic ingredients whenever possible.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <CookingPot className="w-10 h-10 mx-auto text-primary" />
                  <CardTitle className="mt-4">Chef-Crafted Menus</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Our talented chefs design creative, delicious meals that you&apos;ll look forward to.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Heartbeat className="w-10 h-10 mx-auto text-primary" />
                  <CardTitle className="mt-4">Nutritionist Approved</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Every meal is vetted by nutritionists to be balanced and goal-oriented.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <Package className="w-10 h-10 mx-auto text-primary" />
                  <CardTitle className="mt-4">Ultimate Convenience</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Ready-to-eat meals, delivered to you. No cooking, no cleaning.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <FinalCTASection />
      </main>
    </div>
  )
}

export default AboutPage
