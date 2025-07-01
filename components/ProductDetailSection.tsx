"use client";

import { GrainsIcon } from "@phosphor-icons/react";
import Image from "next/image";
import { Barbell, Drop, Fire } from "phosphor-react";

interface ProductDetailSectionProps {
  name: string;
  image: string;
  ingredients: string[];
  origin: string;
  allergens?: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
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
        
        {/* LEFT - Main content: image, name, ingredients, origin, allergens */}
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
            {/* Ingredients List */}
            <div>
              <h2 className="font-semibold text-lg mb-2">Ingredients</h2>
              <ul className="list-disc pl-5">
                {ingredients.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Origin and description */}
            <div>
              <h2 className="font-semibold text-lg mb-2">Origin & Nutritional Background</h2>
              <p>{origin}</p>
            </div>

            {/* Allergen info */}
            <div>
              <h2 className="font-semibold text-lg mb-2">Allergen Information</h2>
              <p>{allergens}</p>
            </div>
          </div>
        </div>

        {/* RIGHT - Sticky nutrition box */}
        <div className="lg:sticky lg:top-24 h-fit space-y-6">
          <div className="rounded-xl border p-6 bg-muted">
            <h3 className="text-lg font-semibold mb-2">Quick Nutrition Facts</h3>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li className="flex flex-row items-center gap-3">
                <Fire />
                Calories: <strong>{nutrition.calories} kcal</strong>
              </li>
              <li className="flex flex-row items-center gap-3">
                <Barbell />
                Protein: <strong>{nutrition.protein}g</strong>
              </li>
              <li className="flex flex-row items-center gap-3">
                <GrainsIcon />
                Carbs: <strong>{nutrition.carbs}g</strong>
              </li>
              <li className="flex flex-row items-center gap-3">
                <Drop />
                Fat: <strong>{nutrition.fat}g</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailSection;
