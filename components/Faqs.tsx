"use client"
import { useState } from "react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqData = [
    {
      question: "What services do you offer?",
      answer: "We offer a wide range of garage services including oil changes, tire rotations, brake inspections, battery checks, and much more.",
    },
    {
      question: "How can I book a service?",
      answer: "You can book a service through our website by choosing a plan and selecting the service date, or you can contact us directly by phone.",
    },
    {
      question: "Are your mechanics certified?",
      answer: "Yes, all of our mechanics are highly trained and certified to provide top-quality service for all vehicle types.",
    },
    {
      question: "Do you offer any warranties on services?",
      answer: "Yes, we provide warranties on all our services to ensure customer satisfaction and peace of mind.",
    },
    {
      question: "What are your working hours?",
      answer: "We are open Monday to Friday from 8 AM to 6 PM and on Saturdays from 9 AM to 4 PM. We are closed on Sundays.",
    },
  ];

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqData.map((faq, index) => (
            <div key={index} className="bg-white shadow-lg rounded-lg overflow-hidden">
              <div
                className="px-6 py-4 cursor-pointer flex justify-between items-center hover:bg-gray-100 transition"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-xl font-semibold text-gray-800">{faq.question}</h3>
                <span className="text-gray-500">{openIndex === index ? "-" : "+"}</span>
              </div>
              {openIndex === index && (
                <div className="px-6 py-4 bg-gray-100 text-gray-700">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
