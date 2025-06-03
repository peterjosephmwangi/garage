// // // "use client";

// // // import React from "react";
// // // import { useRouter } from "next/navigation";

// // // const EngineServiceDetailsPage = ({ params }: { params: { id: string } }) => {
// // //   const router = useRouter();
// // //   const { id } = params;

// // //   // Mock data for engine diagnostic tools (matching EngineDiagnostics products)
// // //   const diagnosticTools = [
// // //     {
// // //       id: "1",
// // //       imgSrc: "/images/diagnostic1.jpeg",
// // //       title: "OBD-II Scanner",
// // //       description:
// // //         "Quickly identify engine fault codes with precision. Ideal for quick engine checks and DIY diagnostics.",
// // //       features: [
// // //         "Reads and clears fault codes",
// // //         "Live engine data monitoring",
// // //         "Compatible with most OBD-II vehicles",
// // //         "Compact and user-friendly",
// // //       ],
// // //       price: "$120",
// // //       supplier: "Supplier A",
// // //       rating: 4.5,
// // //       reviews: 102,
// // //     },
// // //     {
// // //       id: "2",
// // //       imgSrc: "/images/diagnostic2.jpeg",
// // //       title: "Digital Compression Tester",
// // //       description:
// // //         "Accurately measure engine compression levels. Great for engine performance and leak detection.",
// // //       features: [
// // //         "Digital display for accurate readings",
// // //         "Compatible with gasoline engines",
// // //         "Multiple adapters included",
// // //         "Durable and portable",
// // //       ],
// // //       price: "$95",
// // //       supplier: "Supplier A",
// // //       rating: 4.2,
// // //       reviews: 76,
// // //     },
// // //     {
// // //       id: "3",
// // //       imgSrc: "/images/diagnostic3.jpeg",
// // //       title: "Engine Analyzer",
// // //       description:
// // //         "Advanced analysis for performance and fault detection. Trusted by mechanics and pros.",
// // //       features: [
// // //         "Comprehensive diagnostics suite",
// // //         "Multi-sensor integration",
// // //         "Graphical data visualization",
// // //         "Professional-grade tool",
// // //       ],
// // //       price: "$250",
// // //       supplier: "Supplier B",
// // //       rating: 4.8,
// // //       reviews: 128,
// // //     },
// // //     {
// // //       id: "4",
// // //       imgSrc: "/images/diagnostic4.jpeg",
// // //       title: "Vacuum Gauge Tester",
// // //       description:
// // //         "Diagnose air leaks and engine inefficiencies. Helps fine-tune your engine performance.",
// // //       features: [
// // //         "Accurate vacuum readings",
// // //         "Diagnoses intake leaks",
// // //         "Easy-to-read gauge",
// // //         "Essential for engine tuning",
// // //       ],
// // //       price: "$60",
// // //       supplier: "Supplier B",
// // //       rating: 4.0,
// // //       reviews: 53,
// // //     },
// // //   ];

// // //   const product = diagnosticTools.find((tool) => tool.id === id);

// // //   if (!product) {
// // //     return (
// // //       <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
// // //         Product not found.
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="min-h-screen bg-blue-50 py-12">
// // //       <div className="container mx-auto px-6 md:px-12 lg:px-20">
// // //         {/* Breadcrumb */}
// // //         <nav className="text-sm text-blue-600 mb-6">
// // //           <span
// // //             className="cursor-pointer hover:underline"
// // //             onClick={() => router.push("/services/engine")}
// // //           >
// // //             Engine Diagnostics
// // //           </span>{" "}
// // //           / <span className="text-blue-800">{product.title}</span>
// // //         </nav>

