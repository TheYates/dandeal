"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface HeroSectionProps {
  title: string;
  subtitle?: string;
  description?: string;
  showCTA?: boolean;
  ctaText?: string;
  ctaSecondaryText?: string;
}

export default function HeroSection({
  title,
  subtitle,
  description,
  showCTA = false,
  ctaText = "Free Consultation",
  ctaSecondaryText = "Learn More",
}: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Logistics slideshow images
  const heroImages = [
    "https://images.pexels.com/photos/906494/pexels-photo-906494.jpeg", // Container ship
    "https://images.pexels.com/photos/906982/pexels-photo-906982.jpeg", // Cargo plane
    "https://images.pexels.com/photos/21234960/pexels-photo-21234960.jpeg", // Warehouse
  ];

  // Slideshow effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
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
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center w-full">
        <div className="w-full">
          {/* Hero Content */}
          <div className="flex flex-col justify-center text-white max-w-2xl">
            <motion.h1
              className="text-5xl lg:text-6xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              {title}
            </motion.h1>

            {subtitle && (
              <motion.p
                className="text-xl italic mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                {subtitle}
              </motion.p>
            )}

            {description && (
              <motion.p
                className="text-sm mb-8 max-w-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                viewport={{ once: true }}
              >
                {description}
              </motion.p>
            )}

            {showCTA && (
              <motion.div
                className="flex space-x-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                viewport={{ once: true }}
              >
                <button className="bg-orange-600 hover:bg-red-700 text-white rounded-full px-8 py-3 font-semibold transition">
                  {ctaText}
                </button>
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-3 font-semibold transition">
                  {ctaSecondaryText}
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

