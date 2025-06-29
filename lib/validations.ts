import { z } from "zod"

// Schema dasar User
export const UserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  email: z.string().email({ message: "Invalid email" }).optional(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).optional(),
  provider: z.enum(["credentials", "google"]).default("credentials"),
})

export const AddPlanSchema = z.object({
  name: z.enum(["Diet", "Protein", "Royal"]),
  price: z.number().min(1000),
});

export interface SignInWithOAuthParams {
    provider: "google",
    providerAccountId: string,
    user: {
        name: string,
        email: string,
        image: string,
        username: string,
        role: string
    }
} 
 
export interface SerializedPlan {
  _id: string;
  name: "Diet" | "Protein" | "Royal";
  price: number;
  description?: string; 
  image?: string;      
  createdAt: string;
  updatedAt: string;
}

export const SignInSchema = z.object({
    email: z.string().min(1, {message: "Email is required"}).email({message: "Please provide a valid email address"}),
    password: z.string().min(6, {message: "Password must be at least 6 characters long."}).max(100, {message: "Password cannot exceed 100 characters"})
})

export const AccountSchema = z.object({
    userId: z.string().min(1, {message: "User ID is required"}),
    name: z.string().min(1, {message: "Name is required"}),
    image: z.string().url({message: "Please provide a valid URL."}).optional(),
    password: z.string().min(6, {message: "Password must be at least 6 characters long."}).max(100, {message: "Password cannot exceed 100 characters"}).regex(/[A-Z]/, {message: "Password must contain at least one uppercase letter."}).regex(/[a-z]/, {message: "Password must containt at least one lowercase letter"}).regex(/[0-9]/, {message: "Password must contain at least one number"}).regex(/[^a-zA-Z0-9]/, {message: "Password must contain at least one special character",}).optional(),
    provider: z.string().min(1, {message: "Provider is required"}),
    providerAccountId: z.string().min(1, {message: "Provider Account ID is required"})
});

// Register (Credentials-based)
export const SignUpSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  username: z.string().min(3, { message: "Username is required" }),
  phoneNumber: z
    .string()
    .min(8, { message: "Phone number is too short" })
    .max(15, { message: "Phone number is too long" })
    .regex(/^[0-9]+$/, { message: "Phone number must contain only digits" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export type RegisterFormData = z.infer<typeof SignUpSchema>

export type LoginFormData = z.infer<typeof SignInSchema>

// Login (email & password — optional disesuaikan login flow kamu)
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string().min(1, { message: "Password is required" }),
})

export const mealPlans = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
} as const

export const subscriptionSchema = z.object({
  name: z.string().min(3, { message: "Name is required" }),
  phoneNumber: z
    .string()
    .min(10, { message: "Phone number too short" })
    .max(15, { message: "Phone number too long" }),
  plan: z.enum(["diet", "protein", "royal"]),
  mealTypes: z.array(z.enum(["breakfast", "lunch", "dinner"])).min(1, {
    message: "Select at least one meal type",
  }),
  deliveryDays: z
    .array(
      z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
      ])
    )
    .min(1, { message: "Select at least one delivery day" }),
  allergies: z.string().optional(),
})