// // //         {/* Product Details */}
// // //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
// // //           <div>
// // //             <img
// // //               src={product.imgSrc}
// // //               alt={product.title}
// // //               className="rounded-lg shadow-md w-full h-72 object-contain"
// // //             />
// // //           </div>
// // //           <div>
// // //             <h1 className="text-3xl font-bold text-blue-800 mb-4">
// // //               {product.title}
// // //             </h1>
// // //             <p className="text-blue-600 mb-6">{product.description}</p>
// // //             <div className="mb-6">
// // //               <h3 className="text-lg font-semibold text-blue-800 mb-2">
// // //                 Features:
// // //               </h3>
// // //               <ul className="list-disc pl-6 text-blue-600">
// // //                 {product.features.map((feature, index) => (
// // //                   <li key={index}>{feature}</li>
// // //                 ))}
// // //               </ul>
// // //             </div>
// // //             <p className="text-lg font-semibold text-blue-600 mb-2">
// // //               Price: {product.price}
// // //             </p>
// // //             <p className="text-blue-600 mb-4">Supplier: {product.supplier}</p>
// // //             <p className="text-blue-600 mb-4">
// // //               ⭐ {product.rating} / 5 ({product.reviews} reviews)
// // //             </p>
// // //             <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// // //               Buy Now
// // //             </button>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default EngineServiceDetailsPage;
// // "use client";

// // import React from "react";
// // import { useRouter } from "next/navigation";
// // import {
// //   ScrollMenu,
// //   VisibilityContext,
// // } from "react-horizontal-scrolling-menu";
// // import {
// //   FaRegArrowAltCircleRight,
// //   FaRegArrowAltCircleLeft,
// // } from "react-icons/fa";
// // import "react-horizontal-scrolling-menu/dist/styles.css";

// // // Sample data
// // export const engineProducts = [
// //   {
// //     id: "1",
// //     imgSrc: "/images/diagnostic1.jpeg",
// //     title: "OBD-II Scanner",
// //     description: "Quickly identify engine fault codes with precision.",
// //     features: ["Compact design", "Reads multiple fault codes", "User-friendly interface"],
// //     price: "$120",
// //     supplier: "Supplier A",
// //     rating: 4.5,
// //     reviews: 74,
// //   },
// //   {
// //     id: "2",
// //     imgSrc: "/images/diagnostic2.jpeg",
// //     title: "Digital Compression Tester",
// //     description: "Accurately measure engine compression levels.",
// //     features: ["Digital display", "Quick-connect hose", "Multiple adapters included"],
// //     price: "$95",
// //     supplier: "Supplier A",
// //     rating: 4.2,
// //     reviews: 56,
// //   },
// //   {
// //     id: "3",
// //     imgSrc: "/images/diagnostic3.jpeg",
// //     title: "Engine Analyzer",
// //     description: "Advanced analysis for performance and fault detection.",
// //     features: ["Real-time data", "High-resolution display", "Wide compatibility"],
// //     price: "$250",
// //     supplier: "Supplier B",
// //     rating: 4.7,
// //     reviews: 92,
// //   },
// // ];

// // const LeftArrow = () => {
// //   const { scrollPrev } = React.useContext(VisibilityContext);
// //   return (
// //     <div className="flex items-center">
// //       <button
// //         onClick={scrollPrev}
// //         className="text-blue-500 text-3xl hover:text-blue-700 p-2"
// //       >
// //         <FaRegArrowAltCircleLeft />
// //       </button>
// //     </div>
// //   );
// // };

// // const RightArrow = () => {
// //   const { scrollNext } = React.useContext(VisibilityContext);
// //   return (
// //     <div className="flex items-center">
// //       <button
// //         onClick={scrollNext}
// //         className="text-blue-500 text-3xl hover:text-blue-700 p-2"
// //       >
// //         <FaRegArrowAltCircleRight />
// //       </button>
// //     </div>
// //   );
// // };

// // const EngineServiceDetailsPage = ({ params }) => {
// //   const router = useRouter();
// //   const { id } = params;

// //   const product = engineProducts.find((p) => p.id === id);
// //   const similarProducts = engineProducts.filter((p) => p.id !== id);

// //   if (!product) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
// //         Product not found.
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-blue-50 py-12">
// //       <div className="container mx-auto px-6 md:px-12 lg:px-20">
// //         {/* Breadcrumb */}
// //         <nav className="text-sm text-blue-600 mb-6">
// //           <span
// //             onClick={() => router.push("/services/engine")}
// //             className="cursor-pointer hover:underline"
// //           >
// //             Engine Diagnostics
// //           </span>{" "}
// //           / <span className="text-blue-800">{product.title}</span>
// //         </nav>

