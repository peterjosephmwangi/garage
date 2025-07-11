// app/(root)/services/batteries/[id]/page.tsx
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

interface ServiceDetailsPageProps {
  params: Promise<{ id: string }>;
}

const ServiceDetailsPage: React.FC<ServiceDetailsPageProps> = ({ params }) => {
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
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-800">Loading product details...</p>
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
            onClick={() => router.push("/services/batteries")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Battery Services
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
            Product not found
          </h2>
          <button
            onClick={() => router.push("/services/batteries")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Battery Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <nav className="text-sm text-blue-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/batteries")}
          >
            Battery Services
          </span>{" "}
          / <span className="text-blue-800">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-72 object-contain border border-blue-100"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              {product.title}
            </h1>
            <p className="text-blue-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-6 text-blue-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Supplier: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Price:{" "}
              <span className="text-2xl text-blue-800">Ksh {product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-blue-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-blue-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <button
              onClick={() => alert("Purchased Successfully!")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition w-full md:w-auto"
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

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  supplier,
}) => {
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
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-blue-600">Loading related products...</p>
      </div>
    );

  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        More from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.$id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border border-blue-100"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-blue-800 mb-2">
              {product.title}
            </h3>
            <p className="text-blue-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-blue-800 mt-4">
              Ksh {product.price}
            </p>
            <button
              onClick={() => router.push(`/services/batteries/${product.$id}`)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full"
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