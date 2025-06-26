// app/not-found.tsx
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 py-12 space-y-6">
      <div className="relative w-full max-w-md aspect-square">
        <Image
          src="/404error.svg"
          alt="404 Error"
          fill
          className="object-contain"
          priority
        />
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-foreground">
        Page Not Found
      </h1>
      <p className="text-muted-foreground text-base md:text-lg max-w-md">
        Oops! Halaman yang kamu cari tidak ditemukan atau mungkin telah dipindahkan.
      </p>
      <Button asChild size="lg" className="rounded-full">
        <Link href="/">Kembali ke Beranda</Link>
      </Button>
    </div>
  );
}
