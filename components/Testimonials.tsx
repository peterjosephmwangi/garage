export default function Testimonials() {
    const testimonials = [
      {
        name: "John Doe",
        image: "/images/team.jpg",
        review:
          "Amazing service! My car feels brand new. The team is professional and very friendly.",
        role: "Regular Customer",
      },
      {
        name: "Jane Smith",
        image: "/images/team.jpg",
        review:
          "Quick and reliable. They fixed my brakes perfectly. Highly recommend this garage!",
        role: "Satisfied Client",
      },
      {
        name: "Michael Lee",
        image: "/images/team.jpg",
        review:
          "The best garage in town! Affordable prices and top-notch service. Thank you!",
        role: "Loyal Customer",
      },
    ];
  
    return (
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            What Our Customers Say
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12">
            Real reviews from satisfied customers.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">"{testimonial.review}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  