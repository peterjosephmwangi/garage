// // "use client";
// // import React from "react";
// // import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
// // import "react-horizontal-scrolling-menu/dist/styles.css";
// // import {
// //   FaRegArrowAltCircleRight,
// //   FaRegArrowAltCircleLeft,
// // } from "react-icons/fa";

// // const BatteryReplacement = () => {
// //   // Battery options grouped by brand/supplier
// //   const suppliers = {
// //     "Brand X": [
// //       {
// //         id: 1,
// //         imgSrc: "/images/battery1.jpeg",
// //         title: "Standard Battery",
// //         description: "Reliable performance for everyday use.",
// //         price: "$100",
// //       },
// //       {
// //         id: 2,
// //         imgSrc: "/images/battery2.jpeg",
// //         title: "Premium Battery",
// //         description: "Extended lifespan with advanced technology.",
// //         price: "$150",
// //       },
// //       {
// //         id: 3,
// //         imgSrc: "/images/battery3.jpeg",
// //         title: "Eco-Friendly Battery",
// //         description: "Environmentally conscious and efficient.",
// //         price: "$120",
// //       },
// //       {
// //         id: 4,
// //         imgSrc: "/images/battery4.jpeg",
// //         title: "Heavy-Duty Battery",
// //         description: "Built for trucks and commercial vehicles.",
// //         price: "$200",
// //       },
// //     ],
// //     "Brand Y": [
// //       {
// //         id: 3,
// //         imgSrc: "/images/battery3.jpeg",
// //         title: "Eco-Friendly Battery",
// //         description: "Environmentally conscious and efficient.",
// //         price: "$120",
// //       },
// //       {
// //         id: 4,
// //         imgSrc: "/images/battery4.jpeg",
// //         title: "Heavy-Duty Battery",
// //         description: "Built for trucks and commercial vehicles.",
// //         price: "$200",
// //       },
// //     ],
// //   };

// //   const LeftArrow = () => {
// //     const { scrollPrev } = React.useContext(VisibilityContext);
// //     return (
// //       <button
// //         onClick={() => scrollPrev()}
// //         className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
// //       >
// //         <FaRegArrowAltCircleLeft />
// //       </button>
// //     );
// //   };

// //   const RightArrow = () => {
// //     const { scrollNext } = React.useContext(VisibilityContext);
// //     return (
// //       <button
// //         className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
// //         onClick={() => scrollNext()}
// //       >
// //         <FaRegArrowAltCircleRight />
// //       </button>
// //     );
// //   };

// //   return (
// //     <section className="bg-gray-50 min-h-screen py-12">
// //       <div className="container mx-auto px-6 md:px-12 lg:px-20">
// //         <div className="text-center mb-12">
// //           <h1 className="text-4xl font-bold text-gray-800">
// //             🔋 Battery Replacement
// //           </h1>
// //           <p className="mt-4 text-lg text-gray-600">
// //             Get back on the road with our quick and affordable battery
// //             replacement service.
// //           </p>
// //         </div>

// //         {/* Battery Services */}
// //         <div className="bg-white rounded-lg shadow-lg p-8">
// //           <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:mx-auto after:mt-2">
// //             Battery Replacement Services
// //           </h2>
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
// //             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
// //               <h3 className="text-xl font-bold text-gray-800 mb-4">
// //                 Standard Cars
// //               </h3>
// //               <p className="text-gray-600 mb-4">
// //                 Affordable batteries for compact and mid-size cars.
// //               </p>
// //               <p className="text-lg font-semibold text-blue-600 mb-4">
// //                 $80 - $120
// //               </p>
// //               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// //                 Book Now
// //               </button>
// //             </div>
// //             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
// //               <h3 className="text-xl font-bold text-gray-800 mb-4">
// //                 SUVs & Crossovers
// //               </h3>
// //               <p className="text-gray-600 mb-4">
// //                 High-performance batteries for versatile vehicles.
// //               </p>
// //               <p className="text-lg font-semibold text-blue-600 mb-4">
// //                 $120 - $180
// //               </p>
// //               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// //                 Book Now
// //               </button>
// //             </div>
// //             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
// //               <h3 className="text-xl font-bold text-gray-800 mb-4">
// //                 Trucks & Commercial Vehicles
// //               </h3>
// //               <p className="text-gray-600 mb-4">
// //                 Heavy-duty batteries for demanding applications.
// //               </p>
// //               <p className="text-lg font-semibold text-blue-600 mb-4">
// //                 $150 - $250
// //               </p>
// //               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// //                 Book Now
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Battery Products by Supplier */}
// //         {Object.entries(suppliers).map(([supplier, products]) => (
// //           <div
// //             key={supplier}
// //             className="bg-white rounded-lg shadow-lg p-8 mb-12"
// //           >
// //             <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
// //               {supplier}'s Battery Products
// //             </h2>
// //             <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
// //               {products.map((product) => (
// //                 <div
// //                   key={product?.id}
// //                   itemID={product?.id.toString()}
// //                   className="flex-shrink-0 w-72 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
// //                   style={{ marginRight: "16px" }}
// //                 >
// //                   <img
// //                     src={product?.imgSrc}
// //                     alt={product?.title}
// //                     className="mb-4 w-full h-48 object-contain rounded"
// //                   />
// //                   <h3 className="text-xl font-bold text-gray-800 mb-2">
// //                     {product?.title}
// //                   </h3>
// //                   <p className="text-gray-600 mb-4">{product?.description}</p>
// //                   <p className="text-lg font-semibold text-blue-600 mb-4">
// //                     {product?.price}
// //                   </p>
// //                   <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
// //                     Buy Now
// //                   </button>
// //                 </div>
// //               ))}
// //             </ScrollMenu>
// //           </div>
// //         ))}
// //       </div>
// //     </section>
// //   );
// // };

