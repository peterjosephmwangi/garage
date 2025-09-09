import { MpesaPaymentState, OrderData, CustomerInfo, CartItem } from "../app/lib/product";

import { formatMpesaPhone } from "../utils/paymentUtils";
import { DatabaseService } from "./databaseService";
import { extractNumericPrice } from "../utils/paymentUtils";

export class MpesaService {
  static async initiateStkPush(
    phone: string,
    amount: number,
    productId: string,
    productTitle: string,
    productPrice: string,
    customerInfo: CustomerInfo,
    supplier: string,
    setState: (state: Partial<MpesaPaymentState>) => void,
    cartItems?: CartItem[]
  ): Promise<string | null> {
    try {
      setState({
        isInitiating: true,
        status: "initiated",
        message: "Initiating M-Pesa payment...",
      });

      const formattedPhone = formatMpesaPhone(phone);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch("/api/mpesa/stk-push", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "MyApp/1.0 (Node.js; Next.js)",
        },
        body: JSON.stringify({
          phoneNumber: formattedPhone,
          amount: amount,
          accountReference: productId,
          transactionDesc: `Payment for ${productTitle}`,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error(
          `Failed to parse response: ${
            jsonError instanceof Error ? jsonError.message : "Unknown JSON parsing error"
          }`
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.error
            ? `API Error: ${data.error}`
            : `HTTP Error: ${response.status} ${response.statusText}`
        );
      }

      if (data.ResponseCode === "0") {
        console.log("STK Push successful, creating initial order record...");

        try {
          const orderData: OrderData = {
            productId: productId,
            productTitle: productTitle,
            price: productPrice,
            supplier: supplier,
            customerInfo: JSON.stringify(customerInfo),
            paymentMethod: "mpesa",
            transactionId: data.CheckoutRequestID,
            status: "pending",
            orderDate: new Date().toISOString(),
            phoneNumber: formattedPhone,
          };

          // Add cart-specific fields
          if (cartItems && cartItems.length > 0) {
            orderData.cartItems = JSON.stringify(
              cartItems.map(item => ({
                productId: item.$id,
                title: item.title,
                price: extractNumericPrice(item.price),
                quantity: item.quantity,
                supplier: item.supplier,
                imageUrl: item.imageUrl || '',
                subtotal: extractNumericPrice(item.price) * item.quantity
              }))
            );
            orderData.itemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
            orderData.orderType = "cart";
            orderData.supplierList = [...new Set(cartItems.map(item => item.supplier))].join(", ");
          } else {
            orderData.cartItems = JSON.stringify([{
              productId: productId,
              title: productTitle,
              price: extractNumericPrice(productPrice),
              quantity: 1,
              supplier: supplier,
              imageUrl: '', // Add if available
              subtotal: extractNumericPrice(productPrice)
            }]);
            orderData.itemsCount = 1;
            orderData.orderType = "single";
            orderData.supplierList = supplier;
          }

          await DatabaseService.createOrder(data.CheckoutRequestID, orderData);

          console.log(`Initial order created: ${data.CheckoutRequestID}`);

          setState({
            isInitiating: false,
            isPolling: true,
            checkoutRequestID: data.CheckoutRequestID,
            status: "polling",
            message: "Please check your phone and enter M-Pesa PIN...",
          });

          return data.CheckoutRequestID;
        } catch (createError) {
          console.error("Failed to create initial order:", createError);
          throw new Error("Failed to create order record");
        }
      } else {
        throw new Error(data.ResponseDescription || "Payment initiation failed");
      }
    } catch (error) {
      console.error("M-Pesa initiation error:", error);
      setState({
        isInitiating: false,
        status: "failed",
        message:
          error instanceof Error ? error.message : "Failed to initiate payment",
      });
      return null;
    }
  }

  static async pollPaymentStatus(
    checkoutRequestID: string,
    setState: (state: Partial<MpesaPaymentState>) => void
  ): Promise<void> {
    let attempts = 0;
    const maxAttempts = 12; // 12 * 15s = 180s (3 minutes)
    const pollInterval = 15000; // 15 seconds to stay under 5 requests/min
    const maxRetries = 2; // Retry up to 2 times for 429/403 errors

    const poll = async (retryCount = 0): Promise<void> => {
      try {
        attempts++;
        console.log(`Polling attempt ${attempts} for CheckoutRequestID: ${checkoutRequestID}`);

        const response = await fetch("/api/mpesa/query", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "MyApp/1.0 (Node.js; Next.js)",
          },
          body: JSON.stringify({
            checkoutRequestID,
          }),
        });

        let data;
        try {
          data = await response.json();
          console.log("Poll response:", data);
        } catch (jsonError) {
          throw new Error(
            `Failed to parse query response: ${
              jsonError instanceof Error ? jsonError.message : "Unknown error"
            }`
          );
        }

        if (!response.ok) {
          if (response.status === 429 || response.status === 403) {
            if (retryCount < maxRetries) {
              console.log(`Error (${response.status}), retrying (${retryCount + 1}/${maxRetries}) after delay...`);
              await new Promise((resolve) => setTimeout(resolve, pollInterval));
              return poll(retryCount + 1);
            }
            throw new Error(`Query failed after retries: ${response.statusText}`);
          }
          throw new Error(
            data?.error ? `Query Error: ${data.error}` : `HTTP Error: ${response.status}`
          );
        }

        if (data.ResultCode === "0") {
          setState({
            isPolling: false,
            status: "success",
            message: "Payment completed successfully!",
          });

          await DatabaseService.updateOrder(checkoutRequestID, { status: "paid" });
          return;
        } else if (data.ResultCode === "1032") {
          setState({
            isPolling: false,
            status: "failed",
            message: "Payment was cancelled by user. Please try again.",
          });
          await DatabaseService.updateOrder(checkoutRequestID, { status: "cancelled" });
          return;
        } else if (data.ResultCode === "1037") {
          setState({
            isPolling: false,
            status: "timeout",
            message: "Payment request timed out. Please try again.",
          });
          await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
          return;
        } else if (data.ResultCode === "1" && data.ResultDesc.includes("pending")) {
          if (attempts < maxAttempts) {
            setState({
              message: `Waiting for payment confirmation... (${attempts}/${maxAttempts})`,
            });
            setTimeout(() => poll(0), pollInterval);
          } else {
            setState({
              isPolling: false,
              status: "timeout",
              message: "Payment confirmation timeout. Please check your M-Pesa messages.",
            });
            await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
          }
        } else {
          setState({
            isPolling: false,
            status: "failed",
            message: data.ResultDesc || "Payment failed. Please try again.",
          });
          await DatabaseService.updateOrder(checkoutRequestID, { status: "failed" });
        }
      } catch (error) {
        console.error("Polling error:", error);
        if (error instanceof Error && (error.message.includes("Forbidden") || error.message.includes("Too Many Requests"))) {
          if (retryCount < maxRetries) {
            console.log(`Error (${error.message}), retrying (${retryCount + 1}/${maxRetries}) after delay...`);
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            return poll(retryCount + 1);
          }
          setState({
            isPolling: false,
            status: "pending",
            message: "Unable to verify payment due to server restrictions. Please wait for confirmation or try again later.",
          });
          await DatabaseService.updateOrder(checkoutRequestID, { status: "pending" });
          return;
        }
        if (attempts < maxAttempts) {
          setTimeout(() => poll(0), pollInterval);
        } else {
          setState({
            isPolling: false,
            status: "timeout",
            message: "Unable to confirm payment status. Please check your M-Pesa messages.",
          });
          await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
        }
      }
    };

