"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  avatarSrc?: string
  type: "personal" | "corporate"
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "SEA Catering’s healthy meals have truly changed my lifestyle! Perfect portions, delicious taste, and a non-boring variety of menus. Highly recommended for busy people who still want to stay healthy.",
    author: "Budi Santoso",
    title: "Entrepreneur",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=BS",
    type: "personal",
  },
  {
    id: "2",
    quote:
      "As a professional who travels frequently, SEA Catering is a lifesaver. The nutrition is guaranteed, delivery is always on time, and the menu customization process is very easy. Premium quality!",
    author: "Dewi Lestari",
    title: "Project Manager",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=DL",
    type: "personal",
  },
  {
    id: "3",
    quote:
      "We use SEA Catering for our office catering needs, and the result is amazing. Employees love the healthy dishes, and the flavors suit everyone. Their customer service is also top-notch!",
    author: "PT. Maju Bersama",
    title: "Tech Company",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=MB",
    type: "corporate",
  },
  {
    id: "4",
    quote:
      "I was skeptical at first about healthy food, but SEA Catering proved otherwise. Each meal is carefully prepared, tastes great, and I feel more energetic since subscribing.",
    author: "Rina Amelia",
    title: "Student",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=RA",
    type: "personal",
  },
  {
    id: "5",
    quote:
      "SEA Catering’s service is very responsive and professional. They provide diverse menu options tailored to our team’s dietary needs. It really helps maintain productivity.",
    author: "CV. Inovasi Cipta",
    title: "Creative Agency",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=IC",
    type: "corporate",
  },
  {
    id: "6",
    quote:
      "SEA Catering meals are always addictive! I never thought healthy food could taste this good. Delivery is always punctual too.",
    author: "Andi Wijaya",
    title: "Athlete",
    avatarSrc: "https://api.dicebear.com/8.x/initials/svg?seed=AW",
    type: "personal",
  },
]

export default function TestimonialsSection() {
  const [filterType, setFilterType] = React.useState<"all" | "personal" | "corporate">("all")

  const filteredTestimonials = React.useMemo(() => {
    if (filterType === "all") return testimonials
    return testimonials.filter((t) => t.type === filterType)
  }, [filterType])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl text-center">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
          Testimonials
        </h3>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Meet our happy clients
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Over 1000+ satisfied clients trust SEA Catering to serve their daily healthy meals.
        </p>

        {/* Filter Buttons */}
        <div className="flex justify-center gap-4 mb-16">
          <Button
            variant={filterType === "all" ? "default" : "outline"}
            onClick={() => setFilterType("all")}
            className="px-6 py-3 text-base rounded-full"
          >
            All
          </Button>
          <Button
            variant={filterType === "personal" ? "default" : "outline"}
            onClick={() => setFilterType("personal")}
            className="px-6 py-3 text-base rounded-full"
          >
            Personal Clients
          </Button>
          <Button
            variant={filterType === "corporate" ? "default" : "outline"}
            onClick={() => setFilterType("corporate")}
            className="px-6 py-3 text-base rounded-full"
          >
            Corporate Clients
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTestimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg"
            >
              <CardContent className="p-6">
                <p className="text-base leading-relaxed mb-6 italic text-left">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
              </CardContent>
              <CardFooter className="flex items-center gap-4 pt-0 px-6 pb-6 border-t border-border/50">
                <Avatar className="size-12 border-2 border-primary">
                  <AvatarImage src={testimonial.avatarSrc} alt={testimonial.author} />
                  <AvatarFallback>
                    {testimonial.author
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="text-base font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.title}
                  </p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
