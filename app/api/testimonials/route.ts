import { NextResponse } from "next/server"
import { Types } from "mongoose"
import dbConnect from "@/lib/mongoose"
import Testimonial from "@/models/Testimonial.model"
import User from "@/models/User.model"
import type { ITestimonial } from "@/models/Testimonial.model"
import type { IUser } from "@/models/User.model"

// Tipe khusus untuk testimonial yang sudah di-populate user-nya
type LeanFeaturedTestimonial = Omit<ITestimonial, "user"> & {
  _id: Types.ObjectId
  user: Pick<IUser, "name" | "image"> & { _id: Types.ObjectId }
  createdAt: Date
}

export async function GET() {
  try {
    // 1. Hubungkan ke database MongoDB
    await dbConnect()

    // 2. Ambil testimonial yang featured, termasuk info nama dan gambar user
    const testimonialsFromDb = (await Testimonial.find({ featured: true })
        .populate({
            path: "user", // field relasi
            select: "name image", // hanya ambil nama dan gambar user
            model: User,
        })
        .sort({ createdAt: -1 }) // urutkan dari yang terbaru
        .limit(9) // batasi hanya 9 testimonial
        .lean() // hasilkan plain object, bukan Mongoose document
    ) as unknown as LeanFeaturedTestimonial[]

    // 3. Jika tidak ada testimonial ditemukan, kirim response 404
    if (!testimonialsFromDb || testimonialsFromDb.length === 0) {
      return NextResponse.json(
        { message: "No featured testimonials found" },
        { status: 404 }
      )
    }

    // 4. Format testimonial agar sesuai kebutuhan frontend
    const formattedTestimonials = testimonialsFromDb.map((t) => ({
      id: t._id.toString(), // konversi ObjectId ke string
      quote: t.message, // pesan testimoni
      author: t.user.name, // nama user yang memberi testimoni
      title: "Valued Customer", // label title statis
      avatarSrc:
        t.user.image || // jika ada image pakai itu
        `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(
          t.user.name
        )}`, // jika tidak ada, buat avatar dari inisial
    }))

    // 5. Kirim hasil testimonial ke client
    return NextResponse.json(formattedTestimonials)

  } catch (error) {
    // 6. Tangani error tak terduga dan log ke server
    console.error("[TESTIMONIALS_GET_ERROR]", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}