    setTimeout(() => poll(0), pollInterval);
  }
}



// =========================PRODUCTION ==========================


// // Alternative approach: Callback + Reduced Polling
// export class MpesaService {
//   static async initiateStkPush(
//     phone: string,
//     amount: number,
//     productId: string,
//     productTitle: string,
//     productPrice: string,
//     customerInfo: CustomerInfo,
//     supplier: string,
//     setState: (state: Partial<MpesaPaymentState>) => void,
//     cartItems?: CartItem[]
//   ): Promise<string | null> {
//     // ... existing initiation code ...

//     if (data.ResponseCode === "0") {
//       // Create order and provide immediate user guidance
//       setState({
//         isInitiating: false,
//         isPolling: true,
//         checkoutRequestID: data.CheckoutRequestID,
//         status: "polling",
//         message: "Check your phone for M-Pesa popup. Enter your PIN within 2 minutes.",
//       });

//       // Start minimal polling (only 3 attempts over 90 seconds)
//       setTimeout(() => this.minimalPoll(data.CheckoutRequestID, setState), 30000);
      
//       return data.CheckoutRequestID;
//     }
//   }

//   static async minimalPoll(
//     checkoutRequestID: string,
//     setState: (state: Partial<MpesaPaymentState>) => void
//   ): Promise<void> {
//     let attempts = 0;
//     const maxAttempts = 3;
//     const interval = 30000; // 30 seconds

