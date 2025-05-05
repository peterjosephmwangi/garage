// app/actions/getAirConditions.ts

import { databases } from "../lib/appwrite";

export interface AirConditionProduct {
  $id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageUrl: string;
}

const databaseId = "680716c20000a52ce526"; // Same database ID
const collectionId = "6807170100118fcdb939"; // Air condition collection ID

export const getAirConditions = async (): Promise<AirConditionProduct[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title || "",
      description: doc.description || "",
      features: doc.features || [],
      price: doc.price || "",
      supplier: doc.supplier || "",
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      imageUrl: doc.imageUrl || "",
    })) as AirConditionProduct[];
  } catch (error) {
    console.error("Error fetching air condition products:", error);
    return [];
  }
};
