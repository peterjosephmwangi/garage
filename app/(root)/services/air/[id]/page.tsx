"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { databases } from "@/app/lib/appwrite";
import { Query } from "appwrite";

const databaseId = "680716c20000a52ce526";
const collectionId = "6807170100118fcdb939"; // Products collection
const ordersCollectionId = "orders_6807170100118fcdb939"; // Orders collection

export interface NewAirConditionProduct {
  $id: string;
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageFile?: File;
  imageUrl?: string;
}

export interface AirConditionProduct extends NewAirConditionProduct {
  $id: string;
  $createdAt?: string;
  $updatedAt?: string;
  $permissions?: string[];
  $databaseId?: string;
  $collectionId?: string;
}

interface PaymentModalProps {
  product: AirConditionProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface MpesaPaymentState {
  isInitiating: boolean;
  isPolling: boolean;
  checkoutRequestID: string | null;
  status: "idle" | "initiated" | "polling" | "success" | "failed" | "timeout" | "pending";
  message: string;
}

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
  mpesaReceiptNumber?: string; // Renamed for clarity
  transactionDate?: string;
  callbackData?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [cardInfo, setCardInfo] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");

  const [mpesaState, setMpesaState] = useState<MpesaPaymentState>({
    isInitiating: false,
    isPolling: false,
    checkoutRequestID: null,
    status: "idle",
    message: "",
  });

  // Extract numeric price from string like "KES 45,000"
  const extractNumericPrice = (priceString: string): number => {
    const numericString = priceString.replace(/[^\d.-]/g, "");
    return parseFloat(numericString) || 0;
  };

