"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"

interface ProductDetailSectionProps {
  name: string
  image: string
  ingredients: string[]
  origin: string
  allergens?: string
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

const ProductDetailSection = ({
  name,
  image,
  ingredients,
  origin,
  allergens = "None",
  nutrition,
}: ProductDetailSectionProps) => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-28">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-12">
        
        {/* LEFT */}
        <div>
          <Image
            src={image}
            alt={name}
            width={1200}
            height={700}
            className="rounded-xl object-cover w-full mb-8"
          />

          <h1 className="text-3xl md:text-4xl font-bold mb-4">{name}</h1>

          <div className="text-muted-foreground leading-relaxed space-y-6">
            <div>
              <h2 className="font-semibold text-lg mb-2">Ingredients</h2>
              <ul className="list-disc pl-5">
                {ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Origin & Nutritional Background</h2>
              <p>{origin}</p>
            </div>

            <div>
              <h2 className="font-semibold text-lg mb-2">Allergen Info</h2>
              <p>{allergens}</p>
            </div>
          </div>
        </div>

        {/* RIGHT - Sticky */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="rounded-xl border p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2">Quick Info</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>🍽 Calories: <strong>{nutrition.calories} kcal</strong></li>
              <li>💪 Protein: <strong>{nutrition.protein}g</strong></li>
              <li>🌾 Carbs: <strong>{nutrition.carbs}g</strong></li>
              <li>🧴 Fat: <strong>{nutrition.fat}g</strong></li>
            </ul>
          </div>

          <Button size="lg" className="w-full text-base font-semibold rounded-full">
            Add to Meal Plan
          </Button>

          <p className="text-sm text-muted-foreground">
            You can customize this meal in your subscription preferences.
          </p>
        </div>
      </div>
    </section>
  )
}

export default ProductDetailSection
