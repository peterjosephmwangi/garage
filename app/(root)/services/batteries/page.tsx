"use client";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

const BatteryReplacement = () => {
  // Battery options grouped by brand/supplier
  const suppliers = {
    "Brand X": [
      {
        id: 1,
        imgSrc: "/images/battery1.jpeg",
        title: "Standard Battery",
        description: "Reliable performance for everyday use.",
        price: "$100",
      },
      {
        id: 2,
        imgSrc: "/images/battery2.jpeg",
        title: "Premium Battery",
        description: "Extended lifespan with advanced technology.",
        price: "$150",
      },
      {
        id: 3,
        imgSrc: "/images/battery3.jpeg",
        title: "Eco-Friendly Battery",
        description: "Environmentally conscious and efficient.",
        price: "$120",
      },
      {
        id: 4,
        imgSrc: "/images/battery4.jpeg",
        title: "Heavy-Duty Battery",
        description: "Built for trucks and commercial vehicles.",
        price: "$200",
      },
    ],
    "Brand Y": [
      {
        id: 3,
        imgSrc: "/images/battery3.jpeg",
        title: "Eco-Friendly Battery",
        description: "Environmentally conscious and efficient.",
        price: "$120",
      },
      {
        id: 4,
        imgSrc: "/images/battery4.jpeg",
        title: "Heavy-Duty Battery",
        description: "Built for trucks and commercial vehicles.",
        price: "$200",
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
          <h1 className="text-4xl font-bold text-gray-800">
            🔋 Battery Replacement
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Get back on the road with our quick and affordable battery
            replacement service.
          </p>
        </div>

        {/* Battery Services */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:mx-auto after:mt-2">
            Battery Replacement Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Standard Cars
              </h3>
              <p className="text-gray-600 mb-4">
                Affordable batteries for compact and mid-size cars.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $80 - $120
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
                High-performance batteries for versatile vehicles.
              </p>
              <p className="text-lg font-semibold text-blue-600 mb-4">
                $120 - $180
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
                Heavy-duty batteries for demanding applications.
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

        {/* Battery Products by Supplier */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div
            key={supplier}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
              {supplier}'s Battery Products
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

export default BatteryReplacement;
