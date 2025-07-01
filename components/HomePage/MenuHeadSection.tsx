"use client"

import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import type { CarouselApi } from "@/components/ui/carousel"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface GalleryItem {
  id: string
  title: string
  summary: string
  url: string
  image: string
}

const MenuHeadSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({})

  const items: GalleryItem[] = [
    {
      id: "grilled-chicken-salad",
      title: "Grilled Chicken Salad",
      summary: "Grilled chicken, romaine lettuce, cherry tomatoes, olive oil, lemon dressing",
      url: "/menu/grilled-chicken-salad",
      image: "/grilledchicken.jpg",
    },
    {
      id: "salmon-teriyaki-bowl",
      title: "Salmon Teriyaki Bowl",
      summary: "Salmon fillet, brown rice, broccoli, teriyaki sauce, sesame seeds",
      url: "/menu/salmon-teriyaki-bowl",
      image: "/SalmonTeriyaki.jpg",
    },
    {
      id: "vegan-buddha-bowl",
      title: "Vegan Buddha Bowl",
      summary: "Quinoa, chickpeas, avocado, kale, beetroot, tahini sauce",
      url: "/menu/vegan-buddha-bowl",
      image: "/buddhavegan.jpg",
    },
    {
      id: "goulash",
      title: "Hearty Goulash",
      summary: "A rich Hungarian stew of beef, onions, and paprika, perfect for a hearty meal.",
      url: "/menu/goulash",
      image: "/goulash.jpg",
    },
    {
      id: "fruit-yogurt-parfait",
      title: "Fruit Yogurt Parfait",
      summary: "Greek yogurt, granola, strawberries, blueberries, honey",
      url: "/menu/fruit-yogurt-parfait",
      image: "/fruityogurt.jpg",
    },
  ]

  useEffect(() => {
    if (!carouselApi) return
    const update = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    update()
    carouselApi.on("select", update)
    return () => {
      carouselApi.off("select", update)
    }
  }, [carouselApi])

  return (
    <section className="pb-20 pt-32 md:pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Heading */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold mb-2">Featured Menu</h2>
            <Link
              href="/menu"
              className="group flex items-center gap-1 text-sm sm:text-base text-muted-foreground hover:text-foreground transition"
            >
              View all menu
              <ArrowUpRight className="size-4 group-hover:translate-x-1 transition" />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

        {/* Carousel */}
        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
          className="relative w-full"
        >
          <CarouselContent className="hide-scrollbar w-full">
            {items.map((item) => (
              <CarouselItem
                key={item.id}
                className="basis-[90%] md:basis-[380px] flex justify-center"
              >
                <Link href={item.url} className="group block w-full h-full">
                  <Card className="flex flex-col justify-between h-full overflow-hidden">
                    <div>
                      <CardHeader>
                        <CardTitle className="mb-2 text-lg sm:text-xl lg:text-2xl font-medium line-clamp-2">
                          {item.title}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground text-sm sm:text-base line-clamp-2">
                          {item.summary}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="aspect-[3/2] overflow-hidden rounded-xl mt-3">
                          <div className="relative w-full h-full transition-transform group-hover:scale-105">
                            {!imageLoaded[item.id] && (
                              <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
                            )}
                            <Image
                              fill
                              src={item.image}
                              alt={item.title}
                              className={`object-cover rounded-xl transition-opacity duration-300 ${
                                imageLoaded[item.id] ? "opacity-100" : "opacity-0"
                              }`}
                              onLoad={() =>
                                setImageLoaded((prev) => ({
                                  ...prev,
                                  [item.id]: true,
                                }))
                              }
                            />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                    <CardFooter>
                      <span className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition">
                        Learn more
                        <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardFooter>
                  </Card>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default MenuHeadSection
