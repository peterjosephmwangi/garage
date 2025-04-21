"use client";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

const TireServices = () => {
  // Group tire products by brand/supplier
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
        className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    );
  };

  const RightArrow = () => {
    const { scrollNext } = React.useContext(VisibilityContext);
    return (
      <button
        className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
        onClick={() => scrollNext()}
      >
        <FaRegArrowAltCircleRight />
      </button>
    );
  };

  return (
    <section className="bg-gray-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">🚙 Tire Services</h1>
          <p className="mt-4 text-lg text-gray-600">
            Get the best tires and expert installation for your vehicle.
          </p>
        </div>

        {/* Vehicle Types and Tire Services */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:mx-auto after:mt-2">
            Tire Services for Different Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Cars (Sedans, Hatchbacks)
              </h3>
              <p className="text-gray-600 mb-4">
                Quality tire services for smooth city drives.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $60 - $100
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                SUVs & Crossovers
              </h3>
              <p className="text-gray-600 mb-4">
                Rugged tires for versatile and off-road performance.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $100 - $150
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Trucks & Commercial Vehicles
              </h3>
              <p className="text-gray-600 mb-4">
                Durable tires for heavy-duty applications.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $150 - $250
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Tire Products by Supplier */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div
            key={supplier}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
              {supplier}'s Tire Products
            </h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {products.map((product) => (
                <div
                  key={product?.id}
                  itemID={product?.id.toString()}
                  className="flex-shrink-0 w-72 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
                  style={{ marginRight: "16px" }}
                >
                  <img
                    src={product?.imgSrc}
                    alt={product?.title}
                    className="mb-4 w-full h-48 object-contain rounded"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product?.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{product?.description}</p>
                  <p className="text-lg font-semibold text-blue-600 mb-4">
                    {product?.price}
                  </p>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Buy Now
                  </button>
                </div>
              ))}
            </ScrollMenu>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TireServices;
