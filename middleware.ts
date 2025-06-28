// middleware.ts
export { auth as middleware } from "@/auth";

// Konfigurasi matcher untuk menentukan halaman mana yang akan dilindungi
export const config = {
  matcher: [
    "/dashboard/:path*", // Melindungi halaman dashboard dan semua sub-halamannya
    // Tambahkan path lain yang ingin Anda lindungi di sini
  ],
};