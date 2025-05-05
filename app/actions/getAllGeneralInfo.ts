import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6";
const collectionId = "67c1a3b300317e80f997";

export interface GeneralProjectInfo {
  $id: string;
  projectId: string;
  projectcategory: string;
  timeline: string;
  license: string;
  links: string[];
  contributors: string[];
}

export const getAllGeneralInfo = async (): Promise<GeneralProjectInfo[]> => {
  try {
    const response = await databases.listDocuments(databaseId, collectionId);

    const data: GeneralProjectInfo[] = response.documents.map((doc: any) => ({
      $id: doc.$id,
      projectId: doc.projectId || "",
      projectcategory: doc.projectcategory || "",
      timeline: doc.timeline || "",
      license: doc.license || "",
      links: Array.isArray(doc.links) ? doc.links : [],
      contributors: Array.isArray(doc.contributors) ? doc.contributors : [],
    }));

    return data;
  } catch (error) {
    console.error("Error fetching general info:", error);
    return [];
  }
};
