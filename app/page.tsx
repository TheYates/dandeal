"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronDown,
  Calendar,
  Package,
  Plane,
  Ship,
  Truck,
  Globe,
  FileText,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoCarousel from "@/components/LogoCarousel";

export default function Home() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    message: "",
  });

  const [activeTab, setActiveTab] = useState("rates");
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (value: string) => {
    setFormData((prev) => ({ ...prev, service: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

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
      <section className="relative h-screen pt-20 flex items-center overflow-hidden">
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
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
            {/* Left Content */}
            <div className="flex flex-col justify-center text-white">
              <motion.h1
                className="text-5xl lg:text-6xl font-bold mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Dandeal Logistics & Importation
              </motion.h1>
              <motion.p
                className="text-xl italic mb-6"
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
                From Sourcing Raw Materials, Machinery, And Vehicles Globally to
                Shipping, ALS Delivers Seamless Logistics And Import & Export
                Solutions.
              </motion.p>

              {/* CTA Buttons */}
              <div className="flex space-x-4">
                <Button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-8">
                  Free Consultation
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-black rounded-full px-8"
                >
                  Contact Us
                </Button>
              </div>
            </div>

            {/* Right Form */}
            <div className="flex items-center justify-center">
              <div className="bg-white/10 rounded-lg p-8 w-full max-w-md shadow-lg backdrop-blur-sm">
                <h2 className="text-2xl font-bold text-white mb-6">
                  Book A Free Consultation
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Name */}
                  <div>
                    <Input
                      type="text"
                      name="name"
                      placeholder="Name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60"
                    />
                  </div>

                  {/* Service Dropdown */}
                  <div>
                    <Label className="text-white text-sm mb-2 block">
                      Service Requested
                    </Label>
                    <Select
                      value={formData.service}
                      onValueChange={handleServiceChange}
                    >
                      <SelectTrigger className="w-full bg-white/20 border border-white/30 rounded-md text-white">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="shipping">Shipping</SelectItem>
                        <SelectItem value="logistics">Logistics</SelectItem>
                        <SelectItem value="import">Import</SelectItem>
                        <SelectItem value="export">Export</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div>
                    <Textarea
                      name="message"
                      placeholder="Message"
                      value={formData.message}
                      onChange={handleInputChange}
                      className="w-full bg-white/20 border border-white/30 rounded-md px-4 py-2 text-white placeholder-white/60 resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Submit Button */}
                  <Button className="w-full bg-orange-600 hover:bg-red-700 text-white rounded-md py-2 flex items-center justify-center">
                    Book Free Consultation
                    <ChevronDown className="w-4 h-4 ml-2 rotate-[-90deg]" />
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search, Tabs & Partners Section */}
      <section className="bg-gray-50 h-screen flex items-center py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col gap-12 h-full justify-center">
            {/* Tabs */}
            <div>
              {/* Tabs Header */}
              <div className="text-center mb-8">
                <motion.h2
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3"
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
                  Get instant shipping rates, track your cargo in real-time, or
                  view our comprehensive schedules
                </motion.p>
              </div>

              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6 bg-white border-b">
                  <TabsTrigger
                    value="rates"
                    className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Rates
                  </TabsTrigger>
                  <TabsTrigger
                    value="tracking"
                    className="data-[state=active]:bg-green-100 data-[state=active]:text-green-600 rounded-none border-b-2 border-transparent data-[state=active]:border-green-600"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Tracking
                  </TabsTrigger>
                  <TabsTrigger
                    value="schedules"
                    className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-600 rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedules
                  </TabsTrigger>
                </TabsList>

                {/* Rates Tab */}
                <TabsContent value="rates" className="bg-white p-6 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        From
                      </Label>
                      <Input
                        placeholder="City, terminal, zip code etc."
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        To
                      </Label>
                      <Input
                        placeholder="City, terminal, zip code etc."
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        Date
                      </Label>
                      <Input
                        type="date"
                        defaultValue="2025-10-16"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        Container Type
                      </Label>
                      <Input
                        placeholder="FCL, 20'ST"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <Button className="bg-orange-600 hover:bg-red-700 text-white w-full">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Tracking Tab */}
                <TabsContent
                  value="tracking"
                  className="bg-white p-6 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <div>
                      <Input
                        placeholder="Container, Booking, Bill of lading"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 "
                      >
                        Auto Detect
                      </Button>
                    </div>
                    <Button className="bg-orange-600 hover:bg-red-700 text-white w-full">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>

                {/* Schedules Tab */}
                <TabsContent
                  value="schedules"
                  className="bg-white p-6 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        From
                      </Label>
                      <Input
                        placeholder="From"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        To
                      </Label>
                      <Input
                        placeholder="To"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        Date
                      </Label>
                      <Input
                        type="date"
                        defaultValue="2025-10-16"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700 text-sm mb-2 block">
                        Frequency
                      </Label>
                      <Input
                        placeholder="2 weeks, All sealines"
                        className="border-gray-300 bg-white text-gray-900"
                      />
                    </div>
                    <Button className="bg-orange-600 hover:bg-red-700 text-white w-full">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            {/* Partners & Accreditations */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">
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
      <section className="relative overflow-hidden h-screen flex items-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            {/* Left Content */}
            <div className="bg-white flex flex-col justify-center px-8 sm:px-6 lg:px-8 py-12 lg:py-0">
              <div className="max-w-lg">
                <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
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

                <Button className="bg-orange-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-full">
                  REQUEST A FREE QUOTE
                </Button>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
              {/* Diagonal shape background */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100"></div>

              {/* Phone mockup with shipping imagery */}
              <div className="relative z-10 w-full h-full flex items-center justify-center px-8">
                <div className="relative w-64 h-96 bg-black rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                  {/* Phone screen content */}
                  <div className="w-full h-full bg-gradient-to-b from-blue-400 to-blue-600 flex flex-col items-center justify-center p-4 relative">
                    {/* Airplane */}
                    <div className="absolute top-8 right-4 text-4xl">✈️</div>

                    {/* Cargo containers */}
                    <div className="absolute left-2 top-20 text-2xl">📦</div>
                    <div className="absolute left-6 top-24 text-2xl">📦</div>

                    {/* Ship */}
                    <div className="absolute bottom-16 left-4 text-3xl">🚢</div>

                    {/* Truck */}
                    <div className="absolute bottom-8 right-6 text-3xl">🚚</div>

                    {/* Center text */}
                    <div className="text-center text-white font-bold text-sm mt-20">
                      <div>Global</div>
                      <div>Shipping</div>
                    </div>
                  </div>

                  {/* Phone notch */}
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-20"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Diagonal wave divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-r from-red-600 to-blue-900 clip-path-polygon"
          style={{
            clipPath: "polygon(0 30%, 100% 0%, 100% 100%, 0 100%)",
          }}
        ></div>
      </section>

      {/* Comprehensive Solutions Section */}
      <section className="h-screen flex items-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <motion.h2
              className="text-orange-600 text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Comprehensive Solutions From One Of{" "}
              <span className="text-black">Ghana's</span>
              <br />
              <span className="text-black">Top Shipping Companies</span>
            </motion.h2>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Air Freight */}
            <div className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition">
              <Plane className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Air Freight</h3>
              <p className="text-sm leading-relaxed">
                Premium air cargo solutions with guaranteed delivery windows and
                real-time tracking. Minimum 10kg load.
              </p>
            </div>

            {/* Sea Freight */}
            <div className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition">
              <Ship className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Sea Freight</h3>
              <p className="text-sm leading-relaxed">
                Cost-effective container shipping with flexible options from FCL
                to LCL, tailored to your volume requirements.
              </p>
            </div>

            {/* Door-to-Door Delivery */}
            <div className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition">
              <Truck className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Door-to-Door Delivery</h3>
              <p className="text-sm leading-relaxed">
                Seamless last-mile service throughout Ghana, from Accra to
                Koforidua on time, every time.
              </p>
            </div>

            {/* International Procurement */}
            <div className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition">
              <Globe className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">
                International Procurement
              </h3>
              <p className="text-sm leading-relaxed">
                Direct access to verified suppliers in China, UAE, and Turkey
                with secure payment facilitation.
              </p>
            </div>

            {/* Container Clearance */}
            <div className="bg-orange-600 text-white p-8 rounded-lg hover:shadow-lg transition">
              <FileText className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Container Clearance</h3>
              <p className="text-sm leading-relaxed">
                Swift 24-48 hour customs clearance at all Ghanaian ports,
                managed by our expert teams.
              </p>
            </div>

            {/* Warehousing */}
            <div className="bg-blue-900 text-white p-8 rounded-lg hover:shadow-lg transition">
              <Building2 className="w-12 h-12 mb-4" />
              <h3 className="text-2xl font-bold mb-3">Warehousing</h3>
              <p className="text-sm leading-relaxed">
                Strategic storage solutions in key industrial districts in China
                and Ghana.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Leading Businesses Choose ALS Section */}
      <section className="h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="mb-8">
                <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mb-4">
                  <span className="text-white text-2xl font-bold">ALS</span>
                </div>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gray-900">
                  Why Leading <br />
                  Businesses{" "}
                </span>
                <span className="text-orange-600">Choose</span>
                <br />
                <span className="text-orange-600">ALS</span>.
              </h2>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-full">
                Book A Free Consultation
              </Button>

              {/* Images */}
              <div className="flex gap-4 mt-8">
                <div className="w-32 h-24 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=300&h=200&fit=crop"
                    alt="Shipping"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-32 h-24 bg-gray-300 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop"
                    alt="Logistics"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Right Content - Benefits List */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {/* Benefit 1 */}
              <div className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg">
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
              </div>

              {/* Benefit 2 */}
              <div className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
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
              </div>

              {/* Benefit 3 */}
              <div className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg">
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
              </div>

              {/* Benefit 4 */}
              <div className="border-l-4 border-blue-900 bg-blue-50 p-6 rounded-r-lg">
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
              </div>

              {/* Benefit 5 */}
              <div className="border-l-4 border-orange-600 bg-red-50 p-6 rounded-r-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-600 text-white font-bold text-xl w-12 h-12 rounded flex items-center justify-center flex-shrink-0">
                    05
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">
                      All-in-One Service
                    </h3>
                    <p className="text-gray-700 text-sm">
                      From source to doorstep, ALS has you covered.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries We Serve Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
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
          <div className="text-center mb-16">
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
              className="text-4xl lg:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Industries We Serve
            </motion.h2>
            <motion.p
              className="text-lg text-gray-700 max-w-3xl mx-auto"
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Fast-Moving Consumer Goods */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">✓</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Fast-Moving Consumer Goods
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [FMCG Image]
              </div>
            </div>

            {/* Industrial Machinery */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Industrial Machinery
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Machinery Image]
              </div>
            </div>

            {/* Furniture & Home Goods */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">🏠</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Furniture & Home Goods
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Furniture Image]
              </div>
            </div>

            {/* Pharmaceuticals & Medical Equipment */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">🏥</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Pharmaceuticals & Medical Equipment
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Medical Image]
              </div>
            </div>
          </div>

          {/* Industries Grid - Second Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Cosmetics & Apparel */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">👗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Cosmetics & Apparel
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Cosmetics Image]
              </div>
            </div>

            {/* Electronics & Electrical Components */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">🔌</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Electronics & Electrical Components
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Electronics Image]
              </div>
            </div>

            {/* Construction Materials */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Construction Materials
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Construction Image]
              </div>
            </div>

            {/* Automotive & Spare Parts */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition border-4 border-gray-200">
              <div className="p-6">
                <div className="text-3xl mb-3">🚗</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Automotive & Spare Parts
                </h3>
              </div>
              <div className="h-40 bg-gray-300 flex items-center justify-center text-gray-600">
                [Automotive Image]
              </div>
            </div>
          </div>
        </div>

        {/* Navy blue wave divider at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-32 bg-blue-900"
          style={{
            clipPath: "polygon(0 50%, 100% 0%, 100% 100%, 0 100%)",
          }}
        ></div>
      </section>

      {/* CTA Section with Navy Background */}
      <section className="relative h-screen flex items-center bg-blue-900 overflow-hidden">
        {/* Angled top divider */}
        <div
          className="absolute top-0 left-0 right-0 h-20 bg-white"
          style={{
            clipPath: "polygon(0 0, 100% 20%, 100% 100%, 0 100%)",
          }}
        ></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
          {/* Main Heading */}
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Whatever your industry, we have the specialized experience to
            optimize your supply chain.
          </h2>

          {/* CTA Button */}
          <div className="mb-8">
            <Button className="bg-orange-600  hover:bg-red-700 text-white rounded-full px-8 py-3 font-semibold">
              Book A Free Consultation
            </Button>
          </div>

          {/* Social Media Icons */}
          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-12 h-12 bg-blue-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition"
            >
              <span className="text-white text-xl">f</span>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center hover:bg-pink-600 transition"
            >
              <span className="text-white text-xl">📷</span>
            </a>
            <a
              href="#"
              className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition"
            >
              <span className="text-white text-xl">in</span>
            </a>
          </div>
        </div>

        {/* Angled bottom divider */}
        <div
          className="absolute bottom-0 left-0 right-0 h-20 bg-white"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 80%)",
          }}
        ></div>
      </section>

      {/* Testimonials Section */}
      <section className="h-screen flex items-center bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
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
              className="text-4xl lg:text-5xl font-bold text-gray-900"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
            >
              What Our Clients Say
            </motion.h2>
          </div>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Testimonial 1 - Red */}
            <div className="bg-orange-600 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "ALS has been our trusted logistics partner for over three
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
            </div>

            {/* Testimonial 2 - Navy */}
            <div className="bg-blue-900 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "I used to struggle with sourcing beauty products from Turkey,
                but ALS made it simple. They helped me find suppliers, handled
                payments, and shipped everything right to my store in Kumasi.
                Fantastic service!"
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
            </div>

            {/* Testimonial 3 - Red */}
            <div className="bg-orange-600 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "We import car parts monthly and ALS has been exceptional. Their
                team clears our shipments fast and keeps us informed every step
                of the way. Working with them has improved our turnaround time
                significantly."
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
            </div>

            {/* Testimonial 4 - Navy */}
            <div className="bg-blue-900 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "I found ALS through a friend and they've been a game-changer
                for my business. I now get my furniture imports from China
                faster, safer, and at better rates. Highly recommended!"
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
            </div>

            {/* Testimonial 5 - Red */}
            <div className="bg-orange-600 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "As a company that regularly brings in industrial machinery, we
                need a logistics partner we can rely on. ALS delivers every
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
            </div>

            {/* Testimonial 6 - Navy */}
            <div className="bg-blue-900 rounded-2xl p-8 text-white">
              <p className="mb-6 text-sm leading-relaxed">
                "Thanks to ALS, I've been able to scale my clothing business by
                importing from Dubai and China without the usual headaches. They
                even helped me source suppliers. Excellent service!"
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
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section with Background Video */}
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

      {/* Quote Request Section */}
      <section className="relative h-screen flex items-center bg-white overflow-hidden">
        {/* Red diagonal shape on right */}
        <div
          className="absolute right-0 top-60 bottom-0 w-11/12 bg-orange-500"
          style={{
            clipPath: "polygon(100% 0%, 100% 00%, 100% 100%, 0% 100%)",
          }}
        ></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
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
                className="text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <span className="text-orange-600">Request</span>{" "}
                <span className="text-gray-900">A Quote</span>
              </motion.h2>

              <motion.p
                className="text-gray-700 text-lg mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Let's Get Moving. Request a Free Shipping Quote
              </motion.p>

              <motion.p
                className="text-gray-600 mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                viewport={{ once: true }}
              >
                Tell us what you need, and our team will respond with a
                customized shipping solution tailored to your business.
              </motion.p>

              {/* Benefits List */}
              <ul className="space-y-4">
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
            </div>

            {/* Right Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 w-full max-w-lg">
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
                    <input
                      type="text"
                      placeholder="First Name *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Last Name *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="email"
                      placeholder="Email Address *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent col-span-2"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent col-span-2"
                    />
                  </div>
                </div>

                {/* Shipment Details Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Shipment Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Origin Location *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Destination Location *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-700">
                      <option value="">Shipping Method *</option>
                      <option value="air">Air Freight</option>
                      <option value="sea">Sea Freight</option>
                      <option value="land">Land Transport</option>
                      <option value="multimodal">Multimodal</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Cargo Type *"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Weight/Volume"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                    <input
                      type="date"
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Additional Information Section */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-900 mb-3 uppercase tracking-wide">
                    Additional Information
                  </h4>
                  <textarea
                    placeholder="Special requirements or additional notes..."
                    rows={3}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded px-4 py-2 font-semibold text-sm transition-colors">
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
