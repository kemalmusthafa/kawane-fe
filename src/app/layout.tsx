import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { CartProvider } from "@/components/providers/cart-provider-backend";
import { AddToCartAnimationProvider } from "@/components/providers/add-to-cart-animation-provider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kawane Studio - Premium E-commerce Platform",
  description:
    "Discover premium products with exceptional quality and service at Kawane Studio. Shop the latest trends with confidence.",
  keywords: "e-commerce, online shopping, premium products, fashion, lifestyle",
  authors: [{ name: "Kawane Studio" }],
  creator: "Kawane Studio",
  publisher: "Kawane Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kawane-fe.vercel.app"),
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kawane-fe.vercel.app",
    title: "Kawane Studio - Premium E-commerce Platform",
    description:
      "Discover premium products with exceptional quality and service at Kawane Studio.",
    siteName: "Kawane Studio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kawane Studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawane Studio - Premium E-commerce Platform",
    description:
      "Discover premium products with exceptional quality and service at Kawane Studio.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`font-pragmatica`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <GoogleOAuthProvider clientId={googleClientId || ""}>
            <SWRProvider>
              <AuthProvider>
                <CartProvider>
                  <AddToCartAnimationProvider>
                    {children}
                    <Toaster />
                    <SonnerToaster />
                  </AddToCartAnimationProvider>
                </CartProvider>
              </AuthProvider>
            </SWRProvider>
          </GoogleOAuthProvider>
        </ThemeProvider>
        <Script
          src="https://elfsightcdn.com/platform.js"
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
