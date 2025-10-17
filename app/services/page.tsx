"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import { Button } from "@/components/ui/button";

export default function Services() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="Our Services"
        subtitle="Comprehensive logistics solutions tailored to your shipping needs"
      />

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
              📋 ALL SERVICES
            </p>
            <h2 className="text-4xl font-bold text-gray-900">
              Our Full Range of Services
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Air Freight Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.unsplash.com/photo-1571086291540-b137111fa1c7?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074"
                alt="Air Freight"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  AIR FREIGHT SERVICES
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  GLOBAL REACH WITH SPEED AND PRECISION
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  When time is critical, our air freight solutions deliver
                  unmatched efficiency and reliability.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Express delivery options
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Temperature-controlled transport
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Real-time tracking</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  GET QUOTE <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Sea Freight Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/1544372/pexels-photo-1544372.jpeg"
                alt="Sea Freight"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  SEA FREIGHT SERVICES
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  COST-EFFECTIVE SOLUTIONS FOR VOLUME SHIPPING
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Our ocean freight services combine cost efficiency with
                  reliable scheduling for larger shipments.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">FCL & LCL shipments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Break-bulk handling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Competitive rates</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  GET QUOTE <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Customs Brokerage Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/14801547/pexels-photo-14801547.jpeg"
                alt="Customs Brokerage"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  CUSTOMS BROKERAGE
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  SWIFT CUSTOMS PROCESSING
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Our specialized clearance team navigates complex customs
                  requirements with maximum efficiency.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">2-3 day clearance</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Expert documentation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Compliance management
                      </span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  LEARN MORE <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Door-to-Door Delivery Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/15218464/pexels-photo-15218464.jpeg"
                alt="Door-to-Door Delivery"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  DOOR-TO-DOOR DELIVERY
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  SEAMLESS FINAL MILE LOGISTICS
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We manage the complete journey of your goods from
                  international origin to final destination.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Nationwide coverage</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Scheduled delivery</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Special handling</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  CHECK COVERAGE <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Warehousing Solutions Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/236705/pexels-photo-236705.jpeg"
                alt="Warehousing Solutions"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  WAREHOUSING SOLUTIONS
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  STRATEGIC STORAGE & DISTRIBUTION
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Our warehousing network spans key locations in China and Ghana
                  for efficient inventory management.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Storage options</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Inventory management
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Order fulfillment</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  EXPLORE <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* International Procurement Support Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/8069554/pexels-photo-8069554.jpeg"
                alt="International Procurement Support"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  PROCUREMENT SUPPORT
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  VERIFIED GLOBAL SUPPLIERS
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We connect you with trusted manufacturers and suppliers in key
                  global markets.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Supplier verification
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Quality inspections</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Order management</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  DISCUSS NEEDS <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Import and Export Services Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/6169178/pexels-photo-6169178.jpeg"
                alt="Import and Export Services"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  IMPORT & EXPORT
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  INTERNATIONAL TRADE FACILITATION
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  We manage all aspects of cross-border trade from documentation
                  to regulatory compliance.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">
                        Export documentation
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">License management</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Compliance guidance</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  GET CONSULTATION <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>

            {/* Specialized Solutions Service Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
            >
              <img
                src="https://images.pexels.com/photos/906484/pexels-photo-906484.jpeg"
                alt="Specialized Solutions"
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <p className="text-orange-600 font-semibold text-sm tracking-widest mb-2">
                  📋 SERVICE DETAILS
                </p>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  SPECIALIZED SOLUTIONS
                </h3>
                <p className="text-orange-600 font-bold text-sm mb-4">
                  TAILORED LOGISTICS
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Customized solutions for clients with specialized requirements
                  or industry-specific challenges.
                </p>
                <div className="space-y-2 mb-6">
                  <p className="text-gray-900 font-semibold text-sm">
                    Service Highlights:
                  </p>
                  <ul className="space-y-1 text-sm">
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Project cargo</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">Hazmat handling</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 font-bold mr-2">✓</span>
                      <span className="text-gray-600">High-value security</span>
                    </li>
                  </ul>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm flex items-center gap-2 w-full justify-center">
                  DISCUSS NEEDS <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section - 80% Viewport Height */}
      <section
        className="relative overflow-hidden flex items-center justify-center"
        style={{ height: "80vh" }}
      >
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1586528116039-c48148d8e98f?w=1200&h=800&fit=crop')",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-8 leading-tight">
              We support clients in sourcing and procuring goods and equipment
              locally and internationally, ensuring quality and timely supply.
            </h2>
            <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-10 py-4 text-lg font-semibold">
              Book A Free Consultation
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Value Added Services Section */}
      <section className="py-20 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-2 underline decoration-orange-600 decoration-4 underline-offset-8">
              Value Added Services
            </h2>
          </motion.div>

          {/* Logistics & Cargo Handling */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Logistics & Cargo Handling
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Cargo Consolidation / Deconsolidation
                  </h4>
                  <p className="text-gray-600">
                    Combine multiple shipments into one container to save costs,
                    or separate bulk cargos for last-mile delivery.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Custom Crating & Packaging
                  </h4>
                  <p className="text-gray-600">
                    Offer professional, secure packaging for fragile,
                    high-value, or specialized cargo (especially for air freight
                    and project cargo).
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Last-Mile Delivery Coordination
                  </h4>
                  <p className="text-gray-600">
                    Ensure door to door service, especially in hard-to-reach
                    areas in Africa and UAE areas.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Regulatory & Compliance Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Regulatory & Compliance Support
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    HS Code Classification & Documentation Consulting
                  </h4>
                  <p className="text-gray-600">
                    We help clients with correct classification, documentation,
                    and compliance (especially valuable for new
                    exporters/importers).
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Bonded Warehousing
                  </h4>
                  <p className="text-gray-600">
                    We offer clients temporary duty-free storage for transit
                    cargo or deferred customs payments.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Technology & Visibility */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Technology & Visibility
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Client Shipment Tracking Dashboard
                  </h4>
                  <p className="text-gray-600">
                    Give clients real-time visibility into their shipments and
                    documents via a branded online dashboard.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Carbon Footprint & Green Shipping Options
                  </h4>
                  <p className="text-gray-600">
                    Offer eco-friendly shipping alternatives, carbon reporting,
                    and offsetting partnerships—positioning ALS as a green
                    logistics advocate.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Customer Experience & Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-8">
                  Customer Experience & Support
                </h3>
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Dedicated Account Manager or WhatsApp Support Line
                  </h4>
                  <p className="text-gray-600">
                    A direct channel for top-tier clients to handle urgent
                    queries, updates, and strategic support.
                  </p>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-orange-600 mb-2">
                    Free Trade Zone (FTZ) Consulting & Setup
                  </h4>
                  <p className="text-gray-600">
                    Advise clients on how to use UAE or Ghana FTZs for
                    import/export cost optimization.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bonus Add-On */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white rounded-lg p-8 border-l-4 border-red-600"
          >
            <h3 className="text-2xl font-bold text-orange-600 mb-4">
              Bonus Add-On:
            </h3>
            <p className="text-gray-600 leading-relaxed">
              <span className="font-semibold text-gray-900">
                Supply Chain Consulting & Optimization
              </span>{" "}
              - For enterprise clients, offer strategic consulting on supply
              chain redesign, cost reduction, and efficiency improvements. This
              positions ALS as a trusted logistics partner, not just a service
              provider.
            </p>
          </motion.div>
        </div>

        {/* Red diagonal shape */}
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600 transform translate-x-1/3 translate-y-1/3 rounded-full opacity-10"></div>
      </section>

      {/* Join Hundreds Of Satisfied Clients Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/timelapse port.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/50"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Icon */}
          <div className="mb-8 flex justify-center">
            <div className="text-5xl">✈️</div>
          </div>

          {/* Label */}
          <p className="text-white text-sm font-semibold mb-4">Join Us</p>

          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Join Hundreds Of Satisfied Clients Across Ghana And Beyond. Let Us
            Handle Your Cargo — Efficiently, Affordably, And Professionally.
          </h2>

          {/* CTA Button */}
          <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-full px-8 py-3 font-semibold transition">
            Contact Us
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