//     const poll = async (): Promise<void> => {
//       attempts++;
      
//       try {
//         const response = await fetch("/api/mpesa/query", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ checkoutRequestID }),
//         });

//         if (!response.ok) {
//           throw new Error("Query failed");
//         }

//         const data = await response.json();

//         if (data.ResultCode === "0") {
//           setState({
//             isPolling: false,
//             status: "success",
//             message: "Payment completed successfully!",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "paid" });
//           return;
//         }

//         if (data.ResultCode === "1032" || data.ResultCode === "1037" || data.ResultCode === "1001") {
//           const messages: { [key: string]: string } = {
//             "1032": "Payment was cancelled. You can try again.",
//             "1037": "Payment request expired. Please try again.", 
//             "1001": "Insufficient M-Pesa balance. Please top up and try again."
//           };
          
//           setState({
//             isPolling: false,
//             status: "failed",
//             message: messages[data.ResultCode],
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "failed" });
//           return;
//         }

//         // Continue polling if still pending
//         if (attempts < maxAttempts) {
//           setState({
//             message: `Checking payment status... (${maxAttempts - attempts} checks remaining)`,
//           });
//           setTimeout(poll, interval);
//         } else {
//           // Give up polling, rely on callback or manual check
//           setState({
//             isPolling: false,
//             status: "pending",
//             message: "Payment is being processed. You'll receive an SMS when complete. This page will auto-update when payment is confirmed.",
//           });
          
//           // Start listening for callback updates
//           this.listenForCallbackUpdate(checkoutRequestID, setState);
//         }
//       } catch (error) {
//         if (attempts < maxAttempts) {
//           setTimeout(poll, interval);
//         } else {
//           setState({
//             isPolling: false,
//             status: "pending", 
//             message: "Payment submitted. Check your M-Pesa messages for confirmation. This page will update automatically.",
//           });
          
//           this.listenForCallbackUpdate(checkoutRequestID, setState);
//         }
//       }
//     };

//     poll();
//   }

//   // Listen for callback updates via polling database or WebSocket
//   static listenForCallbackUpdate(
//     checkoutRequestID: string,
//     setState: (state: Partial<MpesaPaymentState>) => void
//   ): void {
//     const checkDatabase = async () => {
//       try {
//         const order = await DatabaseService.getOrder(checkoutRequestID);
//         if (order?.status === "paid") {
//           setState({
//             status: "success",
//             message: "Payment confirmed! Redirecting...",
//           });
//         } else if (order?.status === "failed" || order?.status === "cancelled") {
//           setState({
//             status: "failed",
//             message: "Payment was not completed. You can try again.",
//           });
//         } else {
//           // Check again in 15 seconds
//           setTimeout(checkDatabase, 15000);
//         }
//       } catch (error) {
//         // Continue checking
//         setTimeout(checkDatabase, 15000);
//       }
//     };

