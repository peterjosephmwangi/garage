"use client";

import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const CustomCarousel = () => {
  return (
    <div className="carousel-container mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 md:mt-8 lg:mt-12">
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        autoPlay={true}
        interval={3000}
        showStatus={false}
        stopOnHover={true}
        dynamicHeight={true}
      >
        <div>
          <Image
            src="/images/repair3.jpg"
            alt="Delicious Dish 1"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
          />
          {/* <p className="legend">Delicious Dish 1</p> */}
        </div>
        <div>
          <Image
            src="/images/repair2.jpg"
            alt="Delicious Dish 2"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
          />
          {/* <p className="legend">Delicious Dish 2</p> */}
        </div>
        <div>
          <Image
            src="/images/repair1.jpg"
            alt="Delicious Dish 3"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
          />
          {/* <p className="legend">Delicious Dish 3</p> */}
        </div>
        {/* <div>
          <Image
            src="/images/image3.jpg"
            alt="Delicious Dish 4"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
          />
          <p className="legend">Delicious Dish 4</p>
        </div>
        <div>
          <Image
            src="/images/image4.jpg"
            alt="Delicious Dish 5"
            width={800}
            height={600}
            className="rounded-lg object-cover w-full h-48 sm:h-64 md:h-80 lg:h-96"
          />
          <p className="legend">Delicious Dish 5</p>
        </div> */}
      </Carousel>
    </div>
  );
};

export default CustomCarousel;
