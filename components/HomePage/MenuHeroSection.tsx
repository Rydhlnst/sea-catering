"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link"; // Gunakan Link dari Next.js untuk navigasi

import { Button } from "@/components/ui/button";
import type { CarouselApi } from "@/components/ui/carousel";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";

interface GalleryItem {
  id: string; // ID ini sebaiknya cocok dengan ID di data.ts
  title: string;
  summary: string;
  url: string; // URL akan menuju ke halaman detail
  image: string;
}

const MenuHeadSection = () => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // Data ini bisa juga diambil dari data.ts dan di-filter jika perlu
  const items: GalleryItem[] = [
    {
      id: "grilled-chicken-salad",
      title: "Grilled Chicken Salad",
      summary:
        "Grilled chicken, romaine lettuce, cherry tomatoes, olive oil, lemon dressing",
      url: "/menu/grilled-chicken-salad",
      image: "/grilledchicken.jpg",
    },
    {
      id: "salmon-teriyaki-bowl",
      title: "Salmon Teriyaki Bowl",
      summary:
        "Salmon fillet, brown rice, broccoli, teriyaki sauce, sesame seeds",
      url: "/menu/salmon-teriyaki-bowl",
      image: "/SalmonTeriyaki.jpg",
    },
    {
      id: "vegan-buddha-bowl",
      title: "Vegan Buddha Bowl",
      summary:
        "Quinoa, chickpeas, avocado, kale, beetroot, tahini sauce",
      url: "/menu/vegan-buddha-bowl",
      image: "/buddhavegan.jpg",
    },
    {
      id: "goulash",
      title: "Hearty Goulash",
      summary:
        "A rich Hungarian stew of beef, onions, and paprika, perfect for a hearty meal.",
      url: "/menu/goulash", // Asumsi Anda akan menambahkan goulash ke data.ts
      image: "/goulash.jpg",
    },
    {
      id: "fruit-yogurt-parfait",
      title: "Fruit Yogurt Parfait",
      summary:
        "Greek yogurt, granola, strawberries, blueberries, honey",
      url: "/menu/fruit-yogurt-parfait", // Asumsi Anda akan menambahkan parfait ke data.ts
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
            <Link
              href="/menu" // Arahkan ke halaman menu utama
              className="group flex items-center gap-1 text-sm font-medium md:text-base lg:text-lg"
            >
              View all menu
              <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
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
                <Link
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
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
};

export default MenuHeadSection;