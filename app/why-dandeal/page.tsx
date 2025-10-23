"use client";

import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export default function WhyALS() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="WHY ALS Global Shipping & Logistics"
        subtitle="Discover why ALS is the trusted partner for global shipping and logistics solutions"
      />

      {/* Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Commitment
              </h2>
              <p className="text-gray-600 mb-4">
                Dandeal Logistics & Importation is committed to providing
                world-class logistics solutions that connect Africa, the Middle
                East, and China. We understand the complexities of international
                trade and deliver seamless, reliable services.
              </p>
              <p className="text-gray-600 mb-4">
                With offices strategically located across key trading hubs, we
                offer comprehensive solutions including air freight, sea
                freight, land transport, and multimodal logistics services.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose Dandeal?
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">✓</span>
                  <span>Global network with local expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">✓</span>
                  <span>24/7 customer support and tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">✓</span>
                  <span>Competitive rates and transparent pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">✓</span>
                  <span>Experienced team with industry expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3">✓</span>
                  <span>Reliable and timely delivery</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
