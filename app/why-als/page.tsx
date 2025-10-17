"use client"

import { motion } from "framer-motion"
import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function WhyALS() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section
        className="relative h-screen bg-cover bg-center pt-20 flex items-center"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1586528116039-c48148d8e98f?w=1200&h=800&fit=crop')",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="w-full">
            {/* Hero Content */}
            <div className="flex flex-col justify-center text-white">
              <motion.h1
                className="text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                WHY ALS Global
              </motion.h1>
              <motion.h2
                className="text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Shipping & Logistics
              </motion.h2>
              <motion.p
                className="text-xl italic mb-6 max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                Discover why ALS is the trusted partner for global shipping and logistics solutions
              </motion.p>
            </div>
          </div>
        </div>
      </section>

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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                ALS Global Shipping & Logistics is committed to providing world-class logistics solutions that connect Africa, the Middle East, and China. We understand the complexities of international trade and deliver seamless, reliable services.
              </p>
              <p className="text-gray-600 mb-4">
                With offices strategically located across key trading hubs, we offer comprehensive solutions including air freight, sea freight, land transport, and multimodal logistics services.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why Choose ALS?</h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <span>Global network with local expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <span>24/7 customer support and tracking</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <span>Competitive rates and transparent pricing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <span>Experienced team with industry expertise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-600 font-bold mr-3">✓</span>
                  <span>Reliable and timely delivery</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

