"use client";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

const EngineDiagnostics = () => {
  // Group products by supplier/manufacturer
  const suppliers = {
    "Supplier A": [
      {
        id: 1,
        imgSrc: "/images/diagnostic1.jpeg",
        title: "OBD-II Scanner",
        description: "Quickly identify engine fault codes with precision.",
        price: "$120",
      },
      {
        id: 2,
        imgSrc: "/images/diagnostic2.jpeg",
        title: "Digital Compression Tester",
        description: "Accurately measure engine compression levels.",
        price: "$95",
      },
      {
        id: 3,
        imgSrc: "/images/diagnostic3.jpeg",
        title: "Engine Analyzer",
        description: "Advanced analysis for performance and fault detection.",
        price: "$250",
      },
      {
        id: 4,
        imgSrc: "/images/diagnostic4.jpeg",
        title: "Vacuum Gauge Tester",
        description: "Diagnose air leaks and engine inefficiencies.",
        price: "$60",
      },
    ],
    "Supplier B": [
      {
        id: 5,
        imgSrc: "/images/diagnostic3.jpeg",
        title: "Engine Analyzer",
        description: "Advanced analysis for performance and fault detection.",
        price: "$250",
      },
      {
        id: 6,
        imgSrc: "/images/diagnostic4.jpeg",
        title: "Vacuum Gauge Tester",
        description: "Diagnose air leaks and engine inefficiencies.",
        price: "$60",
      },
      {
        id: 7,
        imgSrc: "/images/diagnostic1.jpeg",
        title: "OBD-II Scanner",
        description: "Quickly identify engine fault codes with precision.",
        price: "$120",
      },
      {
        id: 8,
        imgSrc: "/images/diagnostic2.jpeg",
        title: "Digital Compression Tester",
        description: "Accurately measure engine compression levels.",
        price: "$95",
      },
      {
        id: 9,
        imgSrc: "/images/diagnostic3.jpeg",
        title: "Engine Analyzer",
        description: "Advanced analysis for performance and fault detection.",
        price: "$250",
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
          <h1 className="text-4xl font-bold text-gray-800">🔧 Engine Diagnostics</h1>
          <p className="mt-4 text-lg text-gray-600">
            Advanced diagnostic tools to identify and solve engine issues quickly.
          </p>
        </div>

        {/* Vehicle Types and Charges */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:mx-auto after:mt-2">
            Diagnostics for Different Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Cars (Sedans, Hatchbacks)
              </h3>
              <p className="text-gray-600 mb-4">
                Comprehensive engine diagnostics for city drivers.
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
                SUVs & Crossovers
              </h3>
              <p className="text-gray-600 mb-4">
                Expert diagnostics for rugged and family vehicles.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $150 - $200
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
                Heavy-duty diagnostics for commercial engines.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $200 - $300
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Diagnostic Products by Supplier */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div
            key={supplier}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
              {supplier}'s Diagnostic Tools
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

export default EngineDiagnostics;
