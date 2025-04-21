"use client";
import React from "react";

const ContactPage = () => {
  return (
    <section className="min-h-screen bg-white py-16 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Contact Us</h1>
          <p className="mt-4 text-gray-600 text-lg max-w-2xl mx-auto">
            Have questions, need assistance, or want to schedule an appointment?
            We're here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Form */}
          <div className="bg-gray-50 p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-blue-700 mb-6">
              Send Us a Message
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Name
                </label>
                <input
                  type="text"
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Your message..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col justify-between space-y-6 text-gray-700">
            <div>
              <h2 className="text-2xl font-semibold text-blue-700 mb-4">
                Get In Touch
              </h2>
              <p className="mb-4">
                Whether you’re looking for a quick tune-up or a full diagnostic,
                our team is ready to help. Reach out by phone, email, or drop by
                — we’d love to meet you.
              </p>
              <ul className="space-y-3">
                <li>
                  <strong>Phone:</strong> +254 716 988 147
                </li>
                <li>
                  <strong>Email:</strong> support@autoshop.com
                </li>
                <li>
                  <strong>Address:</strong> ABC 123 Nairobi, Kenya
                </li>
                <li>
                  <strong>Hours:</strong> Mon–Sat, 8am–6pm
                </li>
              </ul>
            </div>

            {/* Optional Map Embed */}
            <div className="rounded-lg overflow-hidden shadow-sm">
              <iframe
                className="w-full h-56 rounded-md"
                // src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3163.162556907212!2d-122.0842496851088!3d37.42206597981907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808fba02b8e04297%3A0x36f69a7cf72a595b!2sGoogleplex!5e0!3m2!1sen!2sus!4v1636420625047!5m2!1sen!2sus"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.007438574648!2d36.790752351837004!3d-1.2615126999999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17693b368f0f%3A0x13091f14086655c5!2sHaven%20Court!5e0!3m2!1sen!2ske!4v1712838230903!5m2!1sen!2ske"
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
