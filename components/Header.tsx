// components/Header.tsx (Updated from your existing Navbar)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import CartIcon from "./CartIcon";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-lg sticky top-0 z-30">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-blue-800">
              Garage
            </Link>
          </div>

          {/* Hamburger menu for mobile */}
          <div className="md:hidden flex items-center gap-4">
            <CartIcon />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-600 focus:outline-none"
            >
              <div className="w-6 h-6 flex flex-col justify-around">
                <span className={`block h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transition-all duration-500 ease-in-out ${menuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`block h-0.5 w-6 bg-current transform transition duration-500 ease-in-out ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Home
            </Link>
            <Link href="#about" className="text-gray-700 hover:text-blue-600 font-medium transition">
              About Us
            </Link>
            <Link href="#services" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Services
            </Link>
            <Link href="#gallery" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Gallery
            </Link>
            <Link href="#faqs" className="text-gray-700 hover:text-blue-600 font-medium transition">
              FAQs
            </Link>
            <Link href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition">
              Contact
            </Link>
            
            {/* Cart Icon */}
            <CartIcon />
          </nav>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden">
            <nav className="flex flex-col space-y-4 pb-4 border-t border-gray-200 pt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="#about"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="#services"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                href="#gallery"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                Gallery
              </Link>
              <Link
                href="#faqs"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                FAQs
              </Link>
              <Link
                href="#contact"
                className="text-gray-700 hover:text-blue-600 font-medium transition"
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;


// "use client"
// import React, { useState } from "react";
// import Link from "next/link";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);

//   return (
//     <nav className="bg-white shadow-md sticky top-0 z-40">
//       <div className="container mx-auto px-4 flex justify-between items-center py-4">
//         {/* Logo */}
//         <div className="text-2xl font-bold text-orange-600">
//           <Link href="/">Garage</Link>
//         </div>

//         {/* Hamburger menu for mobile */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="text-gray-600 focus:outline-none"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M4 6h16M4 12h16m-7 6h7"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Navigation Links */}
//         <div className="hidden md:flex space-x-6">
//           <Link href="/" className="text-gray-700 hover:text-orange-600">
//             Home
//           </Link>
//           <Link href="/about" className="text-gray-700 hover:text-orange-600">
//             About Us
//           </Link>
//           <Link href="/services" className="text-gray-700 hover:text-orange-600">
//             Services
//           </Link>
//           <Link href="/gallery" className="text-gray-700 hover:text-orange-600">
//             Gallery
//           </Link>
//           <Link href="/faqs" className="text-gray-700 hover:text-orange-600">
//             FAQs
//           </Link>
//           <Link href="/contact" className="text-gray-700 hover:text-orange-600">
//             Contact
//           </Link>
//         </div>
//       </div>

//       {/* Mobile Dropdown */}
//       {menuOpen && (
//         <div className="md:hidden bg-gray-100">
//           <Link
//             href="/"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             Home
//           </Link>
//           <Link
//             href="/about"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             About Us
//           </Link>
//           <Link
//             href="/services"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             Services
//           </Link>
//           <Link
//             href="/gallery"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             Gallery
//           </Link>
//           <Link
//             href="/faqs"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             FAQs
//           </Link>
//           <Link
//             href="/contact"
//             className="block px-4 py-2 text-gray-700 hover:bg-orange-100"
//             onClick={() => setMenuOpen(false)}
//           >
//             Contact
//           </Link>
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;
