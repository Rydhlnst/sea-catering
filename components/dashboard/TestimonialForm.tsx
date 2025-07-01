"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { createTestimonial } from "@/lib/actions/testimonial.action"

// Skema validasi Zod untuk sisi klien.
// Sebaiknya identik dengan skema di server action untuk konsistensi.
const FormSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, { message: "Rating tidak boleh kurang dari 1." })
    .max(5, { message: "Rating tidak boleh lebih dari 5." }),
  message: z.string()
    .min(10, { message: "Pesan testimoni harus lebih dari 10 karakter." })
    .max(1000, { message: "Pesan testimoni tidak boleh lebih dari 1000 karakter." }),
})

interface TestimonialFormProps {
  subscriptionId: string
  // Tambahkan prop untuk menutup dialog/modal jika form ini ada di dalamnya
  onSuccess?: () => void
}

export function TestimonialForm({ subscriptionId, onSuccess }: TestimonialFormProps) {
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rating: 5,
      message: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await createTestimonial({
        ...data,
        subscriptionId,
      })

      if (result.error) {
        toast.error("Gagal Mengirim", {
          description: result.error,
        })
      } else {
        toast.success("Testimoni Terkirim!", {
          description: result.success,
        })
        form.reset() // Reset field form setelah berhasil
        if (onSuccess) {
          onSuccess() // Jalankan callback jika ada (misal: menutup modal)
        }
      }
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Rating</FormLabel>
              <FormControl>
                <Input type="number" min={1} max={5} {...field} />
              </FormControl>
              <FormDescription>
                Beri rating antara 1 sampai 5.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pesan Testimoni</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ceritakan pengalaman Anda menggunakan layanan kami..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Pesan Anda akan membantu pengguna lain membuat keputusan.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Mengirim..." : "Kirim Testimoni"}
        </Button>
      </form>
    </Form>
  )
}