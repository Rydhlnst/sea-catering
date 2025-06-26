'use client'

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 space-y-6">
      <h1 className="text-3xl font-bold">Oops! Something went wrong.</h1>
      <p className="text-muted-foreground max-w-md">
        Kami mengalami kendala saat memuat halaman ini. Silakan coba lagi nanti.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>Coba Lagi</Button>
        <Button variant="outline" asChild>
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    </div>
  )
}
