"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "../ui/skeleton";

interface GalleryItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  image: string;
}

const MenuHeadSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  const items: GalleryItem[] = [
    {
      id: "1",
      title: "Grilled Chicken Salad",
      summary:
        "Grilled chicken, romaine lettuce, cherry tomatoes, olive oil, lemon dressing",
      url: "#",
      image: "/grilledchicken.jpg",
    },
    {
      id: "2",
      title: "Salmon Teriyaki Bowl",
      summary:
        "Salmon fillet, brown rice, broccoli, teriyaki sauce, sesame seeds",
      url: "#",
      image: "/salmonteriyaki.jpg",
    },
    {
      id: "3",
      title: "Vegan Buddha Bowl",
      summary:
        "Quinoa, chickpeas, avocado, kale, beetroot, tahini sauce",
      url: "#",
      image: "/buddhavegan.jpg",
    },
    {
      id: "4",
      title: "Goulash",
      summary:
        "Slow-cooked beef, coconut milk, lemongrass, galangal, spices",
      url: "#",
      image: "/goulash.jpg",
    },
    {
      id: "5",
      title: "Fruit Yogurt Parfait",
      summary:
        "Greek yogurt, granola, strawberries, blueberries, honey",
      url: "#",
      image: "/fruityogurt.jpg",
    },
  ];

  useEffect(() => {
    if (!carouselApi) return;
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev());
      setCanScrollNext(carouselApi.canScrollNext());
    };
    updateSelection();
    carouselApi.on("select", updateSelection);
    return () => {
      carouselApi.off("select", updateSelection);
    };
  }, [carouselApi]);

  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div>
            <h2 className="mb-3 text-3xl font-semibold md:mb-4 md:text-4xl lg:mb-6">
              Featured Menu
            </h2>
            <a
              href="#"
              className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
            >
              View all menu
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
          <div className="mt-8 flex shrink-0 items-center justify-start gap-2">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="disabled:pointer-events-auto"
            >
              <ArrowLeft className="size-5" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="disabled:pointer-events-auto"
            >
              <ArrowRight className="size-5" />
            </Button>
          </div>
        </div>

        <Carousel
          setApi={setCarouselApi}
          opts={{
            breakpoints: {
              "(max-width: 768px)": {
                dragFree: true,
              },
            },
          }}
          className="relative w-full max-w-full md:left-[-1rem]"
        >
          <CarouselContent className="hide-scrollbar w-full max-w-full">
            {items.map((item) => (
              <CarouselItem key={item.id} className="ml-8 md:max-w-[452px]">
                <a
                  href={item.url}
                  className="group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-3/2 flex overflow-clip rounded-xl">
                        <div className="flex-1 relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
                            {!imageLoaded[item.id] && (
                            <Skeleton className="absolute inset-0 h-full w-full rounded-xl" />
                            )}
                            <Image
                            fill
                            src={item.image}
                            alt={item.title}
                            className={`object-cover object-center rounded-xl transition-opacity duration-300 ${
                                imageLoaded[item.id] ? "opacity-100" : "opacity-0"
                            }`}
                            onLoad={() =>
                                setImageLoaded((prev) => ({ ...prev, [item.id]: true }))
                            }
                            />
                        </div>
                        </div>
                  </div>
                  <div className="mb-2 line-clamp-3 break-words pt-4 text-lg font-medium md:mb-3 md:pt-4 md:text-xl lg:pt-4 lg:text-2xl">
                    {item.title}
                  </div>
                  <div className="text-muted-foreground mb-8 line-clamp-2 text-sm md:mb-12 md:text-base lg:mb-9">
                    {item.summary}
                  </div>
                  <div className="flex items-center text-sm">
                    Learn more
                    <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
                  </div>
                </a>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default MenuHeadSection;
