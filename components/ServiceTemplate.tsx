"use client";

import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import Link from "next/link";
import { ServiceType, serviceTypes } from "@/app/lib/serviceTypes";
import { ServiceProduct } from "@/app/lib/types";

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

const ServiceTemplate = ({
  serviceType,
  products,
}: {
  serviceType: typeof serviceTypes[number];
  products: ServiceProduct[];
}) => {
  const [suppliers, setSuppliers] = React.useState<
    Record<string, ServiceProduct[]>
  >({});

  React.useEffect(() => {
    // Group products by supplier
    const grouped: Record<string, ServiceProduct[]> = {};

    products.forEach((product) => {
      const supplier = product.supplier || "Unknown Supplier";
      if (!grouped[supplier]) {
        grouped[supplier] = [];
      }
      grouped[supplier].push(product);
    });

    setSuppliers(grouped);
  }, [products]);

  // Service-specific data
  const serviceData = {
    airConditioning: {
      title: "❄️ Air Conditioning Repair & Maintenance",
      description: "Stay cool with our expert AC repair and maintenance services.",
      serviceOptions: [
        {
          name: "Cars (Sedans, Hatchbacks)",
          description: "Efficient AC services for comfortable city driving.",
          price: "$80 - $120",
        },
        // ... other options
      ],
    },
    brakes: {
      title: "🛑 Brake Repair & Maintenance",
      description: "Keep your stopping power reliable with our brake services.",
      serviceOptions: [
        {
          name: "Standard Brake Service",
          description: "Complete inspection and pad replacement.",
          price: "$120 - $180",
        },
        // ... other options
      ],
    },
    // ... other services
  };

  const currentService = serviceData[serviceType.value] || {
    title: serviceType.label,
    description: "",
    serviceOptions: [],
  };

  return (
    <section className="bg-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800">
            {currentService.title}
          </h1>
          <p className="mt-4 text-lg text-blue-600">
            {currentService.description}
          </p>
        </div>

        {/* Vehicle Types and Charges */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-green-500 after:mx-auto after:mt-2">
            {serviceType.label} Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentService.serviceOptions.map((option, index) => (
              <div
                key={index}
                className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
              >
                <h3 className="text-xl font-bold text-blue-800 mb-4">
                  {option.name}
                </h3>
                <p className="text-blue-600 mb-4">{option.description}</p>
                <p className="text-lg font-semibold text-blue-600 mb-4">
                  {option.price}
                </p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                  Book Now
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div
            key={supplier}
            className="bg-white rounded-lg shadow-lg p-8 mb-12"
          >
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-gray-500 after:mx-auto after:mt-2">
              {supplier}'s Products
            </h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {products.map((product) => (
                <Link
                  key={product.$id}
                  href={`/services/${serviceType.value}/${product.$id}`}
                  passHref
                >
                  <div
                    className="cursor-pointer flex-shrink-0 w-72 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105"
                    style={{ marginRight: "16px" }}
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="mb-4 w-full h-48 object-contain rounded"
                    />
                    <h3 className="text-xl font-bold text-blue-800 mb-2">
                      {product.title}
                    </h3>
                    <p className="text-blue-600 mb-4">{product.description}</p>
                    <p className="text-lg font-semibold text-blue-600 mb-4">
                      {product.price}
                    </p>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </ScrollMenu>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServiceTemplate;