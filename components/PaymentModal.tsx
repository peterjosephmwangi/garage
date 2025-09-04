"use client";

import React, { useState, useEffect } from "react";
import { AirConditionProduct, CustomerInfo, CardInfo } from "../app/lib/product";
import { DatabaseService } from "../services/databaseService";
import { useMpesaPayment } from "../hooks/useMpesaPayment";
import { isValidMpesaPhone, simulatePaymentProcess, extractNumericPrice } from "../utils/paymentUtils";

interface PaymentModalProps {
  product: AirConditionProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  product,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardName: "",
  });
  const [mpesaPhone, setMpesaPhone] = useState("");

  const { mpesaState, initiateMpesaPayment, isProcessing: mpesaProcessing } = useMpesaPayment(
    selectedPaymentMethod,
    isOpen
  );

  const handlePayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      if (selectedPaymentMethod === "mpesa") {
        await initiateMpesaPayment(mpesaPhone, product, customerInfo, onSuccess);
      } else if (selectedPaymentMethod === "card") {
        await simulatePaymentProcess("Card", cardInfo.cardNumber);
        await DatabaseService.createOrder("card_" + Date.now(), {
          productId: product.$id,
          productTitle: product.title,
          price: product.price,
          supplier: product.supplier,
          customerInfo: JSON.stringify(customerInfo),
          paymentMethod: "card",
          transactionId: "card_" + Date.now(),
          status: "paid",
          orderDate: new Date().toISOString(),
        });
        onSuccess();
      } else if (selectedPaymentMethod === "paypal") {
        await simulatePaymentProcess("PayPal", customerInfo.email);
        await DatabaseService.createOrder("paypal_" + Date.now(), {
          productId: product.$id,
          productTitle: product.title,
          price: product.price,
          supplier: product.supplier,
          customerInfo: JSON.stringify(customerInfo),
          paymentMethod: "paypal",
          transactionId: "paypal_" + Date.now(),
          status: "paid",
          orderDate: new Date().toISOString(),
        });
        onSuccess();
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setErrorMessage(error instanceof Error ? error.message : "Payment failed. Please try again.");
    } finally {
      if (selectedPaymentMethod !== "mpesa") {
        setIsProcessing(false);
      }
    }
  };

  const isFormValid = () => {
    const basicInfoValid =
      customerInfo.name &&
      customerInfo.email &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email) &&
      customerInfo.phone;

    if (!basicInfoValid || !selectedPaymentMethod) return false;

    if (selectedPaymentMethod === "card") {
      return (
        cardInfo.cardName &&
        cardInfo.cardNumber.length >= 16 &&
        /^\d{2}\/\d{2}$/.test(cardInfo.expiryDate) &&
        cardInfo.cvv.length === 3
      );
    } else if (selectedPaymentMethod === "mpesa") {
      return mpesaPhone && isValidMpesaPhone(mpesaPhone);
    } else if (selectedPaymentMethod === "paypal") {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email);
    }

    return true;
  };

  useEffect(() => {
    if (selectedPaymentMethod === "mpesa") {
      setIsProcessing(mpesaProcessing);
    }
  }, [mpesaProcessing, selectedPaymentMethod]);

  useEffect(() => {
    if (!isOpen) {
      setCustomerInfo({ name: "", email: "", phone: "", address: "" });
      setCardInfo({ cardNumber: "", expiryDate: "", cvv: "", cardName: "" });
      setMpesaPhone("");
      setSelectedPaymentMethod("");
      setErrorMessage(null);
    }
  }, [isOpen]);

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
                aria-label="Full Name"
              />
              <input
                type="email"
                placeholder="Email Address"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
                aria-label="Email Address"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
                aria-label="Phone Number"
              />
              <input
                type="text"
                placeholder="Delivery Address"
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isProcessing}
                aria-label="Delivery Address"
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
                      aria-label="M-Pesa Phone Number"
                    />
                    {mpesaPhone && !isValidMpesaPhone(mpesaPhone) && (
                      <p className="text-red-500 text-sm">
                        Please enter a valid Safaricom number (e.g., 0712345678)
                      </p>
                    )}
                    {mpesaState.message && (
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
                      aria-label="Cardholder Name"
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
                      aria-label="Card Number"
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
                        aria-label="Expiry Date"
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
                        aria-label="CVV"
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

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              <span className="text-sm">{errorMessage}</span>
            </div>
          )}

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
                <li>Click "Pay {extractNumericPrice(product.price)} KES" to initiate payment</li>
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

export default PaymentModal;