"use client"

import { AuthForm } from "@/components/auth/auth-form";
import { signInWithCredentials } from "@/lib/actions/auth.action";
import { LoginFormData, SignInSchema } from "@/lib/validations";
// import { registerUser } from "@/lib/actions/user.action";

export default function LoginPage() {
  const defaultValues: LoginFormData = {
      email: "",
      password: "",
    };
  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm defaultValues={defaultValues} formType="SIGN_IN" onSubmit={signInWithCredentials} schema={SignInSchema}/>
      </div>
    </div>
  );
}
