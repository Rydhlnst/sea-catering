'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import { menuData } from '@/lib/data' 
import ProductDetailSection from '@/components/ProductDetailSection'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const MenuDetailPage = () => {
  // 1. Ambil parameter dari URL
  const params = useParams()
  const id = params.id as string // 'id' sesuai dengan nama folder [id]

  // 2. Cari data produk yang sesuai di dalam array menuData
  const product = menuData.find((item) => item.id === id)

  // 3. Jika produk tidak ditemukan, tampilkan pesan error atau komponen Not Found
  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 text-center">
        <div className="flex flex-col items-center gap-6">
          
          <div className="rounded-full flex items-center justify-center">
            <Image src={"/menunotfound.svg"} alt='Menu Not Found' width={512} height={512}/>
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Menu Tidak Ditemukan
            </h1>
            <p className="text-muted-foreground max-w-md">
              Maaf, kami tidak dapat menemukan menu yang Anda cari. Mungkin link salah atau menu sudah tidak tersedia lagi.
            </p>
          </div>
          
          <Link href="/menu">
              <Button className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  Kembali ke Menu
              </Button>
          </Link>
        </div>
      </div>
    );
  }

  // 4. Jika produk ditemukan, render komponen ProductDetailSection dengan data tersebut
  return <ProductDetailSection {...product} />
}

export default MenuDetailPage