  // Format phone number for M-Pesa
  const formatMpesaPhone = (phone: string): string => {
    let cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) {
      cleaned = "254" + cleaned.slice(1);
    } else if (cleaned.startsWith("+254")) {
      cleaned = cleaned.slice(1);
    } else if (cleaned.startsWith("254")) {
      // Already in correct format
    } else if (cleaned.length === 9) {
      cleaned = "254" + cleaned;
    }
    return cleaned;
  };

  // Validate M-Pesa phone number
  const isValidMpesaPhone = (phone: string): boolean => {
    const formatted = formatMpesaPhone(phone);
    return /^254[17]\d{8}$/.test(formatted);
  };

  const createOrderRecord = async (
    transactionId: string,
    paymentMethod: string,
    status: string
  ): Promise<void> => {
    try {
      const orderData: OrderData = {
        productId: product.$id,
        productTitle: product.title,
        price: product.price,
        supplier: product.supplier,
        customerInfo: JSON.stringify(customerInfo),
        paymentMethod,
        transactionId,
        status,
        orderDate: new Date().toISOString(),
        phoneNumber: paymentMethod === "mpesa" ? formatMpesaPhone(mpesaPhone) : undefined,
      };

      await databases.createDocument(
        databaseId,
        ordersCollectionId,
        transactionId,
        orderData
      );

      console.log("Order created:", { transactionId, status });
    } catch (error) {
      console.error("Failed to create order record:", error);
      throw new Error("Failed to save order to database");
    }
  };

  const updateOrderRecord = async (
    transactionId: string,
    updates: Partial<OrderData>
  ): Promise<void> => {
    try {
      // Truncate callbackData to 255 characters if present
      const truncatedUpdates: Partial<OrderData> = {
        ...updates,
        callbackData: updates.callbackData ? updates.callbackData.slice(0, 255) : updates.callbackData,
      };

      console.log(`Updating order ${transactionId} with:`, truncatedUpdates);
      await databases.updateDocument(
        databaseId,
        ordersCollectionId,
        transactionId,
        truncatedUpdates
      );
      console.log(`Order updated successfully: ${transactionId}`);
    } catch (error) {
      console.error("Error updating order:", {
        error,
        databaseId,
        ordersCollectionId,
        transactionId,
        updates,
      });
      throw new Error(`Failed to update order record: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const initiateMpesaPayment = async (): Promise<void> => {
    try {
      setMpesaState((prev) => ({
        ...prev,
        isInitiating: true,
        status: "initiated",
        message: "Initiating M-Pesa payment...",
      }));

      const formattedPhone = formatMpesaPhone(mpesaPhone);
      // const numericAmount = extractNumericPrice(product.price);
      const numericAmount = 2;


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
          amount: numericAmount,
          accountReference: product.$id,
          transactionDesc: `Payment for ${product.title}`,
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
            productId: product.$id,
            productTitle: product.title,
            price: product.price,
            supplier: product.supplier,
            customerInfo: JSON.stringify(customerInfo),
            paymentMethod: "mpesa",
            transactionId: data.CheckoutRequestID,
            status: "pending",
            orderDate: new Date().toISOString(),
            phoneNumber: formattedPhone,
          };

          await databases.createDocument(
            databaseId,
            ordersCollectionId,
            data.CheckoutRequestID,
            orderData
          );

          console.log(`Initial order created: ${data.CheckoutRequestID}`);

          setMpesaState((prev) => ({
            ...prev,
            isInitiating: false,
            isPolling: true,
            checkoutRequestID: data.CheckoutRequestID,
            status: "polling",
            message: "Please check your phone and enter M-Pesa PIN...",
          }));

          pollPaymentStatus(data.CheckoutRequestID);
        } catch (createError) {
          console.error("Failed to create initial order:", createError);
          throw new Error("Failed to create order record");
        }
      } else {
        throw new Error(data.ResponseDescription || "Payment initiation failed");
      }
    } catch (error) {
      console.error("M-Pesa initiation error:", error);
      setMpesaState((prev) => ({
        ...prev,
        isInitiating: false,
        status: "failed",
        message:
          error instanceof Error ? error.message : "Failed to initiate payment",
      }));
    }
  };

  const pollPaymentStatus = async (checkoutRequestID: string): Promise<void> => {
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
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "success",
            message: "Payment completed successfully!",
          }));

          await updateOrderRecord(checkoutRequestID, { status: "paid" });
          setTimeout(() => {
            onSuccess();
          }, 1500);
          return;
        } else if (data.ResultCode === "1032") {
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "failed",
            message: "Payment was cancelled by user. Please try again.",
          }));
          await updateOrderRecord(checkoutRequestID, { status: "cancelled" });
          return;
        } else if (data.ResultCode === "1037") {
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "timeout",
            message: "Payment request timed out. Please try again.",
          }));
          await updateOrderRecord(checkoutRequestID, { status: "timeout" });
          return;
        } else if (data.ResultCode === "1" && data.ResultDesc.includes("pending")) {
          if (attempts < maxAttempts) {
            setMpesaState((prev) => ({
              ...prev,
              message: `Waiting for payment confirmation... (${attempts}/${maxAttempts})`,
            }));
            setTimeout(() => poll(0), pollInterval);
          } else {
            setMpesaState((prev) => ({
              ...prev,
              isPolling: false,
              status: "timeout",
              message: "Payment confirmation timeout. Please check your M-Pesa messages.",
            }));
            await updateOrderRecord(checkoutRequestID, { status: "timeout" });
          }
        } else {
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "failed",
            message: data.ResultDesc || "Payment failed. Please try again.",
          }));
          await updateOrderRecord(checkoutRequestID, { status: "failed" });
        }
      } catch (error) {
        console.error("Polling error:", error);
        if (error instanceof Error && (error.message.includes("Forbidden") || error.message.includes("Too Many Requests"))) {
          if (retryCount < maxRetries) {
            console.log(`Error (${error.message}), retrying (${retryCount + 1}/${maxRetries}) after delay...`);
            await new Promise((resolve) => setTimeout(resolve, pollInterval));
            return poll(retryCount + 1);
          }
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "pending",
            message: "Unable to verify payment due to server restrictions. Please wait for confirmation or try again later.",
          }));
          await updateOrderRecord(checkoutRequestID, { status: "pending" });
          return;
        }
        if (attempts < maxAttempts) {
          setTimeout(() => poll(0), pollInterval);
        } else {
          setMpesaState((prev) => ({
            ...prev,
            isPolling: false,
            status: "timeout",
            message: "Unable to confirm payment status. Please check your M-Pesa messages.",
          }));
          await updateOrderRecord(checkoutRequestID, { status: "timeout" });
        }
      }
    };

    setTimeout(() => poll(0), pollInterval);
  };

  const simulatePaymentProcess = (method: string, identifier: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error(`${method} payment failed`));
        }
      }, 3000);
    });
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      if (selectedPaymentMethod === "mpesa") {
        await initiateMpesaPayment();
      } else if (selectedPaymentMethod === "card") {
        await simulatePaymentProcess("Card", cardInfo.cardNumber);
        await createOrderRecord("card_" + Date.now(), "card", "paid");
        onSuccess();
      } else if (selectedPaymentMethod === "paypal") {
        await simulatePaymentProcess("PayPal", customerInfo.email);
        await createOrderRecord("paypal_" + Date.now(), "paypal", "paid");
        onSuccess();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      if (selectedPaymentMethod !== "mpesa") {
        setIsProcessing(false);
      }
    }
  };

  const isFormValid = () => {
    const basicInfoValid = customerInfo.name && customerInfo.email && customerInfo.phone;

    if (!basicInfoValid || !selectedPaymentMethod) return false;

    if (selectedPaymentMethod === "card") {
      return cardInfo.cardNumber && cardInfo.expiryDate && cardInfo.cvv && cardInfo.cardName;
    } else if (selectedPaymentMethod === "mpesa") {
      return mpesaPhone && isValidMpesaPhone(mpesaPhone);
    }

    return true;
  };

  useEffect(() => {
    if (!isOpen || selectedPaymentMethod !== "mpesa") {
      setMpesaState({
        isInitiating: false,
        isPolling: false,
        checkoutRequestID: null,
        status: "idle",
        message: "",
      });
    }
  }, [isOpen, selectedPaymentMethod]);

  useEffect(() => {
    if (selectedPaymentMethod === "mpesa") {
      setIsProcessing(mpesaState.isInitiating || mpesaState.isPolling);
    }
  }, [mpesaState.isInitiating, mpesaState.isPolling, selectedPaymentMethod]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-blue-800">Complete Your Purchase</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
              disabled={isProcessing}
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">Order Summary</h3>
            <div className="flex justify-between items-center">
              <span>{product.title}</span>
              <span className="font-bold text-blue-800">{product.price}</span>
            </div>
            <div className="text-sm text-blue-600 mt-1">Supplier: {product.supplier}</div>
          </div>

          {/* Customer Information */}
          <div className="mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Full Name"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
              <input
                type="text"
                placeholder="Delivery Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
              />
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-6">
            <h3 className="font-semibold text-blue-800 mb-3">Payment Method</h3>
            <div className="space-y-3">
              {/* M-Pesa */}
              <div className="border border-gray-300 rounded-lg p-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="mpesa"
                    checked={selectedPaymentMethod === "mpesa"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                    disabled={isProcessing}
                  />
                  <div className="flex items-center">
                    <div className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold mr-3">
                      M-PESA
                    </div>
                    <span>Pay with M-Pesa</span>
                  </div>
                </label>
                {selectedPaymentMethod === "mpesa" && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="tel"
                      placeholder="M-Pesa Phone Number (0712345678 or 254712345678)"
                      value={mpesaPhone}
                      onChange={(e) => setMpesaPhone(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                        mpesaPhone && !isValidMpesaPhone(mpesaPhone)
                          ? "border-red-300 focus:ring-red-500"
                          : "border-gray-300 focus:ring-blue-500"
                      }`}
                      disabled={isProcessing}
                    />
                    {mpesaPhone && !isValidMpesaPhone(mpesaPhone) && (
                      <p className="text-red-500 text-sm">
                        Please enter a valid Safaricom number (e.g., 0712345678)
                      </p>
                    )}

                    {/* M-Pesa Status Messages */}
                    {selectedPaymentMethod === "mpesa" && mpesaState.message && (
                      <div
                        className={`p-3 rounded-lg ${
                          mpesaState.status === "success"
                            ? "bg-green-100 text-green-700"
                            : mpesaState.status === "failed"
                            ? "bg-red-100 text-red-700"
                            : mpesaState.status === "timeout"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <div className="flex items-center">
                          {mpesaState.isInitiating || mpesaState.isPolling ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
                          ) : null}
                          <span className="text-sm">{mpesaState.message}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Credit/Debit Card */}
              <div className="border border-gray-300 rounded-lg p-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={selectedPaymentMethod === "card"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                    disabled={isProcessing}
                  />
                  <div className="flex items-center">
                    <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold mr-3">
                      CARD
                    </div>
                    <span>Credit/Debit Card</span>
                  </div>
                </label>
                {selectedPaymentMethod === "card" && (
                  <div className="mt-3 space-y-3">
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardInfo.cardName}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cardName: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                    <input
                      type="text"
                      placeholder="Card Number"
                      value={cardInfo.cardNumber}
                      onChange={(e) =>
                        setCardInfo({ ...cardInfo, cardNumber: e.target.value })
                      }
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      disabled={isProcessing}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardInfo.expiryDate}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, expiryDate: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        value={cardInfo.cvv}
                        onChange={(e) =>
                          setCardInfo({ ...cardInfo, cvv: e.target.value })
                        }
                        className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* PayPal */}
              <div className="border border-gray-300 rounded-lg p-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={selectedPaymentMethod === "paypal"}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3"
                    disabled={isProcessing}
                  />
                  <div className="flex items-center">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-bold mr-3">
                      PayPal
                    </div>
                    <span>Pay with PayPal</span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={!isFormValid() || isProcessing}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  {selectedPaymentMethod === "mpesa" ? (
                    mpesaState.isInitiating ? "Initiating..." : "Waiting for confirmation..."
                  ) : (
                    "Processing..."
                  )}
                </>
              ) : (
                `Pay ${product.price}`
              )}
            </button>
          </div>

          {/* M-Pesa Instructions */}
          {selectedPaymentMethod === "mpesa" && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2">M-Pesa Payment Instructions:</h4>
              <ol className="text-sm text-green-700 list-decimal list-inside space-y-1">
                <li>Click "Pay {product.price}" to initiate payment</li>
                <li>Check your phone for M-Pesa PIN prompt</li>
                <li>Enter your M-Pesa PIN to complete payment</li>
                <li>Wait for confirmation message</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ServiceDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const router = useRouter();
  const [product, setProduct] = useState<AirConditionProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [productId, setProductId] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        setProductId(id);

        const response = await databases.getDocument(databaseId, collectionId, id);
        setProduct(response as AirConditionProduct);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params]);

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false);
    setShowSuccessModal(true);

    // Auto-close success modal after 3 seconds
    setTimeout(() => {
      setShowSuccessModal(false);
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-blue-800">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-4">{error}</h2>
          <button
            onClick={() => router.push("/services/air")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Air Conditioning Services
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-blue-50 py-12 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Product not found</h2>
          <button
            onClick={() => router.push("/services/air")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Air Conditioning Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/air")}
          >
            Air Conditioning Services
          </span>{" "}
          / <span className="text-blue-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-72 object-contain"
              />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">{product.title}</h1>
            <p className="text-blue-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Features:</h3>
              <ul className="list-disc pl-6 text-blue-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Supplier: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Price: <span className="text-2xl text-blue-800">{product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-blue-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition flex-1 md:flex-none"
              >
                Buy Now
              </button>
              <button
                onClick={() => alert("Added to cart!")}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-blue-800 font-bold rounded-lg transition flex-1 md:flex-none"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {product.supplier && productId && (
          <RelatedProducts currentProductId={productId} supplier={product.supplier} />
        )}
      </div>

      {/* Payment Modal */}
      {product && (
        <PaymentModal
          product={product}
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 text-center max-w-md mx-4">
            <div className="text-green-500 text-6xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-green-600 mb-2">Payment Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your order has been placed successfully. You will receive a confirmation email shortly.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const RelatedProducts = ({
  currentProductId,
  supplier,
}: {
  currentProductId: string;
  supplier: string;
}) => {
  const [relatedProducts, setRelatedProducts] = useState<AirConditionProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        const response = await databases.listDocuments(databaseId, collectionId, [
          Query.equal("supplier", supplier),
          Query.notEqual("$id", currentProductId),
          Query.limit(3),
        ]);
        setRelatedProducts(response.documents as AirConditionProduct[]);
      } catch (err) {
        console.error("Error fetching related products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, supplier]);

  if (loading) return null;
  if (relatedProducts.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
        More from {supplier}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {relatedProducts.map((product) => (
          <div
            key={product.$id}
            className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
              />
            )}
            <h3 className="text-xl font-bold text-blue-800 mb-2">{product.title}</h3>
            <p className="text-blue-600 line-clamp-2">{product.description}</p>
            <p className="text-lg font-semibold text-blue-800 mt-4">{product.price}</p>
            <button
              onClick={() => router.push(`/services/air/${product.$id}`)}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full"
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;