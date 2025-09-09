// components/BuyNowButton.tsx
import React, { useState } from 'react';
import { useStripePayment, PaymentProduct } from '@/hooks/useStripePayment';

interface Product {
  $id: string;
  title: string;
  price: string;
  description?: string;
  imageUrl?: string;
  supplier: string;
  serviceType?: string;
  // Add any other properties your product has
}

interface BuyNowButtonProps {
  product: Product;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'stripe';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  paymentMethod?: 'stripe' | 'default';
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  children,
  paymentMethod = 'stripe', // Default to Stripe
}) => {
  const { initiatePayment, isLoading, error, clearError } = useStripePayment();
  const [showError, setShowError] = useState(false);

  // Convert your product to PaymentProduct format
  const convertToPaymentProduct = (prod: Product): PaymentProduct => ({
    id: prod.$id,
    title: prod.title,
    price: prod.price.replace(/[^\d.]/g, ''), // Remove currency symbols
    description: prod.description || `${prod.title} - ${prod.supplier}`,
    imageUrl: prod.imageUrl,
    supplier: prod.supplier,
    serviceType: prod.serviceType || 'general'
  });

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    clearError();
    setShowError(false);
    
    try {
      if (paymentMethod === 'stripe') {
        const paymentProduct = convertToPaymentProduct(product);
        await initiatePayment(paymentProduct, quantity);
      } else {
        // Handle other payment methods or redirect to checkout
        window.location.href = `/services/${product.serviceType || 'general'}/${product.$id}`;
      }
    } catch (err) {
      setShowError(true);
      // Auto-hide error after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    }
  };

  // Determine button text
  const getButtonText = () => {
    if (children) return children;
    
    if (paymentMethod === 'stripe') {
      return isLoading ? 'Redirecting...' : 'Buy with Stripe';
    }
    
    return 'Buy Now';
  };

  // Base styles
  const baseStyles = "font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50 relative";
  
  // Size variants
  const sizeStyles = {
    sm: "px-3 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  // Color variants
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-300",
    stripe: "bg-purple-600 hover:bg-purple-700 text-white focus:ring-purple-500 disabled:bg-purple-300",
  };

  // Loading styles
  const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer";
  
  // Use stripe variant if payment method is stripe and no explicit variant is set
  const finalVariant = paymentMethod === 'stripe' && variant === 'primary' ? 'stripe' : variant;
  
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[finalVariant]}
    ${loadingStyles}
    ${className}
  `.trim();

  return (
    <div className="relative">
      <button
        onClick={handleClick}
        disabled={disabled || isLoading}
        className={buttonClasses}
        type="button"
      >
        <span className="flex items-center justify-center gap-2">
          {isLoading && (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          {paymentMethod === 'stripe' && !isLoading && (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z"/>
            </svg>
          )}
          {getButtonText()}
        </span>
      </button>

      {/* Error Message */}
      {showError && error && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg z-10">
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <svg
                className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm">{error}</span>
            </div>
            <button
              onClick={() => setShowError(false)}
              className="ml-2 text-red-400 hover:text-red-600"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyNowButton;



// // components/BuyNowButton.tsx
// import React, { useState } from 'react';
// import { useStripePayment, PaymentProduct } from '@/hooks/useStripePayment';

// interface BuyNowButtonProps {
//   product: PaymentProduct;
//   quantity?: number;
//   className?: string;
//   disabled?: boolean;
//   variant?: 'primary' | 'secondary';
//   size?: 'sm' | 'md' | 'lg';
//   children?: React.ReactNode;
// }

// const BuyNowButton: React.FC<BuyNowButtonProps> = ({
//   product,
//   quantity = 1,
//   className = '',
//   disabled = false,
//   variant = 'primary',
//   size = 'md',
//   children = 'Buy Now',
// }) => {
//   const { initiatePayment, isLoading, error, clearError } = useStripePayment();
//   const [showError, setShowError] = useState(false);

//   const handleClick = async () => {
//     if (disabled || isLoading) return;
    
//     clearError();
//     setShowError(false);
    
//     try {
//       await initiatePayment(product, quantity);
//     } catch (err) {
//       setShowError(true);
//       // Auto-hide error after 5 seconds
//       setTimeout(() => setShowError(false), 5000);
//     }
//   };

//   // Base styles
//   const baseStyles = "font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
//   // Size variants
//   const sizeStyles = {
//     sm: "px-3 py-2 text-sm",
//     md: "px-6 py-3 text-base",
//     lg: "px-8 py-4 text-lg",
//   };

//   // Color variants
//   const variantStyles = {
//     primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 disabled:bg-blue-300",
//     secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 disabled:bg-gray-300",
//   };

//   // Loading styles
//   const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer";
  
//   const buttonClasses = `
//     ${baseStyles}
//     ${sizeStyles[size]}
//     ${variantStyles[variant]}
//     ${loadingStyles}
//     ${className}
//   `.trim();

//   return (
//     <div className="relative">
//       <button
//         onClick={handleClick}
//         disabled={disabled || isLoading}
//         className={buttonClasses}
//         type="button"
//       >
//         <span className="flex items-center justify-center gap-2">
//           {isLoading && (
//             <svg
//               className="animate-spin h-4 w-4"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//             >
//               <circle
//                 className="opacity-25"
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               ></circle>
//               <path
//                 className="opacity-75"
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//               ></path>
//             </svg>
//           )}
//           {isLoading ? 'Processing...' : children}
//         </span>
//       </button>

//       {/* Error Message */}
//       {showError && error && (
//         <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-lg z-10">
//           <div className="flex items-start justify-between">
//             <div className="flex items-start">
//               <svg
//                 className="w-4 h-4 mt-0.5 mr-2 flex-shrink-0"
//                 fill="currentColor"
//                 viewBox="0 0 20 20"
//               >
//                 <path
//                   fillRule="evenodd"
//                   d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//               <span className="text-sm">{error}</span>
//             </div>
//             <button
//               onClick={() => setShowError(false)}
//               className="ml-2 text-red-400 hover:text-red-600"
//             >
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path
//                   fillRule="evenodd"
//                   d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
//                   clipRule="evenodd"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BuyNowButton;