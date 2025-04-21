import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Garage Services</h3>
            <p className="text-gray-400 mb-4">
              Providing quality automotive services to keep your car running
              smoothly. We offer a wide range of services tailored to your
              needs.
            </p>
            {/* <p className="text-gray-400">
              © {new Date().getFullYear()} Garage Services. All Rights Reserved.
            </p> */}
          </div>

          {/* Quick Links Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Quick Links</h3>
            <ul>
              <li className="mb-2">
                <a href="#home" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#services" className="text-gray-400 hover:text-white">
                  Services
                </a>
              </li>
              <li className="mb-2">
                <a href="#about" className="text-gray-400 hover:text-white">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#contact" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Contact Information</h3>
            <ul>
              <li className="flex items-center mb-2">
                <FaPhoneAlt className="mr-2 text-gray-400" size={18} />
                <span className="text-gray-400">+254 716 988 147</span>
              </li>
              <li className="flex items-center mb-2">
                <FaEnvelope className="mr-2 text-gray-400" size={18} />
                <span className="text-gray-400">
                  contact@garageservices.com
                </span>
              </li>
              <li className="flex items-center">
                <FaMapMarkerAlt className="mr-2 text-gray-400" size={18} />
                <span className="text-gray-400">ABC 123 Nairobi, Kenya</span>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup Section */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Subscribe to Our Newsletter
            </h3>
            <p className="text-gray-400 mb-4">
              Stay updated with the latest news and offers from Garage Services.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="p-3 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright Section */}
        <div className="flex justify-between items-center border-t border-gray-700 pt-8 mt-8">
          <div className="flex space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebookF size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedinIn size={24} />
            </a>
          </div>
          <p className="text-gray-400 text-sm text-center">
            &copy; {new Date().getFullYear()} Garage Services. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
