export interface ServiceProduct {
    $id: string;
    title: string;
    description: string;
    features: string[];
    price: string;
    supplier: string;
    rating: number;
    reviews: number;
    imageUrl: string;
    serviceType: string;
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