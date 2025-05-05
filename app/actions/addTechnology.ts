import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67bcb2220032243e25e1"; // Your collection ID

export interface NewTechnology {
  name: string;
  iconKey: string; // This should match a key in the icon mapping
}

export const addTechnology = async (technology: NewTechnology) => {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()", // Auto-generate document ID
      {
        name: technology.name,
        iconKey: technology.iconKey, // Store the key for later mapping
      }
    );

    console.log("Technology added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding technology:", error);
    throw error;
  }
};
