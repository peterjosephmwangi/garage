// import { databases } from "../lib/appwrite";

// const databaseId = "67add1b5003d443b3ae6"; // Your database ID
// const collectionId = "67adf54d003077926db7"; // Your collection ID

// export interface UpdatedProject {
//   projectId: string; // ID of the project to be updated
//   title?: string;
//   description?: string;
//   techStack?: string[];
//   imageUrl?: string;
//   repoUrl?: string;
//   liveUrl?: string;
//   category?: string;
//   features?: string[];
//   functionalities?: string[];
// }

// export const editProject = async (updatedData: UpdatedProject) => {
//   try {
//     const { projectId, ...fieldsToUpdate } = updatedData;

//     const response = await databases.updateDocument(
//       databaseId,
//       collectionId,
//       projectId,
//       {
//         ...fieldsToUpdate,
//         techStack: fieldsToUpdate.techStack ? JSON.stringify(fieldsToUpdate.techStack) : undefined,
//       }
//     );

//     console.log("Project updated successfully:", response);
//     return response;
//   } catch (error) {
//     console.error("Error updating project:", error);
//     throw error;
//   }
// };


import { databases } from "../lib/appwrite";

const databaseId = "67add1b5003d443b3ae6"; // Your database ID
const collectionId = "67adf54d003077926db7"; // Your collection ID

export interface UpdatedProject {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  imageUrl: string;
  repoUrl: string;
  liveUrl: string;
  category: string;
  features: string[];
  functionalities: string[];
}

// Fetch project by ID
export const getProjectById = async (id: string): Promise<UpdatedProject | null> => {
  try {
    const response = await databases.getDocument(databaseId, collectionId, id);
    return {
      id: response.$id,
      title: response.title,
      description: response.description,
      techStack: JSON.parse(response.techStack),
      imageUrl: response.imageUrl,
      repoUrl: response.repoUrl,
      liveUrl: response.liveUrl,
      category: response.category,
      features: response.features,
      functionalities: response.functionalities,
    };
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
};

// Update project
export const editProject = async (project: UpdatedProject) => {
  try {
    const response = await databases.updateDocument(
      databaseId,
      collectionId,
      project.id,
      {
        title: project.title,
        description: project.description,
        techStack: JSON.stringify(project.techStack),
        imageUrl: project.imageUrl,
        repoUrl: project.repoUrl,
        liveUrl: project.liveUrl,
        category: project.category,
        features: project.features,
        functionalities: project.functionalities,
      }
    );

    console.log("Project updated successfully:", response);
    return response;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};
