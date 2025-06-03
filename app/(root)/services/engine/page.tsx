// app/(root)/services/engine/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import { ServiceProduct } from "@/app/lib/serviceTypes";
import Link from "next/link";

export default function EngineService() {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getServiceProducts("engine");
        
        const grouped: Record<string, ServiceProduct[]> = {};
        products.forEach((product) => {
          const supplier = product.supplier || "Unknown Supplier";
          if (!grouped[supplier]) grouped[supplier] = [];
          grouped[supplier].push(product);
        });
        
        setSuppliers(grouped);
      } catch (error) {
        console.error("Error fetching engine products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-2xl text-red-800">Loading engine products...</div>
      </div>
    );
  }

  return (
    <section className="bg-red-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-red-800">
            ⚙️ Engine Services & Repairs
          </h1>
          <p className="mt-4 text-lg text-red-600">
            Expert engine solutions to maximize performance and longevity
          </p>
        </div>

        {/* Service Types and Pricing */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-red-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 after:mx-auto after:mt-2">
            Engine Maintenance Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                Oil Change & Filter
              </h3>
              <p className="text-red-600 mb-4">
                Full synthetic oil and premium filter replacement
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $40 - $80
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                Engine Diagnostics
              </h3>
              <p className="text-red-600 mb-4">
                Computerized engine system analysis
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $60 - $120
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-red-50">
              <h3 className="text-xl font-bold text-red-800 mb-4">
                Timing Belt Replacement
              </h3>
              <p className="text-red-600 mb-4">
                Complete timing system service with OEM parts
              </p>
              <p className="text-lg font-semibold text-red-700 mb-4">
                $250 - $500
              </p>
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Engine Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-red-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-red-500 after:to-yellow-500 after:mx-auto after:mt-2">
              {supplier}'s Engine Products
            </h2>
            <ScrollMenu 
              LeftArrow={<LeftArrow />} 
              RightArrow={<RightArrow />}
            >
              {products.map((product) => (
                <div 
                  key={product.$id} 
                  className="flex-shrink-0"
                  style={{ marginRight: "16px" }}
                >
                  <Link href={`/services/engine/${product.$id}`} passHref>
                    <div className="cursor-pointer w-72 border border-red-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-red-50">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="mb-4 w-full h-48 object-contain rounded"
                      />
                      <h3 className="text-xl font-bold text-red-800 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-red-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-semibold text-red-700 mb-4">
                       Ksh {product.price}
                      </p>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">
                        View Details
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </ScrollMenu>
          </div>
        ))}
      </div>
    </section>
  );
}