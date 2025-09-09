"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/app/lib/store/cartStore";
import { ArrowLeft, CreditCard, Smartphone, DollarSign, User, Zap } from "lucide-react";
import { useMpesaPayment } from "../../../hooks/useMpesaPayment";
import { useStripePayment, PaymentProduct } from "../../../hooks/useStripePayment";
import { DatabaseService } from "../../../services/databaseService";
import { CustomerInfo, CardInfo, CartItem } from "../../lib/product";
import { isValidMpesaPhone, simulatePaymentProcess } from "../../../utils/paymentUtils";
import { formatMpesaPhone, extractNumericPrice } from "../../../utils/paymentUtils";

const CheckoutPage: React.FC = () => {
  const router = useRouter();
  const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mpesaPhone, setMpesaPhone] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
  
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  // Use existing M-Pesa hook
  const { mpesaState, initiateMpesaPayment, isProcessing: mpesaProcessing } = useMpesaPayment(
    selectedPaymentMethod,
    true // Always consider modal "open" for checkout
  );

  // Use Stripe hook
  const { initiatePayment: initiateStripePayment, isLoading: stripeLoading, error: stripeError, clearError: clearStripeError } = useStripePayment();

  // Redirect if cart is empty, but not after successful payment
  useEffect(() => {
    if (items.length === 0 && !isPaymentSuccessful) {
      router.push("/");
    }
  }, [items, router, isPaymentSuccessful]);

  // Sync processing state with payment methods
  useEffect(() => {
    if (selectedPaymentMethod === "mpesa") {
      setIsProcessing(mpesaProcessing);
    } else if (selectedPaymentMethod === "stripe") {
      setIsProcessing(stripeLoading);
    }
  }, [mpesaProcessing, stripeLoading, selectedPaymentMethod]);

  // Handle Stripe errors
  useEffect(() => {
    if (stripeError) {
      setErrorMessage(stripeError);
    }
  }, [stripeError]);

  // Create a virtual product representing the cart
  const createCartProduct = () => ({
    $id: `CART-${Date.now()}`,
    title: `Cart with ${getTotalItems()} items`,
    description: `Order containing ${items.map(item => item.title).join(', ')}`,
    features: items.map(item => `${item.quantity}x ${item.title}`),
    price: `KES ${getTotalPrice().toLocaleString()}`,
    supplier: "Multiple suppliers",
    rating: 5,
    reviews: 0,
    imageUrl: items[0]?.imageUrl || "",
  });

  // Create Stripe product object
  const createStripeProduct = (): PaymentProduct => ({
    id: `CART-${Date.now()}`,
    title: `Cart with ${getTotalItems()} items`,
    price: getTotalPrice().toString(),
    description: `Order containing ${items.map(item => `${item.quantity}x ${item.title}`).join(', ')}`,
    imageUrl: items[0]?.imageUrl,
    supplier: "Multiple suppliers",
    serviceType: "cart"
  });

  const isValidCard = (): boolean => {
    return (
      cardInfo.cardName.length > 0 &&
      cardInfo.cardNumber.length >= 13 &&
      cardInfo.expiryDate.length >= 4 &&
      cardInfo.cvv.length >= 3
    );
  };

  const isValidCustomerInfo = (): boolean => {
    return (
      customerInfo.name.trim() !== "" &&
      customerInfo.email.trim() !== "" &&
      customerInfo.phone.trim() !== "" &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
    );
  };

  const canProceedWithPayment = (): boolean => {
    if (!isValidCustomerInfo() || !selectedPaymentMethod) {
      return false;
    }

    switch (selectedPaymentMethod) {
      case "mpesa":
        return isValidMpesaPhone(mpesaPhone);
      case "card":
        return isValidCard();
      case "paypal":
      case "stripe":
        return true;
      default:
        return false;
    }
  };

  const handlePaymentSuccess = (transactionId: string = `CART-${Date.now()}`) => {
    setIsPaymentSuccessful(true); // Set flag before clearing cart
    const cartProduct = createCartProduct();
    clearCart();
    router.push(
      `/payment/success?transactionId=${encodeURIComponent(transactionId)}` +
      `&amount=${encodeURIComponent(getTotalPrice())}` +
      `&customerEmail=${encodeURIComponent(customerInfo.email)}` +
      `&productName=${encodeURIComponent(cartProduct.title)}` +
      `&paymentMethod=${encodeURIComponent(selectedPaymentMethod)}`
    );
  };
  const handleMpesaPayment = async () => {
    if (!isValidMpesaPhone(mpesaPhone)) {
      setErrorMessage("Please enter a valid Safaricom number");
      return;
    }
  
    setErrorMessage(null);
    const cartProduct = createCartProduct();
  
    try {
      await initiateMpesaPayment(
        mpesaPhone,
        cartProduct,
        customerInfo,
        (checkoutRequestID?: string) => handlePaymentSuccess(checkoutRequestID || `MPESA-${Date.now()}`)
      );
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "M-Pesa payment failed");
    }
  };

  // const handleMpesaPayment = async () => {
  //   if (!isValidMpesaPhone(mpesaPhone)) {
  //     setErrorMessage("Please enter a valid Safaricom number");
  //     return;
  //   }

  //   setErrorMessage(null);
  //   const cartProduct = createCartProduct();
    
  //   try {
  //     await initiateMpesaPayment(
  //       mpesaPhone,
  //       cartProduct,
  //       customerInfo,
  //       (checkoutRequestID?: string) => handlePaymentSuccess(checkoutRequestID || `MPESA-${Date.now()}`),
  //       items as CartItem[]
  //     );
  //   } catch (error) {
  //     setErrorMessage(error instanceof Error ? error.message : "M-Pesa payment failed");
  //   }
  // };

  const handleStripePayment = async () => {
    setErrorMessage(null);
    clearStripeError();
    
    try {
      const stripeProduct = createStripeProduct();
      
      // Store customer info in localStorage for success page (temporary solution)
      localStorage.setItem('checkout_customer_info', JSON.stringify(customerInfo));
      localStorage.setItem('checkout_cart_items', JSON.stringify(items));
      
      // Initiate Stripe payment - this will redirect to Stripe Checkout
      await initiateStripePayment(stripeProduct, getTotalItems());
      
      // If we reach here, there was an error (successful payments redirect away)
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Stripe payment failed");
    }
  };

  const handleCardPayment = async () => {
    if (!isValidCard()) {
      setErrorMessage("Please fill in all card details correctly");
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      await simulatePaymentProcess("Card", cardInfo.cardNumber);
      
      const transactionId = `CARD-${Date.now()}`;
      await DatabaseService.createOrder(transactionId, {
        productId: `CART-${Date.now()}`,
        productTitle: `Cart with ${getTotalItems()} items`,
        price: `KES ${getTotalPrice().toLocaleString()}`,
        supplier: "Multiple suppliers",
        customerInfo: JSON.stringify(customerInfo),
        paymentMethod: "card",
        transactionId: transactionId,
        status: "paid",
        orderDate: new Date().toISOString(),
        cartItems: JSON.stringify(
          items.map(item => ({
            productId: item.$id,
            title: item.title,
            price: extractNumericPrice(item.price),
            quantity: item.quantity,
            supplier: item.supplier,
            imageUrl: item.imageUrl || '',
            subtotal: extractNumericPrice(item.price) * item.quantity
          }))
        ),
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        orderType: "cart",
        supplierList: [...new Set(items.map(item => item.supplier))].join(", "),
      });
      
      handlePaymentSuccess(transactionId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Card payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayPalPayment = async () => {
    setIsProcessing(true);
    setErrorMessage(null);
    
    try {
      await simulatePaymentProcess("PayPal", customerInfo.email);
      
      const transactionId = `PAYPAL-${Date.now()}`;
      await DatabaseService.createOrder(transactionId, {
        productId: `CART-${Date.now()}`,
        productTitle: `Cart with ${getTotalItems()} items`,
        price: `KES ${getTotalPrice().toLocaleString()}`,
        supplier: "Multiple suppliers",
        customerInfo: JSON.stringify(customerInfo),
        paymentMethod: "paypal",
        transactionId: transactionId,
        status: "paid",
        orderDate: new Date().toISOString(),
        cartItems: JSON.stringify(
          items.map(item => ({
            productId: item.$id,
            title: item.title,
            price: extractNumericPrice(item.price),
            quantity: item.quantity,
            supplier: item.supplier,
            imageUrl: item.imageUrl || '',
            subtotal: extractNumericPrice(item.price) * item.quantity
          }))
        ),
        itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
        orderType: "cart",
        supplierList: [...new Set(items.map(item => item.supplier))].join(", "),
      });
      
      handlePaymentSuccess(transactionId);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "PayPal payment failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleProcessPayment = () => {
    if (!isValidCustomerInfo()) {
      setErrorMessage("Please fill in all customer information fields correctly");
      return;
    }

    if (!selectedPaymentMethod) {
      setErrorMessage("Please select a payment method");
      return;
    }

    switch (selectedPaymentMethod) {
      case "mpesa":
        handleMpesaPayment();
        break;
      case "stripe":
        handleStripePayment();
        break;
      case "card":
        handleCardPayment();
        break;
      case "paypal":
        handlePayPalPayment();
        break;
      default:
        setErrorMessage("Invalid payment method selected");
    }
  };

  if (items.length === 0 && !isPaymentSuccessful) {
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
            disabled={isProcessing}
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Customer Info & Payment Methods */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-blue-800 mb-6 flex items-center">
                <User className="mr-2" size={20} />
                Customer Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={customerInfo.name}
                  onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    customerInfo.name.trim() === "" 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isProcessing}
                  required
                />
                
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={customerInfo.email}
                  onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    customerInfo.email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isProcessing}
                  required
                />
                
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={customerInfo.phone}
                  onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                    customerInfo.phone.trim() === "" 
                      ? "border-red-300 focus:ring-red-500" 
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  disabled={isProcessing}
                  required
                />
                
                <input
                  type="text"
                  placeholder="Delivery Address"
                  value={customerInfo.address}
                  onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-semibold text-blue-800 mb-6 flex items-center">
                <CreditCard className="mr-2" size={20} />
                Payment Method
              </h3>
              
              <div className="space-y-4">
                {/* Stripe Checkout */}
                <div className={`border border-gray-300 rounded-lg p-4 transition ${
                  isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
                }`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={selectedPaymentMethod === "stripe"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing || !isValidCustomerInfo()}
                    />
                    <div className="flex items-center">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <Zap size={16} className="mr-1" />
                        STRIPE
                      </div>
                      <span className="font-medium">Secure Card Payment</span>
                    </div>
                  </label>
                  
                  {selectedPaymentMethod === "stripe" && isValidCustomerInfo() && (
                    <div className="mt-4 ml-7">
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h4 className="font-semibold text-purple-800 mb-2">Stripe Secure Checkout:</h4>
                        <ul className="text-sm text-purple-700 list-disc list-inside space-y-1">
                          <li>Pay with any major credit or debit card</li>
                          <li>Secure SSL encryption and PCI compliance</li>
                          <li>No card details stored on our servers</li>
                          <li>Instant payment confirmation</li>
                        </ul>
                        <div className="mt-2 flex items-center text-xs text-purple-600">
                          <span>Powered by Stripe - Trusted by millions worldwide</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* M-Pesa */}
                <div className={`border border-gray-300 rounded-lg p-4 transition ${
                  isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
                }`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="mpesa"
                      checked={selectedPaymentMethod === "mpesa"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing || !isValidCustomerInfo()}
                    />
                    <div className="flex items-center">
                      <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <Smartphone size={16} className="mr-1" />
                        M-PESA
                      </div>
                      <span className="font-medium">Pay with M-Pesa</span>
                    </div>
                  </label>
                  
                  {selectedPaymentMethod === "mpesa" && isValidCustomerInfo() && (
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

                      {/* M-Pesa status display */}
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
                      
                      {/* M-Pesa Instructions */}
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">M-Pesa Payment Instructions:</h4>
                        <ol className="text-sm text-green-700 list-decimal list-inside space-y-1">
                          <li>Click "Pay KES {getTotalPrice().toLocaleString()}" to initiate payment</li>
                          <li>Check your phone for M-Pesa PIN prompt</li>
                          <li>Enter your M-Pesa PIN to complete payment</li>
                          <li>Wait for confirmation message</li>
                        </ol>
                      </div>
                    </div>
                  )}
                </div>

                {/* Credit/Debit Card */}
                <div className={`border border-gray-300 rounded-lg p-4 transition ${
                  isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
                }`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={selectedPaymentMethod === "card"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing || !isValidCustomerInfo()}
                    />
                    <div className="flex items-center">
                      <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
                        <CreditCard size={16} className="mr-1" />
                        CARD
                      </div>
                      <span className="font-medium">Credit/Debit Card (Basic)</span>
                    </div>
                  </label>
                  
                  {selectedPaymentMethod === "card" && isValidCustomerInfo() && (
                    <div className="mt-4 space-y-3 ml-7">
                      <input
                        type="text"
                        placeholder="Cardholder Name"
                        value={cardInfo.cardName}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                      <input
                        type="text"
                        placeholder="Card Number (1234 5678 9012 3456)"
                        value={cardInfo.cardNumber}
                        onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isProcessing}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          value={cardInfo.expiryDate}
                          onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isProcessing}
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          value={cardInfo.cvv}
                          onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
                          className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={isProcessing}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* PayPal */}
                <div className={`border border-gray-300 rounded-lg p-4 transition ${
                  isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
                }`}>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={selectedPaymentMethod === "paypal"}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                      className="mr-3 w-4 h-4"
                      disabled={isProcessing || !isValidCustomerInfo()}
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
                        Qty: {item.quantity} × KES {item.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({getTotalItems()} items)</span>
                  <span>KES {getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>KES 0</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax</span>
                  <span>KES 0</span>
                </div>
                <div className="border-t border-gray-200 pt-2">
                  <div className="flex justify-between font-bold text-lg text-blue-800">
                    <span>Total</span>
                    <span>KES {getTotalPrice().toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                  <span className="text-sm">{errorMessage}</span>
                </div>
              )}

              {/* Process Payment Button */}
              <button
                onClick={handleProcessPayment}
                disabled={!canProceedWithPayment() || isProcessing}
                className={`w-full mt-6 py-3 px-4 rounded-lg font-bold transition flex items-center justify-center ${
                  !canProceedWithPayment() || isProcessing
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : selectedPaymentMethod === "stripe"
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    {selectedPaymentMethod === "mpesa" ? (
                      mpesaState.isInitiating ? "Initiating..." : "Waiting for confirmation..."
                    ) : selectedPaymentMethod === "stripe" ? (
                      "Redirecting to Stripe..."
                    ) : (
                      "Processing..."
                    )}
                  </>
                ) : (
                  `Pay KES ${getTotalPrice().toLocaleString()}`
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



// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useCartStore } from "@/app/lib/store/cartStore";
// import { ArrowLeft, CreditCard, Smartphone, DollarSign, User } from "lucide-react";
// import { useMpesaPayment } from "../../../hooks/useMpesaPayment";
// import { DatabaseService } from "../../../services/databaseService";
// import { CustomerInfo, CardInfo, CartItem } from "../../lib/product";
// import { isValidMpesaPhone, simulatePaymentProcess } from "../../../utils/paymentUtils";
// import { formatMpesaPhone, extractNumericPrice } from "../../../utils/paymentUtils";

// const CheckoutPage: React.FC = () => {
//   const router = useRouter();
//   const { items, getTotalItems, getTotalPrice, clearCart } = useCartStore();
  
//   const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [mpesaPhone, setMpesaPhone] = useState<string>("");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);
//   const [isPaymentSuccessful, setIsPaymentSuccessful] = useState<boolean>(false);
  
//   const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   });
  
//   const [cardInfo, setCardInfo] = useState<CardInfo>({
//     cardName: "",
//     cardNumber: "",
//     expiryDate: "",
//     cvv: ""
//   });

//   // Use existing M-Pesa hook
//   const { mpesaState, initiateMpesaPayment, isProcessing: mpesaProcessing } = useMpesaPayment(
//     selectedPaymentMethod,
//     true // Always consider modal "open" for checkout
//   );

//   // Redirect if cart is empty, but not after successful payment
//   useEffect(() => {
//     if (items.length === 0 && !isPaymentSuccessful) {
//       router.push("/");
//     }
//   }, [items, router, isPaymentSuccessful]);

//   // Sync processing state with M-Pesa processing
//   useEffect(() => {
//     if (selectedPaymentMethod === "mpesa") {
//       setIsProcessing(mpesaProcessing);
//     }
//   }, [mpesaProcessing, selectedPaymentMethod]);

//   // Create a virtual product representing the cart
//   const createCartProduct = () => ({
//     $id: `CART-${Date.now()}`,
//     title: `Cart with ${getTotalItems()} items`,
//     description: `Order containing ${items.map(item => item.title).join(', ')}`,
//     features: items.map(item => `${item.quantity}x ${item.title}`),
//     price: `KES ${getTotalPrice().toLocaleString()}`,
//     supplier: "Multiple suppliers",
//     rating: 5,
//     reviews: 0,
//     imageUrl: items[0]?.imageUrl || "",
//   });

//   const isValidCard = (): boolean => {
//     return (
//       cardInfo.cardName.length > 0 &&
//       cardInfo.cardNumber.length >= 13 &&
//       cardInfo.expiryDate.length >= 4 &&
//       cardInfo.cvv.length >= 3
//     );
//   };

//   const isValidCustomerInfo = (): boolean => {
//     return (
//       customerInfo.name.trim() !== "" &&
//       customerInfo.email.trim() !== "" &&
//       customerInfo.phone.trim() !== "" &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
//     );
//   };

//   const canProceedWithPayment = (): boolean => {
//     if (!isValidCustomerInfo() || !selectedPaymentMethod) {
//       return false;
//     }

//     switch (selectedPaymentMethod) {
//       case "mpesa":
//         return isValidMpesaPhone(mpesaPhone);
//       case "card":
//         return isValidCard();
//       case "paypal":
//         return true;
//       default:
//         return false;
//     }
//   };

//   const handlePaymentSuccess = (transactionId: string = `CART-${Date.now()}`) => {
//     setIsPaymentSuccessful(true); // Set flag before clearing cart
//     const cartProduct = createCartProduct();
//     clearCart();
//     router.push(
//       `/payment/success?transactionId=${encodeURIComponent(transactionId)}` +
//       `&amount=${encodeURIComponent(getTotalPrice())}` +
//       `&customerEmail=${encodeURIComponent(customerInfo.email)}` +
//       `&productName=${encodeURIComponent(cartProduct.title)}` +
//       `&paymentMethod=${encodeURIComponent(selectedPaymentMethod)}`
//     );
//   };

//   const handleMpesaPayment = async () => {
//     if (!isValidMpesaPhone(mpesaPhone)) {
//       setErrorMessage("Please enter a valid Safaricom number");
//       return;
//     }

//     setErrorMessage(null);
//     const cartProduct = createCartProduct();
    
//     try {
//       await initiateMpesaPayment(
//         mpesaPhone,
//         cartProduct,
//         customerInfo,
//         (checkoutRequestID?: string) => handlePaymentSuccess(checkoutRequestID || `MPESA-${Date.now()}`),
//         items as CartItem[]
//       );
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : "M-Pesa payment failed");
//     }
//   };

//   const handleCardPayment = async () => {
//     if (!isValidCard()) {
//       setErrorMessage("Please fill in all card details correctly");
//       return;
//     }

//     setIsProcessing(true);
//     setErrorMessage(null);
    
//     try {
//       await simulatePaymentProcess("Card", cardInfo.cardNumber);
      
//       const transactionId = `CARD-${Date.now()}`;
//       await DatabaseService.createOrder(transactionId, {
//         productId: `CART-${Date.now()}`,
//         productTitle: `Cart with ${getTotalItems()} items`,
//         price: `KES ${getTotalPrice().toLocaleString()}`,
//         supplier: "Multiple suppliers",
//         customerInfo: JSON.stringify(customerInfo),
//         paymentMethod: "card",
//         transactionId: transactionId,
//         status: "paid",
//         orderDate: new Date().toISOString(),
//         cartItems: JSON.stringify(
//           items.map(item => ({
//             productId: item.$id,
//             title: item.title,
//             price: extractNumericPrice(item.price),
//             quantity: item.quantity,
//             supplier: item.supplier,
//             imageUrl: item.imageUrl || '',
//             subtotal: extractNumericPrice(item.price) * item.quantity
//           }))
//         ),
//         itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
//         orderType: "cart",
//         supplierList: [...new Set(items.map(item => item.supplier))].join(", "),
//       });
      
//       handlePaymentSuccess(transactionId);
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : "Card payment failed");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handlePayPalPayment = async () => {
//     setIsProcessing(true);
//     setErrorMessage(null);
    
//     try {
//       await simulatePaymentProcess("PayPal", customerInfo.email);
      
//       const transactionId = `PAYPAL-${Date.now()}`;
//       await DatabaseService.createOrder(transactionId, {
//         productId: `CART-${Date.now()}`,
//         productTitle: `Cart with ${getTotalItems()} items`,
//         price: `KES ${getTotalPrice().toLocaleString()}`,
//         supplier: "Multiple suppliers",
//         customerInfo: JSON.stringify(customerInfo),
//         paymentMethod: "paypal",
//         transactionId: transactionId,
//         status: "paid",
//         orderDate: new Date().toISOString(),
//         cartItems: JSON.stringify(
//           items.map(item => ({
//             productId: item.$id,
//             title: item.title,
//             price: extractNumericPrice(item.price),
//             quantity: item.quantity,
//             supplier: item.supplier,
//             imageUrl: item.imageUrl || '',
//             subtotal: extractNumericPrice(item.price) * item.quantity
//           }))
//         ),
//         itemsCount: items.reduce((sum, item) => sum + item.quantity, 0),
//         orderType: "cart",
//         supplierList: [...new Set(items.map(item => item.supplier))].join(", "),
//       });
      
//       handlePaymentSuccess(transactionId);
//     } catch (error) {
//       setErrorMessage(error instanceof Error ? error.message : "PayPal payment failed");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleProcessPayment = () => {
//     if (!isValidCustomerInfo()) {
//       setErrorMessage("Please fill in all customer information fields correctly");
//       return;
//     }

//     if (!selectedPaymentMethod) {
//       setErrorMessage("Please select a payment method");
//       return;
//     }

//     switch (selectedPaymentMethod) {
//       case "mpesa":
//         handleMpesaPayment();
//         break;
//       case "card":
//         handleCardPayment();
//         break;
//       case "paypal":
//         handlePayPalPayment();
//         break;
//       default:
//         setErrorMessage("Invalid payment method selected");
//     }
//   };

//   if (items.length === 0 && !isPaymentSuccessful) {
//     return null; // Will redirect via useEffect
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-6xl">
//         {/* Header */}
//         <div className="flex items-center mb-8">
//           <button
//             onClick={() => router.back()}
//             className="flex items-center text-blue-600 hover:text-blue-800 mr-4"
//             disabled={isProcessing}
//           >
//             <ArrowLeft size={20} className="mr-2" />
//             Back
//           </button>
//           <h1 className="text-3xl font-bold text-gray-800">Checkout</h1>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Customer Info & Payment Methods */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Customer Information */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="font-semibold text-blue-800 mb-6 flex items-center">
//                 <User className="mr-2" size={20} />
//                 Customer Information
//               </h3>
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="text"
//                   placeholder="Full Name *"
//                   value={customerInfo.name}
//                   onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
//                   className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//                     customerInfo.name.trim() === "" 
//                       ? "border-red-300 focus:ring-red-500" 
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                   disabled={isProcessing}
//                   required
//                 />
                
//                 <input
//                   type="email"
//                   placeholder="Email Address *"
//                   value={customerInfo.email}
//                   onChange={(e) => setCustomerInfo({...customerInfo, email: e.target.value})}
//                   className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//                     customerInfo.email.trim() === "" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)
//                       ? "border-red-300 focus:ring-red-500" 
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                   disabled={isProcessing}
//                   required
//                 />
                
//                 <input
//                   type="tel"
//                   placeholder="Phone Number *"
//                   value={customerInfo.phone}
//                   onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
//                   className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//                     customerInfo.phone.trim() === "" 
//                       ? "border-red-300 focus:ring-red-500" 
//                       : "border-gray-300 focus:ring-blue-500"
//                   }`}
//                   disabled={isProcessing}
//                   required
//                 />
                
//                 <input
//                   type="text"
//                   placeholder="Delivery Address"
//                   value={customerInfo.address}
//                   onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
//                   className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   disabled={isProcessing}
//                 />
//               </div>
//             </div>

//             {/* Payment Methods */}
//             <div className="bg-white rounded-lg shadow-md p-6">
//               <h3 className="font-semibold text-blue-800 mb-6 flex items-center">
//                 <CreditCard className="mr-2" size={20} />
//                 Payment Method
//               </h3>
              
//               <div className="space-y-4">
//                 {/* M-Pesa */}
//                 <div className={`border border-gray-300 rounded-lg p-4 transition ${
//                   isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
//                 }`}>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="mpesa"
//                       checked={selectedPaymentMethod === "mpesa"}
//                       onChange={(e) => setSelectedPaymentMethod(e.target.value)}
//                       className="mr-3 w-4 h-4"
//                       disabled={isProcessing || !isValidCustomerInfo()}
//                     />
//                     <div className="flex items-center">
//                       <div className="bg-green-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
//                         <Smartphone size={16} className="mr-1" />
//                         M-PESA
//                       </div>
//                       <span className="font-medium">Pay with M-Pesa</span>
//                     </div>
//                   </label>
                  
//                   {selectedPaymentMethod === "mpesa" && isValidCustomerInfo() && (
//                     <div className="mt-4 space-y-3 ml-7">
//                       <input
//                         type="tel"
//                         placeholder="M-Pesa Phone Number (0712345678 or 254712345678)"
//                         value={mpesaPhone}
//                         onChange={(e) => setMpesaPhone(e.target.value)}
//                         className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
//                           mpesaPhone && !isValidMpesaPhone(mpesaPhone)
//                             ? "border-red-300 focus:ring-red-500"
//                             : "border-gray-300 focus:ring-blue-500"
//                         }`}
//                         disabled={isProcessing}
//                       />
//                       {mpesaPhone && !isValidMpesaPhone(mpesaPhone) && (
//                         <p className="text-red-500 text-sm">
//                           Please enter a valid Safaricom number (e.g., 0712345678)
//                         </p>
//                       )}

//                       {/* Reuse M-Pesa status display from existing modal */}
//                       {mpesaState.message && (
//                         <div
//                           className={`p-3 rounded-lg ${
//                             mpesaState.status === "success"
//                               ? "bg-green-100 text-green-700"
//                               : mpesaState.status === "failed"
//                               ? "bg-red-100 text-red-700"
//                               : mpesaState.status === "timeout"
//                               ? "bg-yellow-100 text-yellow-700"
//                               : "bg-blue-100 text-blue-700"
//                           }`}
//                         >
//                           <div className="flex items-center">
//                             {mpesaState.isInitiating || mpesaState.isPolling ? (
//                               <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current mr-2"></div>
//                             ) : null}
//                             <span className="text-sm">{mpesaState.message}</span>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* M-Pesa Instructions */}
//                       <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
//                         <h4 className="font-semibold text-green-800 mb-2">M-Pesa Payment Instructions:</h4>
//                         <ol className="text-sm text-green-700 list-decimal list-inside space-y-1">
//                           <li>Click "Pay KES {getTotalPrice().toLocaleString()}" to initiate payment</li>
//                           <li>Check your phone for M-Pesa PIN prompt</li>
//                           <li>Enter your M-Pesa PIN to complete payment</li>
//                           <li>Wait for confirmation message</li>
//                         </ol>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* Credit/Debit Card */}
//                 <div className={`border border-gray-300 rounded-lg p-4 transition ${
//                   isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
//                 }`}>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="card"
//                       checked={selectedPaymentMethod === "card"}
//                       onChange={(e) => setSelectedPaymentMethod(e.target.value)}
//                       className="mr-3 w-4 h-4"
//                       disabled={isProcessing || !isValidCustomerInfo()}
//                     />
//                     <div className="flex items-center">
//                       <div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
//                         <CreditCard size={16} className="mr-1" />
//                         CARD
//                       </div>
//                       <span className="font-medium">Credit/Debit Card</span>
//                     </div>
//                   </label>
                  
//                   {selectedPaymentMethod === "card" && isValidCustomerInfo() && (
//                     <div className="mt-4 space-y-3 ml-7">
//                       <input
//                         type="text"
//                         placeholder="Cardholder Name"
//                         value={cardInfo.cardName}
//                         onChange={(e) => setCardInfo({ ...cardInfo, cardName: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={isProcessing}
//                       />
//                       <input
//                         type="text"
//                         placeholder="Card Number (1234 5678 9012 3456)"
//                         value={cardInfo.cardNumber}
//                         onChange={(e) => setCardInfo({ ...cardInfo, cardNumber: e.target.value })}
//                         className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         disabled={isProcessing}
//                       />
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           placeholder="MM/YY"
//                           value={cardInfo.expiryDate}
//                           onChange={(e) => setCardInfo({ ...cardInfo, expiryDate: e.target.value })}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           disabled={isProcessing}
//                         />
//                         <input
//                           type="text"
//                           placeholder="CVV"
//                           value={cardInfo.cvv}
//                           onChange={(e) => setCardInfo({ ...cardInfo, cvv: e.target.value })}
//                           className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           disabled={isProcessing}
//                         />
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 {/* PayPal */}
//                 <div className={`border border-gray-300 rounded-lg p-4 transition ${
//                   isValidCustomerInfo() ? "hover:border-blue-300" : "opacity-50"
//                 }`}>
//                   <label className="flex items-center cursor-pointer">
//                     <input
//                       type="radio"
//                       name="paymentMethod"
//                       value="paypal"
//                       checked={selectedPaymentMethod === "paypal"}
//                       onChange={(e) => setSelectedPaymentMethod(e.target.value)}
//                       className="mr-3 w-4 h-4"
//                       disabled={isProcessing || !isValidCustomerInfo()}
//                     />
//                     <div className="flex items-center">
//                       <div className="bg-yellow-500 text-white px-3 py-1 rounded text-sm font-bold mr-3 flex items-center">
//                         <DollarSign size={16} className="mr-1" />
//                         PayPal
//                       </div>
//                       <span className="font-medium">Pay with PayPal</span>
//                     </div>
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="lg:col-span-1">
//             <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
//               <h3 className="font-semibold text-blue-800 mb-6">Order Summary</h3>
              
//               {/* Cart Items */}
//               <div className="space-y-4 mb-6">
//                 {items.map((item) => (
//                   <div key={item.$id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
//                     {item.imageUrl && (
//                       <img
//                         src={item.imageUrl}
//                         alt={item.title}
//                         className="w-12 h-12 object-cover rounded"
//                       />
//                     )}
//                     <div className="flex-1 min-w-0">
//                       <h4 className="font-medium text-gray-800 truncate text-sm">
//                         {item.title}
//                       </h4>
//                       <p className="text-gray-600 text-xs">
//                         Qty: {item.quantity} × KES {item.price}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               {/* Order Totals */}
//               <div className="border-t border-gray-200 pt-4 space-y-2">
//                 <div className="flex justify-between text-gray-600">
//                   <span>Subtotal ({getTotalItems()} items)</span>
//                   <span>KES {getTotalPrice().toLocaleString()}</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Service Fee</span>
//                   <span>KES 0</span>
//                 </div>
//                 <div className="flex justify-between text-gray-600">
//                   <span>Tax</span>
//                   <span>KES 0</span>
//                 </div>
//                 <div className="border-t border-gray-200 pt-2">
//                   <div className="flex justify-between font-bold text-lg text-blue-800">
//                     <span>Total</span>
//                     <span>KES {getTotalPrice().toLocaleString()}</span>
//                   </div>
//                 </div>
//               </div>

//               {/* Error Message */}
//               {errorMessage && (
//                 <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
//                   <span className="text-sm">{errorMessage}</span>
//                 </div>
//               )}

//               {/* Process Payment Button */}
//               <button
//                 onClick={handleProcessPayment}
//                 disabled={!canProceedWithPayment() || isProcessing}
//                 className={`w-full mt-6 py-3 px-4 rounded-lg font-bold transition flex items-center justify-center ${
//                   !canProceedWithPayment() || isProcessing
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 text-white"
//                 }`}
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
//                     {selectedPaymentMethod === "mpesa" ? (
//                       mpesaState.isInitiating ? "Initiating..." : "Waiting for confirmation..."
//                     ) : (
//                       "Processing..."
//                     )}
//                   </>
//                 ) : (
//                   `Pay KES ${getTotalPrice().toLocaleString()}`
//                 )}
//               </button>

//               {/* Security Notice */}
//               <div className="mt-4 p-3 bg-blue-50 rounded-lg">
//                 <p className="text-xs text-blue-700 text-center">
//                   🔒 Your payment information is secure and encrypted
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CheckoutPage;
