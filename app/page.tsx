import Header from "../components/Header";
import Carousel from "../components/Carousel";
import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import Gallery from "../components/Gallery";
import Testimonials from "../components/Testimonials";
import Pricing from "../components/Pricing";
import Faqs from "../components/Faqs";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <>
      <Header />
      <Carousel />
      {/* Add scroll animation to Hero Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      > */}
      <Hero />
      {/* </motion.div> */}

      {/* Add scroll animation to About Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <About />
      </motion.div> */}
      <About />
      {/* Add scroll animation to Services Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Services />
      </motion.div> */}
      <Services />
      {/* Add scroll animation to Gallery Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Gallery />
      </motion.div> */}
      <Gallery />
      {/* Add scroll animation to Testimonials Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Testimonials />
      </motion.div> */}
      <Testimonials />
      {/* Add scroll animation to Pricing Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Pricing />
      </motion.div> */}
      <Pricing />
      {/* Add scroll animation to FAQ Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Faqs />
      </motion.div> */}
      <Faqs />
      {/* Add scroll animation to Contact Section */}
      {/* <motion.div 
        initial={{ opacity: 0 }} 
        whileInView={{ opacity: 1 }} 
        transition={{ duration: 0.5 }}
      >
        <Contact />
      </motion.div> */}
      <Contact />
      <Footer />
    </>
  );
}
