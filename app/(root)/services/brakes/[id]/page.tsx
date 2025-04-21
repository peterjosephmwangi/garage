"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";
const myproduct = {
  id : 1,
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

const productData = [
  {
    id: 1,
    imgSrc: "/images/brakes1.jpeg",
    title: "Premium Brake Pads",
    description: "Durable and long-lasting brake pads for smooth stops.",
    price: "$60",
    supplier: "Supplier X",
  },
  {
    id: 2,
    imgSrc: "/images/brakes2.jpeg",
    title: "Ceramic Brake Pads",
    description: "High-performance ceramic pads for quieter braking.",
    price: "$75",
    supplier: "Supplier X",
  },
  {
    id: 3,
    imgSrc: "/images/brakes3.jpeg",
    title: "Semi-Metallic Brake Pads",
    description: "Affordable brake pads with excellent stopping power.",
    price: "$50",
    supplier: "Supplier X",
  },
  {
    id: 4,
    imgSrc: "/images/brakes4.jpeg",
    title: "Drilled Brake Rotors",
    description: "High-performance rotors for better heat dissipation.",
    price: "$150",
    supplier: "Supplier Y",
  },
  {
    id: 5,
    imgSrc: "/images/brakes5.jpeg",
    title: "Slotted Brake Rotors",
    description: "Designed for better braking in wet conditions.",
    price: "$140",
    supplier: "Supplier Y",
  },
  {
    id: 6,
    imgSrc: "/images/brakes6.jpeg",
    title: "Semi-Metallic Brake Pads",
    description: "Affordable brake pads with excellent stopping power.",
    price: "$50",
    supplier: "Supplier Y",
  },
];

const BrakeProductDetails = () => {
  const { id } = useParams();
  const router = useRouter();

  const product = productData.find((item) => item.id.toString() === id);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-2xl font-bold text-red-600">Product Not Found</h1>
          <button
            onClick={() => router.push("/services/brakes")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Back to Brakes Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        {/* Breadcrumb */}
        <nav className="text-sm text-red-600 mb-6">
          <span
            className="cursor-pointer hover:underline"
            onClick={() => router.push("/services/brakes")}
          >
            Brake Services
          </span>{" "}
          / <span className="text-red-800">{product.title}</span>
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
            <h1 className="text-3xl font-bold text-red-800 mb-4">
              {product.title}
            </h1>
            <p className="text-gray-600 mb-6 text-lg">{product.description}</p>

            {/* Features */}
            <ul className="mb-6 list-disc list-inside text-gray-700 space-y-1">
              {myproduct?.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>

            <p className="text-lg font-semibold text-gray-700 mb-2">
              Supplier:{" "}
              <span className="font-bold text-red-700">{product.supplier}</span>
            </p>
            <p className="text-xl font-bold text-red-600 mb-4">
              {product.price}
            </p>

            {/* Dynamic Rating */}
            <div className="flex items-center gap-4 mb-6">
              <div className="text-yellow-500 text-lg">
                {"★".repeat(Math.floor(product.rating))}
                {product.rating % 1 >= 0.5 ? "½" : ""}
                {"☆".repeat(5 - Math.ceil(product.rating))}
              </div>
              <span className="text-gray-600">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={() => alert("Purchased Successfully!")}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition w-full md:w-auto"
              >
                Buy Now
              </button>
              <button
                onClick={() => router.back()}
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition w-full md:w-auto"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-red-800 mb-10 text-center">
            Related Brake Products
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <img
                  src={`/images/brakes${item}.jpeg`}
                  alt={`Related Brake ${item}`}
                  className="rounded-lg shadow-md w-full h-48 object-contain mb-4"
                />
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Related Brake {item}
                </h3>
                <p className="text-gray-600">
                  Durable and high-performance brake component for safe stops.
                </p>
                <p className="text-lg font-semibold text-red-700 mt-4">
                  $50 - $150
                </p>
                <button
                  onClick={() => router.push(`/services/brakes/${item}`)}
                  className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition w-full"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrakeProductDetails;
