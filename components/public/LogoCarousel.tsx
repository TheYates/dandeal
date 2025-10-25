"use client";

import { useEffect, useState } from "react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface Logo {
  id: string;
  name: string;
  icon?: string;
  image?: string;
}

interface LogoCarouselProps {
  logos: Logo[];
  speed?: number;
}

export default function LogoCarousel({ logos, speed = 30 }: LogoCarouselProps) {
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Create duplicated logos for infinite scroll effect
  const duplicatedLogos = [...logos, ...logos, ...logos];

  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 1;
        // Reset to 0 when we've scrolled through one full set
        if (newPosition >= logos.length * 120) {
          return 0;
        }
        return newPosition;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [isHovered, logos.length, speed]);

  return (
    <div className="w-full py-12 relative">
      {/* Left fade gradient */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-gray-50 to-transparent z-10 pointer-events-none"></div>

      {/* Right fade gradient */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-gray-50 to-transparent z-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div
          className="flex gap-12 transition-transform duration-100 ease-linear"
          style={{
            transform: `translateX(-${scrollPosition}px)`,
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {duplicatedLogos.map((logo, index) => (
            <Tooltip key={`${logo.id}-${index}`}>
              <TooltipTrigger asChild>
                <div
                  className="shrink-0 w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center hover:shadow-lg transition hover:scale-105 cursor-pointer"
                >
                  {logo.image ? (
                    <img
                      src={logo.image}
                      alt={logo.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : (
                    <div className="text-5xl">{logo.icon}</div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{logo.name}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </div>
  );
}
