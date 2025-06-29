"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addPlan } from "@/lib/actions/admin.action";

const addPlanSchema = z.object({
  name: z.enum(["Diet", "Protein", "Royal"]),
  price: z.coerce.number().min(1000, { message: "Harga minimal Rp1.000" }),
});

type AddPlanInput = z.infer<typeof addPlanSchema>;

export function AddPlanForm() {
  const form = useForm<AddPlanInput>({
    resolver: zodResolver(addPlanSchema),
    defaultValues: {
      name: "Diet",
      price: 0,
    },
  });

  const onSubmit = async (data: AddPlanInput) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());
      const result = await addPlan(formData);
      if (result?.success) {
        toast.success("Plan berhasil ditambahkan");
        form.reset();
      } else {
        toast.error("Gagal menambahkan plan");
      }
    } catch (error) {
      toast.error((error as Error).message ?? "Terjadi kesalahan");
    }
  };

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-2">Tambah Paket Plan</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Plan</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full border rounded-md px-3 py-2 text-sm"
                  >
                    <option value="Diet">Diet</option>
                    <option value="Protein">Protein</option>
                    <option value="Royal">Royal</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga per Makan (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Tambahkan Plan
          </Button>
        </form>
      </Form>
    </div>
  );
}
