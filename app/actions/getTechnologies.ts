import { databases } from "../lib/appwrite";

export interface Technology {
  $id: string;
  name: string;
  iconKey: string;
}

const databaseId = "67add1b5003d443b3ae6";
const collectionId = "67bcb2220032243e25e1";

export const getTechnologies = async (): Promise<Technology[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      name: doc.name || "",
      iconKey: doc.iconKey || "",
    })) as Technology[];
  } catch (error) {
    console.error("Error fetching technologies:", error);
    return [];
  }
};
