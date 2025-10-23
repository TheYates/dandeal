"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["700"] });

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xs h-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
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
                  href="/why-als"
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
              <div className="text-white text-xs">
                <div>+49 15212203183</div>
              </div>
            </div>
            <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-6">
              Get a Free Quote
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
