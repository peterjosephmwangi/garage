import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* About Us Image */}
          <div>
            <img
              src="/images/team.jpg" // Replace with your image path
              alt="Garage Team"
              className="rounded-lg shadow-lg"
            />
          </div>

          {/* About Us Text */}
          <div>
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              About Our Garage
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Welcome to{" "}
              <span className="text-blue-600 font-semibold">Gaarage</span>, your
              trusted partner in vehicle care and maintenance. With over 10
              years of experience, we are dedicated to delivering exceptional
              service and ensuring the safety of every vehicle that enters our
              doors.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our team of certified professionals specializes in a wide range of
              services, from routine maintenance to advanced diagnostics and
              repairs. We pride ourselves on using state-of-the-art equipment
              and high-quality tools to provide reliable solutions.
            </p>
            <Link href="/about">
              <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition">
                Learn More
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

// import React from 'react';
// import { motion } from 'framer-motion'; // Import motion

// const About = () => {
//   return (
//     <section className="py-12 bg-gray-100">
//       <div className="container mx-auto px-6 md:px-12 lg:px-20">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
//           {/* About Us Image */}
//           <motion.div
//             initial={{ opacity: 0 }} // Initial state
//             whileInView={{ opacity: 1 }} // Visible when in view
//             transition={{ duration: 1 }} // Animation duration
//           >
//             <img
//               src="/images/team.jpg" // Replace with your image path
//               alt="Garage Team"
//               className="rounded-lg shadow-lg"
//             />
//           </motion.div>

//           {/* About Us Text */}
//           <motion.div
//             initial={{ opacity: 0 }} // Initial state
//             whileInView={{ opacity: 1 }} // Visible when in view
//             transition={{ duration: 1 }} // Animation duration
//           >
//             <h2 className="text-4xl font-bold text-gray-800 mb-4">
//               About Our Garage
//             </h2>
//             <p className="text-lg text-gray-600 leading-relaxed mb-6">
//               Welcome to <span className="text-blue-600 font-semibold">[Garage Name]</span>, your trusted partner in vehicle care and maintenance.
//               With over 10 years of experience, we are dedicated to delivering exceptional service
//               and ensuring the safety of every vehicle that enters our doors.
//             </p>
//             <p className="text-lg text-gray-600 leading-relaxed mb-6">
//               Our team of certified professionals specializes in a wide range of services, from
//               routine maintenance to advanced diagnostics and repairs. We pride ourselves on using
//               state-of-the-art equipment and high-quality tools to provide reliable solutions.
//             </p>
//             <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg transition">
//               Learn More
//             </button>
//           </motion.div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default About;
