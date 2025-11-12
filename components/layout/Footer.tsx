"use client";

import { useSiteSettings } from "@/hooks/use-site-settings";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaTiktok } from "react-icons/fa";

export default function Footer() {
  const { settings, loading } = useSiteSettings();

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Logo and Description */}
          <div>
            <div className="mb-2">
              <div className="text-2xl font-bold">
                {" "}
                <span className="text-whitel">Dan</span>
                <span className="text-[#AF7E37]">deal</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Dandeal Logistics & Importation - Moving Africa, Middle East &
              China, delivering excellence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base font-bold text-orange-600 mb-3">
              Quick Links
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  href="/why-Dandeal"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Why Dandeal
                </a>
              </li>
              <li>
                <a
                  href="/terms-and-conditions"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Terms and Conditions
                </a>
              </li>
              <li>
                <a
                  href="/services"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="/news"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  News
                </a>
              </li>
              <li>
                <a
                  href="/faq"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  FAQs
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-base font-bold text-orange-600 mb-3">
              Contact Us
            </h3>
            {!loading ? (
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Call Us:</p>
                  <p className="text-gray-600"> {settings.phonePrimary}</p>
                  <p className="text-gray-600"> {settings.phoneSecondary}</p>
                  <p className="text-gray-600">WhatsApp: {settings.whatsapp}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email:</p>
                  <p className="text-gray-600">
                    <a
                      href={`mailto:${settings.emailPrimary}`}
                      className="hover:text-orange-600"
                    >
                      {settings.emailPrimary}
                    </a>
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Follow Us:</p>
                  <div className="flex gap-3 mt-2">
                    {settings.facebookUrl && settings.displayFacebook && (
                      <a
                        href={settings.facebookUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <Facebook className="text-blue-600 w-6 h-6" />
                      </a>
                    )}
                    {settings.instagramUrl && settings.displayInstagram && (
                      <a
                        href={settings.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <Instagram className="text-pink-600 w-6 h-6" />
                      </a>
                    )}
                    {settings.linkedinUrl && settings.displayLinkedin && (
                      <a
                        href={settings.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <Linkedin className="text-blue-800 w-6 h-6" />
                      </a>
                    )}
                    {settings.twitterUrl && settings.displayTwitter && (
                      <a
                        href={settings.twitterUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <Twitter className="text-sky-500 w-6 h-6" />
                      </a>
                    )}
                    {settings.tiktokUrl && settings.displayTiktok && (
                      <a
                        href={settings.tiktokUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:scale-110 transition"
                      >
                        <FaTiktok className="text-black w-6 h-6" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>

          {/* Locate Us */}
          <div>
            <h3 className="text-base font-bold text-orange-600 mb-3">
              Locate Us
            </h3>
            {!loading ? (
              <div className="space-y-2 text-sm">
                <div>
                  <p className="font-semibold text-gray-900">Kumasi - Ghana:</p>
                  <p className="text-gray-600">{settings.officeKumasi}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">
                    Obuasi - Ashanti Region:
                  </p>
                  <p className="text-gray-600">{settings.officeObuasi}</p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">China Office:</p>
                  <p className="text-gray-600">{settings.officeChina}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-600 text-center">
            Copyright © {new Date().getFullYear()} Dandeal Logistics &
            Importation. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
