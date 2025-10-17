"use client";

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Logo and Description */}
          <div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-orange-400">Dandeal</div>
              <p className="text-sm text-gray-600 mt-1">
                Dandeal Logistics & Importation
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              ALS Global Shipping & Logistics - Moving Africa, Middle East &
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
                  href="/why-als"
                  className="text-gray-700 hover:text-orange-600 text-sm"
                >
                  Why ALS
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
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Call Us:</p>
                <p className="text-gray-600">Accra: +233 58 523 3019</p>
                <p className="text-gray-600">Kumasi: +233 59 523 3020</p>
                <p className="text-gray-600">China: +86 139 2823 9401</p>
                <p className="text-gray-600">Dubai: +971 557536772</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Email:</p>
                <p className="text-gray-600">
                  <a
                    href="mailto:info@alsshipping.com"
                    className="hover:text-orange-600"
                  >
                    info@dandealimportation.com
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Locate Us */}
          <div>
            <h3 className="text-base font-bold text-orange-600 mb-3">
              Locate Us
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <p className="font-semibold text-gray-900">Kumasi - Ghana:</p>
                <p className="text-gray-600">Santasi</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Obuasi - Ashanti Region:
                </p>
                <p className="text-gray-600">Mangoase</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">China Office:</p>
                <p className="text-gray-600">Gunagzhou</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-3">
          <p className="text-sm text-gray-600 text-center">
            Copyright © 2025 ALS Shipping. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
