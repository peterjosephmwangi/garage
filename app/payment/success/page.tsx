"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Home, Receipt, Mail, CreditCard } from "lucide-react";
import { DatabaseService } from '@/services/databaseService';
import { extractNumericPrice } from '@/utils/paymentUtils';

interface PaymentDetails {
  transactionId: string;
  amount: string;
  customerEmail: string;
  productName: string;
  paymentMethod: string;
  sessionId?: string;
  stripeDetails?: {
    customerEmail: string;
    amount: number;
    currency: string;
    status: string;
    created: number;
  };
}

// Child component to handle useSearchParams
const PaymentSuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    transactionId: "",
    amount: "",
    customerEmail: "",
    productName: "",
    paymentMethod: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const initializePaymentDetails = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const transactionId = searchParams.get('transactionId');
        const amount = searchParams.get('amount');
        const customerEmail = searchParams.get('customerEmail');
        const productName = searchParams.get('productName');
        const paymentMethod = searchParams.get('paymentMethod');

        if (sessionId) {
          // Handle Stripe payment
          await handleStripePayment(sessionId);
        } else if (transactionId && amount) {
          // Handle other payment methods (existing flow)
          setPaymentDetails({
            transactionId: decodeURIComponent(transactionId),
            amount: decodeURIComponent(amount),
            customerEmail: decodeURIComponent(customerEmail || ""),
            productName: decodeURIComponent(productName || ""),
            paymentMethod: decodeURIComponent(paymentMethod || ""),
          });
        } else {
          setError("Invalid payment session - missing transaction details");
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing payment details:', err);
        setError("Failed to load payment details");
        setIsLoading(false);
      }
    };

    initializePaymentDetails();
  }, [searchParams]);

  const handleStripePayment = async (sessionId: string) => {
    try {
      // Fetch session details from your API
      const response = await fetch(`/api/stripe/session/${sessionId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch payment details');
      }

      const stripeDetails = await response.json();
      
      // Get stored customer info and cart items from localStorage
      const storedCustomerInfo = localStorage.getItem('checkout_customer_info');
      const storedCartItems = localStorage.getItem('checkout_cart_items');
      
      let customerInfo = null;
      let cartItems = [];
      
      if (storedCustomerInfo) {
        try {
          customerInfo = JSON.parse(storedCustomerInfo);
          localStorage.removeItem('checkout_customer_info'); // Clean up
        } catch (e) {
          console.error('Error parsing stored customer info:', e);
        }
      }
      
      if (storedCartItems) {
        try {
          cartItems = JSON.parse(storedCartItems);
          localStorage.removeItem('checkout_cart_items'); // Clean up
        } catch (e) {
          console.error('Error parsing stored cart items:', e);
        }
      }

      setPaymentDetails({
        transactionId: sessionId,
        amount: (stripeDetails.amount / 100).toString(), // Convert from cents
        customerEmail: stripeDetails.customerEmail || customerInfo?.email || 'unknown@stripe.com',
        productName: stripeDetails.productName || 'Stripe Purchase',
        paymentMethod: 'stripe',
        sessionId,
        stripeDetails,
      });

      // Create order record for Stripe payment if we have the necessary data
      if (customerInfo && cartItems.length > 0 && !orderCreated) {
        await createStripeOrderRecord(sessionId, stripeDetails, customerInfo, cartItems);
        setOrderCreated(true);
      }
    } catch (err) {
      console.error('Error handling Stripe payment:', err);
      throw err;
    }
  };

  const createStripeOrderRecord = async (
    sessionId: string,
    stripeDetails: any,
    customerInfo: any,
    cartItems: any[]
  ) => {
    try {
      const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      const supplierList = [...new Set(cartItems.map(item => item.supplier))].join(", ");

      await DatabaseService.createOrder(sessionId, {
        productId: `STRIPE-CART-${Date.now()}`,
        productTitle: `Stripe Cart with ${totalItems} items`,
        price: `KES ${(stripeDetails.amount / 100).toLocaleString()}`,
        supplier: supplierList,
        customerInfo: JSON.stringify(customerInfo),
        paymentMethod: "stripe",
        transactionId: sessionId,
        status: stripeDetails.status === 'paid' ? 'paid' : 'pending',
        orderDate: new Date().toISOString(),
        cartItems: JSON.stringify(
          cartItems.map(item => ({
            productId: item.$id,
            title: item.title,
            price: extractNumericPrice(item.price),
            quantity: item.quantity,
            supplier: item.supplier,
            imageUrl: item.imageUrl || '',
            subtotal: extractNumericPrice(item.price) * item.quantity
          }))
        ),
        itemsCount: totalItems,
        orderType: "cart",
        supplierList: supplierList,
      });

      console.log('Stripe order record created successfully');
    } catch (error) {
      console.error('Error creating Stripe order record:', error);
      // Don't throw - we still want to show success even if DB write fails
    }
  };

  const formatAmount = (amount: string) => {
    const numericAmount = parseFloat(amount);
    return isNaN(numericAmount) ? amount : numericAmount.toLocaleString();
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case "mpesa":
        return "💚";
      case "stripe":
        return "⚡";
      case "card":
        return <CreditCard size={20} className="text-blue-600" />;
      case "paypal":
        return "💛";
      default:
        return "💳";
    }
  };

  const getPaymentMethodName = (method: string) => {
    switch (method.toLowerCase()) {
      case "mpesa":
        return "M-Pesa";
      case "stripe":
        return "Stripe";
      case "card":
        return "Credit/Debit Card";
      case "paypal":
        return "PayPal";
      default:
        return method;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-4">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
          >
            <Home size={20} />
            Return to Home
          </button>
          {paymentDetails.transactionId && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">Session ID:</p>
              <p className="text-xs font-mono text-gray-800">{paymentDetails.transactionId}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-green-500 text-6xl mb-6">
            <CheckCircle size={80} className="mx-auto" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-8">
            Your order has been placed successfully. You will receive a confirmation email shortly.
          </p>
          <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Receipt size={20} />
              Payment Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                  {paymentDetails.transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount:</span>
                <span className="font-bold text-lg text-green-600">
                  KES {formatAmount(paymentDetails.amount)}
                </span>
              </div>
              {paymentDetails.paymentMethod && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method:</span>
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(paymentDetails.paymentMethod)}
                    <span className="font-medium">
                      {getPaymentMethodName(paymentDetails.paymentMethod)}
                    </span>
                  </div>
                </div>
              )}
              {paymentDetails.productName && (
                <div className="flex justify-between items-start">
                  <span className="text-gray-600">Order:</span>
                  <span className="font-medium text-right max-w-xs">
                    {paymentDetails.productName}
                  </span>
                </div>
              )}
              {paymentDetails.customerEmail && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Email:</span>
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-500" />
                    <span className="font-medium">
                      {paymentDetails.customerEmail}
                    </span>
                  </div>
                </div>
              )}
              {paymentDetails.stripeDetails && (
                <>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Currency:</span>
                    <span className="font-medium uppercase">
                      {paymentDetails.stripeDetails.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status:</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
                      {paymentDetails.stripeDetails.status}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
          {paymentDetails.paymentMethod === 'stripe' && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl">⚡</span>
                <span className="font-semibold text-purple-800">Stripe Payment</span>
              </div>
              <p className="text-sm text-purple-700">
                Your payment was processed securely through Stripe. Check your email for a detailed receipt from both Stripe and our team.
              </p>
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
            >
              <Home size={20} />
              Continue Shopping
            </button>
            <button
              onClick={() => window.print()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 justify-center"
            >
              <Receipt size={20} />
              Print Receipt
            </button>
          </div>
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              📧 A confirmation email with order details has been sent to your email address.
              <br />
              💬 For any questions, please contact our customer support.
              {paymentDetails.paymentMethod === 'stripe' && (
                <>
                  <br />
                  ⚡ Stripe payments include additional receipt and transaction details via email.
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main page component with Suspense boundary
const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment details...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;


// "use client";

// import React, { useEffect, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { CheckCircle, Home, Receipt, Mail, CreditCard } from "lucide-react";
// import { DatabaseService } from '@/services/databaseService';
// import { extractNumericPrice } from '@/utils/paymentUtils';

// interface PaymentDetails {
//   transactionId: string;
//   amount: string;
//   customerEmail: string;
//   productName: string;
//   paymentMethod: string;
//   sessionId?: string;
//   stripeDetails?: {
//     customerEmail: string;
//     amount: number;
//     currency: string;
//     status: string;
//     created: number;
//   };
// }

// const PaymentSuccessPage: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
//     transactionId: "",
//     amount: "",
//     customerEmail: "",
//     productName: "",
//     paymentMethod: "",
//   });
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [orderCreated, setOrderCreated] = useState(false);

//   useEffect(() => {
//     const initializePaymentDetails = async () => {
//       try {
//         const sessionId = searchParams.get('session_id');
//         const transactionId = searchParams.get('transactionId');
//         const amount = searchParams.get('amount');
//         const customerEmail = searchParams.get('customerEmail');
//         const productName = searchParams.get('productName');
//         const paymentMethod = searchParams.get('paymentMethod');

//         if (sessionId) {
//           // Handle Stripe payment
//           await handleStripePayment(sessionId);
//         } else if (transactionId && amount) {
//           // Handle other payment methods (existing flow)
//           setPaymentDetails({
//             transactionId: decodeURIComponent(transactionId),
//             amount: decodeURIComponent(amount),
//             customerEmail: decodeURIComponent(customerEmail || ""),
//             productName: decodeURIComponent(productName || ""),
//             paymentMethod: decodeURIComponent(paymentMethod || ""),
//           });
//         } else {
//           setError("Invalid payment session - missing transaction details");
//         }
        
//         setIsLoading(false);
//       } catch (err) {
//         console.error('Error initializing payment details:', err);
//         setError("Failed to load payment details");
//         setIsLoading(false);
//       }
//     };

//     initializePaymentDetails();
//   }, [searchParams]);

//   const handleStripePayment = async (sessionId: string) => {
//     try {
//       // Fetch session details from your API
//       const response = await fetch(`/api/stripe/session/${sessionId}`);
//       if (!response.ok) {
//         throw new Error('Failed to fetch payment details');
//       }

//       const stripeDetails = await response.json();
      
//       // Get stored customer info and cart items from localStorage
//       const storedCustomerInfo = localStorage.getItem('checkout_customer_info');
//       const storedCartItems = localStorage.getItem('checkout_cart_items');
      
//       let customerInfo = null;
//       let cartItems = [];
      
//       if (storedCustomerInfo) {
//         try {
//           customerInfo = JSON.parse(storedCustomerInfo);
//           localStorage.removeItem('checkout_customer_info'); // Clean up
//         } catch (e) {
//           console.error('Error parsing stored customer info:', e);
//         }
//       }
      
//       if (storedCartItems) {
//         try {
//           cartItems = JSON.parse(storedCartItems);
//           localStorage.removeItem('checkout_cart_items'); // Clean up
//         } catch (e) {
//           console.error('Error parsing stored cart items:', e);
//         }
//       }

//       setPaymentDetails({
//         transactionId: sessionId,
//         amount: (stripeDetails.amount / 100).toString(), // Convert from cents
//         customerEmail: stripeDetails.customerEmail || customerInfo?.email || 'unknown@stripe.com',
//         productName: stripeDetails.productName || 'Stripe Purchase',
//         paymentMethod: 'stripe',
//         sessionId,
//         stripeDetails,
//       });

//       // Create order record for Stripe payment if we have the necessary data
//       if (customerInfo && cartItems.length > 0 && !orderCreated) {
//         await createStripeOrderRecord(sessionId, stripeDetails, customerInfo, cartItems);
//         setOrderCreated(true);
//       }

//     } catch (err) {
//       console.error('Error handling Stripe payment:', err);
//       throw err;
//     }
//   };

//   const createStripeOrderRecord = async (
//     sessionId: string,
//     stripeDetails: any,
//     customerInfo: any,
//     cartItems: any[]
//   ) => {
//     try {
//       const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
//       const supplierList = [...new Set(cartItems.map(item => item.supplier))].join(", ");

//       await DatabaseService.createOrder(sessionId, {
//         productId: `STRIPE-CART-${Date.now()}`,
//         productTitle: `Stripe Cart with ${totalItems} items`,
//         price: `KES ${(stripeDetails.amount / 100).toLocaleString()}`,
//         supplier: supplierList,
//         customerInfo: JSON.stringify(customerInfo),
//         paymentMethod: "stripe",
//         transactionId: sessionId,
//         status: stripeDetails.status === 'paid' ? 'paid' : 'pending',
//         orderDate: new Date().toISOString(),
//         cartItems: JSON.stringify(
//           cartItems.map(item => ({
//             productId: item.$id,
//             title: item.title,
//             price: extractNumericPrice(item.price),
//             quantity: item.quantity,
//             supplier: item.supplier,
//             imageUrl: item.imageUrl || '',
//             subtotal: extractNumericPrice(item.price) * item.quantity
//           }))
//         ),
//         itemsCount: totalItems,
//         orderType: "cart",
//         supplierList: supplierList,
//       });

//       console.log('Stripe order record created successfully');
//     } catch (error) {
//       console.error('Error creating Stripe order record:', error);
//       // Don't throw - we still want to show success even if DB write fails
//     }
//   };

//   const formatAmount = (amount: string) => {
//     const numericAmount = parseFloat(amount);
//     return isNaN(numericAmount) ? amount : numericAmount.toLocaleString();
//   };

//   const getPaymentMethodIcon = (method: string) => {
//     switch (method.toLowerCase()) {
//       case "mpesa":
//         return "💚";
//       case "stripe":
//         return "⚡";
//       case "card":
//         return <CreditCard size={20} className="text-blue-600" />;
//       case "paypal":
//         return "💛";
//       default:
//         return "💳";
//     }
//   };

//   const getPaymentMethodName = (method: string) => {
//     switch (method.toLowerCase()) {
//       case "mpesa":
//         return "M-Pesa";
//       case "stripe":
//         return "Stripe";
//       case "card":
//         return "Credit/Debit Card";
//       case "paypal":
//         return "PayPal";
//       default:
//         return method;
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading payment details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-4">
//           <div className="text-red-500 text-4xl mb-4">❌</div>
//           <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <button
//             onClick={() => router.push("/")}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
//           >
//             <Home size={20} />
//             Return to Home
//           </button>
//           {paymentDetails.transactionId && (
//             <div className="mt-4 p-3 bg-gray-100 rounded-lg">
//               <p className="text-sm text-gray-600">Session ID:</p>
//               <p className="text-xs font-mono text-gray-800">{paymentDetails.transactionId}</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="container mx-auto px-4 max-w-2xl">
//         <div className="bg-white rounded-lg shadow-md p-8 text-center">
//           {/* Success Icon */}
//           <div className="text-green-500 text-6xl mb-6">
//             <CheckCircle size={80} className="mx-auto" />
//           </div>

//           {/* Success Message */}
//           <h1 className="text-3xl font-bold text-green-600 mb-4">
//             Payment Successful!
//           </h1>
//           <p className="text-gray-600 mb-8">
//             Your order has been placed successfully. You will receive a confirmation email shortly.
//           </p>

//           {/* Payment Details */}
//           <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
//             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
//               <Receipt size={20} />
//               Payment Details
//             </h3>
            
//             <div className="space-y-3">
//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Transaction ID:</span>
//                 <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
//                   {paymentDetails.transactionId}
//                 </span>
//               </div>

//               <div className="flex justify-between items-center">
//                 <span className="text-gray-600">Amount:</span>
//                 <span className="font-bold text-lg text-green-600">
//                   KES {formatAmount(paymentDetails.amount)}
//                 </span>
//               </div>

//               {paymentDetails.paymentMethod && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Payment Method:</span>
//                   <div className="flex items-center gap-2">
//                     {getPaymentMethodIcon(paymentDetails.paymentMethod)}
//                     <span className="font-medium">
//                       {getPaymentMethodName(paymentDetails.paymentMethod)}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {paymentDetails.productName && (
//                 <div className="flex justify-between items-start">
//                   <span className="text-gray-600">Order:</span>
//                   <span className="font-medium text-right max-w-xs">
//                     {paymentDetails.productName}
//                   </span>
//                 </div>
//               )}

//               {paymentDetails.customerEmail && (
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-600">Email:</span>
//                   <div className="flex items-center gap-2">
//                     <Mail size={16} className="text-gray-500" />
//                     <span className="font-medium">
//                       {paymentDetails.customerEmail}
//                     </span>
//                   </div>
//                 </div>
//               )}

//               {/* Stripe-specific details */}
//               {paymentDetails.stripeDetails && (
//                 <>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Currency:</span>
//                     <span className="font-medium uppercase">
//                       {paymentDetails.stripeDetails.currency}
//                     </span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-gray-600">Status:</span>
//                     <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">
//                       {paymentDetails.stripeDetails.status}
//                     </span>
//                   </div>
//                 </>
//               )}
//             </div>
//           </div>

//           {/* Stripe-specific notice */}
//           {paymentDetails.paymentMethod === 'stripe' && (
//             <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
//               <div className="flex items-center justify-center gap-2 mb-2">
//                 <span className="text-2xl">⚡</span>
//                 <span className="font-semibold text-purple-800">Stripe Payment</span>
//               </div>
//               <p className="text-sm text-purple-700">
//                 Your payment was processed securely through Stripe. Check your email for a detailed receipt from both Stripe and our team.
//               </p>
//             </div>
//           )}

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <button
//               onClick={() => router.push("/")}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
//             >
//               <Home size={20} />
//               Continue Shopping
//             </button>
            
//             <button
//               onClick={() => window.print()}
//               className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 justify-center"
//             >
//               <Receipt size={20} />
//               Print Receipt
//             </button>
//           </div>

//           {/* Additional Info */}
//           <div className="mt-8 p-4 bg-blue-50 rounded-lg">
//             <p className="text-sm text-blue-700">
//               📧 A confirmation email with order details has been sent to your email address.
//               <br />
//               💬 For any questions, please contact our customer support.
//               {paymentDetails.paymentMethod === 'stripe' && (
//                 <>
//                   <br />
//                   ⚡ Stripe payments include additional receipt and transaction details via email.
//                 </>
//               )}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;


// // "use client";

// // import React, { useEffect, useState } from "react";
// // import { useRouter, useSearchParams } from "next/navigation";
// // import { CheckCircle, Home, Receipt, Mail, CreditCard } from "lucide-react";

// // const PaymentSuccessPage: React.FC = () => {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const [paymentDetails, setPaymentDetails] = useState({
// //     transactionId: "",
// //     amount: "",
// //     customerEmail: "",
// //     productName: "",
// //     paymentMethod: "",
// //   });
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     try {
// //       const transactionId = searchParams.get('transactionId');
// //       const amount = searchParams.get('amount');
// //       const customerEmail = searchParams.get('customerEmail');
// //       const productName = searchParams.get('productName');
// //       const paymentMethod = searchParams.get('paymentMethod');

// //       if (!transactionId || !amount) {
// //         setError("Invalid payment session - missing transaction details");
// //         setIsLoading(false);
// //         return;
// //       }

// //       setPaymentDetails({
// //         transactionId: decodeURIComponent(transactionId),
// //         amount: decodeURIComponent(amount),
// //         customerEmail: decodeURIComponent(customerEmail || ""),
// //         productName: decodeURIComponent(productName || ""),
// //         paymentMethod: decodeURIComponent(paymentMethod || ""),
// //       });
// //       setIsLoading(false);
// //     } catch (err) {
// //       setError("Failed to load payment details");
// //       setIsLoading(false);
// //     }
// //   }, [searchParams]);

// //   const formatAmount = (amount: string) => {
// //     const numericAmount = parseFloat(amount);
// //     return isNaN(numericAmount) ? amount : numericAmount.toLocaleString();
// //   };

// //   const getPaymentMethodIcon = (method: string) => {
// //     switch (method.toLowerCase()) {
// //       case "mpesa":
// //         return "💚";
// //       case "card":
// //         return <CreditCard size={20} className="text-blue-600" />;
// //       case "paypal":
// //         return "💛";
// //       default:
// //         return "💳";
// //     }
// //   };

// //   const getPaymentMethodName = (method: string) => {
// //     switch (method.toLowerCase()) {
// //       case "mpesa":
// //         return "M-Pesa";
// //       case "card":
// //         return "Credit/Debit Card";
// //       case "paypal":
// //         return "PayPal";
// //       default:
// //         return method;
// //     }
// //   };

// //   if (isLoading) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading payment details...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (error) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="bg-white rounded-lg shadow-md p-8 text-center max-w-md mx-4">
// //           <div className="text-red-500 text-4xl mb-4">❌</div>
// //           <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
// //           <p className="text-gray-600 mb-6">{error}</p>
// //           <button
// //             onClick={() => router.push("/")}
// //             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 mx-auto"
// //           >
// //             <Home size={20} />
// //             Return to Home
// //           </button>
// //           {paymentDetails.transactionId && (
// //             <div className="mt-4 p-3 bg-gray-100 rounded-lg">
// //               <p className="text-sm text-gray-600">Session ID:</p>
// //               <p className="text-xs font-mono text-gray-800">{paymentDetails.transactionId}</p>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 py-8">
// //       <div className="container mx-auto px-4 max-w-2xl">
// //         <div className="bg-white rounded-lg shadow-md p-8 text-center">
// //           {/* Success Icon */}
// //           <div className="text-green-500 text-6xl mb-6">
// //             <CheckCircle size={80} className="mx-auto" />
// //           </div>

// //           {/* Success Message */}
// //           <h1 className="text-3xl font-bold text-green-600 mb-4">
// //             Payment Successful!
// //           </h1>
// //           <p className="text-gray-600 mb-8">
// //             Your order has been placed successfully. You will receive a confirmation email shortly.
// //           </p>

// //           {/* Payment Details */}
// //           <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
// //             <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
// //               <Receipt size={20} />
// //               Payment Details
// //             </h3>
            
// //             <div className="space-y-3">
// //               <div className="flex justify-between items-center">
// //                 <span className="text-gray-600">Transaction ID:</span>
// //                 <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
// //                   {paymentDetails.transactionId}
// //                 </span>
// //               </div>

// //               <div className="flex justify-between items-center">
// //                 <span className="text-gray-600">Amount:</span>
// //                 <span className="font-bold text-lg text-green-600">
// //                   KES {formatAmount(paymentDetails.amount)}
// //                 </span>
// //               </div>

// //               {paymentDetails.paymentMethod && (
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-gray-600">Payment Method:</span>
// //                   <div className="flex items-center gap-2">
// //                     {getPaymentMethodIcon(paymentDetails.paymentMethod)}
// //                     <span className="font-medium">
// //                       {getPaymentMethodName(paymentDetails.paymentMethod)}
// //                     </span>
// //                   </div>
// //                 </div>
// //               )}

// //               {paymentDetails.productName && (
// //                 <div className="flex justify-between items-start">
// //                   <span className="text-gray-600">Order:</span>
// //                   <span className="font-medium text-right max-w-xs">
// //                     {paymentDetails.productName}
// //                   </span>
// //                 </div>
// //               )}

// //               {paymentDetails.customerEmail && (
// //                 <div className="flex justify-between items-center">
// //                   <span className="text-gray-600">Email:</span>
// //                   <div className="flex items-center gap-2">
// //                     <Mail size={16} className="text-gray-500" />
// //                     <span className="font-medium">
// //                       {paymentDetails.customerEmail}
// //                     </span>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* Action Buttons */}
// //           <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //             <button
// //               onClick={() => router.push("/")}
// //               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 justify-center"
// //             >
// //               <Home size={20} />
// //               Continue Shopping
// //             </button>
            
// //             <button
// //               onClick={() => window.print()}
// //               className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 justify-center"
// //             >
// //               <Receipt size={20} />
// //               Print Receipt
// //             </button>
// //           </div>

// //           {/* Additional Info */}
// //           <div className="mt-8 p-4 bg-blue-50 rounded-lg">
// //             <p className="text-sm text-blue-700">
// //               📧 A confirmation email with order details has been sent to your email address.
// //               <br />
// //               💬 For any questions, please contact our customer support.
// //             </p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default PaymentSuccessPage;
