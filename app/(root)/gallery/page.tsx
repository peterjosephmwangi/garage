"use client";

import React from "react";
import Image from "next/image";

const galleryImages = [
  { src: "/images/ac1.jpeg", alt: "Engine Repair in Progress" },
  { src: "/images/battery.jpeg", alt: "Our Clean and Modern Workshop" },
  { src: "/images/brakes1.jpeg", alt: "Tire Replacement Service" },
  { src: "/images/diagnostic1.jpeg", alt: "Brake System Inspection" },
  { src: "/images/download.jpeg", alt: "Customer Lounge Area" },
  { src: "/images/images1.jpeg", alt: "Technician at Work" },
];

const GalleryPage = () => {
  return (
    <section className="min-h-screen bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Gallery</h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Get a behind-the-scenes look at our workspace, our team in action,
            and the dedication that goes into every service we provide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleryImages.map((image, idx) => (
            <div
              key={idx}
              className="relative group overflow-hidden rounded-xl shadow-md hover:shadow-xl transition"
            >
              <Image
                src={image.src}
                alt={image.alt}
                width={600}
                height={400}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300 ease-in-out"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <p className="text-white text-lg font-semibold px-4 text-center">
                  {image.alt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GalleryPage;
