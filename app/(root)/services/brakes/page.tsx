// "use client";

// import React, { useEffect, useState } from "react";
// import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
// import "react-horizontal-scrolling-menu/dist/styles.css";
// import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
// import { getServiceProducts } from "@/app/actions/getServiceProducts";
// import { ServiceType, ServiceProduct } from "../../../lib/serviceTypes";
// import Link from "next/link";

// const serviceConfig = {
//   title: "🛑 Brake Repair & Maintenance",
//   tagline: "Ensure your safety with our professional brake services.",
//   options: [
//     {
//       vehicleType: "Cars (Sedans, Hatchbacks)",
//       description: "Complete brake inspection and repair services.",
//       priceRange: "$80 - $150",
//     },
//     {
//       vehicleType: "SUVs & Crossovers",
//       description: "Brake system maintenance for larger vehicles.",
//       priceRange: "$120 - $200",
//     },
//     {
//       vehicleType: "Trucks & Commercial Vehicles",
//       description: "Heavy-duty brake services for maximum safety.",
//       priceRange: "$150 - $300",
//     },
//   ],
// };

// const BrakesService = () => {
//   const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const products = await getServiceProducts("brakes");
        
//         const grouped: Record<string, ServiceProduct[]> = {};
//         products.forEach((product) => {
//           const supplier = product.supplier || "Unknown Supplier";
//           if (!grouped[supplier]) grouped[supplier] = [];
//           grouped[supplier].push(product);
//         });
        
//         setSuppliers(grouped);
//       } catch (error) {
//         console.error("Error fetching brake products:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   const LeftArrow = () => {
//     const { scrollPrev } = React.useContext(VisibilityContext);
//     return (
//       <button
//         onClick={() => scrollPrev()}
//         className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
//       >
//         <FaRegArrowAltCircleLeft />
//       </button>
//     );
//   };

//   const RightArrow = () => {
//     const { scrollNext } = React.useContext(VisibilityContext);
//     return (
//       <button
//         className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
//         onClick={() => scrollNext()}
//       >
//         <FaRegArrowAltCircleRight />
//       </button>
//     );
//   };

//   return (
//     <section className="bg-red-50 min-h-screen py-12">
//         <div className="container mx-auto px-6 md:px-12 lg:px-20">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-red-800">
//             🛑 Brake Repair Service
//           </h1>
//           <p className="mt-4 text-lg text-red-600">
//             Ensure your safety with top-notch brake repair services.
//           </p>
//         </div>

//         {/* Vehicle Types and Charges */}
//         <div className="bg-white rounded-lg shadow-lg p-8">
//           <h2 className="text-3xl font-extrabold text-red-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-red-700 after:mx-auto after:mt-2">
//             Brake Services for Different Vehicles
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
//               <h3 className="text-xl font-bold text-red-800 mb-4">
//                 Cars (Sedans, Hatchbacks)
//               </h3>
//               <p className="text-red-600 mb-4">
//                 Premium brake services for daily commutes and city driving.
//               </p>
//               <p className="text-lg font-semibold text-red-700 mb-4">
//                 $100 - $150
//               </p>
//               <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//             <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
//               <h3 className="text-xl font-bold text-red-800 mb-4">
//                 SUVs & Crossovers
//               </h3>
//               <p className="text-red-600 mb-4">
//                 Advanced brake repair services for rugged and heavy vehicles.
//               </p>
//               <p className="text-lg font-semibold text-red-700 mb-4">
//                 $150 - $200
//               </p>
//               <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//             <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
//               <h3 className="text-xl font-bold text-red-800 mb-4">
//                 Trucks & Commercial Vehicles
//               </h3>
//               <p className="text-red-600 mb-4">
//                 Heavy-duty brake services for enhanced safety and performance.
//               </p>
//               <p className="text-lg font-semibold text-red-700 mb-4">
//                 $200 - $300
//               </p>
//               <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {Object.entries(suppliers).map(([supplier, products]) => (
//           <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
//             <h2 className="text-3xl font-extrabold text-red-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-red-700 after:mx-auto after:mt-2">
//               {supplier}'s Brake Products
//             </h2>
//             <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
//               {products.map((product) => (
//                 <Link
//                   key={product.$id}
//                   href={`/services/brakes/${product.$id}`}
//                   passHref
//                 >
//                   <div
//                     className="cursor-pointer flex-shrink-0 w-72 border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-red-50"
//                     style={{ marginRight: "16px" }}
//                   >
//                     <img
//                       src={product.imageUrl}
//                       alt={product.title}
//                       className="mb-4 w-full h-48 object-contain rounded"
//                     />
//                     <h3 className="text-xl font-bold text-red-800 mb-2">
//                       {product.title}
//                     </h3>
//                     <p className="text-red-600 mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                     <p className="text-lg font-semibold text-red-700 mb-4">
//                       {product.price}
//                     </p>
//                     <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
//                       View Details
//                     </button>
//                   </div>
//                 </Link>
//               ))}
//             </ScrollMenu>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default BrakesService;





"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import { ServiceProduct } from "@/app/lib/serviceTypes";
import Link from "next/link";

const BrakesService = () => {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await getServiceProducts("brakes");
        
        const grouped: Record<string, ServiceProduct[]> = {};
        products.forEach((product) => {
          const supplier = product.supplier || "Unknown Supplier";
          if (!grouped[supplier]) grouped[supplier] = [];
          grouped[supplier].push(product);
        });
        
        setSuppliers(grouped);
      } catch (error) {
        console.error("Error fetching brake products:", error);
      }
    };

    fetchData();
  }, []);

  const LeftArrow = () => {
    const { scrollPrev } = React.useContext(VisibilityContext);
    return (
      <button
        onClick={() => scrollPrev()}
        className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    );
  };

  const RightArrow = () => {
    const { scrollNext } = React.useContext(VisibilityContext);
    return (
      <button
        className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
        onClick={() => scrollNext()}
      >
        <FaRegArrowAltCircleRight />
      </button>
    );
  };

  return (
    <section className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800">
            🛑 Brake Repair & Maintenance
          </h1>
          <p className="mt-4 text-lg text-red-600">
            Ensure your safety with our professional brake services.
          </p>
        </div>

        {/* Vehicle Types and Charges */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-red-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-red-700 after:mx-auto after:mt-2">
            Brake Services for Different Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                Cars (Sedans, Hatchbacks)
              </h3>
              <p className="text-red-600 mb-4">
                Premium brake services for daily commutes and city driving.
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $100 - $150
              </p>
              <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                SUVs & Crossovers
              </h3>
              <p className="text-red-600 mb-4">
                Advanced brake repair services for rugged and heavy vehicles.
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $150 - $200
              </p>
              <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                Trucks & Commercial Vehicles
              </h3>
              <p className="text-red-600 mb-4">
                Heavy-duty brake services for enhanced safety and performance.
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $200 - $300
              </p>
              <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Brake Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-red-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-red-700 after:mx-auto after:mt-2">
              {supplier}'s Brake Products
            </h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {products.map((product) => (
                <Link
                  key={product.$id}
                  href={`/services/brakes/${product.$id}`}
                  passHref
                >
                  <div
                    className="cursor-pointer flex-shrink-0 w-72 border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-red-50"
                    style={{ marginRight: "16px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="mb-4 w-full h-48 object-contain rounded"
                    />
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-red-600 mb-4 line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-semibold text-red-700 mb-4">
                     Ksh {product.price}
                    </p>
                    <button className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg transition">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </ScrollMenu>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BrakesService;