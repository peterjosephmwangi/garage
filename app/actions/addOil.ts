// app/actions/addOil.ts

import { databases, storage } from "../lib/appwrite";

const databaseId = "680716c20000a52ce526"; // Use your actual database ID
const collectionId = "6807173c001ede4b2686"; // Replace with your oil products collection ID
const bucketId = "680747450034b2c09214"; // Use your actual Appwrite bucket ID

export interface NewOilProduct {
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageFile?: File; // Optional image upload
}

// Upload image to Appwrite Storage
const uploadImage = async (file: File) => {
  try {
    const response = await storage.createFile(bucketId, "unique()", file);
    return response.$id; // Returns the file ID
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const addOil = async (product: NewOilProduct) => {
  try {
    let imageUrl = "";

    // Upload image if provided
    if (product.imageFile) {
      const fileId = await uploadImage(product.imageFile);
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=6807163400296f58b59c`; // Replace with your Appwrite project ID
    }

    // Create the oil product document
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        title: product.title,
        description: product.description,
        features: product.features,
        price: product.price,
        supplier: product.supplier,
        rating: product.rating,
        reviews: product.reviews,
        imageUrl: imageUrl,
      }
    );

    console.log("Oil product added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding oil product:", error);
    throw error;
  }
};
