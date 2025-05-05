// app/actions/addTires.ts

import { databases, storage } from "../lib/appwrite";

const databaseId = "680716c20000a52ce526"; // Use your actual database ID
const collectionId = "680718020033cfadcb44"; // Replace with your tire products collection ID
const bucketId = "680747450034b2c09214"; // Use your actual Appwrite bucket ID

export interface NewTireProduct {
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

export const addTire = async (product: NewTireProduct) => {
  try {
    let imageUrl = "";

    // Upload image if provided
    if (product.imageFile) {
      const fileId = await uploadImage(product.imageFile);
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67add129002a020e15d6`; // Replace with your Appwrite project ID
    }

    // Create the tire product document
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

    console.log("Tire product added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding tire product:", error);
    throw error;
  }
};
