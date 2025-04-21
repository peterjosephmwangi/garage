export default function Contact() {
    return (
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
            Contact Us
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12">
            We’d love to hear from you! Please fill out the form below and we’ll get back to you as soon as possible.
          </p>
  
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
            <form>
              <div className="mb-6">
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                  required
                />
              </div>
  
              <div className="mb-6">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Email"
                  required
                />
              </div>
  
              <div className="mb-6">
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Message
                  </label>
                <textarea
                  id="message"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Your Message"
                  required
                />
              </div>
  
              <button
                type="submit"
                className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }
  