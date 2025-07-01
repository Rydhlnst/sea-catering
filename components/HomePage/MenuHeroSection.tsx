"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

interface MenuItem {
  title: string
  summary: string
  image: string
  url: string
}

const items: MenuItem[] = [
  {
    title: "Grilled Chicken Salad",
    summary: "Grilled chicken, romaine lettuce, cherry tomatoes, olive oil, lemon dressing",
    image: "/grilledchicken.jpg",
    url: "/menu/grilled-chicken-salad",
  },
  {
    title: "Salmon Teriyaki Bowl",
    summary: "Salmon fillet, brown rice, broccoli, teriyaki sauce, sesame seeds",
    image: "/SalmonTeriyaki.jpg",
    url: "/menu/salmon-teriyaki-bowl",
  },
  {
    title: "Vegan Buddha Bowl",
    summary: "Quinoa, chickpeas, avocado, kale, beetroot, tahini sauce",
    image: "/buddhavegan.jpg",
    url: "/menu/vegan-buddha-bowl",
  },
  {
    title: "Fruit Yogurt Parfait",
    summary: "Greek yogurt, granola, strawberries, blueberries, honey",
    image: "/fruityogurt.jpg",
    url: "/menu/fruit-yogurt-parfait",
  },
  {
    title: "Hearty Goulash",
    summary: "A rich Hungarian stew of beef, onions, and paprika, perfect for a hearty meal.",
    image: "/goulash.jpg",
    url: "/menu/goulash",
  },
]

const MenuFeatureGrid = () => {
  return (
    <section className="py-32">
      <div className="container">
        {/* Hero Heading */}
        <div className="mb-24 flex flex-col items-center gap-6 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold max-w-3xl">
            Our Signature Meals
          </h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-4xl px-6">
            Carefully prepared meals using high-quality ingredients to support your daily nutrition — tasty, clean, and convenient.
          </p>
          <Link
            href="/menu"
            className="mt-2 inline-flex items-center gap-1 text-primary font-medium hover:underline"
          >
            View full menu
            <ArrowUpRight className="size-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        {/* Grid 2x2 Layout */}
        <div className="relative flex justify-center">
          <div className="relative flex w-full flex-col border border-muted/30 rounded-lg overflow-hidden md:w-4/5">
            <div className="flex flex-col lg:flex-row">
              <FeatureCard {...items[0]} aspect="2.4" className="lg:w-3/5 border-b lg:border-r" />
              <FeatureCard {...items[1]} aspect="1.45" className="lg:w-2/5" />
            </div>

            <div className="flex flex-col lg:flex-row border-t">
              <FeatureCard {...items[2]} aspect="1.45" className="lg:w-2/5 border-b lg:border-r lg:border-b-0" />
              <FeatureCard {...items[3]} aspect="2.4" className="lg:w-3/5" />
            </div>

            {/* Full Width Item */}
            <div className="border-t">
              <FeatureCard {...items[4]} aspect="2.5" className="w-full" full />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const FeatureCard = ({
  title,
  summary,
  image,
  url,
  aspect,
  className = "",
  full = false,
}: MenuItem & { aspect: string; className?: string; full?: boolean }) => {
  return (
    <div className={`flex flex-col justify-between p-8 ${className}`}>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground">{summary}</p>
      <Link href={url}>
        <Image
          src={image}
          alt={title}
          width={1000}
          height={500}
          className={`mt-6 w-full aspect-[${aspect}] object-cover rounded-md transition hover:scale-[1.01] ${
            full ? "lg:aspect-[3]" : ""
          }`}
        />
      </Link>
    </div>
  )
}

export default MenuFeatureGrid
