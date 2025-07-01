"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { addPlan } from "@/lib/actions/admin.action";

/**
 * Zod schema for form validation.
 * - `name`: must be one of the allowed enum values.
 * - `price`: coerced to number, minimum value is 1000.
 */
const addPlanSchema = z.object({
  name: z.enum(["Diet", "Protein", "Royal"]),
  price: z.coerce.number().min(1000, { message: "Minimum price is Rp1,000" }),
});

// Infer form data type from schema
type AddPlanInput = z.infer<typeof addPlanSchema>;

/**
 * AddPlanForm Component
 * - Renders a form for admins to create new meal subscription plans.
 * - Integrates with react-hook-form and Zod for validation.
 * - Sends data to `addPlan` server action.
 */
export function AddPlanForm() {
  const form = useForm<AddPlanInput>({
    resolver: zodResolver(addPlanSchema),
    defaultValues: {
      name: "Diet",
      price: 0,
    },
  });

  /**
   * Handle form submission
   * - Converts the data into `FormData` format
   * - Sends to backend with `addPlan()` action
   * - Displays toast messages on success/failure
   */
  const onSubmit = async (data: AddPlanInput) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("price", data.price.toString());

      const result = await addPlan(formData);

      if (result?.success) {
        toast.success("Plan successfully added");
        form.reset(); // reset form to default values
      } else {
        toast.error("Failed to add plan");
      }
    } catch (error) {
      toast.error((error as Error).message ?? "An unexpected error occurred");
    }
  };

  return (
    <div className="max-w-md">
      <h3 className="text-lg font-semibold mb-2">Add New Plan Package</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Plan Name Selector */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
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

          {/* Price Input Field */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price per Meal (Rp)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Add Plan
          </Button>
        </form>
      </Form>
    </div>
  );
}
