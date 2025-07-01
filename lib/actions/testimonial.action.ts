"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import mongoose from "mongoose";
import { auth } from "@/auth";
import dbConnect from "../mongoose";
import Subscription from "@/models/Subscription.model";
import Testimonial from "@/models/Testimonial.model";
import User from "@/models/User.model";

// Validasi input testimoni menggunakan Zod
const TestimonialValidationSchema = z.object({
  message: z
    .string()
    .min(10, { message: "Pesan testimoni minimal 10 karakter." })
    .max(1000, { message: "Pesan testimoni maksimal 1000 karakter." }),
  rating: z.coerce
    .number()
    .min(1, { message: "Rating minimal adalah 1." })
    .max(5, { message: "Rating maksimal adalah 5." }),
  subscriptionId: z.string().nonempty({ message: "Subscription ID diperlukan." }),
});

type CreateTestimonialParams = z.infer<typeof TestimonialValidationSchema>;

// Fungsi untuk membuat testimoni oleh user login
export async function createTestimonial(params: CreateTestimonialParams) {
  const session = await auth();
  const userEmail = session?.user?.email;

  if (!userEmail) {
    console.warn("[TESTIMONIAL_CREATE] Gagal: Tidak ada email di sesi pengguna.");
    return { error: "Akses ditolak. Sesi pengguna tidak valid." };
  }

  try {
    // Validasi input menggunakan Zod
    const { subscriptionId, message, rating } = TestimonialValidationSchema.parse(params);

    // Validasi format ID subscription
    if (!mongoose.Types.ObjectId.isValid(subscriptionId)) {
      console.warn(`[TESTIMONIAL_CREATE] Gagal: Format subscriptionId tidak valid. ID: ${subscriptionId}`);
      return { error: "Subscription ID tidak valid." };
    }

    // Koneksi ke database MongoDB
    await dbConnect();

    // Ambil data user berdasarkan email sesi
    const user = await User.findOne({ email: userEmail }).select("_id");
    if (!user || !user._id) {
      return { error: "Pengguna tidak ditemukan dalam database." };
    }

    // Verifikasi apakah subscription dimiliki oleh user
    const userSubscription = await Subscription.findOne({
      _id: subscriptionId,
      user: user._id,
    });

    if (!userSubscription) {
      console.warn(`[TESTIMONIAL_CREATE] Gagal: Subscription tidak ditemukan atau bukan milik user.`);
      return {
        error: "Verifikasi gagal. Subscription tidak ditemukan atau bukan milik Anda.",
      };
    }

    // Cek apakah testimoni untuk subscription ini sudah pernah dibuat oleh user
    const existingTestimonial = await Testimonial.findOne({
      user: user._id,
      subscription: subscriptionId,
    });

    if (existingTestimonial) {
      return { error: "Anda sudah pernah memberikan testimoni untuk langganan ini." };
    }

    // Simpan testimoni ke database dengan featured: true agar langsung tampil di homepage
    const created = await Testimonial.create({
      user: user._id,
      subscription: subscriptionId,
      message,
      rating,
      featured: true, // ✅ Dijadikan featured secara default
    });

    console.log("[TESTIMONIAL_CREATE] Testimoni berhasil dibuat:", created._id);

    // Revalidate path untuk menampilkan testimoni baru secara langsung
    revalidatePath("/dashboard/testimonials");

    return { success: "Terima kasih! Testimoni Anda telah berhasil dikirim." };
  } catch (error) {
    // Tangani error dari validasi Zod
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      console.error("[TESTIMONIAL_CREATE] Error Validasi Zod:", errorMessage);
      return { error: `Data tidak valid: ${errorMessage}` };
    }

    // Tangani error internal
    console.error("[TESTIMONIAL_CREATE] Error Server:", error);
    return { error: "Terjadi kesalahan pada server. Silakan coba lagi nanti." };
  }
}
