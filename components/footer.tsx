import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-blue-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
        <div className="space-y-4 sm:space-y-6">
          {/* Brand - Full width on all screens */}
          <div className="space-y-2 sm:space-y-3 lg:space-y-4">
            <Link href="/" className="text-xl sm:text-2xl font-bold text-white hover:text-yellow-400 transition-colors">
              BrandBuddy
            </Link>
            <p className="text-blue-200 text-sm max-w-xs leading-relaxed">
              Connecting event planners with verified sponsors. Built with ❤️ in Austin 🌮
            </p>
          </div>

          {/* Product and Connect - Side by side on mobile, part of grid on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Product */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Product</h3>
              <div className="space-y-1 sm:space-y-2">
                <Link href="/how-it-works" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  How it Works
                </Link>
                <Link href="/browse-sponsors" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Browse Sponsors
                </Link>
                <Link href="/pricing" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Pricing
                </Link>
              </div>
            </div>

            {/* Legal & Social */}
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              <h3 className="text-white font-semibold text-sm sm:text-base">Connect</h3>
              <div className="space-y-1 sm:space-y-2">
                <Link href="/privacy" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                  Terms of Service
                </Link>
                <div className="flex space-x-3 sm:space-x-4 pt-1 sm:pt-2">
                  <Link href="https://instagram.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                    <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link href="https://twitter.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                    <Twitter className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                  <Link href="https://linkedin.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                    <Linkedin className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-6 pt-4 sm:mt-8 sm:pt-6 lg:mt-12 lg:pt-8 flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
          <p className="text-blue-200 text-sm">
            © 2024 BrandBuddy. All rights reserved.
          </p>
          <p className="text-blue-200 text-sm font-medium">
            Built in Austin 🌮
          </p>
        </div>
      </div>
    </footer>
  );
} 