import Link from "next/link";
import { Instagram, Twitter, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-blue-950/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="text-2xl font-bold text-white hover:text-yellow-400 transition-colors">
              BrandBuddy
            </Link>
            <p className="text-blue-200 text-sm max-w-xs">
              Connecting event planners with verified sponsors. Built with ❤️ in Austin 🌮
            </p>
          </div>

          {/* Product */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Product</h3>
            <div className="space-y-2">
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

          {/* Company */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Company</h3>
            <div className="space-y-2">
              <Link href="/about" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                About
              </Link>
              <Link href="/careers" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                Careers
              </Link>
              <Link href="/contact" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                Contact
              </Link>
            </div>
          </div>

          {/* Legal & Social */}
          <div className="space-y-4">
            <h3 className="text-white font-semibold">Connect</h3>
            <div className="space-y-2">
              <Link href="/privacy" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="block text-blue-200 hover:text-yellow-400 transition-colors text-sm">
                Terms of Service
              </Link>
              <div className="flex space-x-4 pt-2">
                <Link href="https://instagram.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="https://twitter.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link href="https://linkedin.com" className="text-blue-200 hover:text-yellow-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
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