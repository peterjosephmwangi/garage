// services/mpesaService.ts
import { MpesaPaymentState, OrderData, CustomerInfo } from "../app/lib/product";

import { formatMpesaPhone } from "../utils/paymentUtils";
import { DatabaseService } from "./databaseService";

export class MpesaService {
  static async initiateStkPush(
    phone: string,
    amount: number,
    productId: string,
    productTitle: string,
    productPrice: string,
    customerInfo: CustomerInfo,
    supplier: string,
    setState: (state: Partial<MpesaPaymentState>) => void
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