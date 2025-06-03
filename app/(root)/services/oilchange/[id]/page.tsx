// app/(root)/services/oilchange/[id]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/lib/appwrite";
import { Query } from "appwrite";
import { ServiceProduct } from "@/app/lib/serviceTypes";

// Oil Change service collection ID
const databaseId = "680716c20000a52ce526";
const collectionId = "6807173c001ede4b2686"; // Oil Change collection ID

const OilChangeDetails = ({ params }: { params: { id: string } }) => {
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
          serviceType: "oilchange"
        };
        
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching oil change product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading oil change details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-600 mb-4">{error}</h2>
          <button
            onClick={() => router.push("/services/oilchange")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Oil Change Services
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-green-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-green-800 mb-4">
            Oil change product not found
          </h2>
          <button
            onClick={() => router.push("/services/oilchange")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to Oil Change Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-green-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/oilchange")}
          >
            Oil Change Services
          </span>{" "}
          / <span className="text-green-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-72 object-contain border border-green-100"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-4">
              {product.title}
            </h1>
            <p className="text-green-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                Key Benefits:
              </h3>
              <ul className="list-disc pl-6 text-green-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-green-600 mb-2">
              Supplier: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-green-600 mb-2">
              Price:{" "}
              <span className="text-2xl text-green-800">Ksh {product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-green-600">
                {product?.rating} ({product.reviews} reviews)
              </span>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => alert("Added to cart!")}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition flex-1 min-w-[150px]"
              >
                Add to Cart
              </button>
              <button
                onClick={() => alert("Booked successfully!")}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-lg transition flex-1 min-w-[150px]"
              >
                Book Service
              </button>
            </div>
          </div>
        </div>

        {/* Service Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-2xl font-bold text-green-800 mb-6">
            Service Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                What's Included:
              </h3>
              <ul className="list-disc pl-6 text-green-600 space-y-2">
                <li>Full synthetic oil change</li>
                <li>Premium oil filter replacement</li>
                <li>Multi-point vehicle inspection</li>
                <li>Fluid level top-off</li>
                <li>Tire pressure check and adjustment</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Service Duration:
              </h3>
              <p className="text-green-600 mb-4">Approximately 30 minutes</p>
              
              <h3 className="text-lg font-semibold text-green-700 mb-3">
                Warranty:
              </h3>
              <p className="text-green-600">12 months / 12,000 miles</p>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.supplier && productId && (
          <RelatedOilProducts 
            currentProductId={productId} 
            supplier={product.supplier} 
          />
        )}
      </div>
    </div>
  );
};

const RelatedOilProducts = ({
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
          serviceType: "oilchange"
        }));
        
        setRelatedProducts(products);
      } catch (err) {
        console.error("Error fetching related oil products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  if (loading) return (
    <div className="mt-16 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500 mx-auto"></div>
      <p className="mt-2 text-green-600">Loading related oil products...</p>
    </div>
  );
  
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-green-800 mb-8 text-center">
        More Oil Products from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.$id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-green-100"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-green-800 mb-2">
              {product.title}
            </h3>
            <p className="text-green-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-green-800 mt-4">
            Ksh  {product.price}
            </p>
            <button
              onClick={() => router.push(`/services/oilchange/${product.$id}`)}
              className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition w-full"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OilChangeDetails;