// import { databases } from "@/app/lib/appwrite";
// import { ServiceProduct } from "@/app/lib/types";
// import { serviceTypes } from "@/app/lib/serviceTypes";

// const databaseId = "680716c20000a52ce526";

// export const getServiceProducts = async (
//   serviceType: string
// ): Promise<ServiceProduct[]> => {
//   try {
//     const collectionId = serviceTypes.find(
//       (type) => type.value === serviceType
//     )?.collectionId;

//     if (!collectionId) throw new Error("Invalid service type");

//     const response = await databases.listDocuments(databaseId, collectionId);

//     return response.documents.map((doc) => ({
//       $id: doc.$id,
//       title: doc.title || "",
//       description: doc.description || "",
//       features: doc.features || [],
//       price: doc.price || "",
//       supplier: doc.supplier || "",
//       rating: doc.rating || 0,
//       reviews: doc.reviews || 0,
//       imageUrl: doc.imageUrl || "",
//       serviceType: serviceType,
//     }));
//   } catch (error) {
//     console.error(`Error fetching ${serviceType} products:`, error);
//     return [];
//   }
// };


// app/actions/getServiceProducts.ts
import { databases } from "@/app/lib/appwrite";
import { ServiceProduct } from "@/app/lib/types";
import { serviceTypes, ServiceType } from "@/app/lib/serviceTypes";

const databaseId = "680716c20000a52ce526";

export const getServiceProducts = async (
  serviceType: ServiceType
): Promise<ServiceProduct[]> => {
  try {
    const collectionId = serviceTypes.find(
      (type) => type.value === serviceType
    )?.collectionId;

    if (!collectionId) throw new Error(`Invalid service type: ${serviceType}`);

    const response = await databases.listDocuments(databaseId, collectionId);

    return response.documents.map((doc) => ({
      $id: doc.$id,
      title: doc.title || "",
      description: doc.description || "",
      features: doc.features || [],
      price: doc.price || "",
      supplier: doc.supplier || "",
      rating: doc.rating || 0,
      reviews: doc.reviews || 0,
      imageUrl: doc.imageUrl || "",
      serviceType: serviceType,
    }));
  } catch (error) {
    console.error(`Error fetching ${serviceType} products:`, error);
    return [];
  }
};