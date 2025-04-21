"use client";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

const BrakesRepair = () => {
  // Group products by supplier/manufacturer
  const suppliers = {
    "Supplier X": [
      {
        id: 1,
        imgSrc: "/images/brakes1.jpeg",
        title: "Premium Brake Pads",
        description: "Durable and long-lasting brake pads for smooth stops.",
        price: "$60",
      },
      {
        id: 2,
        imgSrc: "/images/brakes2.jpeg",
        title: "Ceramic Brake Pads",
        description: "High-performance ceramic pads for quieter braking.",
        price: "$75",
      },
      {
        id: 3,
        imgSrc: "/images/brakes3.jpeg",
        title: "Semi-Metallic Brake Pads",
        description: "Affordable brake pads with excellent stopping power.",
        price: "$50",
      },
    ],
    "Supplier Y": [
      {
        id: 4,
        imgSrc: "/images/brakes4.jpeg",
        title: "Drilled Brake Rotors",
        description: "High-performance rotors for better heat dissipation.",
        price: "$150",
      },
      {
        id: 5,
        imgSrc: "/images/brakes5.jpeg",
        title: "Slotted Brake Rotors",
        description: "Designed for better braking in wet conditions.",
        price: "$140",
      },
      ,
      {
        id: 6,
        imgSrc: "/images/brakes6.jpeg",
        title: "Semi-Metallic Brake Pads",
        description: "Affordable brake pads with excellent stopping power.",
        price: "$50",
      },
    ],
  };

  const LeftArrow = () => {
    const { scrollPrev } = React.useContext(VisibilityContext);
    return (
      <button
        onClick={() => scrollPrev()}
        className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    );
  };

  const RightArrow = () => {
    const { scrollNext } = React.useContext(VisibilityContext);
    return (
      <button
        className="p-2 md:p-4 lg:p-6 text-red-500 hover:text-red-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
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
          <h1 className="text-4xl font-bold text-gray-800">
            🚗 Brakes Repair Service
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Ensure your safety with top-notch brake repair services.
          </p>
        </div>

        {/* Vehicle Types and Charges */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 after:mx-auto after:mt-2">
            Brake Services for Different Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Cars (Sedans, Hatchbacks)
              </h3>
              <p className="text-gray-600 mb-4">
                Premium brake services for daily commutes and city driving.
              </p>
              <p className="text-lg font-semibold text-red-600 mb-4">
                $100 - $150
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                SUVs & Crossovers
              </h3>
              <p className="text-gray-600 mb-4">
                Advanced brake repair services for rugged and heavy vehicles.
              </p>
              <p className="text-lg font-semibold text-red-600 mb-4">
                $150 - $200
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Trucks & Commercial Vehicles
              </h3>
              <p className="text-gray-600 mb-4">
                Heavy-duty brake services for enhanced safety and performance.
              </p>
              <p className="text-lg font-semibold text-red-600 mb-4">
                $200 - $300
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Brake Products by Supplier */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div
            key={supplier}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-gray-500 after:mx-auto after:mt-2">
              {supplier}'s Brake Products
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
                  <p className="text-lg font-semibold text-red-600 mb-4">
                    {product?.price}
                  </p>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
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

export default BrakesRepair;