// // export default BatteryReplacement;


// "use client";

// import React, { useEffect, useState } from "react";
// import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
// import "react-horizontal-scrolling-menu/dist/styles.css";
// import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
// import { getServiceProducts } from "@/app/actions/getServiceProducts";
// import { ServiceProduct } from "@/app/lib/serviceTypes";
// import Link from "next/link";

// export default function BatteriesService() {
//   const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const products = await getServiceProducts("battery");
        
//         const grouped: Record<string, ServiceProduct[]> = {};
//         products.forEach((product) => {
//           const supplier = product.supplier || "Unknown Supplier";
//           if (!grouped[supplier]) grouped[supplier] = [];
//           grouped[supplier].push(product);
//         });
        
//         setSuppliers(grouped);
//       } catch (error) {
//         console.error("Error fetching battery products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const LeftArrow = () => {
//     const { scrollPrev } = React.useContext(VisibilityContext);
//     return (
//       <button
//         onClick={() => scrollPrev()}
//         className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
//       >
//         <FaRegArrowAltCircleLeft />
//       </button>
//     );
//   };

//   const RightArrow = () => {
//     const { scrollNext } = React.useContext(VisibilityContext);
//     return (
//       <button
//         className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
//         onClick={() => scrollNext()}
//       >
//         <FaRegArrowAltCircleRight />
//       </button>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-blue-50">
//         <div className="text-2xl text-blue-800">Loading battery products...</div>
//       </div>
//     );
//   }

//   return (
//     <section className="bg-blue-50 min-h-screen py-12">
//       <div className="container mx-auto px-6 md:px-12 lg:px-20">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-blue-800">
//             🔋 Battery Services & Replacement
//           </h1>
//           <p className="mt-4 text-lg text-blue-600">
//             Reliable power solutions to keep your vehicle running smoothly
//           </p>
//         </div>

//         {/* Vehicle Types and Charges */}
//         <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
//           <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-yellow-500 after:mx-auto after:mt-2">
//             Battery Services for Different Vehicles
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
//               <h3 className="text-xl font-bold text-blue-800 mb-4">
//                 Cars (Sedans, Hatchbacks)
//               </h3>
//               <p className="text-blue-600 mb-4">
//                 Standard battery replacement for everyday vehicles
//               </p>
//               <p className="text-lg font-semibold text-blue-700 mb-4">
//                 $80 - $120
//               </p>
//               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//             <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
//               <h3 className="text-xl font-bold text-blue-800 mb-4">
//                 SUVs & Crossovers
//               </h3>
//               <p className="text-blue-600 mb-4">
//                 High-capacity batteries for larger vehicles
//               </p>
//               <p className="text-lg font-semibold text-blue-700 mb-4">
//                 $100 - $150
//               </p>
//               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//             <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
//               <h3 className="text-xl font-bold text-blue-800 mb-4">
//                 Trucks & Commercial Vehicles
//               </h3>
//               <p className="text-blue-600 mb-4">
//                 Heavy-duty batteries for maximum power output
//               </p>
//               <p className="text-lg font-semibold text-blue-700 mb-4">
//                 $150 - $250
//               </p>
//               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//                 Book Now
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Dynamic Battery Products */}
//         {Object.entries(suppliers).map(([supplier, products]) => (
//           <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
//             <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-yellow-500 after:mx-auto after:mt-2">
//               {supplier}'s Battery Products
//             </h2>
//             <ScrollMenu 
//               LeftArrow={<LeftArrow />} 
//               RightArrow={<RightArrow />}
//             >
//               {products.map((product) => (
//                 <div 
//                   key={product.$id} 
//                   className="flex-shrink-0"
//                   style={{ marginRight: "16px" }}
//                 >
//                   <Link href={`/services/batteries/${product.$id}`} passHref>
//                     <div className="cursor-pointer w-72 border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-blue-50">
//                       <img
//                         src={product.imageUrl}
//                         alt={product.title}
//                         className="mb-4 w-full h-48 object-contain rounded"
//                       />
//                       <h3 className="text-xl font-bold text-blue-800 mb-2">
//                         {product.title}
//                       </h3>
//                       <p className="text-blue-600 mb-4 line-clamp-2">
//                         {product.description}
//                       </p>
//                       <p className="text-lg font-semibold text-blue-700 mb-4">
//                        Ksh {product.price}
//                       </p>
//                       <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
//                         View Details
//                       </button>
//                     </div>
//                   </Link>
//                 </div>
//               ))}
//             </ScrollMenu>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }


