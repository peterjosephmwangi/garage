"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";
import "react-horizontal-scrolling-menu/dist/styles.css";

// Dummy oil change products
const oilChangeProducts = [
  {
    id: "1",
    mgSrc: "/images/images3.jpeg",
    title: "Synthetic Oil Change",
    description:
      "Enhance engine longevity and performance with full synthetic oil.",
    features: [
      "Premium synthetic oil",
      "Extended engine life",
      "Up to 10,000 miles",
    ],
    price: "$79",
    supplier: "LubeMax",
    rating: 4.8,
    reviews: 102,
  },
  {
    id: "2",
    imgSrc: "/images/images.jpeg",
    title: "Conventional Oil Change",
    description: "Affordable and effective for everyday driving conditions.",
    features: [
      "Standard motor oil",
      "Basic protection",
      "Recommended every 3,000 miles",
    ],
    price: "$45",
    supplier: "QuickLube",
    rating: 4.3,
    reviews: 87,
  },
  {
    id: "3",
    imgSrc: "/images/download.jpeg",
    title: "High-Mileage Oil Change",
    description: "Special formulation for vehicles over 75,000 miles.",
    features: [
      "Reduces oil burn",
      "Prevents leaks",
      "Restores engine performance",
    ],
    price: "$65",
    supplier: "EngineCare",
    rating: 4.6,
    reviews: 76,
  },
];

const LeftArrow = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);
  return (
    <div className="flex items-center">
      <button
        onClick={scrollPrev}
        className="text-blue-500 text-3xl hover:text-blue-700 p-2"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    </div>
  );
};

const RightArrow = () => {
  const { scrollNext } = React.useContext(VisibilityContext);
  return (
    <div className="flex items-center">
      <button
        onClick={scrollNext}
        className="text-blue-500 text-3xl hover:text-blue-700 p-2"
      >
        <FaRegArrowAltCircleRight />
      </button>
    </div>
  );
};

const OilChangeDetailsPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const { id } = params;

  const product = oilChangeProducts.find((p) => p.id === id);
  const similarProducts = oilChangeProducts.filter((p) => p.id !== id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
        Product not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-yellow-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-yellow-600 mb-6">
          <span
            onClick={() => router.push("/services/oilchange")}
            className="cursor-pointer hover:underline"
          >
            Oil Change Services
          </span>{" "}
          / <span className="text-yellow-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8 mb-12">
          <div>
            <img
              src="/images/download.jpeg"
              alt={product.title}
              className="rounded-lg shadow-md w-full h-72 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-yellow-800 mb-4">
              {product.title}
            </h1>
            <p className="text-yellow-600 mb-4">{product.description}</p>
            <p className="text-lg font-semibold text-yellow-700 mb-4">
              Price: {product.price}
            </p>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-6 text-yellow-600">
                {product.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-sm text-gray-500">
              Supplier: {product.supplier}
            </p>
            <p className="text-sm text-gray-500">
              Rating: {product.rating} ★ ({product.reviews} reviews)
            </p>
            <button className="mt-6 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition">
              Book Now
            </button>
          </div>
        </div>

        {/* Similar Products */}
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-yellow-500 after:to-gray-500 after:mx-auto after:mt-2">
          Similar Oil Change Services
        </h2>
        <div className="relative">
          <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
            <div className="flex space-x-4">
              {similarProducts.map((item) => (
                <div
                  key={item.id}
                  itemID={item.id}
                  className="flex-shrink-0 w-72 border rounded-lg p-4 text-center shadow-sm hover:shadow-md transition"
                >
                  <img
                    src={item.imgSrc}
                    alt={item.title}
                    className="mb-4 w-full h-40 object-contain rounded"
                  />
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.description}
                  </p>
                  <p className="text-yellow-600 font-semibold mb-2">
                    {item.price}
                  </p>
                  <button
                    onClick={() =>
                      router.push(`/services/oilchange/${item.id}`)
                    }
                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg"
                  >
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </ScrollMenu>
        </div>
      </div>
    </div>
  );
};

export default OilChangeDetailsPage;
