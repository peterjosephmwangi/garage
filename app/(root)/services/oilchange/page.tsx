"use client";
import React from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import "react-horizontal-scrolling-menu/dist/styles.css";
import {
  FaRegArrowAltCircleRight,
  FaRegArrowAltCircleLeft,
} from "react-icons/fa";

const OilChange = () => {
  // Group products by supplier/manufacturer
  const suppliers = {
    "Supplier A": [
      {
        id: 1,
        imgSrc: "/images/images3.jpeg",
        title: "Synthetic Motor Oil",
        description: "High-performance synthetic oil for extended engine life.",
        price: "$40",
      },
      {
        id: 2,
        imgSrc: "/images/images.jpeg",
        title: "Conventional Motor Oil",
        description: "Reliable conventional oil for standard engines.",
        price: "$25",
      },
      {
        id: 3,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
      {
        id: 4,
        imgSrc: "/images/images3.jpeg",
        title: "Synthetic Motor Oil",
        description: "High-performance synthetic oil for extended engine life.",
        price: "$40",
      },
      {
        id: 5,
        imgSrc: "/images/images.jpeg",
        title: "Conventional Motor Oil",
        description: "Reliable conventional oil for standard engines.",
        price: "$25",
      },
      {
        id: 6,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
    ],
    "Supplier B": [
      {
        id: 3,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
      {
        id: 4,
        imgSrc: "/images/images3.jpeg",
        title: "Synthetic Motor Oil",
        description: "High-performance synthetic oil for extended engine life.",
        price: "$40",
      },
      {
        id: 5,
        imgSrc: "/images/images.jpeg",
        title: "Conventional Motor Oil",
        description: "Reliable conventional oil for standard engines.",
        price: "$25",
      },
      {
        id: 6,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
    ],
    "Supplier C": [
      {
        id: 5,
        imgSrc: "/images/images.jpeg",
        title: "Conventional Motor Oil",
        description: "Reliable conventional oil for standard engines.",
        price: "$25",
      },
      {
        id: 6,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
      {
        id: 3,
        imgSrc: "/images/download.jpeg",
        title: "High-Mileage Motor Oil",
        description: "Specially formulated for vehicles with over 75,000 miles.",
        price: "$35",
      },
      {
        id: 4,
        imgSrc: "/images/images3.jpeg",
        title: "Synthetic Motor Oil",
        description: "High-performance synthetic oil for extended engine life.",
        price: "$40",
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
            🛢️ Oil Change Service
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Keep your engine running like new with our expert oil change
            services.
          </p>
        </div>


         {/* Vehicle Types and Charges */}
         <div className="bg-white rounded-lg shadow-lg p-8">
         <h2
  className="text-3xl font-extrabold text-gray-800 mb-8 text-center relative after:content-[''] after:block after:w-32 after:h-1 after:bg-gradient-to-r after:from-yellow-500 after:to-orange-500 after:mx-auto after:mt-2"
>
  Oil Change for Different Vehicles
</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {/* Card 1 */}
             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
               <h3 className="text-xl font-bold text-gray-800 mb-4">
                 Cars (Sedans, Hatchbacks)
               </h3>
               <p className="text-gray-600 mb-4">
                 Premium engine oil for small cars ensures smoother rides and
                 better fuel efficiency.
               </p>
               <p className="text-lg font-semibold text-blue-600 mb-4">
                 $50 - $70
               </p>
               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                 Book Now
               </button>
             </div>

             {/* Card 2 */}
             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
               <h3 className="text-xl font-bold text-gray-800 mb-4">
                 SUVs & Crossovers
               </h3>
               <p className="text-gray-600 mb-4">
                 Specialized oil for SUVs ensures durability during long drives
                 and rugged terrains.
               </p>
               <p className="text-lg font-semibold text-blue-600 mb-4">
                 $70 - $90
               </p>
               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                 Book Now
               </button>
             </div>

             {/* Card 3 */}
             <div className="border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition">
               <h3 className="text-xl font-bold text-gray-800 mb-4">
                 Trucks & Commercial Vehicles
               </h3>
               <p className="text-gray-600 mb-4">
                 Heavy-duty oil for trucks ensures optimal performance and
                 extended mileage.
               </p>
               <p className="text-lg font-semibold text-blue-600 mb-4">
                 $100 - $150
               </p>
               <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                 Book Now
               </button>
             </div>
           </div>
         </div>


        {/* Oil Products by Supplier */}
        {Object.entries(suppliers).map(([supplier, products]) => (
          <div key={supplier} className="bg-white rounded-lg shadow-lg p-8 mb-12">
            <h2
  className="text-3xl font-extrabold text-gray-800 mb-6 text-center relative after:content-[''] after:block after:w-24 after:h-1 after:bg-gradient-to-r after:from-green-500 after:to-blue-500 after:mx-auto after:mt-2"
>
  {supplier}'s Oil Products
</h2>
            <ScrollMenu LeftArrow={<LeftArrow />} RightArrow={<RightArrow />}>
              {products.map((product) => (
                <div
                  key={product.id}
                  itemID={product?.id.toString()} // Required by ScrollMenu
                  className="flex-shrink-0 w-72 border rounded-lg p-6 text-center shadow-sm hover:shadow-md transition"
                  style={{ marginRight: "16px" }} // Add spacing between cards
                >
                  <img
                    src={product.imgSrc}
                    alt={product.title}
                    className="mb-4 w-full h-48 object-contain rounded"
                  />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-lg font-semibold text-blue-600 mb-4">
                    {product.price}
                  </p>
                  <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition">
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

export default OilChange;

