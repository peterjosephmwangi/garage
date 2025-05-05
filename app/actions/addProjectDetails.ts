import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67c053e9001589a15152"; // Your new collection ID
interface ProjectDetails {
    projectId: string;
    background: string;
    techstack: []; // Ensure this is an array
    challenges: string;
    enhancements: string;
    projectType: string;
  }
  
  export const addProjectDetails = async (details: ProjectDetails) => {
    try {
      const response = await databases.createDocument(
        databaseId,
        collectionId,
        "unique()",
        {
          projectId: details.projectId,
          background: details.background,
          techstack: details.techstack, // Convert to string before saving
          challenges: details.challenges,
          enhancements: details.enhancements,
          projectType: details.projectType,
        }
      );
  
      console.log("Project details added successfully:", response);
      return response;
    } catch (error) {
      console.error("Error adding project details:", error);
      throw error;
    }
  };
