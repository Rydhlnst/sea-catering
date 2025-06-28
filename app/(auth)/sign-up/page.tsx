"use client"

import { AuthForm } from "@/components/auth/auth-form";
import { signUpWithCredentials } from "@/lib/actions/auth.action";
import { RegisterFormData, SignUpSchema } from "@/lib/validations";

export default function RegisterPage() {

  const defaultValues: RegisterFormData = {
    name: "",
    username: "",
    phoneNumber: "",
    email: "",
    password: "",
  };

  return (
    <div className="bg-muted flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <AuthForm formType="SIGN_UP" schema={SignUpSchema} onSubmit={signUpWithCredentials} defaultValues={defaultValues} />
      </div>
    </div>
  );
}
