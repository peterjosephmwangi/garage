import { databases, ID } from "@/app/lib/appwrite";

const databaseId = "680716c20000a52ce526";
const ordersCollectionId = "orders_6807170100118fcdb939";

interface OrderData {
  productId: string;
  productTitle: string;
  price: string;
  supplier: string;
  customerInfo: string;
  paymentMethod: string;
  transactionId: string;
  status: string;
  orderDate: string;
  phoneNumber?: string;
  amount?: number;
  transactionDate?: string;
  callbackData?: string;
}

export const createOrderRecord = async (
  transactionId: string,
  paymentMethod: string,
  status: string,
  product: {
    $id: string;
    title: string;
    price: string;
    supplier: string;
  },
  customerInfo: string,
  phoneNumber?: string
): Promise<void> => {
  try {
    const orderData: OrderData = {
      productId: product.$id,
      productTitle: product.title,
      price: product.price,
      supplier: product.supplier,
      customerInfo,
      paymentMethod,
      transactionId,
      status,
      orderDate: new Date().toISOString(),
      phoneNumber,
    };

    console.log("Creating order with data:", orderData);

    const documentId = ID.unique(); // Generate a compliant unique ID

    await databases.createDocument(
      databaseId,
      ordersCollectionId,
      documentId,
      orderData
    );
    console.log(`Order created successfully: ${documentId}`);
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error(`Failed to create order record: ${error instanceof Error ? error.message : String(error)}`);
  }
};
export const updateOrderRecord = async (
  transactionId: string,
  updates: Partial<OrderData>
): Promise<void> => {
  try {
    console.log(`Updating order ${transactionId} with:`, updates);
    await databases.updateDocument(
      databaseId,
      ordersCollectionId,
      transactionId,
      updates
    );
    console.log(`Order updated successfully: ${transactionId}`);
  } catch (error) {
    console.error("Error updating order:", error);
    throw new Error(`Failed to update order record: ${error instanceof Error ? error.message : String(error)}`);
  }
};