// //         {/* Product Details */}
// //         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8 mb-12">
// //           <div>
// //             <img
// //               src={product.imgSrc}
// //               alt={product.title}
// //               className="rounded-lg shadow-md w-full h-72 object-contain"
// //             />
// //           </div>
// //           <div>
// //             <h1 className="text-3xl font-bold text-blue-800 mb-4">
// //               {product.title}
// //             </h1>
// //             <p className="text-blue-600 mb-4">{product.description}</p>
// //             <p className="text-lg font-semibold text-blue-700 mb-4">
// //               Price: {product.price}
// //             </p>
// //             <div className="mb-4">
// //               <h3 className="text-lg font-semibold text-blue-800 mb-2">
// //                 Features:
// //               </h3>
// //               <ul className="list-disc pl-6 text-blue-600">
// //                 {product.features.map((feature, idx) => (
// //                   <li key={idx}>{feature}</li>
// //                 ))}
// //               </ul>
// //             </div>
// //             <p className="text-sm text-gray-500">Supplier: {product.supplier}</p>
// //             <p className="text-sm text-gray-500">
// //               Rating: {product.rating} ★ ({product.reviews} reviews)
// //             </p>
// //             <button className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// //               Buy Now
// //             </button>
// //           </div>
// //         </div>


// //         {/* Horizontal Scroll Section */}
// //         <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
// //               Similar Products
// //             </h2>
// //         <div className="relative">
// //           <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
// //             <div className="flex space-x-4">
// //               {similarProducts.map((item) => (
// //                 <div
// //                   key={item.id}
// //                   itemID={item.id}
// //                   className="flex-shrink-0 w-72 border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
// //                 >
// //                   <img
// //                     src={item.imgSrc}
// //                     alt={item.title}
// //                     className="mb-4 w-full h-40 object-contain rounded"
// //                   />
// //                   <h3 className="text-lg font-bold text-gray-800 mb-2">
// //                     {item.title}
// //                   </h3>
// //                   <p className="text-sm text-gray-600 mb-2">
// //                     {item.description}
// //                   </p>
// //                   <p className="text-blue-600 font-semibold mb-2">
// //                     {item.price}
// //                   </p>
// //                   <button
// //                     onClick={() => router.push(`/services/engine/${item.id}`)}
// //                     className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
// //                   >
// //                     View Details
// //                   </button>
// //                 </div>
// //               ))}
// //             </div>
// //           </ScrollMenu>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default EngineServiceDetailsPage;



// // app/(root)/services/engine/[id]/page.tsx

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { databases } from "@/app/lib/appwrite";
// import { Query } from "appwrite";
// import { ServiceProduct } from "@/app/lib/serviceTypes";

// // Engine service collection ID
// const databaseId = "680716c20000a52ce526";
// const collectionId = "68071a0a001a0a3b6d6d"; // Engine collection ID

// const ServiceDetailsPage = ({ params }: { params: { id: string } }) => {
//   const router = useRouter();
//   const [product, setProduct] = useState<ServiceProduct | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [productId, setProductId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { id } = params;
//         setProductId(id);
        
//         const response = await databases.getDocument(
//           databaseId,
//           collectionId,
//           id
//         );
        
//         const productData: ServiceProduct = {
//           $id: response.$id,
//           title: response.title || "",
//           description: response.description || "",
//           features: response.features || [],
//           price: response.price || "",
//           supplier: response.supplier || "",
//           rating: response.rating || 0,
//           reviews: response.reviews || 0,
//           imageUrl: response.imageUrl || "",
//           serviceType: "engine"
//         };
        
