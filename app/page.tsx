"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Plane,
  Ship,
  Truck,
  Globe,
  FileText,
  Building2,
  ShoppingCart,
  Settings,
  Home as HomeIcon,
  Shirt,
  Cpu,
  HardHat,
  Car,
  Pill,
  Facebook,
  Instagram,
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";
import ConsultationForm from "@/components/ConsultationForm";
import EmbeddedConsultationForm from "@/components/EmbeddedConsultationForm";
import QuoteForm from "@/components/QuoteForm";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Logistics slideshow images
  const heroImages = [
    "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg", // Container ship
    "https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg", // Cargo plane
    "https://images.pexels.com/photos/21234960/pexels-photo-21234960.jpeg", // Warehouse
  ];

  const logos = [
    { id: 1, name: "JCTRANS", icon: "🚚" },
    { id: 2, name: "Global Logistics", icon: "🌍" },
    { id: 3, name: "JCTRANS Orange", icon: "📦" },
    { id: 4, name: "NAFL", icon: "✈️" },
    { id: 5, name: "DP World", icon: "🏢" },
    { id: 6, name: "FAEFA", icon: "🌐" },
    { id: 7, name: "GIFF", icon: "📋" },
    { id: 8, name: "Shipping Authority", icon: "⚓" },
    { id: 9, name: "DF Alliance", icon: "🤝" },
  ];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-20 pb-12 md:pb-0 flex items-center overflow-hidden">
        {/* Slideshow Background */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-2000 ${
              currentSlide === index ? "animate-zoom-in" : ""
            }`}
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${image}')`,
              opacity: currentSlide === index ? 1 : 0,
              zIndex: currentSlide === index ? 1 : 0,
            }}
          />
        ))}

        {/* Content Overlay */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex items-center py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 w-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center text-white">
              <motion.h1
                className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Dandeal Logistics & Importation
              </motion.h1>
              <motion.p
                className="text-lg sm:text-xl italic mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Your trusted partner in logistics, importation, and global trade
                solutions.
              </motion.p>
              <motion.p
                className="text-sm mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                From Sourcing Raw MateriDandeal, Machinery, And Vehicles
                Globally to Shipping, Dandeal Delivers Seamless Logistics And
                Import & Export Solutions.
              </motion.p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <ConsultationForm
                  trigger={
                    <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-6 sm:px-8 w-full sm:w-auto">
                      Free Consultation
                    </Button>
                  }
                />
                <QuoteForm
                  trigger={
                    <Button
                      variant="outline"
                      className="border-white text-white hover:bg-white hover:text-black rounded-full px-6 sm:px-8 w-full sm:w-auto"
                    >
                      Contact Us
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Right Form - Embedded Consultation Form */}
            <div className="flex items-center justify-center mt-8 lg:mt-0">
              <EmbeddedConsultationForm />
            </div>
          </div>
        </div>
      </section>

      {/* Search, Tabs & Partners Section */}
      <section className="bg-gray-50 min-h-screen flex items-center py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col gap-12 justify-center">
            {/* Tabs */}
            <div>
              {/* Tabs Header */}
              <div className="text-center mb-8">
                <motion.h2
                  className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  viewport={{ once: true }}
                >
                  Track, Quote & Schedule Your Shipments
                </motion.h2>
                <motion.p
                  className="text-gray-600 max-w-2xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  Use our real-time freight calculator to compare rates, track
                  your cargo in real-time, and view comprehensive shipping
                  schedules
                </motion.p>
              </div>

              {/* Searates Logistics Explorer Iframe */}
              <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
                <iframe
                  src="https://www.searates.com/logistics-explorer/"
                  width="100%"
                  height="800"
                  style={{ border: "none" }}
                  title="SeaRates Logistics Explorer"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Partners & Accreditations */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                  <span className="text-gray-900">
                    Partners & Accreditations
                  </span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-sm">
                  We are proud to have been in partnership with the following
                  companies and we appreciate their efforts and generosity in
                  supporting us anytime.
                </p>
              </div>

              {/* Infinite Scrolling Logo Carousel */}
              <LogoCarousel logos={logos} speed={30} />
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Shipping Agents Section */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Content */}
            <div className="bg-white flex flex-col justify-center px-6 sm:px-8 lg:px-12 py-16 lg:py-20">
              <div className="max-w-lg">
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-orange-600">Your Trusted Shipping</span>
                  <br />
                  <span className="text-gray-900">Agents</span>
                  <span className="text-orange-600"> from Dubai</span>
                  <span className="text-gray-900">
                    {" "}
                    - China To Ghana & Africa
                  </span>
                </h2>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  From the factory floor to your door, we eliminate borders and
                  barriers. Our integrated shipping and logistics network spans
                  China - Dubai, China - Africa & Dubai - Africa. Our regional
                  knowledge, pocket-friendly rates, and seamless network ensure
                  your cargo reaches its destination with precision and care.
                </p>

                <QuoteForm
                  trigger={
                    <Button className="bg-orange-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full">
                      REQUEST A FREE QUOTE
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Right Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden min-h-[400px] lg:min-h-screen">
              {/* Diagonal shape background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

              {/* Shipping image */}
              <div className="relative z-10 w-full h-full flex items-center justify-center px-8 py-12">
                <img
                  src="/trusted shipping.png"
                  alt="Global Shipping Services"
                  className="max-w-2xl w-auto h-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal wave divider */}
        <div className="absolute bottom-0 left-0 right-0 h-32 overflow-hidden">
          {/* Orange section - left side */}
          <div
            className="absolute inset-0 bg-orange-600"
            style={{
              clipPath: "polygon(0 0, 70% 0, 50% 100%, 0 100%)",
            }}
          ></div>
          {/* Blue section - right side */}
          <div
            className="absolute inset-0 bg-blue-900"
            style={{
              clipPath: "polygon(50% 0, 100% 0, 100% 100%, 40% 100%)",
            }}
          ></div>
        </div>
      </section>

      {/* Comprehensive Solutions Section */}
      <section className="min-h-screen flex items-center bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <span className="text-orange-600">
                Comprehensive Solutions From One Of{" "}
              </span>
              <span className="text-black">Ghana's</span>
              <br />
              <span className="text-black">Top Shipping Companies</span>
            </motion.h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Air Freight */}
            <motion.div
              className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Plane className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Air Freight</h3>
              <p className="text-sm leading-relaxed flex-grow">
                Premium air cargo solutions with guaranteed delivery windows and
                real-time tracking. Minimum 10kg load.
              </p>
            </motion.div>

            {/* Sea Freight */}
            <motion.div
              className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Ship className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Sea Freight</h3>
              <p className="text-sm leading-relaxed flex-grow">
                Cost-effective container shipping with flexible options from FCL
                to LCL, tailored to your volume requirements.
              </p>
            </motion.div>

            {/* Door-to-Door Delivery */}
            <motion.div
              className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Truck className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Door-to-Door Delivery</h3>
              <p className="text-sm leading-relaxed flex-grow">
                Seamless last-mile service throughout Ghana, from Accra to
                Koforidua on time, every time.
              </p>
            </motion.div>

            {/* International Procurement */}
            <motion.div
              className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Globe className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                International Procurement
              </h3>
              <p className="text-sm leading-relaxed flex-grow">
                Direct access to verified suppliers in China, UAE, and Turkey
                with secure payment facilitation.
              </p>
            </motion.div>

            {/* Container Clearance */}
            <motion.div
              className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Container Clearance</h3>
              <p className="text-sm leading-relaxed flex-grow">
                Swift 24-48 hour customs clearance at all Ghanaian ports,
                managed by our expert teams.
              </p>
            </motion.div>

            {/* Warehousing */}
            <motion.div
              className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <Building2 className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Warehousing</h3>
              <p className="text-sm leading-relaxed flex-grow">
                Strategic storage solutions in key industrial districts in China
                and Ghana.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Leading Businesses Choose Dandeal Section */}
      <section className="min-h-screen flex items-center bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="w-28 h-28 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">Dandeal</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-6">
                <span className="text-gray-900">
                  Why Leading <br />
                  Businesses{" "}
                </span>
                <span className="text-orange-600">Choose</span>
                <br />
                <span className="text-orange-600">Dandeal</span>.
              </h2>
              <ConsultationForm
                trigger={
                  <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-full">
                    Book A Free Consultation
                  </Button>
                }
              />

              {/* Images */}
              <div className="flex gap-4 mt-8">
                <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&h=200&fit=crop"
                    alt="Shipping"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-24 h-20 sm:w-32 sm:h-24 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
                    alt="Logistics"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Content - Benefits List */}
            <div className="space-y-4">
              {/* Benefit 1 */}
              <motion.div
                className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    01
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Verified Global Suppliers
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Avoid fraud and work with trusted sources.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Benefit 2 */}
              <motion.div
                className="border-l-4 border-blue-900 bg-blue-50 p-6 rounded-r-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    02
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Small Load Shipping
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Ship in smaller quantities, reduce storage costs
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Benefit 3 */}
              <motion.div
                className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    03
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Faster Delivery
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Air & sea freight options tailored to your schedule.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Benefit 4 */}
              <motion.div
                className="border-l-4 border-blue-900 bg-blue-50 p-6 rounded-r-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-900 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    04
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      Smart Customs Handling
                    </h3>
                    <p className="text-gray-700 text-sm">
                      Skip the stress of paperwork and delays.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Benefit 5 */}
              <motion.div
                className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    05
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      All-in-One Service
                    </h3>
                    <p className="text-gray-700 text-sm">
                      From source to doorstep, Dandeal has you covered.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-16 md:py-20">
        {/* Red background with wave */}
        <div
          className="absolute inset-0 bg-orange-600"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)",
          }}
        ></div>

        {/* White background below wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-white"></div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.p
              className="text-sm font-semibold text-gray-700 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              📦 INDUSTRIES
            </motion.p>
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Industries We Serve
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-gray-700 max-w-3xl mx-auto px-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Whatever Your Industry, We Have The Specialized Experience To
              Optimize Your Supply Chain.
            </motion.p>
          </div>

          {/* Industries Grid - First Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
            {/* Fast-Moving Consumer Goods */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <ShoppingCart className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Fast-Moving Consumer Goods
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/4829061/pexels-photo-4829061.jpeg"
                  alt="Fast-Moving Consumer Goods"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Industrial Machinery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <Settings className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Industrial Machinery
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/191738/pexels-photo-191738.jpeg"
                  alt="Industrial Machinery"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Furniture & Home Goods */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <HomeIcon className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Furniture & Home Goods
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/133919/pexels-photo-133919.jpeg"
                  alt="Furniture & Home Goods"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Pharmaceutical & Medical Equipment */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <Pill className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Pharmaceutical & Medical Equipment
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/305568/pexels-photo-305568.jpeg"
                  alt="Pharmaceutical & Medical Equipment"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Industries Grid - Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Cosmetics & Apparel */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <Shirt className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Cosmetics & Apparel
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/234220/pexels-photo-234220.jpeg"
                  alt="Cosmetics & Apparel"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Electronics & Electrical Components */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <Cpu className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Electronics & Electrical Components
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/163100/circuit-circuit-board-resistor-computer-163100.jpeg"
                  alt="Electronics & Electrical Components"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Construction Materials */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <HardHat className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Construction Materials
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/2098624/pexels-photo-2098624.jpeg"
                  alt="Construction Materials"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Automotive & Spare Parts */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-3 flex items-center justify-center w-16 h-16 ">
                  <Car className="w-12 h-12 text-black" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 min-h-[3.5rem] flex items-center">
                  Automotive & Spare Parts
                </h3>
              </div>
              <div className="h-40 overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/159293/car-engine-motor-clean-customized-159293.jpeg"
                  alt="Automotive & Spare Parts"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Navy Background */}
      <section className="relative h-[70vh] flex items-center bg-blue-900 overflow-hidden py-16 md:py-20">
        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Main Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Whatever your industry, we have the specialized experience to
            optimize your supply chain.
          </h2>

          {/* CTA Button */}
          <div className="mb-8">
            <ConsultationForm
              trigger={
                <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-8 py-3 font-semibold">
                  Book A Free Consultation
                </Button>
              }
            />
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
            >
              <Facebook className="text-white text-xl" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
            >
              <Instagram className="text-white text-xl" />
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition"
            >
              <Linkedin className="text-white text-xl" />
            </a>
          </div>
        </div>
      </section>

      {/* TestimoniDandeal Section */}
      <section className="min-h-screen flex items-center bg-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.p
              className="text-sm font-semibold text-gray-700 mb-2"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              💬 TESTIMONIALS
            </motion.p>
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              What Our Clients Say
            </motion.h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Testimonial 1 - Red */}
            <motion.div
              className="bg-orange-600 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "Dandeal has been our trusted logistics partner for over three
                years. They handle our imports from China and Dubai with speed
                and professionalism. Their door-to-door service is reliable and
                stress-free. Highly recommended!"
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Kojo Mensah</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>

            {/* Testimonial 2 - Navy */}
            <motion.div
              className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "I used to struggle with sourcing beauty products from Turkey,
                but Dandeal made it simple. They helped me find suppliers,
                handled payments, and shipped everything right to my store in
                Kumasi. Fantastic service!"
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Akosua Serwaa</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>

            {/* Testimonial 3 - Red */}
            <motion.div
              className="bg-orange-600 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "We import car parts monthly and Dandeal has been exceptional.
                Their team clears our shipments fast and keeps us informed every
                step of the way. Working with them has improved our turnaround
                time significantly."
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Nana Yaw Boateng</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>

            {/* Testimonial 4 - Navy */}
            <motion.div
              className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "I found Dandeal through a friend and they've been a
                game-changer for my business. I now get my furniture imports
                from China faster, safer, and at better rates. Highly
                recommended!"
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Abena Agyekum</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>

            {/* Testimonial 5 - Red */}
            <motion.div
              className="bg-orange-600 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "As a company that regularly brings in industrial machinery, we
                need a logistics partner we can rely on. Dandeal delivers every
                time. Their attention to detail and customs expertise is
                unmatched."
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Kwame Owusu</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>

            {/* Testimonial 6 - Navy */}
            <motion.div
              className="bg-blue-900 rounded-2xl p-8 text-white flex flex-col h-full"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="mb-6 text-sm leading-relaxed flex-grow">
                "Thanks to Dandeal, I've been able to scale my clothing business
                by importing from Dubai and China without the usual headaches.
                They even helped me source suppliers. Excellent service!"
              </p>
              <div className="mb-4">
                <p className="font-bold text-lg">Esi Darko</p>
              </div>
              <div className="flex gap-1">
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
                <span className="text-yellow-300">⭐</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Background Video */}
      <section className="relative min-h-screen flex items-center overflow-hidden py-16 md:py-20">
        {/* Background Video */}
        <video
          autoPlay
          muted
          loop
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/timelapse port.mp4" type="video/mp4" />
        </video>

        {/* Dark Overlay */}
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
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Join Hundreds Of Satisfied Clients Across Ghana And Beyond. Let Us
            Handle Your Cargo — Efficiently, Affordably, And Professionally.
          </h2>

          {/* CTA Button */}
          <Link href="/contact">
            <Button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-900 rounded-full px-8 py-3 font-semibold transition">
              Contact Us
            </Button>
          </Link>
        </div>
      </section>

      {/* Quote Request Section */}
      <section className="relative min-h-screen flex items-center bg-white overflow-hidden py-16 md:py-20">
        {/* Red diagonal shape on right */}
        <div
          className="absolute right-0 top-60 bottom-0 w-full bg-orange-500 hidden lg:block"
          style={{
            clipPath: "polygon(100% 0%, 100% 20%, 100% 100%, 0% 100%)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.p
                className="text-gray-600 text-sm font-semibold mb-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                Ready to Ship & Source Smarter?
              </motion.p>
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-orange-600">Request</span>{" "}
                <span className="text-gray-900">A Quote</span>
              </motion.h2>

              <motion.p
                className="text-gray-700 text-base sm:text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Let's Get Moving. Request a Free Shipping Quote
              </motion.p>

              <motion.p
                className="text-gray-600 text-sm sm:text-base mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Tell us what you need, and our team will respond with a
                customized shipping solution tailored to your business.
              </motion.p>

              {/* Benefits List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-lg">🔒</span>
                  <span className="text-gray-700">
                    100% Secure & Confidential
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-lg">⚡</span>
                  <span className="text-gray-700">Fast Response Time</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-orange-600 font-bold text-lg">💡</span>
                  <span className="text-gray-700">Expert Advice Included</span>
                </li>
              </ul>

              {/* CTA Button */}
              <QuoteForm
                trigger={
                  <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-8 py-3 font-semibold">
                    Get Your Free Quote
                  </Button>
                }
              />
            </div>

            {/* Right Form - Embedded Quote Form */}
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-gray-200 w-full max-w-lg mt-8 lg:mt-0">
              <form className="space-y-4">
                {/* Form Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Get Your Quote
                  </h3>
                  <p className="text-sm text-gray-600">
                    Fill out the form and we'll contact you shortly
                  </p>
                </div>

                {/* Contact Information Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        First Name *
                      </Label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Last Name *
                      </Label>
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Email Address *
                      </Label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Phone Number *
                      </Label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipment Details Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Shipment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Origin Location *
                      </Label>
                      <input
                        type="text"
                        name="origin"
                        placeholder="Origin Location"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Destination Location *
                      </Label>
                      <input
                        type="text"
                        name="destination"
                        placeholder="Destination Location"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Shipping Method *
                      </Label>
                      <select
                        name="shippingMethod"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700"
                        required
                      >
                        <option value="">Select Method</option>
                        <option value="air">Air Freight</option>
                        <option value="sea">Sea Freight</option>
                        <option value="land">Land Transport</option>
                        <option value="multimodal">Multimodal</option>
                      </select>
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Cargo Type *
                      </Label>
                      <input
                        type="text"
                        name="cargoType"
                        placeholder="Cargo Type"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Weight/Volume
                      </Label>
                      <input
                        type="text"
                        name="weight"
                        placeholder="Weight/Volume"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-xs mb-1 block">
                        Preferred Date
                      </Label>
                      <input
                        type="date"
                        name="date"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Additional Information
                  </h4>
                  <Label className="text-gray-700 text-xs mb-1 block">
                    Special Requirements
                  </Label>
                  <textarea
                    name="notes"
                    placeholder="Special requirements or additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold text-sm transition-colors"
                  >
                    Request Quote
                  </Button>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    * Required fields
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