//     setTimeout(checkDatabase, 15000);
//   }
// }




// =========================PRODUCTION ==========================



// // services/mpesaService.ts
// import { MpesaPaymentState, OrderData, CustomerInfo } from "../app/lib/product";

// import { formatMpesaPhone } from "../utils/paymentUtils";
// import { DatabaseService } from "./databaseService";

// export class MpesaService {
//   static async initiateStkPush(
//     phone: string,
//     amount: number,
//     productId: string,
//     productTitle: string,
//     productPrice: string,
//     customerInfo: CustomerInfo,
//     supplier: string,
//     setState: (state: Partial<MpesaPaymentState>) => void
//   ): Promise<string | null> {
//     try {
//       setState({
//         isInitiating: true,
//         status: "initiated",
//         message: "Initiating M-Pesa payment...",
//       });

//       const formattedPhone = formatMpesaPhone(phone);
//       const controller = new AbortController();
//       const timeoutId = setTimeout(() => controller.abort(), 10000);

//       const response = await fetch("/api/mpesa/stk-push", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "User-Agent": "MyApp/1.0 (Node.js; Next.js)",
//         },
//         body: JSON.stringify({
//           phoneNumber: formattedPhone,
//           amount: amount,
//           accountReference: productId,
//           transactionDesc: `Payment for ${productTitle}`,
//         }),
//         signal: controller.signal,
//       });

//       clearTimeout(timeoutId);

//       let data;
//       try {
//         data = await response.json();
//       } catch (jsonError) {
//         throw new Error(
//           `Failed to parse response: ${
//             jsonError instanceof Error ? jsonError.message : "Unknown JSON parsing error"
//           }`
//         );
//       }

//       if (!response.ok) {
//         throw new Error(
//           data?.error
//             ? `API Error: ${data.error}`
//             : `HTTP Error: ${response.status} ${response.statusText}`
//         );
//       }

//       if (data.ResponseCode === "0") {
//         console.log("STK Push successful, creating initial order record...");

//         try {
//           const orderData: OrderData = {
//             productId: productId,
//             productTitle: productTitle,
//             price: productPrice,
//             supplier: supplier,
//             customerInfo: JSON.stringify(customerInfo),
//             paymentMethod: "mpesa",
//             transactionId: data.CheckoutRequestID,
//             status: "pending",
//             orderDate: new Date().toISOString(),
//             phoneNumber: formattedPhone,
//           };

//           await DatabaseService.createOrder(data.CheckoutRequestID, orderData);

//           console.log(`Initial order created: ${data.CheckoutRequestID}`);

//           setState({
//             isInitiating: false,
//             isPolling: true,
//             checkoutRequestID: data.CheckoutRequestID,
//             status: "polling",
//             message: "Please check your phone and enter M-Pesa PIN...",
//           });

//           return data.CheckoutRequestID;
//         } catch (createError) {
//           console.error("Failed to create initial order:", createError);
//           throw new Error("Failed to create order record");
//         }
//       } else {
//         throw new Error(data.ResponseDescription || "Payment initiation failed");
//       }
//     } catch (error) {
//       console.error("M-Pesa initiation error:", error);
//       setState({
//         isInitiating: false,
//         status: "failed",
//         message:
//           error instanceof Error ? error.message : "Failed to initiate payment",
//       });
//       return null;
//     }
//   }

//   static async pollPaymentStatus(
//     checkoutRequestID: string,
//     setState: (state: Partial<MpesaPaymentState>) => void
//   ): Promise<void> {
//     let attempts = 0;
//     const maxAttempts = 12; // 12 * 15s = 180s (3 minutes)
//     const pollInterval = 15000; // 15 seconds to stay under 5 requests/min
//     const maxRetries = 2; // Retry up to 2 times for 429/403 errors

