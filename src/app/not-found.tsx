"use client";

import { FileQuestion, Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <FileQuestion className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-gray-600 mb-6">
            Maaf, halaman yang Anda cari tidak ditemukan atau mungkin telah
            dipindahkan.
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full" variant="default">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Kembali ke Beranda
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Error 404</p>
        </div>
      </div>
    </div>
  );
}
