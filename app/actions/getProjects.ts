import { databases } from "../lib/appwrite";

export interface Project {
  $id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  repoUrl: string;
  liveUrl: string;
  category: string;
  features: string[]; // New field
  functionalities: string[]; // New field
}

const databaseId = "67add1b5003d443b3ae6";
const collectionId = "67adf54d003077926db7";

export const getProjects = async (): Promise<Project[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    return response.documents.map((doc) => ({
      $id: doc.$id, // Keep Appwrite's unique ID
      title: doc.title || "",
      description: doc.description || "",
      techStack: JSON.parse(doc.techStack || "[]"), // Convert back to array
      imageUrl: doc.imageUrl || "",
      repoUrl: doc.repoUrl || "",
      liveUrl: doc.liveUrl || "",
      category: doc.category || "",
      features: doc?.features,
      functionalities: doc.functionalities,
    })) as Project[];
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};
