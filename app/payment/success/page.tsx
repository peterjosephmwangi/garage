// app/payment/success/page.tsx
"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaymentDetails {
  sessionId: string;
  customerEmail: string;
  amount: number;
  currency: string;
  productName: string;
  status: string;
}

const PaymentSuccessContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    console.log('Session ID from URL:', sessionId); // Debug log
    
    if (!sessionId) {
      setError('Invalid payment session - no session ID found');
      setLoading(false);
      return;
    }

    const fetchPaymentDetails = async () => {
      try {
        console.log('Fetching payment details for session:', sessionId); // Debug log
        const response = await fetch(`/api/stripe/session/${sessionId}`);
        
        console.log('API Response status:', response.status); // Debug log
        
        if (!response.ok) {
          const errorData = await response.json();
          console.error('API Error:', errorData); // Debug log
          throw new Error(errorData.error || 'Failed to fetch payment details');
        }
        
        const data = await response.json();
        console.log('Payment details received:', data); // Debug log
        setPaymentDetails(data);
      } catch (err) {
        console.error('Error fetching payment details:', err);
        setError(err instanceof Error ? err.message : 'Unable to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [searchParams]);

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-800">Verifying payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <Link
              href="/"
              className="block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </Link>
            <p className="text-sm text-gray-500">
              Session ID: {searchParams.get('session_id')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 py-12">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-600 mb-4">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your payment has been processed successfully.
          </p>

          {/* Payment Details */}
          {paymentDetails && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-mono text-sm text-gray-800">{paymentDetails.sessionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Product:</span>
                  <span className="text-gray-800">{paymentDetails.productName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Amount:</span>
                  <span className="text-gray-800 font-bold">
                    {paymentDetails.currency.toUpperCase()} {(paymentDetails.amount / 100).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-800">{paymentDetails.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="text-green-600 font-semibold capitalize">{paymentDetails.status}</span>
                </div>
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
            <ul className="text-left text-blue-700 space-y-2">
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                You'll receive an email confirmation shortly
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Our team will contact you within 24 hours
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Service delivery will be scheduled as per agreement
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
            >
              Return to Home
            </Link>
            <Link
              href="/services"
              className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
            >
              Browse More Services
            </Link>
          </div>

          {/* Support */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our support team at{' '}
              <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">
                support@yourcompany.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component wrapped with Suspense
const PaymentSuccessPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-green-800">Loading...</p>
        </div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
};

export default PaymentSuccessPage;



// // app/payment/success/page.tsx
// "use client";

// import React, { useEffect, useState } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import Link from 'next/link';

// interface PaymentDetails {
//   sessionId: string;
//   customerEmail: string;
//   amount: number;
//   currency: string;
//   productName: string;
//   status: string;
// }

// const PaymentSuccessPage: React.FC = () => {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const sessionId = searchParams.get('session_id');
    
//     if (!sessionId) {
//       setError('Invalid payment session');
//       setLoading(false);
//       return;
//     }

//     const fetchPaymentDetails = async () => {
//       try {
//         const response = await fetch(`/api/stripe/session/${sessionId}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch payment details');
//         }
        
//         const data = await response.json();
//         setPaymentDetails(data);
//       } catch (err) {
//         console.error('Error fetching payment details:', err);
//         setError('Unable to load payment details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPaymentDetails();
//   }, [searchParams]);

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-green-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-green-800">Verifying payment...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-red-50 flex items-center justify-center">
//         <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//             </svg>
//           </div>
//           <h2 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h2>
//           <p className="text-gray-600 mb-6">{error}</p>
//           <Link
//             href="/"
//             className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
//           >
//             Return to Home
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-green-50 py-12">
//       <div className="container mx-auto px-6 max-w-2xl">
//         <div className="bg-white rounded-lg shadow-lg p-8 text-center">
//           {/* Success Icon */}
//           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <svg className="w-10 h-10 text-green-600" fill="currentColor" viewBox="0 0 20 20">
//               <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//             </svg>
//           </div>

//           {/* Success Message */}
//           <h1 className="text-3xl font-bold text-green-600 mb-4">
//             Payment Successful!
//           </h1>
//           <p className="text-lg text-gray-600 mb-8">
//             Thank you for your purchase. Your payment has been processed successfully.
//           </p>

//           {/* Payment Details */}
//           {paymentDetails && (
//             <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
//               <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Details</h3>
//               <div className="space-y-3">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Transaction ID:</span>
//                   <span className="font-mono text-sm text-gray-800">{paymentDetails.sessionId}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Product:</span>
//                   <span className="text-gray-800">{paymentDetails.productName}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Amount:</span>
//                   <span className="text-gray-800 font-bold">
//                     {paymentDetails.currency.toUpperCase()} {(paymentDetails.amount / 100).toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Email:</span>
//                   <span className="text-gray-800">{paymentDetails.customerEmail}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Status:</span>
//                   <span className="text-green-600 font-semibold capitalize">{paymentDetails.status}</span>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* Next Steps */}
//           <div className="bg-blue-50 rounded-lg p-6 mb-8">
//             <h3 className="text-lg font-semibold text-blue-800 mb-3">What's Next?</h3>
//             <ul className="text-left text-blue-700 space-y-2">
//               <li className="flex items-start">
//                 <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 You'll receive an email confirmation shortly
//               </li>
//               <li className="flex items-start">
//                 <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Our team will contact you within 24 hours
//               </li>
//               <li className="flex items-start">
//                 <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//                 </svg>
//                 Service delivery will be scheduled as per agreement
//               </li>
//             </ul>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link
//               href="/"
//               className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
//             >
//               Return to Home
//             </Link>
//             <Link
//               href="/services"
//               className="px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-lg hover:bg-gray-300 transition"
//             >
//               Browse More Services
//             </Link>
//           </div>

//           {/* Support */}
//           <div className="mt-8 pt-6 border-t border-gray-200">
//             <p className="text-sm text-gray-500">
//               Need help? Contact our support team at{' '}
//               <a href="mailto:support@yourcompany.com" className="text-blue-600 hover:underline">
//                 support@yourcompany.com
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccessPage;