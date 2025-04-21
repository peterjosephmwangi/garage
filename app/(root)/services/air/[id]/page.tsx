"use client";

import React from "react";
import { useRouter } from "next/navigation";

const ServiceDetailsPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  // Mock data for the product/service
  const product = {
    id,
    imgSrc: "/images/ac1.jpeg",
    title: "Premium AC Filter",
    description:
      "Experience the best air quality with our high-efficiency Premium AC Filter. Designed to enhance your air conditioner's performance and keep your environment fresh and clean.",
    features: [
      "High-efficiency filtration",
      "Durable and long-lasting",
      "Improves air quality",
      "Easy to install",
    ],
    price: "$40",
    supplier: "Supplier A",
    rating: 4.8,
    reviews: 120,
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/air")}
          >
            Air Conditioning Services
          </span>{" "}
          / <span className="text-blue-800">{product.title}</span>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
          <div>
            <img
              src={product.imgSrc}
              alt={product.title}
              className="rounded-lg shadow-md w-full h-72 object-contain"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-blue-800 mb-4">
              {product.title}
            </h1>
            <p className="text-blue-600 mb-6">{product.description}</p>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Features:
              </h3>
              <ul className="list-disc pl-6 text-blue-600">
                {product.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </div>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Supplier: <span className="font-bold">{product.supplier}</span>
            </p>
            <p className="text-lg font-semibold text-blue-600 mb-2">
              Price:{" "}
              <span className="text-2xl text-blue-800">{product.price}</span>
            </p>
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating)) +
                  (product.rating % 1 > 0 ? "☆" : "")}
              </div>
              <span className="text-blue-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>
            <button
              onClick={() => alert("Purchased Successfully!")}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition w-full md:w-auto"
            >
              Buy Now
            </button>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-blue-800 mb-8 text-center">
            Related Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <img
                  src={`/images/ac${item}.jpeg`}
                  alt={`Related Product ${item}`}
                  className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Related Product {item}
                </h3>
                <p className="text-blue-600">
                  High-quality AC product to enhance cooling performance.
                </p>
                <p className="text-lg font-semibold text-blue-800 mt-4">
                  $30 - $100
                </p>
                <button
                  onClick={() => router.push(`/services/air/${item}`)}
                  className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
