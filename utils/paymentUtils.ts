// Extract numeric price from string like "KES 45,000"
export const extractNumericPrice = (priceString: string): number => {
  const numericString = priceString.replace(/[^\d.-]/g, "");
  return parseFloat(numericString) || 0;
};

// Format phone number for M-Pesa
export const formatMpesaPhone = (phone: string): string => {
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
export const isValidMpesaPhone = (phone: string): boolean => {
  const formatted = formatMpesaPhone(phone);
  return /^254[17]\d{8}$/.test(formatted);
};

// Simulate payment process for non-M-Pesa methods
export const simulatePaymentProcess = (method: string, identifier: string): Promise<void> => {
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


// // utils/paymentUtils.ts

// // Extract numeric price from string like "KES 45,000"
// export const extractNumericPrice = (priceString: string): number => {
//     const numericString = priceString.replace(/[^\d.-]/g, "");
//     return parseFloat(numericString) || 0;
//   };
  
//   // Format phone number for M-Pesa
//   export const formatMpesaPhone = (phone: string): string => {
//     let cleaned = phone.replace(/\D/g, "");
//     if (cleaned.startsWith("0")) {
//       cleaned = "254" + cleaned.slice(1);
//     } else if (cleaned.startsWith("+254")) {
//       cleaned = cleaned.slice(1);
//     } else if (cleaned.startsWith("254")) {
//       // Already in correct format
//     } else if (cleaned.length === 9) {
//       cleaned = "254" + cleaned;
//     }
//     return cleaned;
//   };
  
//   // Validate M-Pesa phone number
//   export const isValidMpesaPhone = (phone: string): boolean => {
//     const formatted = formatMpesaPhone(phone);
//     return /^254[17]\d{8}$/.test(formatted);
//   };
  
//   // Simulate payment process for non-M-Pesa methods
//   export const simulatePaymentProcess = (method: string, identifier: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       setTimeout(() => {
//         if (Math.random() > 0.1) {
//           resolve();
//         } else {
//           reject(new Error(`${method} payment failed`));
//         }
//       }, 3000);
//     });
//   };