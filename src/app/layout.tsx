import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { CartProvider } from "@/components/providers/cart-provider-backend";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { GoogleOAuthProvider } from "@react-oauth/google";
import {
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/seo/structured-data";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Kawane - Premium E-commerce Platform | Fashion & Lifestyle | Kawane Studio",
  description:
    "Kawane - Discover premium products with exceptional quality and service. Shop fashion, lifestyle products, and trending items with confidence. Kawane offers the best quality products for your needs. Kawane Studio premium e-commerce.",
  keywords:
    "kawane, kawane studio, kawanestudio, kawane fashion, kawane lifestyle, kawane products, kawane store, kawane brand, kawane indonesia, kawane online, kawane shop, premium products, e-commerce, online shopping, fashion indonesia, lifestyle brand",
  authors: [{ name: "Kawane Studio" }],
  creator: "Kawane Studio",
  publisher: "Kawane Studio",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://kawanestudio.com"),
  alternates: {
    canonical: "https://kawanestudio.com",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kawanestudio.com",
    title: "Kawane Studio - Premium E-commerce Platform",
    description:
      "Discover premium products with exceptional quality and service at Kawane Studio. Shop the latest fashion and lifestyle trends with confidence.",
    siteName: "Kawane Studio",
    images: [
      {
        url: "https://kawanestudio.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Kawane Studio - Premium E-commerce Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kawane Studio - Premium E-commerce Platform",
    description:
      "Discover premium products with exceptional quality and service at Kawane Studio.",
    images: ["https://kawanestudio.com/og-image.jpg"],
    creator: "@kawanestudio",
    site: "@kawanestudio",
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
    // Google verification code akan di-set via DNS TXT record
    // atau meta tag di HTML head jika diperlukan
    // google: "js4TRBUeGSuFflwHbhVuKryySnuPQcOK3TeLdYCx8GM",
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
        <OrganizationStructuredData />
        <WebsiteStructuredData />
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
                  {children}
                  <Toaster />
                  <SonnerToaster />
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
