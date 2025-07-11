

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
  <Link
    href={`/services/brakes/${product.$id}`}
    passHref
  >
    <div
      className="cursor-pointer flex-shrink-0 w-72 border border-blue-100 rounded-lg p-6 text-center shadow-sm hover:shadow-md transition hover:scale-105 bg-blue-50"
      style={{ marginRight: "16px" }}
    >
      <img
        src={product.imageUrl || "/placeholder-image.jpg"}
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
      <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition">
        View Details
      </button>
    </div>
  </Link>
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
    <button className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-lg transition">
      {buttonText}
    </button>
  </div>
);

// Main component
const BrakesService: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Record<string, ServiceProduct[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        setLoading(true);
        setError(null);
        
        const products = await getServiceProducts("brakes");
        
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
        console.error("Error fetching brake products:", error);
        setError("Failed to load brake products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className="bg-blue-50 min-h-screen py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center">
            <p className="text-lg text-blue-600">Loading brake services...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-blue-50 min-h-screen py-12">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <div className="text-center">
            <p className="text-lg text-red-600">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-blue-50 min-h-screen py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800">
            🛑 Brake Repair & Maintenance
          </h1>
          <p className="mt-4 text-lg text-blue-600">
            Ensure your safety with our professional brake services.
          </p>
        </div>

        {/* Vehicle Types and Charges */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
            Brake Services for Different Vehicles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ServicePackage
              title="Cars (Sedans, Hatchbacks)"
              description="Premium brake services for daily commutes and city driving."
              price="$100 - $150"
            />
            <ServicePackage
              title="SUVs & Crossovers"
              description="Advanced brake repair services for rugged and heavy vehicles."
              price="$150 - $200"
            />
            <ServicePackage
              title="Trucks & Commercial Vehicles"
              description="Heavy-duty brake services for enhanced safety and performance."
              price="$200 - $300"
            />
          </div>
        </div>

        {/* Additional Brake Services */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
            Additional Brake Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Brake Inspection</h3>
              <p className="text-blue-600 text-sm">Complete brake system check</p>
              <p className="font-semibold text-blue-700 mt-2">$30</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Brake Fluid Change</h3>
              <p className="text-blue-600 text-sm">Fresh brake fluid replacement</p>
              <p className="font-semibold text-blue-700 mt-2">$60</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Brake Pad Replacement</h3>
              <p className="text-blue-600 text-sm">High-quality brake pad installation</p>
              <p className="font-semibold text-blue-700 mt-2">$120</p>
            </div>
            <div className="border border-blue-100 rounded-lg p-4 text-center bg-blue-50">
              <h3 className="font-bold text-blue-800 mb-2">Brake Rotor Service</h3>
              <p className="text-blue-600 text-sm">Rotor resurfacing or replacement</p>
              <p className="font-semibold text-blue-700 mt-2">$180</p>
            </div>
          </div>
        </div>

        {/* Dynamic Brake Products */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2 className="text-3xl font-extrabold text-blue-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-blue-500 after:to-blue-700 after:mx-auto after:mt-2">
              {supplier}'s Brake Products
            </h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {products.map((product) => (
                <ProductCard key={product.$id} product={product} />
              ))}
            </ScrollMenu>
          </div>
        ))}

        {/* Why Choose Our Brake Service */}
        <div className="bg-white rounded-lg shadow-lg p-8 mt-12">
          <h2 className="text-3xl font-extrabold text-blue-800 mb-8 text-center">
            Why Choose Our Brake Service?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Safety First</h3>
              <p className="text-blue-600">Your safety is our top priority with every brake service</p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">⚙️</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Expert Technicians</h3>
              <p className="text-blue-600">Certified brake specialists with years of experience</p>
            </div>
            <div className="text-center p-6 border border-blue-100 rounded-lg">
              <div className="text-4xl text-blue-600 mb-4">🔧</div>
              <h3 className="text-xl font-bold text-blue-800 mb-2">Quality Parts</h3>
              <p className="text-blue-600">Only premium brake components for lasting performance</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrakesService;