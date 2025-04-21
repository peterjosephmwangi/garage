"use client"
import React, { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 flex justify-between items-center py-4">
        {/* Logo */}
        <div className="text-2xl font-bold text-orange-600">
          <Link href="/">Garage</Link>
        </div>

        {/* Hamburger menu for mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="text-gray-700 hover:text-orange-600">
            Home
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-orange-600">
            About Us
          </Link>
          <Link href="/services" className="text-gray-700 hover:text-orange-600">
            Services
          </Link>
          <Link href="/gallery" className="text-gray-700 hover:text-orange-600">
            Gallery
          </Link>
          <Link href="/faqs" className="text-gray-700 hover:text-orange-600">
            FAQs
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-orange-600">
            Contact
          </Link>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-gray-100">
          <Link
            href="/"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            About Us
          </Link>
          <Link
            href="/services"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href="/gallery"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link
            href="/faqs"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            FAQs
          </Link>
          <Link
            href="/contact"
            className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
