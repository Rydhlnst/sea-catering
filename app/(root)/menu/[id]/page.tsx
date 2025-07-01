'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { menuData } from '@/lib/data'
import ProductDetailSection from '@/components/ProductDetailSection'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MenuDetailPage = () => {
  // 1. Get the 'id' parameter from the URL
  const params = useParams()
  const id = params.id as string

  // 2. Find the matching product from menuData
  const product = menuData.find((item) => item.id === id)

  // 3. If no matching product found, show Not Found section
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full flex items-center justify-center">
            <Image src="/menunotfound.svg" alt="Menu Not Found" width={512} height={512} />
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Menu Not Found</h1>
            <p className="text-muted-foreground max-w-md">
              Sorry, we couldn&apos;t find the menu item you&apos;re looking for. The link might be broken, or the item may no longer be available.
            </p>
          </div>

          <Link href="/menu">
            <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
              Back to Menu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // 4. If product is found, render the product detail component
  return <ProductDetailSection {...product} />
}

export default MenuDetailPage
