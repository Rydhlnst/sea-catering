import ProductDetailSection from '@/components/ProductDetailSection'
import React from 'react'

const MenuPage = () => {
  return (
    <div>
      <ProductDetailSection
        name="Vegan Buddha Bowl"
        image="/buddhavegan.jpg"
        ingredients={[
            "Quinoa", "Chickpeas", "Avocado", "Kale", "Beetroot", "Tahini Sauce"
        ]}
        origin="Inspired by Asian-Middle Eastern fusion. This bowl supports digestive health, energy, and balanced plant-based nutrition."
        allergens="Contains sesame. Gluten-free. Vegan."
        nutrition={{
            calories: 420,
            protein: 18,
            carbs: 55,
            fat: 12,
        }}
        />
    </div>
  )
}

export default MenuPage
