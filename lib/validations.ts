import { z } from "zod"

export const registerSchema = z.object({
  name: z.string().min(3, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export const mealPlans = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
} as const

export const subscriptionSchema = z.object({
  name: z.string().min(3),
  phone: z.string().min(10).max(15),
  plan: z.enum(["diet", "protein", "royal"]),
  mealTypes: z.array(z.enum(["breakfast", "lunch", "dinner"])).min(1),
  deliveryDays: z.array(
    z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
  ).min(1),
  allergies: z.string().optional(),
})
