import React from "react";
import Link from "next/link";
import "../app/globals.css";

const HorizontalScroll = ({ items }) => {
  return (
    <div className="w-full overflow-x-auto whitespace-nowrap py-4">
      <div className="flex space-x-4 px-6">
        {items.map((item, index) => (
          <Link href={item.link} key={index}>
            <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg shadow-md hover:shadow-lg cursor-pointer transition min-w-[120px] h-32 p-2">
              <div className="text-3xl mb-1">{item.icon}</div>
              <h3 className="text-sm font-semibold text-gray-800 text-center">
                {item.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HorizontalScroll;