//         setProduct(productData);
//       } catch (err) {
//         console.error("Error fetching engine product:", err);
//         setError("Failed to load product details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [params]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-green-800">Loading product details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-green-600 mb-4">{error}</h2>
//           <button
//             onClick={() => router.push("/services/engine")}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Back to Engine Services
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-green-800 mb-4">
//             Product not found
//           </h2>
//           <button
//             onClick={() => router.push("/services/engine")}
//             className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
//           >
//             Back to Engine Services
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-green-50 py-12">
//       <div className="container mx-auto px-6 md:px-12 lg:px-20">
//         {/* Breadcrumb */}
//         <nav className="text-sm text-green-600 mb-6">
//           <span
//             className="cursor-pointer hover:underline"
//             onClick={() => router.push("/services/engine")}
//           >
//             Engine Services
//           </span>{" "}
//           / <span className="text-green-800">{product.title}</span>
//         </nav>

//         {/* Product Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
//           <div>
//             {product.imageUrl && (
//               <img
//                 src={product.imageUrl}
//                 alt={product.title}
//                 className="rounded-lg shadow-md w-full h-72 object-contain border border-green-100"
//               />
//             )}
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-green-800 mb-4">
//               {product.title}
//             </h1>
//             <p className="text-green-600 mb-6">{product.description}</p>
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-green-800 mb-2">
//                 Features:
//               </h3>
//               <ul className="list-disc pl-6 text-green-600">
//                 {product.features.map((feature, index) => (
//                   <li key={index}>{feature}</li>
//                 ))}
//               </ul>
//             </div>
//             <p className="text-lg font-semibold text-green-600 mb-2">
//               Supplier: <span className="font-bold">{product.supplier}</span>
//             </p>
//             <p className="text-lg font-semibold text-green-600 mb-2">
//               Price:{" "}
//               <span className="text-2xl text-green-800">Ksh {product.price}</span>
//             </p>
//             <div className="flex items-center gap-4 mb-6">
//               <div className="text-yellow-500 text-lg">
//                 {"★".repeat(Math.floor(product.rating)) +
//                   (product.rating % 1 > 0 ? "☆" : "")}
//               </div>
//               <span className="text-green-600">
//                 {product?.rating} ({product.reviews} reviews)
//               </span>
//             </div>
//             <button
//               onClick={() => alert("Purchased Successfully!")}
//               className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition w-full md:w-auto"
//             >
//               Buy Now
//             </button>
//           </div>
//         </div>

//         {/* Related Products Section */}
//         {product.supplier && productId && (
//           <RelatedProducts 
//             currentProductId={productId} 
//             supplier={product.supplier} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// const RelatedProducts = ({
//   currentProductId,
//   supplier,
// }: {
//   currentProductId: string;
//   supplier: string;
// }) => {
//   const [relatedProducts, setRelatedProducts] = useState<ServiceProduct[]>([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRelatedProducts = async () => {
//       try {
//         const response = await databases.listDocuments(databaseId, collectionId, [
//           Query.equal("supplier", supplier),
//           Query.notEqual("$id", currentProductId),
//           Query.limit(3),
//         ]);
        
//         const products: ServiceProduct[] = response.documents.map(doc => ({
//           $id: doc.$id,
//           title: doc.title || "",
//           description: doc.description || "",
//           features: doc.features || [],
//           price: doc.price || "",
//           supplier: doc.supplier || "",
//           rating: doc.rating || 0,
//           reviews: doc.reviews || 0,
//           imageUrl: doc.imageUrl || "",
//           serviceType: "engine"
//         }));
        
//         setRelatedProducts(products);
//       } catch (err) {
//         console.error("Error fetching related engine products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRelatedProducts();
//   }, [currentProductId, supplier]);

//   if (loading) return (
//     <div className="mt-16 text-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
//       <p className="mt-2 text-green-600">Loading related products...</p>
//     </div>
//   );
  
//   if (relatedProducts.length === 0) return null;

