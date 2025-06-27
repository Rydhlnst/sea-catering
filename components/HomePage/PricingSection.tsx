"use client"

// import { Check } from "lucide-react"
// import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Check } from "phosphor-react"

const PricingSection = () => {
//   const [isPerMonth, setIsPerMonth] = useState(false)

  return (
    <section className="py-20 min-h-screen flex items-center justify-center max-w-7xl mx-auto">
      <div className="container">
        <div className="mx-auto flex max-w-7xl flex-col gap-6">
          <h2 className="text-4xl font-bold text-pretty lg:text-6xl">
            Plan Selection
          </h2>
          <div className="flex flex-col justify-between gap-10 md:flex-row">
            <p className="max-w-3xl text-muted-foreground lg:text-xl">
              Pilih paket makanan yang sesuai dengan kebutuhanmu. Semua paket dapat disesuaikan untuk pagi, siang, atau malam, dan dikirim langsung ke tempatmu!
            </p>
          </div>

          <div className="flex w-full flex-col items-stretch gap-6 md:flex-row">
            {/* Diet Plan */}
            <div className="flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">Diet Plan</Badge>
              <span className="text-3xl font-semibold">Rp30.000</span>
              <p className="text-muted-foreground">per meal</p>
              <Separator className="my-6" />
              <div className="flex flex-col justify-between gap-20">
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Kandungan kalori terkontrol (≤ 500 kcal)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Cocok untuk program penurunan berat badan</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Makanan rendah gula & karbohidrat</span>
                  </li>
                </ul>
                <Button className="w-full">Pilih Paket</Button>
              </div>
            </div>

            {/* Protein Plan */}
            <div className="flex w-full flex-col rounded-lg border p-6 text-left">
              <Badge className="mb-8 block w-fit">Protein Plan</Badge>
              <span className="text-3xl font-semibold">Rp40.000</span>
              <p className="text-muted-foreground">per meal</p>
              <Separator className="my-6" />
              <div className="flex flex-col justify-between gap-20">
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Tinggi protein (≥ 25g)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Dukung pertumbuhan & recovery otot</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Cocok untuk gaya hidup aktif & gym</span>
                  </li>
                </ul>
                <Button className="w-full">Pilih Paket</Button>
              </div>
            </div>

            {/* Royal Plan */}
            <div className="flex w-full flex-col rounded-lg border bg-muted p-6 text-left">
              <Badge className="mb-8 block w-fit">Royal Plan</Badge>
              <span className="text-3xl font-semibold">Rp60.000</span>
              <p className="text-muted-foreground">per meal</p>
              <Separator className="my-6" />
              <div className="flex flex-col justify-between gap-20">
                <ul className="space-y-4 text-muted-foreground text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Menu eksklusif & premium</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Bahan baku organik & impor</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Disajikan oleh chef profesional</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-4" />
                    <span>Cocok untuk event atau luxury needs</span>
                  </li>
                </ul>
                <Button className="w-full">Pilih Paket</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PricingSection
