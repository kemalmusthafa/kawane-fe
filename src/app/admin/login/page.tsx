import { AdminLoginForm } from "@/components/auth/admin-login-form";
import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/home" className="text-2xl font-bold text-primary">
            Kawane Studio
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Masuk ke panel administrasi
          </p>
        </div>
        <AdminLoginForm />
      </div>
    </div>
  );
}
