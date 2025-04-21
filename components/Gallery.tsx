export default function Gallery() {
    const images = [
      "/images/repair3.jpg",
      "/images/repair2.jpg",
      "/images/repair1.jpg",
      "/images/repair3.avif",
      "/images/repair4.jpg",
      "/images/repair5.avif",

    ];
  
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Our Work Gallery
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            A glimpse into our garage and the quality of our work.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  src={image}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover transform transition duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
                  <p className="text-white font-semibold">View Details</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  