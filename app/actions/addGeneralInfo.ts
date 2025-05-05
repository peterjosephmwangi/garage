// import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67c1a3b300317e80f997"; // Your new collection ID

// interface GeneralProjectInfo {
//   projectId: string;
//   projectcategory: string;
//   timeline: string;
//   license: string;
//   links: string[]; // Array of links (GitHub, Live Demo, etc.)
//   contributors: string[]; // Array of contributor names
// }

// export const addGeneralProjectInfo = async (info: GeneralProjectInfo) => {
//   try {
//     const response = await databases.createDocument(
//       databaseId,
//       collectionId,
//       "unique()",
//       {
//         projectId: info.projectId,
//         projectcategory: info.projectcategory,
//         timeline: info.timeline,
//         contributors: info.contributors, // ✅ Store as an array
//         license: info.license,
//         links: info.links, // ✅ Store as an array
//       }
//     );

//     console.log("General project info added successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error adding general project info:", error);
//     throw error;
//   }
// };


import { databases } from "../lib/appwrite";

// const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// const collectionId = "67c1a3b300317e80f997"; // Your collection ID for general project info

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
