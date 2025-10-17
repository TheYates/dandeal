"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

export default function News() {
  const newsArticles = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=300&fit=crop",
      title:
        "ALS Global Shipping And Logistics CEO, Madam Evelyn Tetteh Honored At The Maiden Edition Ladies In Leadership Award",
      excerpt:
        "Our CEO receives recognition for her outstanding leadership in the logistics industry...",
      link: "#",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      title:
        "ALS Global Shipping & Logistics Ltd Is A Proud Member Of The International Federation Of Freight Forwarders Associations (FIATA)",
      excerpt:
        "We join the global community of freight forwarders committed to excellence...",
      link: "#",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1586528116039-c48148d8e98f?w=400&h=300&fit=crop",
      title:
        "ALS Global Shipping And Logistics Acquires A New Warehouse In China As Well As In Kumasi",
      excerpt:
        "Expanding our warehouse network to better serve our clients across key regions...",
      link: "#",
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1578575437980-63e9f3c3ee8f?w=400&h=300&fit=crop",
      title:
        "New Partnership Announcement: ALS Expands Services Across West Africa",
      excerpt:
        "Strategic expansion to bring better logistics solutions to more clients...",
      link: "#",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection
        title="Latest News & Updates"
        subtitle="Stay informed about ALS Global Shipping & Logistics"
        description="Discover the latest developments, achievements, and industry insights from ALS Global Shipping & Logistics"
      />

      {/* News Grid Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Latest Stories
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Read about our latest achievements, partnerships, and industry
              updates
            </p>
          </motion.div>

          {/* News Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsArticles.map((article, index) => (
              <motion.div
                key={article.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition border border-gray-200"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gray-200">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover hover:scale-105 transition duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-3">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {article.excerpt}
                  </p>

                  {/* Read More Button */}
                  <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6 py-2 flex items-center gap-2 text-sm font-semibold">
                    Read More <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
