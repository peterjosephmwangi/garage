
import { Query } from "appwrite";
import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67c1a3b300317e80f997"; // Your new collection ID

export interface GeneralProjectInfo {
  $id: string;
  projectId: string;
  projectcategory: string;
  timeline: string;
  license: string;
  links: string[];
  contributors: string[];
}

export const getGeneralProjectInfo = async (projectId: string): Promise<GeneralProjectInfo | null> => {
  try {
    console.log("Fetching general info for projectId:", projectId);

    const response = await databases.listDocuments(databaseId, collectionId, [
      Query.equal("projectId", projectId),
    ]);

    console.log("All general project info:", response.documents);

    if (response.documents.length === 0) {
      console.warn("No general project info found.");
      return null;
    }

    const doc = response.documents[0]; // Assuming only one match per project

    return {
      $id: doc.$id,
      projectId: doc.projectId || "",
      projectcategory: doc.projectcategory || "",
      timeline: doc.timeline || "",
      license: doc.license || "",
      links: doc.links , // Convert to array if stored as JSON
      contributors: doc.contributors , // Convert to array if stored as JSON
    };
  } catch (error) {
    console.error("Error fetching general project info:", error);
    return null;
  }
};
