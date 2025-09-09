import { databases } from "../app/lib/appwrite";
import { Query } from "appwrite";
import { AirConditionProduct, OrderData } from "../app/lib/product";

export const DB_CONFIG = {
  databaseId: "680716c20000a52ce526",
  productsCollectionId: "6807170100118fcdb939",
  ordersCollectionId: "orders_6807170100118fcdb939",
};

export class DatabaseService {
  static async getProduct(productId: string): Promise<AirConditionProduct> {
    return await databases.getDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.productsCollectionId,
      productId
    ) as AirConditionProduct;
  }

  static async getRelatedProducts(
    supplier: string,
    currentProductId: string,
    limit: number = 3
  ): Promise<AirConditionProduct[]> {
    const response = await databases.listDocuments(
      DB_CONFIG.databaseId,
      DB_CONFIG.productsCollectionId,
      [
        Query.equal("supplier", supplier),
        Query.notEqual("$id", currentProductId),
        Query.limit(limit),
      ]
    );
    return response.documents as AirConditionProduct[];
  }

  static async createOrder(
    transactionId: string,
    orderData: OrderData
  ): Promise<void> {
    await databases.createDocument(
      DB_CONFIG.databaseId,
      DB_CONFIG.ordersCollectionId,
      transactionId,
      orderData
    );
    console.log("Order created:", { transactionId, status: orderData.status });
  }

  static async updateOrder(
    transactionId: string,
    updates: Partial<OrderData>
  ): Promise<void> {
    // Truncate callbackData to 255 characters if present
    const truncatedUpdates: Partial<OrderData> = {
      ...updates,
      callbackData: updates.callbackData 
        ? updates.callbackData.slice(0, 255) 
        : updates.callbackData,
    };

    console.log(`Updating order ${transactionId} with:`, truncatedUpdates);
    
    try {
      await databases.updateDocument(
        DB_CONFIG.databaseId,
        DB_CONFIG.ordersCollectionId,
        transactionId,
        truncatedUpdates
      );
      console.log(`Order updated successfully: ${transactionId}`);
    } catch (error) {
      console.error("Error updating order:", {
        error,
        databaseId: DB_CONFIG.databaseId,
        ordersCollectionId: DB_CONFIG.ordersCollectionId,
        transactionId,
        updates,
      });
      throw new Error(`Failed to update order record: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}



// // services/databaseService.ts
// import { databases } from "../app/lib/appwrite";
// import { Query } from "appwrite";
// import { AirConditionProduct, OrderData } from "../app/lib/product";

// export const DB_CONFIG = {
//   databaseId: "680716c20000a52ce526",
//   productsCollectionId: "6807170100118fcdb939",
//   ordersCollectionId: "orders_6807170100118fcdb939",
// };

// export class DatabaseService {
//   static async getProduct(productId: string): Promise<AirConditionProduct> {
//     return await databases.getDocument(
//       DB_CONFIG.databaseId,
//       DB_CONFIG.productsCollectionId,
//       productId
//     ) as AirConditionProduct;
//   }

//   static async getRelatedProducts(
//     supplier: string,
//     currentProductId: string,
//     limit: number = 3
//   ): Promise<AirConditionProduct[]> {
//     const response = await databases.listDocuments(
//       DB_CONFIG.databaseId,
//       DB_CONFIG.productsCollectionId,
//       [
//         Query.equal("supplier", supplier),
//         Query.notEqual("$id", currentProductId),
//         Query.limit(limit),
//       ]
//     );
//     return response.documents as AirConditionProduct[];
//   }

//   static async createOrder(
//     transactionId: string,
//     orderData: OrderData
//   ): Promise<void> {
//     await databases.createDocument(
//       DB_CONFIG.databaseId,
//       DB_CONFIG.ordersCollectionId,
//       transactionId,
//       orderData
//     );
//     console.log("Order created:", { transactionId, status: orderData.status });
//   }

//   static async updateOrder(
//     transactionId: string,
//     updates: Partial<OrderData>
//   ): Promise<void> {
//     // Truncate callbackData to 255 characters if present
//     const truncatedUpdates: Partial<OrderData> = {
//       ...updates,
//       callbackData: updates.callbackData 
//         ? updates.callbackData.slice(0, 255) 
//         : updates.callbackData,
//     };

//     console.log(`Updating order ${transactionId} with:`, truncatedUpdates);
    
//     try {
//       await databases.updateDocument(
//         DB_CONFIG.databaseId,
//         DB_CONFIG.ordersCollectionId,
//         transactionId,
//         truncatedUpdates
//       );
//       console.log(`Order updated successfully: ${transactionId}`);
//     } catch (error) {
//       console.error("Error updating order:", {
//         error,
//         databaseId: DB_CONFIG.databaseId,
//         ordersCollectionId: DB_CONFIG.ordersCollectionId,
//         transactionId,
//         updates,
//       });
//       throw new Error(`Failed to update order record: ${error instanceof Error ? error.message : String(error)}`);
//     }
//   }
// }