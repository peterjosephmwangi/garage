// app/actions/getOil.ts

import { databases } from "../lib/appwrite";

export interface OilProduct {
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

const databaseId = "680716c20000a52ce526"; // Same as addOil.ts
const collectionId = "6807173c001ede4b2686"; // Same oil products collection ID

export const getOilProducts = async (): Promise<OilProduct[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title || "",
      description: doc.description || "",
      features: doc.features || [],
      price: doc.price || "",
      supplier: doc.supplier || "",
      rating: doc.rating ?? 0,
      reviews: doc.reviews ?? 0,
      imageUrl: doc.imageUrl || "",
    })) as OilProduct[];
  } catch (error) {
    console.error("Error fetching oil products:", error);
    return [];
  }
};
