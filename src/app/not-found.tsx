"use client";

import { Home, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="max-w-md w-full text-center px-6">
        {/* Icon */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="text-3xl font-bold text-gray-400">404</div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900 mb-3">
            Page Not Found
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Sorry, the page you are looking for could not be found or may have
            been moved.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Button
            asChild
            className="w-full bg-gray-900 hover:bg-gray-800 text-white"
          >
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Error code */}
        <div className="mt-8 text-sm text-gray-400">
          <p>Error 404</p>
        </div>
      </div>
    </div>
  );
}
