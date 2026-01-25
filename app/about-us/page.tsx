"use client";

import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/public/HeroSection";
import { Globe, Package, Shield, Users, Award, TrendingUp } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: Shield,
      title: "Reliability",
      description: "We deliver on our promises with consistent, dependable service you can trust.",
    },
    {
      icon: Users,
      title: "Customer Focus",
      description: "Your success is our priority. We tailor solutions to meet your unique needs.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in every shipment and interaction.",
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We leverage technology and expertise to optimize your supply chain.",
    },
  ];

  const stats = [
    { number: "10+", label: "Years Experience" },
    { number: "1000+", label: "Shipments Delivered" },
    { number: "3", label: "Continents Served" },
    { number: "24/7", label: "Customer Support" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="About Dandeal"
        subtitle="Moving cargo and building connections that power global trade"
      />

      {/* Main Content Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              We move cargo and build connections that power global trade. Headquartered in Ghana, 
              with active operations in China and across West Africa, we specialize in delivering 
              end-to-end logistics solutions that are fast, reliable, and customized to meet each 
              client's needs.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              From air and sea freight to customs clearance, warehousing, and door-to-door delivery, 
              we offer a complete suite of freight forwarding services backed by global expertise and 
              local knowledge.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <Globe className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                To simplify global trade by providing seamless, reliable logistics solutions 
                that connect businesses across continents. We believe logistics isn't just 
                about moving goods—it's about moving businesses forward.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Whether you're a growing SME, an e-commerce exporter, or a multinational 
                corporation, we simplify shipping so you can focus on growth.
              </p>
            </div>
            <div>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-6">
                <Package className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                What We Do
              </h2>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Air & Sea Freight Forwarding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Customs Clearance & Documentation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Warehousing & Distribution</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Door-to-Door Delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Project Cargo & Special Handling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-600 font-bold mr-3 mt-1">✓</span>
                  <span>Supply Chain Consulting</span>
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These principles guide everything we do and define who we are as a company
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center text-white"
          >
            <h2 className="text-4xl font-bold mb-6">
              Ready to Move Your Business Forward?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Let Dandeal handle your cargo—anywhere to Africa & beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Us
              </a>
              <a
                href="/services"
                className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Our Services
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
