// app/(root)/services/tires/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
// import { getServiceProducts } from "@/app/actions/getServiceProducts";
// import { ServiceProduct } from "@/app/lib/serviceTypes";

import { ServiceProduct } from "@/app/lib/types"; // Update this import
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import Link from "next/link";

export default function TiresService() {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getServiceProducts("tires");
        
        const grouped: Record<string, ServiceProduct[]> = {};
        products.forEach((product) => {
          const supplier = product.supplier || "Unknown Supplier";
          if (!grouped[supplier]) grouped[supplier] = [];
          grouped[supplier].push(product);
        });
        
        setSuppliers(grouped);
      } catch (error) {
        console.error("Error fetching tire products:", error);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-2xl text-blue-800">Loading tire products...</div>
      </div>
    );
  }

  return (
    <section className="bg-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800">
            🚗 Tire Services & Replacement
          </h1>
          <p className="mt-4 text-lg text-blue-600">
            Quality tires for safety and performance on the road
          </p>
        </div>

        {/* Tire Types and Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-500 after:mx-auto after:mt-2">
            Our Tire Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Tire Replacement</h3>
              <p className="text-blue-600 text-sm">New tires installed professionally</p>
              <p className="font-semibold text-blue-700 mt-2">From $80/tire</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Tire Rotation</h3>
              <p className="text-blue-600 text-sm">Extend tire life evenly</p>
              <p className="font-semibold text-blue-700 mt-2">$25</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Wheel Alignment</h3>
              <p className="text-blue-600 text-sm">Adjustment for better handling</p>
              <p className="font-semibold text-blue-700 mt-2">$60</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Flat Repair</h3>
              <p className="text-blue-600 text-sm">Quick and reliable puncture repair</p>
              <p className="font-semibold text-blue-700 mt-2">$20</p>
            </div>
          </div>
        </div>

        {/* Popular Tire Categories */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-500 after:mx-auto after:mt-2">
            Popular Tire Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                All-Season Tires
              </h3>
              <p className="text-blue-600 mb-4">
                Perfect for year-round driving in most conditions
              </p>
              <p className="text-lg font-semibold text-blue-700 mb-4">
                $80 - $200 per tire
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                View Options
              </button>
            </div>
            <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                Performance Tires
              </h3>
              <p className="text-blue-600 mb-4">
                Enhanced grip and handling for sports cars
              </p>
              <p className="text-lg font-semibold text-blue-700 mb-4">
                $120 - $300 per tire
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                View Options
              </button>
            </div>
            <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
              <h3 className="text-xl font-bold text-blue-800 mb-4">
                Winter Tires
              </h3>
              <p className="text-blue-600 mb-4">
                Superior traction in snow and ice
              </p>
              <p className="text-lg font-semibold text-blue-700 mb-4">
                $100 - $250 per tire
              </p>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                View Options
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Tire Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-cyan-500 after:mx-auto after:mt-2">
              {supplier}'s Tires
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
                  <Link href={`/services/tires/${product.$id}`} passHref>
                    <div className="cursor-pointer w-72 border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-blue-50">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="mb-4 w-full h-48 object-contain rounded"
                      />
                      <h3 className="text-xl font-bold text-blue-800 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-blue-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-semibold text-blue-700 mb-4">
                       Ksh {product.price}
                      </p>
                      <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                        View Details
                      </button>
                    </div>
                  </Link>
                </div>
              ))}
            </ScrollMenu>
          </div>
        ))}

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
            Why Choose Our Tire Services?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">🛞</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Wide Selection</h3>
              <p className="text-blue-600">All major brands and sizes in stock</p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">🔧</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Expert Installation</h3>
              <p className="text-blue-600">Certified technicians with precision equipment</p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Warranty Included</h3>
              <p className="text-blue-600">Comprehensive warranty on all tires and services</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}