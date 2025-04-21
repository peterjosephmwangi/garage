import Link from "next/link";

export default function Services() {
  const services = [
    {
      title: "Oil Change",
      description: "Ensure your engine runs smoothly with our quick and efficient oil change service.",
      icon: "🛢️",
      link: "/services/oilchange",
    },
    {
      title: "Brake Repair",
      description: "Stay safe on the road with our reliable brake inspection and repair services.",
      icon: "🚗",
      link: "/services/brakes",
    },
    {
      title: "Tire Services",
      description: "From rotation to replacement, we've got your tires covered for all-weather performance.",
      icon: "🚙",
      link: "/services/tires",
    },
    {
      title: "Engine Diagnostics",
      description: "Advanced diagnostic tools to identify and solve engine issues quickly.",
      icon: "🔧",
      link: "/services/engine",
    },
    {
      title: "Battery Replacement",
      description: "Get back on the road with our quick and affordable battery replacement service.",
      icon: "🔋",
      link: "/services/batteries",
    },
    {
      title: "Air Conditioning",
      description: "Stay cool with our expert AC repair and maintenance services.",
      icon: "❄️",
      link: "/services/air",
    },
  ];
  
  
    return (

      <section className="py-12 bg-white">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Our Services
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Explore our wide range of vehicle services designed to keep you safe and on the move.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Link href={service.link} key={index}>
                <div className="flex flex-col items-center p-6 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition cursor-pointer">
                  <div className="text-5xl mb-4">{service.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-center">{service.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
    );
  }
  