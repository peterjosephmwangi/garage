import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6";
const collectionId = "67c053e9001589a15152";

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

export const getAllProjectDetails = async (): Promise<ProjectDetails[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    const data: ProjectDetails[] = response.documents.map((doc: any) => {
      const project = typeof doc.projectId === "object" ? doc.projectId : {};

      return {
        $id: doc.$id,
        projectId: project?.$id || "",
        title: project?.title || "",
        description: project?.description || "",
        imageUrl: project?.imageUrl || "",
        repoUrl: project?.repoUrl || "",
        liveUrl: project?.liveUrl || "",
        background: doc.background || "",
        techstack: Array.isArray(doc.techstack) ? doc.techstack : [],
        challenges: doc.challenges || "",
        enhancements: doc.enhancements || "",
        projectType: doc.projectType || "",
      };
    });

    return data;
  } catch (error) {
    console.error("Error fetching all project details:", error);
    return [];
  }
};
