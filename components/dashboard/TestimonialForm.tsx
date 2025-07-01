"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createTestimonial } from "@/lib/actions/testimonial.action";

/**
 * Zod schema used to validate testimonial form input.
 * Client-side schema should match server schema for consistency.
 */
const FormSchema = z.object({
  rating: z.coerce
    .number()
    .min(1, { message: "Rating cannot be less than 1." })
    .max(5, { message: "Rating cannot be more than 5." }),
  message: z.string()
    .min(10, { message: "Message must be at least 10 characters long." })
    .max(1000, { message: "Message must not exceed 1000 characters." }),
});

interface TestimonialFormProps {
  subscriptionId: string;
  /**
   * Optional callback that runs on successful submission.
   * Useful for closing a modal or refreshing data.
   */
  onSuccess?: () => void;
}

/**
 * A reusable testimonial form component that allows users to submit
 * feedback based on their experience with a service or subscription.
 * Includes form validation using Zod and real-time feedback using Sonner toast.
 */
export function TestimonialForm({
  subscriptionId,
  onSuccess,
}: TestimonialFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      rating: 5,
      message: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    startTransition(async () => {
      const result = await createTestimonial({
        ...data,
        subscriptionId,
      });

      if (result.error) {
        toast.error("Submission Failed", {
          description: result.error,
        });
      } else {
        toast.success("Testimonial Submitted!", {
          description: result.success,
        });
        form.reset(); // Reset form after successful submission
        if (onSuccess) {
          onSuccess(); // Trigger optional callback
        }
      }
    });
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
                Provide a rating between 1 and 5.
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
              <FormLabel>Testimonial Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share your experience using our service..."
                  className="resize-none"
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your message will help other users make informed decisions.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {isPending ? "Submitting..." : "Submit Testimonial"}
        </Button>
      </form>
    </Form>
  );
}
