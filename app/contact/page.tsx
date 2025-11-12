"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, MessageCircle, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/public/HeroSection";
import { useSiteSettings } from "@/hooks/use-site-settings";

export default function Contact() {
  const { settings } = useSiteSettings();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(
          "Thank you! Your message has been sent successfully. We'll get back to you soon."
        );
        // Reset form
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (error) {
      console.error("Error submitting contact form:", error);
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Call Us",
      details: [
        settings.phonePrimary || "+233 25 608 8845",
        settings.phoneSecondary || "+233 25 608 8846"
      ].filter(Boolean),
    },
    {
      icon: Mail,
      title: "Email Us",
      details: [
        settings.emailPrimary || "info@dandealimportation.com",
        settings.emailSupport || "support@dandealimportation.com"
      ].filter(Boolean),
    },
    {
      icon: MapPin,
      title: "Visit Us",
      details: [
        `Kumasi - Ghana: ${settings.officeKumasi || "Santasi"}`,
        `Obuasi - Ashanti Region: ${settings.officeObuasi || "Mangoase"}`,
        `China Office: ${settings.officeChina || "Guangzhou"}`,
      ],
    },
    {
      icon: MessageCircle,
      title: "Message Us",
      details: [settings.whatsapp || "+49 15212203183"],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="Get In Touch"
        subtitle="We're here to help with your shipping and logistics needs"
        description="Have questions or ready to book a shipment? Contact our team today and let's discuss how we can support your business."
      />

      {/* Contact Form Section with Map */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch mb-20">
            {/* Left - Map */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7432123456!2d-0.2!3d5.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMDAuMCJOIDAiwrAxMicwMC4wIlc!5e0!3m2!1sen!2sgh!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </motion.div>

            {/* Right - Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white rounded-lg shadow-lg p-8 border border-gray-200"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Send Us A Message
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Fill out the form below and our team will get back to you as
                soon as possible. We typically respond within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+233 XXX XXX XXXX"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="How can we help?"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell us more about your inquiry..."
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Message"}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  * Required fields
                </p>
              </form>
            </motion.div>
          </div>

          {/* Contact Information Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-200 text-center"
                >
                  <div className="flex justify-center mb-4">
                    <div className="bg-red-100 p-4 rounded-full">
                      <Icon className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {info.title}
                  </h3>
                  <div className="space-y-2">
                    {info.details.map((detail, idx) => (
                      <p key={idx} className="text-sm text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Social Media Section */}
      <section className="relative py-20 bg-white dark:bg-black overflow-hidden">
        {/* Decorative Red Triangle */}
        <div className="absolute right-0 top-0 bottom-0 w-3/12 bg-red-600 clip-triangle"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          >
            Follow Us On Our Social Media Platforms
          </motion.h2>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="flex justify-center gap-6"
          >
            {settings.facebookUrl && settings.displayFacebook && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90  transition transform hover:scale-120"
              >
                <Facebook className="text-blue-500 w-8 h-8" />
              </a>
            )}
            {settings.instagramUrl && settings.displayInstagram && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90 transition transform hover:scale-120"
              >
                <Instagram className="text-pink-500 w-8 h-8" />
              </a>
            )}
            {settings.linkedinUrl && settings.displayLinkedin && (
              <a
                href={settings.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90 transition transform hover:scale-120"
              >
                <Linkedin className="text-blue-500 w-8 h-8" />
              </a>
            )}
            {settings.twitterUrl && settings.displayTwitter && (
              <a
                href={settings.twitterUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90 transition transform hover:scale-120"
              >
                <Twitter className="text-sky-400 w-8 h-8" />
              </a>
            )}
            {settings.tiktokUrl && settings.displayTiktok && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-16 h-16 rounded-full flex items-center justify-center hover:opacity-90 transition transform hover:scale-120"
              >
                <FaTiktok className="text-black w-8 h-8" />
              </a>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
