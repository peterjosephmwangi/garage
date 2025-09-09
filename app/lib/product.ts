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

export interface CartItem extends AirConditionProduct {
  quantity: number;
}

export interface OrderData {
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
  mpesaReceiptNumber?: string;
  transactionDate?: string;
  callbackData?: string;
  cartItems?: string;
  itemsCount?: number;
  orderType?: string;
  supplierList?: string;
  notes?: string; 
}

export interface MpesaPaymentState {
  isInitiating: boolean;
  isPolling: boolean;
  checkoutRequestID: string | null;
  status: "idle" | "initiated" | "polling" | "success" | "failed" | "timeout" | "pending";
  message: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface CardInfo {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardName: string;
}

// // types/product.ts
// export interface NewAirConditionProduct {
//     $id: string;
//     title: string;
//     description: string;
//     features: string[];
//     price: string;
//     supplier: string;
//     rating: number;
//     reviews: number;
//     imageFile?: File;
//     imageUrl?: string;
//   }
  
//   export interface AirConditionProduct extends NewAirConditionProduct {
//     $id: string;
//     $createdAt?: string;
//     $updatedAt?: string;
//     $permissions?: string[];
//     $databaseId?: string;
//     $collectionId?: string;
//   }
  
//   export interface OrderData {
//     productId: string;
//     productTitle: string;
//     price: string;
//     supplier: string;
//     customerInfo: string;
//     paymentMethod: string;
//     transactionId: string;
//     status: string;
//     orderDate: string;
//     phoneNumber?: string;
//     amount?: number;
//     mpesaReceiptNumber?: string;
//     transactionDate?: string;
//     callbackData?: string;
//   }
  
//   export interface MpesaPaymentState {
//     isInitiating: boolean;
//     isPolling: boolean;
//     checkoutRequestID: string | null;
//     status: "idle" | "initiated" | "polling" | "success" | "failed" | "timeout" | "pending";
//     message: string;
//   }
  
//   export interface CustomerInfo {
//     name: string;
//     email: string;
//     phone: string;
//     address: string;
//   }
  
//   export interface CardInfo {
//     cardNumber: string;
//     expiryDate: string;
//     cvv: string;
//     cardName: string;
//   }