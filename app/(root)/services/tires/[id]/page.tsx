"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { FaRegArrowAltCircleLeft, FaRegArrowAltCircleRight } from "react-icons/fa";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";

export const tireServiceDetails = {
  "1": {
    title: "All-Season Tires",
    image: "/images/tire1.jpeg",
    description:
      "Our All-Season Tires offer the perfect blend of performance, comfort, and durability. Designed to handle both dry and wet conditions, they’re ideal for year-round use.",
    features: [
      "Quiet and comfortable ride",
      "Optimized tread for all-season traction",
      "Long-lasting tread life",
    ],
    priceRange: "$100 - $130",
    applicableVehicles: ["Sedans", "Hatchbacks", "Compact SUVs"],
  },
  "2": {
    title: "Winter Tires",
    image: "/images/tire2.jpeg",
    description:
      "Drive confidently through snow and ice with our Winter Tires. Engineered for cold climates, these tires offer superior grip and braking performance.",
    features: [
      "Deep treads for snow traction",
      "Special rubber compound for cold temperatures",
      "Enhanced safety in icy conditions",
    ],
    priceRange: "$130 - $160",
    applicableVehicles: ["All vehicle types in snowy regions"],
  },
  "3": {
    title: "Performance Tires",
    image: "/images/tire3.jpeg",
    description:
      "Unleash the full potential of your vehicle with our Performance Tires. These are built for speed, agility, and high-performance driving.",
    features: [
      "Enhanced cornering and handling",
      "Excellent high-speed stability",
      "Stylish tread patterns",
    ],
    priceRange: "$150 - $200",
    applicableVehicles: ["Sports Cars", "Coupes", "Performance Sedans"],
  },
  "4": {
    title: "Mud-Terrain Tires",
    image: "/images/tire4.jpeg",
    description:
      "For off-road warriors, our Mud-Terrain Tires provide aggressive traction and superior durability on rough terrains like mud, gravel, and rocks.",
    features: [
      "Deep, aggressive tread patterns",
      "Reinforced sidewalls",
      "Resistant to cuts and chips",
    ],
    priceRange: "$180 - $220",
    applicableVehicles: ["Trucks", "Jeeps", "4x4 SUVs"],
  },
  "5": {
    title: "Eco-Friendly Tires",
    image: "/images/tire5.jpeg",
    description:
      "Save fuel and reduce emissions with our Eco-Friendly Tires. Designed to lower rolling resistance without compromising safety.",
    features: [
      "Low rolling resistance",
      "Environmentally friendly materials",
      "Improved fuel efficiency",
    ],
    priceRange: "$90 - $120",
    applicableVehicles: ["Hybrids", "Compact Cars", "City Vehicles"],
  },
  "6": {
    title: "Run-Flat Tires",
    image: "/images/tire6.jpeg",
    description:
      "Keep driving safely even after a puncture with our Run-Flat Tires. Ideal for urban environments and long-distance travel without a spare.",
    features: [
      "Drive up to 50 miles after a puncture",
      "Increased convenience and safety",
      "Stiff sidewalls for better support",
    ],
    priceRange: "$200 - $250",
    applicableVehicles: ["Luxury Cars", "Modern Sedans", "Coupes"],
  },
};

const suppliers = {
  "Brand A": [
    {
      id: 1,
      imgSrc: "/images/tire1.jpeg",
      title: "All-Season Tires",
      description: "Reliable performance in all weather conditions.",
      price: "$120",
    },
    {
      id: 2,
      imgSrc: "/images/tire2.jpeg",
      title: "Winter Tires",
      description: "Enhanced grip and safety on snowy roads.",
      price: "$150",
    },
    {
      id: 3,
      imgSrc: "/images/tire3.jpeg",
      title: "Performance Tires",
      description: "High-speed stability and cornering precision.",
      price: "$180",
    },
  ],
  "Brand B": [
    {
      id: 4,
      imgSrc: "/images/tire4.jpeg",
      title: "Mud-Terrain Tires",
      description: "Built for off-road adventures and tough terrains.",
      price: "$200",
    },
    {
      id: 5,
      imgSrc: "/images/tire5.jpeg",
      title: "Eco-Friendly Tires",
      description: "Fuel-efficient tires with reduced rolling resistance.",
      price: "$130",
    },
    {
      id: 6,
      imgSrc: "/images/tire6.jpeg",
      title: "Run-Flat Tires",
      description: "Allows safe driving even after a puncture.",
      price: "$220",
    },
  ],
};

const LeftArrow = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);
  return (
    <button
      onClick={() => scrollPrev()}
      className="p-2 md:p-4 text-blue-500 hover:text-blue-700 text-xl transition-transform hover:scale-105"
    >
      <FaRegArrowAltCircleLeft />
    </button>
  );
};

const RightArrow = () => {
  const { scrollNext } = React.useContext(VisibilityContext);
  return (
    <button
      onClick={() => scrollNext()}
      className="p-2 md:p-4 text-blue-500 hover:text-blue-700 text-xl transition-transform hover:scale-105"
    >
      <FaRegArrowAltCircleRight />
    </button>
  );
};

const TireDetailsPage = () => {
  const params = useParams();
  const id = params?.id?.toString() || "1";
  const tireId = parseInt(id);

  const allTires = Object.entries(suppliers).flatMap(([supplier, products]) =>
    products.map((product) => ({ ...product, supplier }))
  );

  const tire = allTires.find((t) => t.id === tireId);
  const mtire = tireServiceDetails[id];

  if (!tire || !mtire) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-700">Tire not found.</p>
      </div>
    );
  }

  const similarProducts = allTires.filter(
    (t) => t.supplier === tire.supplier && t.id !== tire.id
  );

  return (
    <section className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">{mtire.title}</h1>
          <p className="mt-2 text-gray-600 text-lg">{mtire.description}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10 bg-white shadow-md rounded-lg p-6">
          <div className="flex-1">
            <Image
              src={mtire.image}
              alt={mtire.title}
              width={600}
              height={400}
              className="rounded-md w-full h-auto object-contain"
            />
          </div>
          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Features
              </h2>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                {mtire.features.map((feature, idx) => (
                  <li key={idx}>{feature}</li>
                ))}
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Price Range
              </h2>
              <p className="text-lg font-bold text-blue-600">{mtire.priceRange}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Suitable for
              </h2>
              <p className="text-gray-700">
                {mtire.applicableVehicles.join(", ")}
              </p>
            </div>

            <button className="mt-6 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
              Book Installation
            </button>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="bg-white p-8 rounded-lg shadow-lg mt-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Similar Tires from {tire.supplier}
            </h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {similarProducts.map((product) => (
                <div
                  key={product.id}
                  itemID={product.id.toString()}
                  className="flex-shrink-0 w-72 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
                  style={{ marginRight: "16px" }}
                >
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    className="mb-4 w-full h-48 object-contain rounded"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-2">{product.description}</p>
                  <p className="text-blue-600 font-semibold mb-4">{product.price}</p>
                  <a
                    href={`/services/tires/${product.id}`}
                    className="inline-block px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
                  >
                    View Details
                  </a>
                </div>
              ))}
            </ScrollMenu>
          </div>
        )}
      </div>
    </section>
  );
};

export default TireDetailsPage;
