// "use client";

// import React from "react";
// import { useRouter } from "next/navigation";

// const EngineServiceDetailsPage = ({ params }: { params: { id: string } }) => {
//   const router = useRouter();
//   const { id } = params;

//   // Mock data for engine diagnostic tools (matching EngineDiagnostics products)
//   const diagnosticTools = [
//     {
//       id: "1",
//       imgSrc: "/images/diagnostic1.jpeg",
//       title: "OBD-II Scanner",
//       description:
//         "Quickly identify engine fault codes with precision. Ideal for quick engine checks and DIY diagnostics.",
//       features: [
//         "Reads and clears fault codes",
//         "Live engine data monitoring",
//         "Compatible with most OBD-II vehicles",
//         "Compact and user-friendly",
//       ],
//       price: "$120",
//       supplier: "Supplier A",
//       rating: 4.5,
//       reviews: 102,
//     },
//     {
//       id: "2",
//       imgSrc: "/images/diagnostic2.jpeg",
//       title: "Digital Compression Tester",
//       description:
//         "Accurately measure engine compression levels. Great for engine performance and leak detection.",
//       features: [
//         "Digital display for accurate readings",
//         "Compatible with gasoline engines",
//         "Multiple adapters included",
//         "Durable and portable",
//       ],
//       price: "$95",
//       supplier: "Supplier A",
//       rating: 4.2,
//       reviews: 76,
//     },
//     {
//       id: "3",
//       imgSrc: "/images/diagnostic3.jpeg",
//       title: "Engine Analyzer",
//       description:
//         "Advanced analysis for performance and fault detection. Trusted by mechanics and pros.",
//       features: [
//         "Comprehensive diagnostics suite",
//         "Multi-sensor integration",
//         "Graphical data visualization",
//         "Professional-grade tool",
//       ],
//       price: "$250",
//       supplier: "Supplier B",
//       rating: 4.8,
//       reviews: 128,
//     },
//     {
//       id: "4",
//       imgSrc: "/images/diagnostic4.jpeg",
//       title: "Vacuum Gauge Tester",
//       description:
//         "Diagnose air leaks and engine inefficiencies. Helps fine-tune your engine performance.",
//       features: [
//         "Accurate vacuum readings",
//         "Diagnoses intake leaks",
//         "Easy-to-read gauge",
//         "Essential for engine tuning",
//       ],
//       price: "$60",
//       supplier: "Supplier B",
//       rating: 4.0,
//       reviews: 53,
//     },
//   ];

//   const product = diagnosticTools.find((tool) => tool.id === id);

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
//         Product not found.
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-blue-50 py-12">
//       <div className="container mx-auto px-6 md:px-12 lg:px-20">
//         {/* Breadcrumb */}
//         <nav className="text-sm text-blue-600 mb-6">
//           <span
//             className="cursor-pointer hover:underline"
//             onClick={() => router.push("/services/engine")}
//           >
//             Engine Diagnostics
//           </span>{" "}
//           / <span className="text-blue-800">{product.title}</span>
//         </nav>

//         {/* Product Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
//           <div>
//             <img
//               src={product.imgSrc}
//               alt={product.title}
//               className="rounded-lg shadow-md w-full h-72 object-contain"
//             />
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-blue-800 mb-4">
//               {product.title}
//             </h1>
//             <p className="text-blue-600 mb-6">{product.description}</p>
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-blue-800 mb-2">
//                 Features:
//               </h3>
//               <ul className="list-disc pl-6 text-blue-600">
//                 {product.features.map((feature, index) => (
//                   <li key={index}>{feature}</li>
//                 ))}
//               </ul>
//             </div>
//             <p className="text-lg font-semibold text-blue-600 mb-2">
//               Price: {product.price}
//             </p>
//             <p className="text-blue-600 mb-4">Supplier: {product.supplier}</p>
//             <p className="text-blue-600 mb-4">
//               ⭐ {product.rating} / 5 ({product.reviews} reviews)
//             </p>
//             <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//               Buy Now
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EngineServiceDetailsPage;
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ScrollMenu,
  VisibilityContext,
} from "react-horizontal-scrolling-menu";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";
import "react-horizontal-scrolling-menu/dist/styles.css";

// Sample data
export const engineProducts = [
  {
    id: "1",
    imgSrc: "/images/diagnostic1.jpeg",
    title: "OBD-II Scanner",
    description: "Quickly identify engine fault codes with precision.",
    features: ["Compact design", "Reads multiple fault codes", "User-friendly interface"],
    price: "$120",
    supplier: "Supplier A",
    rating: 4.5,
    reviews: 74,
  },
  {
    id: "2",
    imgSrc: "/images/diagnostic2.jpeg",
    title: "Digital Compression Tester",
    description: "Accurately measure engine compression levels.",
    features: ["Digital display", "Quick-connect hose", "Multiple adapters included"],
    price: "$95",
    supplier: "Supplier A",
    rating: 4.2,
    reviews: 56,
  },
  {
    id: "3",
    imgSrc: "/images/diagnostic3.jpeg",
    title: "Engine Analyzer",
    description: "Advanced analysis for performance and fault detection.",
    features: ["Real-time data", "High-resolution display", "Wide compatibility"],
    price: "$250",
    supplier: "Supplier B",
    rating: 4.7,
    reviews: 92,
  },
];

const LeftArrow = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);
  return (
    <div className="flex items-center">
      <button
        onClick={scrollPrev}
        className="text-blue-500 text-3xl hover:text-blue-700 p-2"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    </div>
  );
};

const RightArrow = () => {
  const { scrollNext } = React.useContext(VisibilityContext);
  return (
    <div className="flex items-center">
      <button
        onClick={scrollNext}
        className="text-blue-500 text-3xl hover:text-blue-700 p-2"
      >
        <FaRegArrowAltCircleRight />
      </button>
    </div>
  );
};

const EngineServiceDetailsPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  const product = engineProducts.find((p) => p.id === id);
  const similarProducts = engineProducts.filter((p) => p.id !== id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-600 mb-6">
          <span
            onClick={() => router.push("/services/engine")}
            className="cursor-pointer hover:underline"
          >
            Engine Diagnostics
          </span>{" "}
          / <span className="text-blue-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8 mb-12">
          <div>
            <img
              src={product.imgSrc}
              alt={product.title}
              className="rounded-lg shadow-md w-full h-72 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              {product.title}
            </h1>
            <p className="text-blue-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold text-blue-700 mb-4">
              Price: {product.price}
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-6 text-blue-600">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-500">Supplier: {product.supplier}</p>
            <p className="text-sm text-gray-500">
              Rating: {product.rating} ★ ({product.reviews} reviews)
            </p>
            <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
              Buy Now
            </button>
          </div>
        </div>


        {/* Horizontal Scroll Section */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
              Similar Products
            </h2>
        <div className="relative">
          <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
            <div className="flex space-x-4">
              {similarProducts.map((item) => (
                <div
                  key={item.id}
                  itemID={item.id}
                  className="flex-shrink-0 w-72 border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    className="mb-4 w-full h-40 object-contain rounded"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <p className="text-blue-600 font-semibold mb-2">
                    {item.price}
                  </p>
                  <button
                    onClick={() => router.push(`/services/engine/${item.id}`)}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </ScrollMenu>
        </div>
      </div>
    </div>
  );
};

export default EngineServiceDetailsPage;
