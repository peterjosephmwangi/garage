"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/lib/appwrite";
import { Query } from "appwrite";
import { ServiceProduct } from "@/app/lib/types";
import { useCartStore } from "@/app/lib/store/cartStore";
import { ShoppingCart, Check } from "lucide-react";

// Tires service collection ID
const databaseId = "680716c20000a52ce526";
const collectionId = "680718020033cfadcb44"; // Tires collection ID

interface TireDetailsProps {
  params: Promise<{ id: string }>;
}

const TireDetails: React.FC<TireDetailsProps> = ({ params }) => {
  const router = useRouter();
  const { addItem, getItemById } = useCartStore();
  const [product, setProduct] = useState<ServiceProduct | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        // Unwrap the params promise
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        setProductId(id); // Store the ID in state
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
          rating: response.rating ?? 0,
          reviews: response.reviews ?? 0,
          imageUrl: response.imageUrl || "",
          serviceType: "tires"
        };

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching tire product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  // Check if item is in cart
  useEffect(() => {
    if (productId) {
      const cartItem = getItemById(productId);
      setAddedToCart(!!cartItem);
    }
  }, [productId, getItemById]);

  const handleAddToCart = () => {
    if (!product) return;

    addItem({
      $id: product.$id,
      title: product.title,
      description: product.description,
      price: product.price,
      supplier: product.supplier,
      imageUrl: product.imageUrl,
      serviceType: product.serviceType,
      features: product.features,
      rating: product.rating,
      reviews: product.reviews,
    });

    setAddedToCart(true);

    // Show confirmation for 2 seconds
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleBookService = () => {
    // Add to cart first
    if (product && !getItemById(product.$id)) {
      handleAddToCart();
    }

    // Then proceed to booking
    alert("Redirecting to booking page...");
    // router.push(`/booking?serviceId=${productId}&type=tires`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-800">Loading tire details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{error}</h2>
          <button
            onClick={() => router.push("/services/tires")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Tire Services
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            Tire product not found
          </h2>
          <button
            onClick={() => router.push("/services/tires")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Tire Services
          </button>
        </div>
      </div>
    );
  }

  const isInCart = getItemById(product.$id);

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/tires")}
          >
            Tire Services
          </span>{" "}
          / <span className="text-blue-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center">
            {product.imageUrl && (
              <div className="w-full h-80 bg-gray-50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                />
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              {product.title}
            </h1>
            <p className="text-blue-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Key Features:
              </h3>
              <ul className="list-disc pl-6 text-blue-600">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))
                ) : (
                  <li>No features available</li>
                )}
              </ul>
            </div>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Brand: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Price per tire:{" "}
              <span className="text-2xl text-blue-800">Ksh {product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {product.rating !== undefined
                  ? "★".repeat(Math.floor(product.rating)) +
                    (product.rating % 1 > 0 ? "☆" : "")
                  : "No rating"}
              </div>
              <span className="text-blue-600">
                {product.rating !== undefined ? product.rating : "N/A"} (
                {product.reviews !== undefined ? product.reviews : 0} reviews)
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={handleAddToCart}
                disabled={addedToCart}
                className={`px-6 py-3 font-bold rounded-lg transition flex-1 min-w-[150px] flex items-center justify-center gap-2 ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : isInCart
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} />
                    Added to Cart!
                  </>
                ) : isInCart ? (
                  <>
                    <ShoppingCart size={20} />
                    In Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    Add to Cart
                  </>
                )}
              </button>
              <button
                onClick={handleBookService}
                className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition flex-1 min-w-[150px]"
              >
                Book Installation
              </button>
            </div>
          </div>
        </div>

        {/* Tire Specifications */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-blue-800 mb-6">
            Tire Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                Performance:
              </h3>
              <ul className="list-disc pl-6 text-blue-600 space-y-2">
                <li>All-season performance</li>
                <li>Wet and dry traction rating: AA</li>
                <li>Temperature rating: A</li>
                <li>Treadwear warranty: 60,000 miles</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-700 mb-3">
                Dimensions:
              </h3>
              <ul className="list-disc pl-6 text-blue-600 space-y-2">
                <li>Size: 225/45R17</li>
                <li>Load index: 94 (1477 lbs)</li>
                <li>Speed rating: V (149 mph)</li>
                <li>Tread depth: 10/32"</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.supplier && productId && (
          <RelatedTireProducts
            currentProductId={productId}
            supplier={product.supplier}
          />
        )}
      </div>
    </div>
  );
};

interface RelatedTireProductsProps {
  currentProductId: string;
  supplier: string;
}

const RelatedTireProducts: React.FC<RelatedTireProductsProps> = ({
  currentProductId,
  supplier,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<ServiceProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { addItem, getItemById } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedProducts = async (): Promise<void> => {
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
          rating: doc.rating ?? 0,
          reviews: doc.reviews ?? 0,
          imageUrl: doc.imageUrl || "",
          serviceType: "tires"
        }));

        setRelatedProducts(products);
      } catch (err) {
        console.error("Error fetching related tire products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  const handleQuickAddToCart = (product: ServiceProduct, event: React.MouseEvent) => {
    event.stopPropagation();

    addItem({
      $id: product.$id,
      title: product.title,
      description: product.description,
      price: product.price,
      supplier: product.supplier,
      imageUrl: product.imageUrl,
      serviceType: product.serviceType,
      features: product.features,
      rating: product.rating,
      reviews: product.reviews,
    });
  };

  if (loading) return (
    <div className="mt-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
      <p className="mt-2 text-blue-600">Loading related tire products...</p>
    </div>
  );

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        More Tires from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => {
          const isInCart = getItemById(product.$id);

          return (
            <div
              key={product.$id}
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-blue-100"
            >
              {product.imageUrl && (
                <div className="w-full h-48 bg-gray-50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden mb-4">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-md"
                  />
                </div>
              )}
              <h3 className="text-xl font-bold text-blue-800 mb-2">
                {product.title}
              </h3>
              <p className="text-blue-600 line-clamp-2">{product.description}</p>
              <p className="text-lg font-semibold text-blue-800 mt-4">
                Ksh {product.price}
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => router.push(`/services/tires/${product.$id}`)}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  View Details
                </button>
                <button
                  onClick={(e) => handleQuickAddToCart(product, e)}
                  disabled={!!isInCart}
                  className={`px-4 py-2 rounded-lg transition flex items-center justify-center ${
                    isInCart
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                  title={isInCart ? "Already in cart" : "Add to cart"}
                >
                  {isInCart ? <Check size={20} /> : <ShoppingCart size={20} />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TireDetails;

// // app/(root)/services/tires/[id]/page.tsx

// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { databases } from "@/app/lib/appwrite";
// import { Query } from "appwrite";
// // import { ServiceProduct } from "@/app/lib/serviceTypes";
// import { ServiceProduct } from "@/app/lib/types"; // Update this import


// // Tires service collection ID
// const databaseId = "680716c20000a52ce526";
// const collectionId = "680718020033cfadcb44"; // Tires collection ID

// interface TireDetailsProps {
//   params: Promise<{ id: string }>;
// }

// const TireDetails: React.FC<TireDetailsProps> = ({ params }) => {
//   const router = useRouter();
//   const [product, setProduct] = useState<ServiceProduct | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string | null>(null);
//   const [productId, setProductId] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async (): Promise<void> => {
//       try {
//         // Unwrap the params promise
//         const resolvedParams = await Promise.resolve(params);
//         const { id } = resolvedParams;
    
//         setProductId(id); // Store the ID in state
        
//         const response = await databases.getDocument(
//           databaseId,
//           collectionId,
//           id
//         );
        
//         // Map to ServiceProduct type
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
//           serviceType: "tires"
//         };
        
//         setProduct(productData);
//       } catch (err) {
//         console.error("Error fetching tire product:", err);
//         setError("Failed to load product details");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [params]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//           <p className="mt-4 text-blue-800">Loading tire details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-blue-600 mb-4">{error}</h2>
//           <button
//             onClick={() => router.push("/services/tires")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Back to Tire Services
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg">
//           <h2 className="text-2xl font-bold text-blue-800 mb-4">
//             Tire product not found
//           </h2>
//           <button
//             onClick={() => router.push("/services/tires")}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Back to Tire Services
//           </button>
//         </div>
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
//             onClick={() => router.push("/services/tires")}
//           >
//             Tire Services
//           </span>{" "}
//           / <span className="text-blue-800">{product.title}</span>
//         </nav>

//         {/* Product Details */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
//           <div className="flex items-center justify-center">
//             {product.imageUrl && (
//               <div className="w-full h-80 bg-gray-50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-md"
//                 />
//               </div>
//             )}
//           </div>
//           <div>
//             <h1 className="text-3xl font-bold text-blue-800 mb-4">
//               {product.title}
//             </h1>
//             <p className="text-blue-600 mb-6">{product.description}</p>
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold text-blue-800 mb-2">
//                 Key Features:
//               </h3>
//               <ul className="list-disc pl-6 text-blue-600">
//   {product.features && product.features.length > 0 ? (
//     product.features.map((feature, index) => (
//       <li key={index}>{feature}</li>
//     ))
//   ) : (
//     <li>No features available</li>
//   )}
// </ul>
//             </div>
//             <p className="text-lg font-semibold text-blue-600 mb-2">
//               Brand: <span className="font-bold">{product.supplier}</span>
//             </p>
//             <p className="text-lg font-semibold text-blue-600 mb-2">
//               Price per tire:{" "}
//               <span className="text-2xl text-blue-800">Ksh {product.price}</span>
//             </p>
//             {/* <div className="flex items-center gap-4 mb-6">
//               <div className="text-yellow-500 text-lg">
//                 {"★".repeat(Math.floor(product.rating)) +
//                   (product.rating % 1 > 0 ? "☆" : "")}
//               </div>
//               <span className="text-blue-600">
//                 {product.rating} ({product.reviews} reviews)
//               </span>
//             </div> */}
//             <div className="flex items-center gap-4 mb-6">
//   <div className="text-yellow-500 text-lg">
//     {product.rating !== undefined
//       ? "★".repeat(Math.floor(product.rating)) +
//         (product.rating % 1 > 0 ? "☆" : "")
//       : "No rating"}
//   </div>
//   <span className="text-blue-600">
//     {product.rating !== undefined ? product.rating : "N/A"} (
//     {product.reviews !== undefined ? product.reviews : 0} reviews)
//   </span>
// </div>
//             <div className="flex flex-wrap gap-4">
//               <button
//                 onClick={() => alert("Added to cart!")}
//                 className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex-1 min-w-[150px]"
//               >
//                 Add to Cart
//               </button>
//               <button
//                 onClick={() => alert("Booked installation service!")}
//                 className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition flex-1 min-w-[150px]"
//               >
//                 Book Installation
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Tire Specifications */}
//         <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
//           <h2 className="text-2xl font-bold text-blue-800 mb-6">
//             Tire Specifications
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div>
//               <h3 className="text-lg font-semibold text-blue-700 mb-3">
//                 Performance:
//               </h3>
//               <ul className="list-disc pl-6 text-blue-600 space-y-2">
//                 <li>All-season performance</li>
//                 <li>Wet and dry traction rating: AA</li>
//                 <li>Temperature rating: A</li>
//                 <li>Treadwear warranty: 60,000 miles</li>
//               </ul>
//             </div>
//             <div>
//               <h3 className="text-lg font-semibold text-blue-700 mb-3">
//                 Dimensions:
//               </h3>
//               <ul className="list-disc pl-6 text-blue-600 space-y-2">
//                 <li>Size: 225/45R17</li>
//                 <li>Load index: 94 (1477 lbs)</li>
//                 <li>Speed rating: V (149 mph)</li>
//                 <li>Tread depth: 10/32"</li>
//               </ul>
//             </div>
//           </div>
//         </div>

//         {/* Related Products Section */}
//         {product.supplier && productId && (
//           <RelatedTireProducts 
//             currentProductId={productId} 
//             supplier={product.supplier} 
//           />
//         )}
//       </div>
//     </div>
//   );
// };

// interface RelatedTireProductsProps {
//   currentProductId: string;
//   supplier: string;
// }

// const RelatedTireProducts: React.FC<RelatedTireProductsProps> = ({
//   currentProductId,
//   supplier,
// }) => {
//   const [relatedProducts, setRelatedProducts] = useState<ServiceProduct[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchRelatedProducts = async (): Promise<void> => {
//       try {
//         const response = await databases.listDocuments(databaseId, collectionId, [
//           Query.equal("supplier", supplier),
//           Query.notEqual("$id", currentProductId),
//           Query.limit(3),
//         ]);
        
//         // Map to ServiceProduct type
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
//           serviceType: "tires"
//         }));
        
//         setRelatedProducts(products);
//       } catch (err) {
//         console.error("Error fetching related tire products:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRelatedProducts();
//   }, [currentProductId, supplier]);

//   if (loading) return (
//     <div className="mt-16 text-center">
//       <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//       <p className="mt-2 text-blue-600">Loading related tire products...</p>
//     </div>
//   );
  
//   if (relatedProducts.length === 0) return null;

//   return (
//     <div className="mt-16">
//       <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
//         More Tires from {supplier}
//       </h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//         {relatedProducts.map((product) => (
//           <div
//             key={product.$id}
//             className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-blue-100"
//           >
//             {product.imageUrl && (
//               <div className="w-full h-48 bg-gray-50 rounded-lg border border-blue-100 flex items-center justify-center overflow-hidden mb-4">
//                 <img
//                   src={product.imageUrl}
//                   alt={product.title}
//                   className="max-w-full max-h-full object-contain rounded-lg shadow-md"
//                 />
//               </div>
//             )}
//             <h3 className="text-xl font-bold text-blue-800 mb-2">
//               {product.title}
//             </h3>
//             <p className="text-blue-600 line-clamp-2">{product.description}</p>
//             <p className="text-lg font-semibold text-blue-800 mt-4">
//               Ksh {product.price}
//             </p>
//             <button
//               onClick={() => router.push(`/services/tires/${product.$id}`)}
//               className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full"
//             >
//               View Details
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default TireDetails;