//     const poll = async (retryCount = 0): Promise<void> => {
//       try {
//         attempts++;
//         console.log(`Polling attempt ${attempts} for CheckoutRequestID: ${checkoutRequestID}`);

//         const response = await fetch("/api/mpesa/query", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             "User-Agent": "MyApp/1.0 (Node.js; Next.js)",
//           },
//           body: JSON.stringify({
//             checkoutRequestID,
//           }),
//         });

//         let data;
//         try {
//           data = await response.json();
//           console.log("Poll response:", data);
//         } catch (jsonError) {
//           throw new Error(
//             `Failed to parse query response: ${
//               jsonError instanceof Error ? jsonError.message : "Unknown error"
//             }`
//           );
//         }

//         if (!response.ok) {
//           if (response.status === 429 || response.status === 403) {
//             if (retryCount < maxRetries) {
//               console.log(`Error (${response.status}), retrying (${retryCount + 1}/${maxRetries}) after delay...`);
//               await new Promise((resolve) => setTimeout(resolve, pollInterval));
//               return poll(retryCount + 1);
//             }
//             throw new Error(`Query failed after retries: ${response.statusText}`);
//           }
//           throw new Error(
//             data?.error ? `Query Error: ${data.error}` : `HTTP Error: ${response.status}`
//           );
//         }

//         if (data.ResultCode === "0") {
//           setState({
//             isPolling: false,
//             status: "success",
//             message: "Payment completed successfully!",
//           });

//           await DatabaseService.updateOrder(checkoutRequestID, { status: "paid" });
//           return;
//         } else if (data.ResultCode === "1032") {
//           setState({
//             isPolling: false,
//             status: "failed",
//             message: "Payment was cancelled by user. Please try again.",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "cancelled" });
//           return;
//         } else if (data.ResultCode === "1037") {
//           setState({
//             isPolling: false,
//             status: "timeout",
//             message: "Payment request timed out. Please try again.",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
//           return;
//         } else if (data.ResultCode === "1" && data.ResultDesc.includes("pending")) {
//           if (attempts < maxAttempts) {
//             setState({
//               message: `Waiting for payment confirmation... (${attempts}/${maxAttempts})`,
//             });
//             setTimeout(() => poll(0), pollInterval);
//           } else {
//             setState({
//               isPolling: false,
//               status: "timeout",
//               message: "Payment confirmation timeout. Please check your M-Pesa messages.",
//             });
//             await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
//           }
//         } else {
//           setState({
//             isPolling: false,
//             status: "failed",
//             message: data.ResultDesc || "Payment failed. Please try again.",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "failed" });
//         }
//       } catch (error) {
//         console.error("Polling error:", error);
//         if (error instanceof Error && (error.message.includes("Forbidden") || error.message.includes("Too Many Requests"))) {
//           if (retryCount < maxRetries) {
//             console.log(`Error (${error.message}), retrying (${retryCount + 1}/${maxRetries}) after delay...`);
//             await new Promise((resolve) => setTimeout(resolve, pollInterval));
//             return poll(retryCount + 1);
//           }
//           setState({
//             isPolling: false,
//             status: "pending",
//             message: "Unable to verify payment due to server restrictions. Please wait for confirmation or try again later.",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "pending" });
//           return;
//         }
//         if (attempts < maxAttempts) {
//           setTimeout(() => poll(0), pollInterval);
//         } else {
//           setState({
//             isPolling: false,
//             status: "timeout",
//             message: "Unable to confirm payment status. Please check your M-Pesa messages.",
//           });
//           await DatabaseService.updateOrder(checkoutRequestID, { status: "timeout" });
//         }
//       }
//     };

//     setTimeout(() => poll(0), pollInterval);
//   }
// }