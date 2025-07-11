"use client";

import {
  useForm,
  Path,
  SubmitHandler,
  DefaultValues,
  FieldValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z, ZodTypeAny } from "zod";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

// For handling form response consistently
interface ActionResponse {
  success: boolean;
  status?: number;
  error?: {
    message: string;
    name?: string;
    errors?: Record<string, string[]>; // untuk ValidationError
  };
}


// Props for reusable AuthForm
interface AuthFormProps<T extends FieldValues> {
  className?: string;
  image?: string;
  schema: ZodTypeAny;
  defaultValues: T;
  formType: "SIGN_IN" | "SIGN_UP";
  onSubmit: (data: T) => Promise<ActionResponse>;
}

export function AuthForm<T extends FieldValues>({
  className,
  image = "/vegetables.jpg",
  schema,
  defaultValues,
  onSubmit,
  formType,
}: AuthFormProps<T>) {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  if (!schema) {
    throw new Error("Zod schema is required in <AuthForm />");
  }

    // Form submit handler
    const handleSubmit: SubmitHandler<T> = async (data) => {
    try {
      const result = await onSubmit(data);

      if (result?.success) {
        toast("Success", {
          description:
            formType === "SIGN_IN"
              ? "Signed in successfully"
              : "Signed up successfully",
        });
        router.push("/");
      } else {
        // Tampilkan pesan dari server
        if (result?.error?.name === "ValidationError" && result?.error?.errors) {
          const messages = Object.entries(result.error.errors)
            .map(([field, errs]) => `${field}: ${errs.join(", ")}`)
            .join("\n");

          toast.error("Validation Error", {
            description: messages,
          });
        } else {
          toast.error(result.error?.name ?? "Server Error", {
            description: result.error?.message || "Unexpected error occurred.",
          });
        }
      }
    } catch (error) {
      // Error yang tidak tertangkap sebelumnya
      toast.error("Unexpected Error", {
        description: (error as Error).message,
      });
    }
  };


  // Dynamic labels
  const title = formType === "SIGN_IN" ? "Welcome back" : "Create an account";
  const description =
    formType === "SIGN_IN"
      ? "Log in to your account"
      : "Start your journey with us";
  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit, (errors) => {
                const firstError = Object.values(errors)[0];
                if (firstError?.message) {
                  toast.error("Validation Error", {
                    description: firstError.message.toString(),
                  });
                }
              })}
              className="p-6 md:p-8"
            >
              <div className="flex flex-col gap-6">
                {/* Form heading */}
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{title}</h1>
                  <p className="text-muted-foreground text-sm">{description}</p>
                </div>

                {/* Render fields dynamically based on defaultValues */}
                {Object.keys(defaultValues).map((field) => (
                  <FormField
                    key={field}
                    control={form.control}
                    name={field as Path<T>}
                    render={({ field: formField }) => (
                      <FormItem className="grid gap-3">
                        <FormLabel htmlFor={formField.name}>
                          {formField.name === "email"
                            ? "Email Address"
                            : formField.name.charAt(0).toUpperCase() +
                              formField.name.slice(1)}
                        </FormLabel>
                        <FormControl>
                          <Input
                            id={formField.name}
                            type={
                              formField.name === "password" ? "password" : "text"
                            }
                            placeholder={formField.name}
                            {...formField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting
                    ? formType === "SIGN_IN"
                      ? "Logging in..."
                      : "Signing up..."
                    : buttonText}
                </Button>

                {/* Separator for OAuth */}
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or continue with
                  </span>
                </div>

                {/* Google OAuth Button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => signIn("google", {callbackUrl: "/dashboard"})}
                  className="w-full"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 mr-2"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Continue with Google
                </Button>

                {/* Auth links */}
                <div className="text-center text-sm">
                  {formType === "SIGN_IN" ? (
                    <>
                      Don’t have an account?{" "}
                      <Link
                        href="/register"
                        className="underline underline-offset-4"
                      >
                        Sign up
                      </Link>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <Link
                        href="/login"
                        className="underline underline-offset-4"
                      >
                        Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </form>
          </Form>

          {/* Side image on larger screens */}
          <div className="bg-muted relative hidden md:block">
            <Image
              fill
              src={image}
              alt="Auth Illustration"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      {/* Terms and policy disclaimer */}
      <p className="text-muted-foreground text-center text-xs text-balance">
        By clicking continue, you agree to our{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link
          href="#"
          className="underline underline-offset-4 hover:text-primary"
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}

export default AuthForm;
