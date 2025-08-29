// components/BuyNowButton.tsx
import React, { useState } from 'react';
import { useStripePayment, PaymentProduct } from '@/hooks/useStripePayment';

interface BuyNowButtonProps {
  product: PaymentProduct;
  quantity?: number;
  className?: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
}

const BuyNowButton: React.FC<BuyNowButtonProps> = ({
  product,
  quantity = 1,
  className = '',
  disabled = false,
  variant = 'primary',
  size = 'md',
  children = 'Buy Now',
}) => {
  const { initiatePayment, isLoading, error, clearError } = useStripePayment();
  const [showError, setShowError] = useState(false);

  const handleClick = async () => {
    if (disabled || isLoading) return;
    
    clearError();
    setShowError(false);
    
    try {
      await initiatePayment(product, quantity);
    } catch (err) {
      setShowError(true);
      // Auto-hide error after 5 seconds
      setTimeout(() => setShowError(false), 5000);
    }
  };

  // Base styles
  const baseStyles = "font-bold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50";
  
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
  };

  // Loading styles
  const loadingStyles = isLoading ? "opacity-75 cursor-not-allowed" : "cursor-pointer";
  
  const buttonClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${variantStyles[variant]}
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
          {isLoading ? 'Processing...' : children}
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