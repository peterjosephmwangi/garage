// app/(root)/checkout/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/lib/store/cartStore";
import { ArrowLeft, CreditCard, Smartphone, DollarSign } from "lucide-react";

interface MpesaState {
  isInitiating: boolean;
  isPolling: boolean;
  message: string;
  status: 'idle' | 'initiating' | 'polling' | 'success' | 'failed' | 'timeout';
}

interface CardInfo {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mpesaPhone, setMpesaPhone] = useState<string>("");
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  
  const [mpesaState, setMpesaState] = useState<MpesaState>({
    isInitiating: false,
    isPolling: false,
    message: "",
    status: 'idle'
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push("/");
    }
  }, [items, router]);

  const isValidMpesaPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const kenyanPhoneRegex = /^(?:254|\+254|0)?([17]\d{8})$/;
    return kenyanPhoneRegex.test(cleanPhone);
  };

  const isValidCard = (): boolean => {
    return (
      cardInfo.cardName.length > 0 &&
      cardInfo.cardNumber.length >= 13 &&
      cardInfo.expiryDate.length >= 4 &&
      cardInfo.cvv.length >= 3
    );
  };

  const handleMpesaPayment = async () => {
    if (!isValidMpesaPhone(mpesaPhone)) {
      setMpesaState({
        ...mpesaState,
        message: "Please enter a valid Safaricom number",
        status: 'failed'
      });
      return;
    }

    setIsProcessing(true);
    setMpesaState({
      isInitiating: true,
      isPolling: false,
      message: "Initiating M-Pesa payment...",
      status: 'initiating'
    });

    try {
      // Simulate M-Pesa STK Push
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setMpesaState({
        isInitiating: false,
        isPolling: true,
        message: "Please check your phone and enter your M-Pesa PIN",
        status: 'polling'
      });

      // Simulate polling for payment confirmation
      await new Promise(resolve => setTimeout(resolve, 10000));
      
      setMpesaState({
        isInitiating: false,
        isPolling: false,
        message: "Payment successful! Order confirmed.",
        status: 'success'
      });

      // Clear cart and redirect after success
      setTimeout(() => {
        clearCart();
        router.push("/order-confirmation");
      }, 2000);

    } catch (error) {
      setMpesaState({
        isInitiating: false,
        isPolling: false,
        message: "Payment failed. Please try again.",
        status: 'failed'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCardPayment = async () => {
    if (!isValidCard()) {
      alert("Please fill in all card details correctly");
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate card processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      alert("Card payment processed successfully!");
      clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      alert("Card payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate PayPal processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert("PayPal payment processed successfully!");
      clearCart();
      router.push("/order-confirmation");
    } catch (error) {
      alert("PayPal payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method");
      return;
    }

    switch (selectedPaymentMethod) {
      case "mpesa":
        handleMpesaPayment();
        break;
      case "card":
        handleCardPayment();
        break;
      case "paypal":
        handlePayPalPayment();
        break;
      default:
        alert("Invalid payment method selected");
    }
  };

  if (items.length === 0) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-blue-800 mb-6 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Payment Method
              </h3>
              <div className="space-y-4">
                {/* M-Pesa */}
                <div className="border border-gray-300 rounded-lg p-4 hover:border-blue-300 transition">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={selectedPaymentMethod === "mpesa"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing}
                    />
                    <div className="flex items-center">
                      <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <Smartphone size={16} className="mr-1" />
                        M-PESA
                      </div>
                      <span className="font-medium">Pay with M-Pesa</span>
                    </div>
                  </label>
                  {selectedPaymentMethod === "mpesa" && (
                    <div className="mt-4 space-y-3 ml-7">
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
                <div className="border border-gray-300 rounded-lg p-4 hover:border-blue-300 transition">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing}
                    />
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <CreditCard size={16} className="mr-1" />
                        CARD
                      </div>
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </label>
                  {selectedPaymentMethod === "card" && (
                    <div className="mt-4 space-y-3 ml-7">
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
                        placeholder="Card Number (1234 5678 9012 3456)"
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
                <div className="border border-gray-300 rounded-lg p-4 hover:border-blue-300 transition">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={selectedPaymentMethod === "paypal"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing}
                    />
                    <div className="flex items-center">
                      <div className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <DollarSign size={16} className="mr-1" />
                        PayPal
                      </div>
                      <span className="font-medium">Pay with PayPal</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-blue-800 mb-6">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="font-semibold text-blue-800 mb-6">Order Summary</h3>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.$id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {item.imageUrl && (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-800 truncate text-sm">
                        {item.title}
                      </h4>
                      <p className="text-gray-600 text-xs">
                        Qty: {item.quantity} × Ksh {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>Ksh {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>Ksh 0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>Ksh 0</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold text-lg text-blue-800">
                    <span>Total</span>
                    <span>Ksh {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Process Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={!selectedPaymentMethod || isProcessing}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-bold transition ${
                  !selectedPaymentMethod || isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Pay Ksh ${getTotalPrice().toLocaleString()}`
                )}
              </button>

              {/* Security Notice */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-700 text-center">
                  🔒 Your payment information is secure and encrypted
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;