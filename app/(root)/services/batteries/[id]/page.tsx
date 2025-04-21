"use client";

import React from "react";
import { useRouter } from "next/navigation";

const BatteryServiceDetailsPage = ({ params }) => {
  const router = useRouter();
  const { id } = params;

  // Mock data for the battery product/service
  const product = {
    id,
    imgSrc: "/images/battery1.jpeg",
    title: "High-Performance Car Battery",
    description:
      "Ensure reliable starts and smooth drives with our High-Performance Car Battery. Built to last and perform under extreme conditions.",
    features: [
      "Long-lasting power",
      "Weather-resistant design",
      "Maintenance-free operation",
      "Quick and easy installation",
    ],
    price: "$120",
    supplier: "Battery World",
    rating: 4.6,
    reviews: 89,
  };

  return (
    <div className="min-h-screen bg-blue-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-blue-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/batteries")}
          >
            Battery Services
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
            Related Batteries
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition"
              >
                <img
                  src={`/images/battery${item}.jpeg`}
                  alt={`Related Battery ${item}`}
                  className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-blue-800 mb-2">
                  Related Battery {item}
                </h3>
                <p className="text-blue-600">
                  Durable and powerful battery for various vehicle types.
                </p>
                <p className="text-lg font-semibold text-blue-800 mt-4">
                  $80 - $150
                </p>
                <button
                  onClick={() => router.push(`/services/batteries/${item}`)}
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

export default BatteryServiceDetailsPage;
