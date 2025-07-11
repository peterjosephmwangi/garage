// import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67c1a3b300317e80f997"; // Your new collection ID



import { databases } from "../lib/appwrite";

/
export interface ProjectDetails {
  projectId: string;
  projectcategory: string;
  timeline: string;
  license: string;
  links: string[];
  contributors: string[];
}

export const addGeneralProjectInfo = async (details: ProjectDetails) => {
  try {
    const response = await databases.createDocument(
      databaseId,
      collectionId,
      "unique()",
      {
        projectId: details.projectId,
        projectcategory: details.projectcategory,
        timeline: details.timeline,
        license: details.license,
        links: details.links, // Convert to string before saving
        contributors: details.contributors, // Convert to string before saving
      }
    );

    console.log("General project info added successfully:", response);
    return response;
  } catch (error) {
    console.error("Error adding general project info:", error);
    throw error;
  }
};
