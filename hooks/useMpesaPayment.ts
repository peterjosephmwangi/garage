// hooks/useMpesaPayment.ts
import { useState, useEffect, useRef } from "react";
import { MpesaPaymentState, AirConditionProduct, CustomerInfo } from "../app/lib/product";
import { MpesaService } from "../services/mpesaService";

export const useMpesaPayment = (
  selectedPaymentMethod: string,
  isModalOpen: boolean
) => {
  const [mpesaState, setMpesaState] = useState<MpesaPaymentState>({
    isInitiating: false,
    isPolling: false,
    checkoutRequestID: null,
    status: "idle",
    message: "",
  });

  // Use ref to store the current success callback
  const onSuccessRef = useRef<(() => void) | null>(null);

  const updateMpesaState = (newState: Partial<MpesaPaymentState>) => {
    console.log("M-Pesa state updating:", newState);
    setMpesaState(prev => ({ ...prev, ...newState }));
  };

  // Watch for success status and trigger callback
  useEffect(() => {
    console.log("M-Pesa state changed:", mpesaState.status);
    if (mpesaState.status === "success" && onSuccessRef.current) {
      console.log("Payment successful, triggering success callback");
      setTimeout(() => {
        if (onSuccessRef.current) {
          onSuccessRef.current();
          onSuccessRef.current = null; // Prevent multiple calls
        }
      }, 1500);
    }
  }, [mpesaState.status]);

  const initiateMpesaPayment = async (
    mpesaPhone: string,
    product: AirConditionProduct,
    customerInfo: CustomerInfo,
    onSuccess: () => void
  ): Promise<void> => {
    // Store the success callback
    onSuccessRef.current = onSuccess;
    
    const numericAmount = 3; // Match your actual amount from logs

    const checkoutRequestID = await MpesaService.initiateStkPush(
      mpesaPhone,
      numericAmount,
      product.$id,
      product.title,
      product.price,
      customerInfo,
      product.supplier,
      updateMpesaState
    );

    if (checkoutRequestID) {
      // Start polling - the success will be handled by the useEffect above
      MpesaService.pollPaymentStatus(checkoutRequestID, updateMpesaState);
    }
  };

  // Reset state when modal closes or payment method changes
  useEffect(() => {
    if (!isModalOpen || selectedPaymentMethod !== "mpesa") {
      console.log("Resetting M-Pesa state");
      setMpesaState({
        isInitiating: false,
        isPolling: false,
        checkoutRequestID: null,
        status: "idle",
        message: "",
      });
      onSuccessRef.current = null; // Clear success callback
    }
  }, [isModalOpen, selectedPaymentMethod]);

  return {
    mpesaState,
    initiateMpesaPayment,
    isProcessing: mpesaState.isInitiating || mpesaState.isPolling,
  };
};



// // hooks/useMpesaPayment.ts
// import { useState, useEffect } from "react";
// import { MpesaPaymentState, AirConditionProduct, CustomerInfo } from "../app/lib/product";


// import { MpesaService } from "../services/mpesaService";

// export const useMpesaPayment = (
//   selectedPaymentMethod: string,
//   isModalOpen: boolean
// ) => {
//   const [mpesaState, setMpesaState] = useState<MpesaPaymentState>({
//     isInitiating: false,
//     isPolling: false,
//     checkoutRequestID: null,
//     status: "idle",
//     message: "",
//   });

//   const updateMpesaState = (newState: Partial<MpesaPaymentState>) => {
//     setMpesaState(prev => ({ ...prev, ...newState }));
//   };

//   const initiateMpesaPayment = async (
//     mpesaPhone: string,
//     product: AirConditionProduct,
//     customerInfo: CustomerInfo,
//     onSuccess: () => void
//   ): Promise<void> => {
//     // const numericAmount = extractNumericPrice(product.price);
//     const numericAmount = 2; // Using hardcoded value as in original code

//     const checkoutRequestID = await MpesaService.initiateStkPush(
//       mpesaPhone,
//       numericAmount,
//       product.$id,
//       product.title,
//       product.price,
//       customerInfo,
//       product.supplier,
//       updateMpesaState
//     );

//     if (checkoutRequestID) {
//       await MpesaService.pollPaymentStatus(checkoutRequestID, updateMpesaState);
      
//       // Check for success and trigger callback
//       const checkSuccess = () => {
//         if (mpesaState.status === "success") {
//           setTimeout(() => {
//             onSuccess();
//           }, 1500);
//         }
//       };
      
//       setTimeout(checkSuccess, 100);
//     }
//   };

//   // Reset state when modal closes or payment method changes
//   useEffect(() => {
//     if (!isModalOpen || selectedPaymentMethod !== "mpesa") {
//       setMpesaState({
//         isInitiating: false,
//         isPolling: false,
//         checkoutRequestID: null,
//         status: "idle",
//         message: "",
//       });
//     }
//   }, [isModalOpen, selectedPaymentMethod]);

//   return {
//     mpesaState,
//     initiateMpesaPayment,
//     isProcessing: mpesaState.isInitiating || mpesaState.isPolling,
//   };
// };