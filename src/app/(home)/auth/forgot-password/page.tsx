import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/home" className="text-2xl font-bold text-primary">
            Kawane Studio
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link
              href="/home/auth/sign-in"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
