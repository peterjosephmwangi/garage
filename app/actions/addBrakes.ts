import { databases, storage } from "../lib/appwrite";

const databaseId = "680716c20000a52ce526";
const collectionId = "680718220012d8b2eb98"; // Replace with your actual brakes collection ID
const bucketId = "680747450034b2c09214";

export interface NewBrakesProduct {
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageFile?: File;
}

const uploadImage = async (file: File) => {
  try {
    const response = await storage.createFile(bucketId, "unique()", file);
    return response.$id;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export const addBrakes = async (product: NewBrakesProduct) => {
  try {
    let imageUrl = "";

    if (product.imageFile) {
      const fileId = await uploadImage(product.imageFile);
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=6807163400296f58b59c`;
    }

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

    console.log("Brakes product added:", response);
    return response;
  } catch (error) {
    console.error("Error adding brakes product:", error);
    throw error;
  }
};
