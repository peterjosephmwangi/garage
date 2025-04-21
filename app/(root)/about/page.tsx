"use client";
import React from "react";
import {
  FaTools,
  FaBullseye,
  FaThumbsUp,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FaUserCog, FaMoneyCheckAlt, FaCoffee, FaSmile } from "react-icons/fa";

const sections = [
  {
    title: "Who We Are",
    icon: <FaTools className="text-blue-600 text-3xl mb-3" />,
    content:
      "Founded by passionate automotive experts, our shop has grown from a small garage into a full-service car care center trusted by hundreds of drivers. Our team is made up of certified mechanics, service advisors, and support staff who care deeply about getting the job done right.",
  },
  {
    title: "Our Mission",
    icon: <FaBullseye className="text-blue-600 text-3xl mb-3" />,
    content:
      "To provide exceptional auto services with honesty, transparency, and a customer-first approach. Whether it’s routine maintenance or major repairs, we make every experience smooth and stress-free.",
  },
  {
    title: "Why Choose Us?",
    icon: <FaThumbsUp className="text-blue-600 text-3xl mb-3" />,
    content: (
      <div className="space-y-4 text-gray-700">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-1">
            <FaUserCog />
          </span>
          <p>Certified & Experienced Technicians</p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-1">
            <FaMoneyCheckAlt />
          </span>
          <p>Transparent Pricing — No Hidden Fees</p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-1">
            <FaTools />
          </span>
          <p>Modern Tools & Diagnostic Equipment</p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-1">
            <FaCoffee />
          </span>
          <p>Customer Lounge with Wi-Fi & Coffee</p>
        </div>

        <div className="flex items-start gap-3">
          <span className="text-blue-600 text-xl mt-1">
            <FaSmile />
          </span>
          <p>Fast, Reliable, and Friendly Service</p>
        </div>
      </div>
    ),
  },
  {
    title: "Visit Us Today",
    icon: <FaMapMarkerAlt className="text-blue-600 text-3xl mb-3" />,
    content:
      "Ready to experience quality care for your car? Drop by our shop, give us a call, or book your appointment online. We’re here to help — and we’re glad you’re here.",
  },
];

const AboutPage = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-white to-gray-100 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 text-center">
          About Us
        </h1>
        <p className="text-lg text-gray-600 mb-12 text-center max-w-2xl mx-auto">
          We’re not just about fixing cars — we’re about building trust and
          delivering quality service that keeps you and your vehicle on the
          road, safely and confidently.
        </p>

        <div className="space-y-12">
          {sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg p-8 text-center transition duration-300 ease-in-out"
            >
              <div className="flex justify-center">{section.icon}</div>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                {section.title}
              </h2>
              <div className="text-gray-700 leading-relaxed text-md">
                {typeof section.content === "string" ? (
                  <p>{section.content}</p>
                ) : (
                  section.content
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
