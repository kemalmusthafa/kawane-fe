import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export function HomeFooter() {
  return (
    <footer className="bg-muted/50 border-t dark:bg-gradient-to-b dark:from-muted/30 dark:to-background dark:border-border/50">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Company Info */}
          <div className="min-h-[160px] sm:min-h-[180px] flex flex-col">
            <h3 className="font-pragmatica font-[700] tracking-[0.02em] text-sm sm:text-base lg:text-lg mb-3 sm:mb-4 bg-gradient-to-r from-foreground to-muted-foreground dark:from-foreground dark:to-primary bg-clip-text text-transparent">
              Kawane Studio
            </h3>
            <p className="font-pragmatica tracking-[0.01em] leading-relaxed text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 flex-1">
              Premium e-commerce platform offering exceptional quality products
              and service.
            </p>
            <div className="flex gap-2 sm:gap-3 lg:gap-4">
              <Link
                href="https://www.facebook.com/kawane.studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
              <Link
                href="https://www.twitter.com/kawane_studio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
              <Link
                href="https://www.instagram.com/kawane.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-pink-500 transition-colors"
              >
                <Instagram className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
              <Link
                href="https://www.youtube.com/@kawanestudio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Youtube className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="min-h-[160px] sm:min-h-[180px] flex flex-col">
            <h3 className="font-pragmatica font-[700] tracking-[0.02em] text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
              Quick Links
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 flex-1">
              <li>
                <Link
                  href="/products"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Categories
                </Link>
              </li>
              <li>
                <Link
                  href="/deals"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Deals
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="min-h-[160px] sm:min-h-[180px] flex flex-col">
            <h3 className="font-pragmatica font-[700] tracking-[0.02em] text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
              Customer Service
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 flex-1">
              <li>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm sm:text-base text-muted-foreground hover:text-primary transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="min-h-[160px] sm:min-h-[180px] flex flex-col">
            <h3 className="font-pragmatica font-[700] tracking-[0.02em] text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
              Contact Info
            </h3>
            <div className="space-y-1.5 sm:space-y-2 flex-1">
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground break-all">
                  info@kawane-studio.com
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  +62 21 1234 5678
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 text-muted-foreground flex-shrink-0" />
                <span className="text-sm sm:text-base text-muted-foreground">
                  Bandung, Indonesia
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-4 sm:mt-6 pt-4 sm:pt-6 text-center">
          <p className="font-pragmatica tracking-[0.01em] text-sm sm:text-base text-muted-foreground whitespace-nowrap">
            © 2021 Kawane Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
