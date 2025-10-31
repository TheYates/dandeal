"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Testimonial {
  id: string;
  clientName: string;
  clientTitle?: string;
  clientCompany?: string;
  content: string;
  rating: string;
  image?: string;
  order: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function TestimonialsDisplay() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/testimonials");
        if (!response.ok) throw new Error("Failed to fetch testimonials");
        const data = await response.json();
        setTestimonials(data.testimonials || []);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
        setTestimonials([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-2xl p-8 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (testimonials.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No testimonials available yet.</p>
      </div>
    );
  }

  // Alternate between orange and navy colors
  const getBackgroundColor = (index: number) => {
    return index % 2 === 0
      ? "bg-orange-600"
      : "bg-blue-900";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={testimonial.id}
          className={`${getBackgroundColor(index)} rounded-2xl p-8 text-white flex flex-col h-full`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          viewport={{ once: true }}
        >
          <p className="mb-6 text-sm leading-relaxed grow">
            "{testimonial.content}"
          </p>
          <div className="mb-4">
            <p className="font-bold text-lg">{testimonial.clientName}</p>
            {testimonial.clientTitle && (
              <p className="text-sm text-gray-200">{testimonial.clientTitle}</p>
            )}
            {testimonial.clientCompany && (
              <p className="text-sm text-gray-200">{testimonial.clientCompany}</p>
            )}
          </div>
          <div className="flex gap-1">
            {Array.from({ length: parseInt(testimonial.rating) }).map((_, i) => (
              <span key={i} className="text-yellow-300">
                ⭐
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

