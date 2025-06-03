// components/HorizontalScroll.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface ScrollItem {
  title: string;
  icon: string;
  link: string;
}

const HorizontalScroll = ({ items }: { items: ScrollItem[] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollSpeed = 1; // Pixels per frame

  // Duplicate items for seamless looping
  const duplicatedItems = [...items, ...items];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollStep = () => {
      if (!container || isPaused) {
        animationRef.current = requestAnimationFrame(scrollStep);
        return;
      }
      
      const maxScroll = container.scrollWidth / 2;
      
      // If at the end of duplicated content, reset to beginning
      if (container.scrollLeft >= maxScroll - 1) {
        container.scrollLeft = 0;
      } else {
        container.scrollLeft += scrollSpeed;
      }
      
      animationRef.current = requestAnimationFrame(scrollStep);
    };

    animationRef.current = requestAnimationFrame(scrollStep);
    
    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isPaused]);

  return (
    <div className="w-full py-8 relative group">
      {/* Gradient fade effects */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />
      
      {/* Scroll container */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto scrollbar-hide"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {duplicatedItems.map((item, index) => (
          <Link 
            href={item.link} 
            key={index}
            className="flex-shrink-0 px-3 transition-transform duration-300 hover:scale-105"
            onClick={(e) => {
              // Prevent link click during scroll animation
              if (isPaused) return;
              e.preventDefault();
            }}
          >
            <div className="flex flex-col items-center justify-center bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 w-36 h-44 p-4">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="text-sm font-medium text-gray-700 text-center">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroll;