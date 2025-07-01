"use client"

import React, { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Testimonial {
  id: string
  quote: string
  author: string
  title: string
  avatarSrc?: string
}

const TestimonialCardSkeleton = () => (
  <Card className="bg-card text-card-foreground shadow-lg rounded-lg">
    <CardContent className="p-6">
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter className="flex items-center gap-4 pt-0 px-6 pb-6 border-t border-border/50">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
    </CardFooter>
  </Card>
)

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials")
        if (!response.ok) {
          throw new Error("Gagal mengambil testimoni.")
        }

        const data = await response.json()
        setTestimonials(data)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Terjadi kesalahan saat mengambil data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl text-center">
        <h3 className="text-sm font-semibold text-primary uppercase tracking-wide mb-2">
          Testimonials
        </h3>
        <h2 className="text-4xl font-bold text-foreground mb-4">
          Apa Kata Klien Kami?
        </h2>
        <p className="text-lg text-muted-foreground mb-12">
          Lebih dari 1000+ klien puas memercayakan makanan sehat harian mereka kepada SEA Catering.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <TestimonialCardSkeleton key={i} />)
          ) : error ? (
            <p className="col-span-3 text-destructive text-center">{error}</p>
          ) : testimonials.length === 0 ? (
            <p className="col-span-3 text-muted-foreground">Belum ada testimoni tersedia.</p>
          ) : (
            testimonials.map(({ id, quote, author, title, avatarSrc }) => (
              <Card
                key={id}
                className="bg-card text-card-foreground shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg flex flex-col"
              >
                <CardContent className="p-6 flex-grow">
                  <p className="text-base leading-relaxed mb-6 italic text-left">
                    &ldquo;{quote}&rdquo;
                  </p>
                </CardContent>
                <CardFooter className="flex items-center gap-4 pt-0 px-6 pb-6 border-t mt-auto">
                  <Avatar className="size-12 border-2 border-primary">
                    <AvatarImage src={avatarSrc} alt={author} />
                    <AvatarFallback>
                      {author
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="text-base font-semibold text-foreground">{author}</p>
                    <p className="text-sm text-muted-foreground">{title}</p>
                  </div>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  )
}
