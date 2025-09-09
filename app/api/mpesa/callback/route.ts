import { NextRequest, NextResponse } from "next/server";
import { MpesaService } from "@/app/lib/mpesa-service";
import { updateOrderRecord } from "@/app/actions/createOrder";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    console.log("M-Pesa Callback:", body);

    const mpesaService = new MpesaService();
    const callbackData = mpesaService.extractCallbackData(body);

    console.log("Extracted callback data:", callbackData);

    await updateOrderRecord(callbackData.checkoutRequestID, {
      status: callbackData.success ? "paid" : "failed",
      callbackData: JSON.stringify(body),
      amount: callbackData.amount,
      transactionId: callbackData.transactionId,
      transactionDate: callbackData.transactionDate,
      phoneNumber: callbackData.phoneNumber,
    });

    console.log(`Order updated in callback: ${callbackData.checkoutRequestID}`);
    return NextResponse.json({ message: "Callback processed successfully" }, { status: 200 });
  } catch (error) {
    console.error("Callback Error:", error);
    return NextResponse.json(
      { error: `Failed to process callback: ${error instanceof Error ? error.message : String(error)}` },
      { status: 500 }
    );
  }
}



// // app/api/mpesa/callback/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import { MpesaService } from "@/app/lib/mpesa-service";
// import { updateOrderRecord } from "@/app/actions/createOrder";

// export async function POST(request: NextRequest): Promise<NextResponse> {
//   try {
//     const body = await request.json();
//     console.log("M-Pesa Callback:", body);

//     const mpesaService = new MpesaService();
//     const callbackData = mpesaService.extractCallbackData(body);

//     console.log("Extracted callback data:", callbackData);

//     await updateOrderRecord(callbackData.checkoutRequestID, {
//       status: callbackData.success ? "paid" : "failed",
//       callbackData: JSON.stringify(body),
//       amount: callbackData.amount,
//       transactionId: callbackData.transactionId,
//       transactionDate: callbackData.transactionDate,
//       phoneNumber: callbackData.phoneNumber,
//     });

//     console.log(`Order updated in callback: ${callbackData.checkoutRequestID}`);
//     return NextResponse.json({ message: "Callback processed successfully" }, { status: 200 });
//   } catch (error) {
//     console.error("Callback Error:", error);
//     return NextResponse.json(
//       { error: `Failed to process callback: ${error instanceof Error ? error.message : String(error)}` },
//       { status: 500 }
//     );
//   }
// }





// // // app/api/mpesa/callback/route.ts - Improved version
// // import { NextRequest, NextResponse } from "next/server";
// // import { databases } from "@/app/lib/appwrite";
// // import { extractCallbackData, STKCallbackResponse } from "../../../lib/mpesa-service";

// // const databaseId = "680716c20000a52ce526";
// // const ordersCollectionId = "orders_6807170100118fcdb939";

// // export async function POST(request: NextRequest) {
// //   try {
// //     const body = (await request.json()) as STKCallbackResponse;
// //     console.log("M-Pesa Callback:", body);

// //     const callbackData = extractCallbackData(body);
// //     const { success, message, checkoutRequestID } = callbackData;

// //     // Determine status based on M-Pesa response
// //     let status: string;
// //     if (success) {
// //       status = "paid";
// //     } else if (message.includes("cancelled") || message.includes("1032")) {
// //       status = "cancelled";
// //     } else if (message.includes("timeout") || message.includes("1037") || message.includes("No response")) {
// //       status = "timeout";
// //     } else {
// //       status = "failed";
// //     }

// //     const updates = {
// //       status,
// //       callbackData: JSON.stringify(body),
// //       updatedAt: new Date().toISOString(),
// //       ...(success && {
// //         amount: callbackData.amount,
// //         transactionId: callbackData.transactionId,
// //         transactionDate: callbackData.transactionDate,
// //         phoneNumber: callbackData.phoneNumber,
// //       }),
// //     };

// //     console.log(`Updating order ${checkoutRequestID} with:`, updates);

// //     try {
// //       // First check if document exists
// //       await databases.getDocument(databaseId, ordersCollectionId, checkoutRequestID);
      
// //       // Document exists, update it
// //       await databases.updateDocument(
// //         databaseId,
// //         ordersCollectionId,
// //         checkoutRequestID,
// //         updates
// //       );
      
// //       console.log(`Order updated successfully: ${checkoutRequestID}`);
// //     } catch (getError) {
// //       console.error("Document not found, attempting to create:", getError);
      
// //       // Document doesn't exist, create a new one with basic info
// //       // This is a fallback - ideally the document should already exist
// //       const fallbackOrderData = {
// //         transactionId: checkoutRequestID,
// //         paymentMethod: "mpesa",
// //         orderDate: new Date().toISOString(),
// //         productId: "unknown", // We don't have this from callback
// //         productTitle: "M-Pesa Payment",
// //         price: success ? String(callbackData.amount) : "0",
// //         supplier: "unknown",
// //         customerInfo: JSON.stringify({ phone: callbackData.phoneNumber }),
// //         ...updates
// //       };

// //       try {
// //         await databases.createDocument(
// //           databaseId,
// //           ordersCollectionId,
// //           checkoutRequestID,
// //           fallbackOrderData
// //         );
// //         console.log(`Fallback order created: ${checkoutRequestID}`);
// //       } catch (createError) {
// //         console.error("Failed to create fallback order:", createError);
// //         throw createError;
// //       }
// //     }

// //     return NextResponse.json({ 
// //       status: "success",
// //       message: `Order ${status} successfully`
// //     });

// //   } catch (error) {
// //     console.error("Callback Error:", error);
    
// //     // Log the full error details for debugging
// //     if (error instanceof Error) {
// //       console.error("Error details:", {
// //         message: error.message,
// //         stack: error.stack,
// //         name: error.name
// //       });
// //     }

// //     return NextResponse.json({ 
// //       error: "Failed to process callback",
// //       details: error instanceof Error ? error.message : String(error)
// //     }, { status: 500 });
// //   }
// // }