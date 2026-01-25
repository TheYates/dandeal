"use client";

import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";
import { useSiteSettings } from "@/hooks/use-convex-site-settings";
import QuoteForm from "@/components/forms/QuoteForm";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function Header() {
  const { settings, isLoading: loading } = useSiteSettings();
  const [quoteFormOpen, setQuoteFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xs h-20">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition h-full"
          >
            <Image
              src="/dandeal-icon.png"
              alt="Dandeal Icon"
              width={60}
              height={60}
              className="w-12 h-12"
            />
            <span
              className={`${montserrat.className} text-white text-3xl font-bold`}
            >
              <span className="text-whitel">Dan</span>
              <span className="text-[#AF7E37]">deal</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="/"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Home
            </a>
            <div className="relative group">
              <button className="text-white hover:text-orange-600 transition text-sm flex items-center">
                About <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              <div className="absolute left-0 mt-0 w-48 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <a
                  href="/why-dandeal"
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-orange-600 text-sm first:rounded-t-lg"
                >
                  Why Dandeal
                </a>
                <a
                  href="/terms-and-conditions"
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-orange-600 text-sm last:rounded-b-lg"
                >
                  Terms and Conditions
                </a>
              </div>
            </div>
            <a
              href="/services"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Services
            </a>
            <a
              href="/news"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              News
            </a>
            <a
              href="/faq"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              FAQ's
            </a>
            <a
              href="/contact"
              className="text-white hover:text-orange-600 transition text-sm"
            >
              Contact
            </a>
          </nav>

          {/* Contact Info & CTA */}
          <div className="flex items-center space-x-4">
            <div className="hidden lg:block text-right">
              <div className="text-white text-xs space-y-1">
                {!loading && settings && (
                  <>
                    {settings.displayPhonePrimary && settings.phonePrimary && (
                      <div>{settings.phonePrimary}</div>
                    )}
                    {settings.displayPhoneSecondary &&
                      settings.phoneSecondary && (
                        <div>{settings.phoneSecondary}</div>
                      )}
                    {settings.showWhatsappInHeader && settings.whatsapp && (
                      <div>
                        <a
                          href={`https://wa.me/${settings.whatsapp.replace(
                            /\D/g,
                            ""
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-orange-600 transition"
                        >
                          {settings.whatsappLabel}: {settings.whatsapp}
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
            <Button
              onClick={() => setQuoteFormOpen(true)}
              className="hidden sm:block bg-orange-600 hover:bg-red-700 text-white rounded-full px-6"
            >
              Get a Free Quote
            </Button>

            {/* Hamburger Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white hover:text-orange-600 transition"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="md:hidden bg-black/80 backdrop-blur-sm border-t border-white/10">
            <div className="px-4 py-4 space-y-3">
              <a
                href="/"
                className="block text-white hover:text-orange-600 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </a>
              <a
                href="/why-dandeal"
                className="block text-white hover:text-orange-600 transition text-sm py-2 pl-4"
              >
                Why Dandeal
              </a>
              <a
                href="/terms-and-conditions"
                className="block text-white hover:text-orange-600 transition text-sm py-2 pl-4"
              >
                Terms and Conditions
              </a>
              <a
                href="/services"
                className="block text-white hover:text-orange-600 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </a>
              <a
                href="/news"
                className="block text-white hover:text-orange-600 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                News
              </a>
              <a
                href="/faq"
                className="block text-white hover:text-orange-600 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                FAQ's
              </a>
              <a
                href="/contact"
                className="block text-white hover:text-orange-600 transition text-sm py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
              <Button
                onClick={() => {
                  setQuoteFormOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-full mt-2"
              >
                Get a Free Quote
              </Button>
            </div>
          </nav>
        )}
      </div>

      {/* Quote Form Dialog */}
      <QuoteForm open={quoteFormOpen} onOpenChange={setQuoteFormOpen} />
    </header>
  );
}
