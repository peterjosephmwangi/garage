// hooks/useProductData.ts
import { useState, useEffect } from "react";
import { AirConditionProduct } from "../app/lib/product";
import { DatabaseService } from "../services/databaseService";

export const useProductData = (params: Promise<{ id: string }>) => {
  const [product, setProduct] = useState<AirConditionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        setProductId(id);

        const response = await DatabaseService.getProduct(id);
        setProduct(response);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  return { product, loading, error, productId };
};