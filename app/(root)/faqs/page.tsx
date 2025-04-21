"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "What types of vehicles do you service?",
    answer:
      "We work on a wide range of vehicles including sedans, SUVs, trucks, and even light commercial vehicles. Our certified technicians are trained to handle both domestic and imported models.",
  },
  {
    question: "How often should I get my oil changed?",
    answer:
      "Most vehicles should get an oil change every 5,000 to 7,000 miles, depending on your car's make, model, and oil type. We’ll help you determine the best interval based on your vehicle.",
  },
  {
    question: "Do I need to book an appointment?",
    answer:
      "While walk-ins are welcome, we recommend booking an appointment to minimize wait times and ensure prompt service.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, credit/debit cards, mobile payments, and selected digital wallets. Financing options may be available for large repairs.",
  },
  {
    question: "Do you offer warranties on services?",
    answer:
      "Yes, we stand behind our work with service warranties that vary by job. Ask us about our warranty policy specific to your service.",
  },
];

const FaqsPage = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="min-h-screen bg-gray-50 py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">
            Frequently Asked Questions
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Got questions? We've got answers. Here's what our customers ask the
            most.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm transition hover:shadow-md"
            >
              <button
                onClick={() => toggle(index)}
                className="w-full flex items-center justify-between px-6 py-4 text-left"
              >
                <span className="text-lg font-medium text-gray-800">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-700">{faq.answer}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FaqsPage;