"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/lib/appwrite";
import { Query } from "appwrite";

// Appwrite configuration
const databaseId = "680716c20000a52ce526";
const collectionId = "6807175e00341dbc8fd5";

// Type definitions
interface AppwriteDocument {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  $databaseId?: string;
  $collectionId?: string;
  [key: string]: any;
}

interface BatteryProduct extends AppwriteDocument {
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageUrl?: string;
  serviceType: "batteries";
}


const ServiceDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [product, setProduct] = useState<BatteryProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;
    
        setProductId(id); // Store the ID in state

        const response = await databases.getDocument(
          databaseId,
          collectionId,
          id
        );

        const productData: BatteryProduct = {
          ...response,
          title: response.title || "",
          description: response.description || "",
          features: response.features || [],
          price: response.price || "",
          supplier: response.supplier || "",
          rating: response.rating || 0,
          reviews: response.reviews || 0,
          imageUrl: response.imageUrl || "",
          serviceType: "batteries"
        };

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching battery product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-yellow-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-yellow-800">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-yellow-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-600 mb-4">{error}</h2>
          <button
            onClick={() => router.push("/services/batteries")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Back to Battery Services
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-yellow-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-yellow-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.push("/services/batteries")}
            className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition"
          >
            Back to Battery Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <nav className="text-sm text-yellow-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/batteries")}
          >
            Battery Services
          </span>{" "}
          / <span className="text-yellow-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-72 object-contain border border-yellow-100"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-800 mb-4">
              {product.title}
            </h1>
            <p className="text-yellow-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-6 text-yellow-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-yellow-600 mb-2">
              Supplier: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-yellow-600 mb-2">
              Price:{" "}
              <span className="text-2xl text-yellow-800">Ksh {product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-yellow-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <button
              onClick={() => alert("Purchased Successfully!")}
              className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-lg transition w-full md:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>

        {product.supplier && productId && (
          <RelatedProducts
            currentProductId={productId}
            supplier={product.supplier}
          />
        )}
      </div>
    </div>
  );
};

interface RelatedProductsProps {
  currentProductId: string;
  supplier: string;
}

const RelatedProducts = ({
  currentProductId,
  supplier,
}: RelatedProductsProps) => {
  const [relatedProducts, setRelatedProducts] = useState<BatteryProduct[]>([]);
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

        const products: BatteryProduct[] = response.documents.map((doc) => ({
          ...doc,
          title: doc.title || "",
          description: doc.description || "",
          features: doc.features || [],
          price: doc.price || "",
          supplier: doc.supplier || "",
          rating: doc.rating || 0,
          reviews: doc.reviews || 0,
          imageUrl: doc.imageUrl || "",
          serviceType: "batteries",
        }));

        setRelatedProducts(products);
      } catch (err) {
        console.error("Error fetching related battery products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  if (loading)
    return (
      <div className="mt-16 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-500 mx-auto"></div>
        <p className="mt-2 text-yellow-600">Loading related products...</p>
      </div>
    );

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-yellow-800 mb-8 text-center">
        More from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.$id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-yellow-100"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-yellow-800 mb-2">
              {product.title}
            </h3>
            <p className="text-yellow-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-yellow-800 mt-4">
              Ksh {product.price}
            </p>
            <button
              onClick={() => router.push(`/services/batteries/${product.$id}`)}
              className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition w-full"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;