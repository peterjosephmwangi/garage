import { ServiceType } from "./serviceTypes";

export interface ServiceProduct {
  $id: string;
  title: string;
  description: string;
  price: string;
  imageUrl?: string;
  supplier: string;
  serviceType: ServiceType;
  rating: number; // Make required
  reviews: number; // Make required
  features: string[]; // Make required
}

export interface NewServiceProduct {
  title: string;
  description: string;
  features: string[];
  price: string;
  supplier: string;
  rating: number;
  reviews: number;
  imageFile?: File;
  serviceType: string;
}

// // export interface ServiceProduct {
// //     $id: string;
// //     title: string;
// //     description: string;
// //     features: string[];
// //     price: string;
// //     supplier: string;
// //     rating: number;
// //     reviews: number;
// //     imageUrl: string;
// //     serviceType: string;
// //   }
//   // app/lib/types.ts
// import { ServiceType } from "./serviceTypes";

// export interface ServiceProduct {
//   $id: string;
//   title: string;
//   description: string;
//   price: string;
//   imageUrl?: string;
//   supplier: string;
//   serviceType: ServiceType;
//   rating?: number;
//   reviews?: number;
//   features?: string[];
// }
//   export interface NewServiceProduct {
//     title: string;
//     description: string;
//     features: string[];
//     price: string;
//     supplier: string;
//     rating: number;
//     reviews: number;
//     imageFile?: File;
//     serviceType: string;
//   }