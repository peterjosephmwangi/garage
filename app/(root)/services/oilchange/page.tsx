// app/(root)/services/oilchange/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import { ServiceProduct } from "@/app/lib/serviceTypes";
import Link from "next/link";

export default function OilChangeService() {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const products = await getServiceProducts("oilchange");
        
        const grouped: Record<string, ServiceProduct[]> = {};
        products.forEach((product) => {
          const supplier = product.supplier || "Unknown Supplier";
          if (!grouped[supplier]) grouped[supplier] = [];
          grouped[supplier].push(product);
        });
        
        setSuppliers(grouped);
      } catch (error) {
        console.error("Error fetching oil change products:", error);
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
        className="p-2 md:p-4 lg:p-6 text-green-500 hover:text-green-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      >
        <FaRegArrowAltCircleLeft />
      </button>
    );
  };

  const RightArrow = () => {
    const { scrollNext } = React.useContext(VisibilityContext);
    return (
      <button
        className="p-2 md:p-4 lg:p-6 text-green-500 hover:text-green-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
        onClick={() => scrollNext()}
      >
        <FaRegArrowAltCircleRight />
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-2xl text-green-800">Loading oil change products...</div>
      </div>
    );
  }

  return (
    <section className="bg-green-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-green-800">
            🛢️ Oil Change Services
          </h1>
          <p className="mt-4 text-lg text-green-600">
            Premium oil and filter replacements to keep your engine running smoothly
          </p>
        </div>

        {/* Oil Change Packages */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-green-500 after:to-yellow-500 after:mx-auto after:mt-2">
            Oil Change Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="border border-green-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-green-50">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Standard Oil Change
              </h3>
              <p className="text-green-600 mb-4">
                Conventional oil and filter replacement
              </p>
              <p className="text-lg font-semibold text-green-700 mb-4">
                $40 - $70
              </p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-green-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-green-50">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Synthetic Blend Oil Change
              </h3>
              <p className="text-green-600 mb-4">
                Premium blend oil for better protection
              </p>
              <p className="text-lg font-semibold text-green-700 mb-4">
                $60 - $90
              </p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
            <div className="border border-green-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-green-50">
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Full Synthetic Oil Change
              </h3>
              <p className="text-green-600 mb-4">
                Highest quality oil for maximum engine protection
              </p>
              <p className="text-lg font-semibold text-green-700 mb-4">
                $80 - $120
              </p>
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
                Book Now
              </button>
            </div>
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-green-500 after:to-yellow-500 after:mx-auto after:mt-2">
            Additional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-green-100 rounded-lg p-4 text-center bg-green-50">
              <h3 className="font-bold text-green-800 mb-2">Fluid Top-off</h3>
              <p className="text-green-600 text-sm">Check and fill all fluids</p>
              <p className="font-semibold text-green-700 mt-2">$15</p>
            </div>
            <div className="border border-green-100 rounded-lg p-4 text-center bg-green-50">
              <h3 className="font-bold text-green-800 mb-2">Tire Rotation</h3>
              <p className="text-green-600 text-sm">Extend tire life</p>
              <p className="font-semibold text-green-700 mt-2">$25</p>
            </div>
            <div className="border border-green-100 rounded-lg p-4 text-center bg-green-50">
              <h3 className="font-bold text-green-800 mb-2">Air Filter Replacement</h3>
              <p className="text-green-600 text-sm">Improve engine performance</p>
              <p className="font-semibold text-green-700 mt-2">$30</p>
            </div>
            <div className="border border-green-100 rounded-lg p-4 text-center bg-green-50">
              <h3 className="font-bold text-green-800 mb-2">Multi-point Inspection</h3>
              <p className="text-green-600 text-sm">Complete vehicle check</p>
              <p className="font-semibold text-green-700 mt-2">Free</p>
            </div>
          </div>
        </div>

        {/* Dynamic Oil Change Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-green-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-green-500 after:to-yellow-500 after:mx-auto after:mt-2">
              {supplier}'s Oil Products
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
                  <Link href={`/services/oilchange/${product.$id}`} passHref>
                    <div className="cursor-pointer w-72 border border-green-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-green-50">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="mb-4 w-full h-48 object-contain rounded"
                      />
                      <h3 className="text-xl font-bold text-green-800 mb-2">
                        {product.title}
                      </h3>
                      <p className="text-green-600 mb-4 line-clamp-2">
                        {product.description}
                      </p>
                      <p className="text-lg font-semibold text-green-700 mb-4">
                       Ksh {product.price}
                      </p>
                      <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
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
          <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">
            Why Choose Our Oil Change Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-green-100 rounded-lg">
              <div className="text-4xl text-green-600 mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Fast Service</h3>
              <p className="text-green-600">Most oil changes completed in under 30 minutes</p>
            </div>
            <div className="text-center p-6 border border-green-100 rounded-lg">
              <div className="text-4xl text-green-600 mb-4">🔧</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Certified Technicians</h3>
              <p className="text-green-600">ASE-certified professionals servicing your vehicle</p>
            </div>
            <div className="text-center p-6 border border-green-100 rounded-lg">
              <div className="text-4xl text-green-600 mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-green-800 mb-2">12-Month Warranty</h3>
              <p className="text-green-600">All services come with our satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}