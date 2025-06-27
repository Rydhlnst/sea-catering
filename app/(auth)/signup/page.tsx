import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm mode="register" />
      </div>
    </div>
  );
}