//   return (
//     <div className="mt-16">
//       <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
//         More from {supplier}
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {relatedProducts.map((product) => (
//           <div
//             key={product.$id}
//             className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-green-100"
//           >
//             {product.imageUrl && (
//               <img
//                 src={product.imageUrl}
//                 alt={product.title}
//                 className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
//               />
//             )}
//             <h3 className="text-xl font-bold text-green-800 mb-2">
//               {product.title}
//             </h3>
//             <p className="text-green-600 line-clamp-2">{product.description}</p>
//             <p className="text-lg font-semibold text-green-800 mt-4">
//             Ksh  {product.price}
//             </p>
//             <button
//               onClick={() => router.push(`/services/engine/${product.$id}`)}
//               className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition w-full"
//             >
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ServiceDetailsPage;
// app/(root)/services/engine/[id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/lib/appwrite";
import { Query } from "appwrite";
import { ServiceProduct } from "@/app/lib/serviceTypes";

// Engine service collection ID
const databaseId = "680716c20000a52ce526";
const collectionId = "68071783002d63cc1dc2"; // Engine collection ID (different from brakes)

const EngineServiceDetails = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const [product, setProduct] = useState<ServiceProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { id } = params;
        setProductId(id);
        
        const response = await databases.getDocument(
          databaseId,
          collectionId,
          id
        );
        
        // Map to ServiceProduct type
        const productData: ServiceProduct = {
          $id: response.$id,
          title: response.title || "",
          description: response.description || "",
          features: response.features || [],
          price: response.price || "",
          supplier: response.supplier || "",
          rating: response.rating || 0,
          reviews: response.reviews || 0,
          imageUrl: response.imageUrl || "",
          serviceType: "engine"
        };
        
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching engine product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-orange-800">Loading engine product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-orange-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">{error}</h2>
          <button
            onClick={() => router.push("/services/engine")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Back to Engine Services
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-orange-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-orange-800 mb-4">
            Engine product not found
          </h2>
          <button
            onClick={() => router.push("/services/engine")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Back to Engine Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-orange-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/engine")}
          >
            Engine Services
          </span>{" "}
          / <span className="text-orange-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-72 object-contain border border-orange-100"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-orange-800 mb-4">
              {product.title}
            </h1>
            <p className="text-orange-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">
                Key Features:
              </h3>
              <ul className="list-disc pl-6 text-orange-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-orange-600 mb-2">
              Manufacturer: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-orange-600 mb-2">
              Price:{" "}
              <span className="text-2xl text-orange-800">Ksh {product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-orange-600">
                {product?.rating} ({product.reviews} reviews)
              </span>
            </div>
            <button
              onClick={() => alert("Purchased Successfully!")}
              className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition w-full md:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        {product.supplier && productId && (
          <RelatedEngineProducts 
            currentProductId={productId} 
            supplier={product.supplier} 
          />
        )}
      </div>
    </div>
  );
};

const RelatedEngineProducts = ({
  currentProductId,
  supplier,
}: {
  currentProductId: string;
  supplier: string;
}) => {
  const [relatedProducts, setRelatedProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("supplier", supplier),
          Query.notEqual("$id", currentProductId),
          Query.limit(3),
        ]);
        
        // Map to ServiceProduct type
        const products: ServiceProduct[] = response.documents.map(doc => ({
          $id: doc.$id,
          title: doc.title || "",
          description: doc.description || "",
          features: doc.features || [],
          price: doc.price || "",
          supplier: doc.supplier || "",
          rating: doc.rating || 0,
          reviews: doc.reviews || 0,
          imageUrl: doc.imageUrl || "",
          serviceType: "engine"
        }));
        
        setRelatedProducts(products);
      } catch (err) {
        console.error("Error fetching related engine products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  if (loading) return (
    <div className="mt-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500 mx-auto"></div>
      <p className="mt-2 text-orange-600">Loading related engine products...</p>
    </div>
  );
  
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-orange-800 mb-8 text-center">
        More Engine Products from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.$id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-orange-100"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-orange-800 mb-2">
              {product.title}
            </h3>
            <p className="text-orange-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-orange-800 mt-4">
            Ksh  {product.price}
            </p>
            <button
              onClick={() => router.push(`/services/engine/${product.$id}`)}
              className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition w-full"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EngineServiceDetails;