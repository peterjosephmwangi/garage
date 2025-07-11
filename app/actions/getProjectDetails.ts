import { Client, Databases, Query } from "appwrite";
import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67c053e9001589a15152"; // Your new collection ID



export interface ProjectDetails {
  $id: string;
  projectId: string;
  title: string;
  description: string;
  imageUrl: string;
  repoUrl: string;
  liveUrl: string;
  background: string;
  techstack: string[];
  challenges: string;
  enhancements: string;
  projectType: string;
}

export const getProjectDetails = async (projectId: string): Promise<ProjectDetails | null> => {
  try {
    console.log("Fetching details for projectId:", projectId);

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("projectId", projectId), // Ensure correct filtering
    ]);

    console.log("All project details:", response.documents);

    if (response.documents.length === 0) {
      console.warn("No project details found.");
      return null;
    }

    // Extracting project details properly
    const doc = response.documents[0]; // Assuming only one match per project

    // Handle related project details
    const projectInfo = typeof doc.projectId === "object" ? doc.projectId : {};

    return {
      $id: doc.$id,
      projectId: projectInfo.$id || "", // Use the actual ID of the related project
      title: projectInfo.title || "",
      description: projectInfo.description || "",
      imageUrl: projectInfo.imageUrl || "",
      repoUrl: projectInfo.repoUrl || "",
      liveUrl: projectInfo.liveUrl || "",
      background: doc.background || "",
      techstack: doc.techstack , // Convert to array if stored as JSON
      challenges: doc.challenges || "",
      enhancements: doc.enhancements || "",
      projectType: doc.projectType || "",
    };
  } catch (error) {
    console.error("Error fetching project details:", error);
    return null;
  }
};

