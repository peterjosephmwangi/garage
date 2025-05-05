import { databases, storage } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67adf54d003077926db7"; // Your collection ID
const bucketId = "67e44b1f001db59a81a8"; // Replace with your Appwrite bucket ID

export interface NewProject {
  title: string;
  description: string;
  techStack: string[];
  imageFile?: File; // File input for the image
  repoUrl: string;
  liveUrl: string;
  category: string;
  features: string[];
  functionalities: string[];
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

export const addProject = async (project: NewProject) => {
  try {
    let imageUrl = "";

    // Upload the image if a file is provided
    if (project.imageFile) {
      const fileId = await uploadImage(project.imageFile);
      imageUrl = `https://cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${fileId}/view?project=67add129002a020e15d6`; // Replace with your Appwrite project ID
    }

    // Create the project document
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        title: project.title,
        description: project.description,
        techStack: JSON.stringify(project.techStack),
        imageUrl: imageUrl, // Use uploaded image URL
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        category: project.category,
        features: project.features,
        functionalities: project.functionalities,
      }
    );

    console.log("Project added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};
