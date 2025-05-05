import { databases, storage } from "../lib/appwrite";

const databaseId = "680716c20000a52ce526";
const collectionId = "6807175e00341dbc8fd5"; // Replace with your actual battery collection ID
const bucketId = "680747450034b2c09214";

export interface NewBatteryProduct {
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

export const addBattery = async (product: NewBatteryProduct) => {
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

    console.log("Battery product added:", response);
    return response;
  } catch (error) {
    console.error("Error adding battery product:", error);
    throw error;
  }
};
