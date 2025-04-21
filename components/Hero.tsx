import React from 'react'

const Hero = () => {
  return (
     <section className="relative bg-gray-900 text-white mt-4">
      {/* Background Image */}
      <div className="absolute inset-0 bg-cover bg-center bg-hero-pattern opacity-80"></div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-6 md:px-12 lg:px-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
          Professional Garage Management Made Easy
        </h1>
        <p className="mt-4 text-lg md:text-xl lg:text-2xl max-w-3xl">
          Simplify your operations with modern tools and efficient workflows. From vehicle repairs to customer management, we've got you covered.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition">
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition">
            Learn More
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero


// import React from 'react';
// import { motion } from 'framer-motion'; // Import motion

// const Hero = () => {
//   return (
//     <section className="relative bg-gray-900 text-white mt-4">
//       {/* Background Image */}
//       <div className="absolute inset-0 bg-cover bg-center bg-hero-pattern opacity-80"></div>

//       {/* Overlay */}
//       <div className="absolute inset-0 bg-black bg-opacity-50"></div>

//       {/* Content */}
//       <motion.div
//         className="relative flex flex-col items-center justify-center text-center min-h-[80vh] px-6 md:px-12 lg:px-20"
//         initial={{ opacity: 0 }} // Initial state
//         animate={{ opacity: 1 }} // End state
//         transition={{ duration: 1 }} // Animation duration
//       >
//         <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//           Professional Garage Management Made Easy
//         </h1>
//         <p className="mt-4 text-lg md:text-xl lg:text-2xl max-w-3xl">
//           Simplify your operations with modern tools and efficient workflows. From vehicle repairs to customer management, we've got you covered.
//         </p>
//         <div className="mt-6 flex flex-wrap justify-center gap-4">
//           <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition">
//             Get Started
//           </button>
//           <button className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg shadow-lg transition">
//             Learn More
//           </button>
//         </div>
//       </motion.div>
//     </section>
//   );
// }

// export default Hero;
