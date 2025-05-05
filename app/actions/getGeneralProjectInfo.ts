// // import { databases } from "../lib/appwrite";

// // const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// // const collectionId = "67c1a3b300317e80f997"; // Your collection ID

// // export const getGeneralProjectInfo = async () => {
// //   try {
// //     const response = await databases.listDocuments(databaseId, collectionId);
// //     return response.documents; // Return list of project info documents
// //   } catch (error) {
// //     console.error("Error fetching general project info:", error);
// //     throw error;
// //   }
// // };

// // import { databases } from "../lib/appwrite";
// // import { Client, Databases, Query } from "appwrite";

// const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// const collectionId = "67c1a3b300317e80f997"; // Your collection ID
// import { databases } from "../lib/appwrite";
// import { Query } from "appwrite";

// // // const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// // // const collectionId = "67c1a3b300317e80f997"; // Your collection ID

// // export const getGeneralProjectInfo = async (
// //   projectId: string
// // ): Promise<ProjectInfo | null> => {
// //   try {
// //     console.log("Fetching general info for projectId:", projectId);

// //     // Fetch documents with a filter for the specific projectId
// //     const response = await databases.listDocuments(databaseId, collectionId, [
// //       Query.equal("projectId", [projectId]), // Filter by projectId
// //     ]);

// //     console.log("All general project info:", response.documents);
// //     console.log("Raw response from Appwrite:", response);

// //     if (response.documents.length === 0) {
// //       console.warn("No general project info found.");
// //       return null;
// //     }

// //     const doc = response.documents[0]; // Assuming only one entry per project
// //     return {
// //       $id: doc.$id,
// //       projectId: doc.projectId,
// //       projectcategory: doc.projectcategory || "",
// //       timeline: doc.timeline || "",
// //       license: doc.license || "",
// //       links: doc.links ? JSON.parse(doc.links) : [], // Ensure it's an array
// //       contributors: doc.contributors ? JSON.parse(doc.contributors) : [], // Ensure it's an array
// //     };
// //   } catch (error) {
// //     console.error("Error fetching general project info:", error);
// //     return null;
// //   }
// // };

// // interface ProjectInfo {
// //   $id: string;
// //   projectId: string;
// //   projectcategory: string;
// //   timeline: string;
// //   license: string;
// //   links: string[];
// //   contributors: string[];
// // }
// // ======================================================================================
// // import { Client, Databases, Query } from "appwrite";
// // import { databases } from "../lib/appwrite";

// // const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// // const collectionId = "67c053e9001589a15152"; // Your new collection ID

// // export interface ProjectDetails {
// //   $id: string;
// //   projectId: string;
// //   background: string;
// //   techStack: string[];
// //   challenges: string;
// //   enhancements: string;
// //   projectType: string;
// // }

// // // export const getProjectDetails = async (projectId: string): Promise<ProjectDetails | null> => {
// // //   try {
// // //     const response = await databases.listDocuments(databaseId, collectionId, [
// // //       `equal("projectId", "${projectId}")` // Fetch details by projectId
// // //     ]);

// // //     if (response.documents.length === 0) {
// // //       console.warn("No project details found.");
// // //       return null;
// // //     }

// // //     const doc = response.documents[0]; // Assuming one entry per project
// // //     return {
// // //       $id: doc.$id,
// // //       projectId: doc.projectId,
// // //       background: doc.background || "",
// // //       techStack: JSON.parse(doc.techStack || "[]"), // Convert back to array
// // //       challenges: doc.challenges || "",
// // //       enhancements: doc.enhancements || "",
// // //       projectType: doc.projectType || "",
// // //     };
// // //   } catch (error) {
// // //     console.error("Error fetching project details:", error);
// // //     return null;
// // //   }
// // // };
// // export const getProjectDetails = async (
// //   projectId: string
// // ): Promise<ProjectDetails | null> => {
// //   try {
// //     console.log("Fetching details for projectId:", projectId);

// //     // const response = await databases.listDocuments(databaseId, collectionId, [
// //     //   `equal("projectId", "${projectId}")`, // Fetch details by projectId
// //     // ]);
// //     // const response = await databases.listDocuments(databaseId, collectionId);
// //     const response = await databases.listDocuments(databaseId, collectionId, [
// //       Query.equal("projectId", [projectId]), // Filter to match the projectId
// //       Query.select(["projectId"]) // Expand the relationship field
// //     ]);

// //     console.log("All project details:", response.documents);
// //     console.log("Raw response from Appwrite:", response);

// //     if (response.documents.length === 0) {
// //       console.warn("No project details found.");
// //       return null;
// //     }

// //     const doc = response.documents[0]; // Assuming one entry per project
// //     return {
// //       $id: doc.$id,
// //       projectId: doc.projectId,
// //       background: doc.background || "",
// //       techStack: JSON.parse(doc.techStack || "[]"), // Convert back to array
// //       challenges: doc.challenges || "",
// //       enhancements: doc.enhancements || "",
// //       projectType: doc.projectType || "",
// //     };
// //   } catch (error) {
// //     console.error("Error fetching project details:", error);
// //     return null;
// //   }
// // };

// // import { databases, Query } from "../lib/appwrite";

// // const databaseId = "67add1b5003d443b3ae6";
// // const collectionId = "67c053e9001589a15152";

// export interface ProjectDetails {
//   $id: string;
//   projectId: string;
//   projectcategory: string;
//   timeline: string;
//   license: string;
//   links: string[];
//   contributors: string[];
// }

// export const getGeneralProjectInfo = async (projectId: string): Promise<ProjectDetails | null> => {
//   try {
//     console.log("Fetching details for projectId:", projectId);

//     const response = await databases.listDocuments(databaseId, collectionId, [
//       Query.equal("projectId", projectId), // Ensure correct filtering
//     ]);

//     console.log("All project details:", response.documents);

//     if (response.documents.length === 0) {
//       console.warn("No project details found.");
//       return null;
//     }

//     // Extracting project details properly
//     const doc = response.documents[0]; // Assuming only one match per project

//     // Handle related project details
//     const projectInfo = typeof doc.projectId === "object" ? doc.projectId : {};

//     return {
//       $id: doc.$id,
//       projectId: projectInfo.$id || "", // Use the actual ID of the related project
//       projectcategory: doc.projectcategory || "",
//       timeline: doc.timeline || "",
//       license: doc.license || "",
//       links: doc.links ? JSON.parse(doc.links) : [], // Ensure it's an array
//       contributors: doc.contributors ? JSON.parse(doc.contributors) : [], // Ensure it's an array
//     };
//   } catch (error) {
//     console.error("Error fetching project details:", error);
//     return null;
//   }
// };

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
