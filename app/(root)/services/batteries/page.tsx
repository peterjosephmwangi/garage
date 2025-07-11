
"use client";

import React, { useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import { FaRegArrowAltCircleRight, FaRegArrowAltCircleLeft } from "react-icons/fa";
import { getServiceProducts } from "@/app/actions/getServiceProducts";
import { ServiceProduct } from "@/app/lib/serviceTypes";
import Link from "next/link";

// Arrow components with proper typing
const LeftArrow: React.FC = () => {
  const { scrollPrev } = React.useContext(VisibilityContext);
  return (
    <button
      onClick={() => scrollPrev()}
      className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      aria-label="Scroll left"
    >
      <FaRegArrowAltCircleLeft />
    </button>
  );
};

const RightArrow: React.FC = () => {
  const { scrollNext } = React.useContext(VisibilityContext);
  return (
    <button
      className="p-2 md:p-4 lg:p-6 text-blue-500 hover:text-blue-700 text-xl md:text-3xl lg:text-4xl transition-transform transform hover:scale-105"
      onClick={() => scrollNext()}
      aria-label="Scroll right"
    >
      <FaRegArrowAltCircleRight />
    </button>
  );
};

// Product card component for better organization
interface ProductCardProps {
  product: ServiceProduct;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => (
  <div 
    className="flex-shrink-0"
    style={{ marginRight: "16px" }}
  >
    <Link href={`/services/batteries/${product.$id}`} passHref>
      <div className="cursor-pointer w-72 border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-blue-50">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.title}
            className="mb-4 w-full h-48 object-contain rounded"
          />
        )}
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
);

// Service package component
interface ServicePackageProps {
  title: string;
  description: string;
  price: string;
  buttonText?: string;
}

const ServicePackage: React.FC<ServicePackageProps> = ({ 
  title, 
  description, 
  price, 
  buttonText = "Book Now" 
}) => (
  <div className="border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition bg-blue-50">
    <h3 className="text-xl font-bold text-blue-800 mb-4">
      {title}
    </h3>
    <p className="text-blue-600 mb-4">
      {description}
    </p>
    <p className="text-lg font-semibold text-blue-700 mb-4">
      {price}
    </p>
    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
      {buttonText}
    </button>
  </div>
);

// Additional service component
interface AdditionalServiceProps {
  title: string;
  description: string;
  price: string;
}

const AdditionalService: React.FC<AdditionalServiceProps> = ({ 
  title, 
  description, 
  price 
}) => (
  <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
    <h3 className="font-bold text-blue-800 mb-2">{title}</h3>
    <p className="text-blue-600 text-sm">{description}</p>
    <p className="font-semibold text-blue-700 mt-2">{price}</p>
  </div>
);

// Feature card component
interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="text-center p-6 border border-blue-100 rounded-lg">
    <div className="text-4xl text-blue-600 mb-4">{icon}</div>
    <h3 className="text-xl font-bold text-blue-800 mb-2">{title}</h3>
    <p className="text-blue-600">{description}</p>
  </div>
);

// Main component
const BatteryService: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const products = await getServiceProducts("battery");
        
        const grouped: Record<string, ServiceProduct[]> = {};
        products.forEach((product: ServiceProduct) => {
          const supplier = product.supplier || "Unknown Supplier";
          if (!grouped[supplier]) {
            grouped[supplier] = [];
          }
          grouped[supplier].push(product);
        });
        
        setSuppliers(grouped);
      } catch (error) {
        console.error("Error fetching battery products:", error);
        setError("Failed to load battery products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-2xl text-blue-800">Loading battery products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-2xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <section className="bg-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800">
            🔋 Battery Services
          </h1>
          <p className="mt-4 text-lg text-blue-600">
            High-quality batteries to keep your vehicle powered and reliable
          </p>
        </div>

        {/* Battery Packages */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
            Battery Packages
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServicePackage
              title="Standard Battery"
              description="Reliable battery for everyday vehicles"
              price="Ksh 5,000 - 8,000"
            />
            <ServicePackage
              title="Premium Battery"
              description="Enhanced performance for high-demand vehicles"
              price="Ksh 8,000 - 12,000"
            />
            <ServicePackage
              title="Heavy-Duty Battery"
              description="Long-lasting power for trucks and SUVs"
              price="Ksh 12,000 - 18,000"
            />
          </div>
        </div>

        {/* Additional Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
            Additional Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdditionalService
              title="Battery Testing"
              description="Check battery health and charge"
              price="Ksh 500"
            />
            <AdditionalService
              title="Terminal Cleaning"
              description="Prevent corrosion and improve connectivity"
              price="Ksh 1,000"
            />
            <AdditionalService
              title="Alternator Check"
              description="Ensure proper charging system"
              price="Ksh 1,500"
            />
            <AdditionalService
              title="Battery Installation"
              description="Professional installation service"
              price="Free with purchase"
            />
          </div>
        </div>

        {/* Dynamic Battery Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
              {supplier}'s Battery Products
            </h2>
            <ScrollMenu 
              LeftArrow={<LeftArrow />} 
              RightArrow={<RightArrow />}
            >
              {products.map((product) => (
                <ProductCard key={product.$id} product={product} />
              ))}
            </ScrollMenu>
          </div>
        ))}

        {/* Why Choose Us */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
            Why Choose Our Battery Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon="⚡"
              title="Quick Installation"
              description="Most batteries installed in under 20 minutes"
            />
            <FeatureCard
              icon="🔧"
              title="Expert Technicians"
              description="Certified professionals for reliable service"
            />
            <FeatureCard
              icon="🛡️"
              title="2-Year Warranty"
              description="All batteries come with our quality guarantee"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BatteryService;