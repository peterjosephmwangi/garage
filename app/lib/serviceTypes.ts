// export const serviceTypes = [
//   {
//     value: "airConditioning",
//     label: "Air Conditioning",
//     collectionId: "6807170100118fcdb939",
//   },
//   { value: "brakes", label: "Brakes", collectionId: "680718220012d8b2eb98" },
//   { value: "tires", label: "Tires", collectionId: "680718020033cfadcb44" },
//   {
//     value: "oilChange",
//     label: "Oil Change",
//     collectionId: "6807173c001ede4b2686",
//   },
//   { value: "battery", label: "Battery", collectionId: "6807175e00341dbc8fd5" },
//   { value: "engine", label: "Engine", collectionId: "68071783002d63cc1dc2" },
// ] as const;

// export type ServiceType = (typeof serviceTypes)[number]["value"];

// // Add this missing export
// export type ServiceProduct = (typeof serviceTypes)[number];


// @/app/lib/serviceTypes.ts
// export const serviceTypes = [
//   {
//     value: "airConditioning",
//     label: "Air Conditioning",
//     collectionId: "6807170100118fcdb939",
//   },
//   { value: "brakes", label: "Brakes", collectionId: "680718220012d8b2eb98" },
//   { value: "tires", label: "Tires", collectionId: "680718020033cfadcb44" },
//   {
//     value: "oilChange",
//     label: "Oil Change",
//     collectionId: "6807173c001ede4b2686",
//   },
//   { value: "battery", label: "Battery", collectionId: "6807175e00341dbc8fd5" },
//   { value: "engine", label: "Engine", collectionId: "68071783002d63cc1dc2" },
// ] as const;

// export type ServiceType = (typeof serviceTypes)[number]["value"];

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

// app/lib/serviceTypes.ts
export const serviceTypes = [
  {
    value: "airConditioning",
    label: "Air Conditioning",
    collectionId: "6807170100118fcdb939",
  },
  { value: "brakes", label: "Brakes", collectionId: "680718220012d8b2eb98" },
  { value: "tires", label: "Tires", collectionId: "680718020033cfadcb44" },
  {
    value: "oilChange",
    label: "Oil Change",
    collectionId: "6807173c001ede4b2686",
  },
  { value: "battery", label: "Battery", collectionId: "6807175e00341dbc8fd5" },
  { value: "engine", label: "Engine", collectionId: "68071783002d63cc1dc2" },
] as const;

export type ServiceType = (typeof serviceTypes)[number]["value"];