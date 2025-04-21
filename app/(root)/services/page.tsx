"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

const servicesData = [
  {
    id: "tires",
    title: "Tire Services",
    description:
      "We offer a wide range of tire services, from installation to repair, for various types of vehicles. Find the perfect tires for your car, truck, or SUV.",
    image: "/images/tire4.jpeg",
    link: "/services/tires",
  },
  {
    id: "brakes",
    title: "Brake Services",
    description:
      "Ensure your vehicle's braking system is in top condition with our comprehensive brake services, including brake pad replacement, fluid flush, and more.",
    image: "/images/brakes5.jpeg",
    link: "/services/brakes",
  },
  {
    id: "oil-change",
    title: "Oil Change Services",
    description:
      "Keep your engine running smoothly with our quick and affordable oil change services. We use high-quality oils and filters for optimal performance.",
    image: "/images/images.jpeg",
    link: "/services/oil-change",
  },
  {
    id: "battery",
    title: "Battery Services",
    description:
      "Get your car's battery checked and replaced if necessary. Our experts ensure that you won't be left stranded with a dead battery.",
    image: "/images/battery1.jpeg",
    link: "/services/battery",
  },
];

const ServicesPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="container mx-auto px-4 sm:px-8 lg:px-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 leading-tight">
            Our Services
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our top-tier automotive services tailored to keep your
            vehicle safe, smooth, and road-ready.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4  ">
          {servicesData.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6 flex flex-col justify-between">
                <h3 className="text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                  {service.description}
                </p>
                <Link
                  href={service.link}
                  className="mt-6 inline-block self-center px-5 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 rounded-full shadow-md hover:shadow-lg transition-transform hover:-translate-y-0.5 duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesPage;
