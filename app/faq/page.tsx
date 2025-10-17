"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqItems = [
    {
      question: "What shipping methods does ALS Global offer?",
      answer:
        "ALS Global offers comprehensive shipping solutions including Air Freight, Sea Freight (FCL & LCL), Door-to-Door Delivery, and Multimodal transport. We serve routes from China, Dubai, and Turkey to Ghana and across Africa.",
    },
    {
      question: "How long does customs clearance take?",
      answer:
        "Our expert team typically completes customs clearance within 24-48 hours at all Ghanaian ports. The exact timeline depends on documentation completeness and cargo type. We handle all paperwork to ensure smooth processing.",
    },
    {
      question: "Do you provide warehousing services?",
      answer:
        "Yes, we offer strategic storage solutions in key industrial districts in both China and Ghana. Our warehousing facilities are secure, climate-controlled, and equipped with modern inventory management systems.",
    },
    {
      question: "Can you help with international procurement?",
      answer:
        "Absolutely! We provide direct access to verified suppliers in China, UAE, and Turkey. We handle supplier verification, secure payment facilitation, quality checks, and shipping coordination for your peace of mind.",
    },
    {
      question: "What is the minimum weight for air freight?",
      answer:
        "The minimum load for air freight is 10kg. However, we can consolidate smaller shipments with other clients to help you save on costs. Contact us for consolidation options.",
    },
    {
      question: "Do you offer tracking for shipments?",
      answer:
        "Yes! We provide real-time shipment tracking through our Client Shipment Tracking Dashboard. You can monitor your cargo at every stage of the journey from origin to destination.",
    },
    {
      question: "What documents do I need for import/export?",
      answer:
        "Required documents typically include Bill of Lading, Commercial Invoice, Packing List, Certificate of Origin, and any product-specific certifications. Our team will guide you through the documentation process based on your cargo type.",
    },
    {
      question: "Do you offer green shipping options?",
      answer:
        "Yes, we provide Carbon Footprint & Green Shipping Options for environmentally conscious clients. We can help you choose sustainable shipping methods that reduce your environmental impact.",
    },
    {
      question: "How do I get a quote?",
      answer:
        "You can request a free quote through our website's quote form, call us directly, or use WhatsApp. Provide details about your shipment (origin, destination, cargo type, weight/volume), and our team will respond with a customized quote within 24 hours.",
    },
    {
      question: "Do you have a dedicated account manager?",
      answer:
        "Yes! Enterprise clients receive a dedicated Account Manager who handles all their logistics needs. We also offer WhatsApp Support for quick communication and issue resolution.",
    },
    {
      question: "What areas in Ghana do you deliver to?",
      answer:
        "We provide door-to-door delivery throughout Ghana, including Accra, Kumasi, Koforidua, and other major cities. Our network ensures timely delivery to your exact location.",
    },
    {
      question: "Can you help with supply chain optimization?",
      answer:
        "Yes, we offer Supply Chain Consulting & Optimization services for enterprise clients. Our experts analyze your logistics operations and recommend cost-effective solutions to improve efficiency.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="Frequently Asked Questions"
        subtitle="Find answers to common questions about our services"
        description="Have questions about shipping, logistics, or our services? We've compiled answers to help you understand how ALS Global can support your business."
      />

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Common Questions
            </h2>
            <p className="text-gray-600">
              Everything you need to know about our shipping and logistics
              services
            </p>
          </motion.div>

          {/* FAQ Accordion - 2 Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
              >
                {/* Question Button */}
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  <h3 className="text-base font-semibold text-gray-900 text-left">
                    {item.question}
                  </h3>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-600 flex-shrink-0 transition-transform duration-300 ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Answer */}
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-6 py-4 bg-gray-50 border-t border-gray-200"
                  >
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          {/* Still Have Questions CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-16 bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-8 text-center text-white"
          >
            <h3 className="text-2xl font-bold mb-3">Still Have Questions?</h3>
            <p className="mb-6">
              Can't find the answer you're looking for? Our team is here to
              help!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+233585233019"
                className="bg-white text-orange-600 hover:bg-gray-100 px-6 py-2 rounded-full font-semibold transition"
              >
                Call Us
              </a>
              <a
                href="mailto:info@alsshipping.com"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 py-2 rounded-full font-semibold transition"
              >
                Email Us
              </a>
              <a
                href="/contact"
                className="border-2 border-white text-white hover:bg-white hover:text-orange-600 px-6 py-2 rounded-full font-semibold transition"
              >
                Contact Form
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
