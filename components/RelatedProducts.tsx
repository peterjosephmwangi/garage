// components/RelatedProducts.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AirConditionProduct } from "../app/lib/product";
import { DatabaseService } from "../services/databaseService";

interface RelatedProductsProps {
  currentProductId: string;
  supplier: string;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({
  currentProductId,
  supplier,
}) => {
  const [relatedProducts, setRelatedProducts] = useState<AirConditionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const products = await DatabaseService.getRelatedProducts(
          supplier,
          currentProductId,
          3
        );
        setRelatedProducts(products);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  if (loading) return null;
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
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-blue-800 mb-2">{product.title}</h3>
            <p className="text-blue-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-blue-800 mt-4">{product.price}</p>
            <button
              onClick={() => router.push(`/services/air/${product.$id}`)}
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

export default RelatedProducts;