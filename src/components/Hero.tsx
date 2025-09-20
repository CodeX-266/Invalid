"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Typewriter } from "react-simple-typewriter";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartProvider";
import toast, { Toaster } from "react-hot-toast";
import BasicEditor from "@/components/DesignEditor";

interface HeroShopProps {
  onCartClick?: () => void;
  onAuthClick?: () => void;
}

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

const products = [
  { id: 1, name: "Classic Jacket", price: "₹120", image: "/images/product1.webp" },
  { id: 2, name: "Elegant Shirt", price: "₹80", image: "/images/product2.webp" },
  { id: 3, name: "Stylish Pants", price: "₹90", image: "/images/product3.webp" },
  { id: 4, name: "Trendy Sneakers", price: "₹110", image: "/images/product4.webp" },
  { id: 5, name: "Classic Jacket", price: "₹120", image: "/images/product5.jpg" },
  { id: 6, name: "Classic Jacket", price: "₹120", image: "/images/product6.webp" },
  { id: 7, name: "Classic Jacket", price: "₹120", image: "/images/product1.webp" },
  { id: 8, name: "Elegant Shirt", price: "₹80", image: "/images/product2.webp" },
];

export default function HeroShop({ onCartClick, onAuthClick }: HeroShopProps) {
  const [index, setIndex] = useState(0);
  const [slice, setSlice] = useState(false);
  const [showValid, setShowValid] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const { addToCart } = useCart();
  const shopRef = useRef<HTMLDivElement>(null);

  // Slide images every 10s
  useEffect(() => {
    const interval = setInterval(() => setIndex((prev) => (prev + 1) % images.length), 10000);
    return () => clearInterval(interval);
  }, []);

  // Initial animations
  useEffect(() => {
    const timer1 = setTimeout(() => setSlice(true), 800);
    const timer2 = setTimeout(() => setShowValid(true), 1600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleShopClick = () => setShowShop(true);
  const handleBack = () => setShowShop(false);

  const handleHomeClick = () => {
    setShowShop(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Toaster position="top-right" reverseOrder={false} /> {/* ✅ React Hot Toast */}

      {/* Hero Section */}
      <motion.section
        className="absolute inset-0 w-full h-full bg-black"
        animate={{ y: showShop || showEditor ? "-100%" : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Background */}
        <motion.div
          key={index}
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${images[index]})` }}
          initial={{ x: "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: "-100%" }}
          transition={{ duration: 2 }}
        />
        <div className="absolute inset-0 bg-black/40 pointer-events-none" />

        {/* Navbar */}
        <Navbar onCartClick={onCartClick} onAuthClick={onAuthClick} />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full h-full px-8 md:px-16">
          <div className="max-w-xl space-y-6 text-white mt-32 md:mt-0">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Redefine Your{" "}
              <span className="text-white">
                <Typewriter
                  words={["Style", "Wardrobe", "Outfit", "Look"]}
                  loop={0}
                  cursor
                  cursorStyle="|"
                  typeSpeed={120}
                  deleteSpeed={80}
                  delaySpeed={1500}
                />
              </span>
            </h1>
            <p className="text-lg md:text-xl font-semibold text-white/90 max-w-lg">
              Premium clothing blending comfort and elegance. Crafted to match your everyday energy.
            </p>
            <div className="flex space-x-4 pt-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-gray-800 via-indigo-900 to-blue-900 text-white font-semibold shadow-md"
                onClick={handleShopClick}
              >
                Shop Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="px-8 py-4 rounded-full bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
                onClick={() => setShowEditor(true)}
              >
                Create Your Own
              </motion.button>
            </div>
          </div>

          <div className="mt-12 md:mt-0 w-full h-[700px] relative flex items-center justify-end overflow-hidden">
            <div className="relative">
              <div className="flex text-white text-[6rem] md:text-[14rem] relative">
                {!showValid && (
                  <>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={slice ? { x: 40, opacity: 0 } : {}}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="font-thin tracking-wide"
                    >
                      I
                    </motion.span>
                    <motion.span
                      initial={{ x: 0 }}
                      animate={slice ? { x: 40, opacity: 0 } : {}}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="font-thin tracking-wide"
                    >
                      N
                    </motion.span>
                  </>
                )}
                {["V", "A", "L", "I", "D"].map((letter, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: showValid ? 0 : 1 }}
                    animate={{ opacity: showValid ? 1 : 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut", delay: 0.2 }}
                    className="font-thin tracking-wide"
                  >
                    {letter}
                  </motion.span>
                ))}
              </div>

              <motion.div
                className="absolute h-2 bg-white top-1/2 w-full -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.7)]"
                initial={{ scaleX: 0, opacity: 1 }}
                animate={{ scaleX: slice ? 1 : 0, opacity: slice ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut", delay: slice ? 0 : 0.4 }}
              />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Shop Section */}
      <motion.section
        ref={shopRef}
        className="absolute inset-0 z-20 overflow-y-auto scrollbar-hide"
        initial={{ y: "100%" }}
        animate={{ y: showShop ? 0 : "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Full height background */}
        <div className="absolute top-0 left-0 w-full min-h-[200vh] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gray-700 rounded-full opacity-20 animate-pulse mix-blend-overlay"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gray-600 rounded-full opacity-20 animate-pulse mix-blend-overlay"></div>
        </div>

        {/* Top bar */}
        <div className="fixed top-5 left-0 w-full flex justify-between items-center px-6 py-2 z-30">
          <div className="flex items-center cursor-pointer" onClick={handleBack}>
            <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
            <span className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent ml-3">
              INVALID
            </span>
          </div>

          <button
            onClick={handleHomeClick}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold shadow-lg hover:scale-105 transition-transform"
          >
            Home
          </button>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-24 text-white z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">Our Collection</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl"
                whileHover={{ y: -10 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-72 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                  <p className="text-lg font-bold">{product.price}</p>
                </div>
                <motion.div
                  className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-100 sm:opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <button
                    className="px-6 py-3 bg-gray-700 rounded-full font-semibold hover:bg-gray-600 transition"
                    onClick={() => {
                      addToCart({
                        id: product.id,
                        name: product.name,
                        price: parseFloat(product.price.replace("₹", "")),
                        image: product.image,
                      });
                      toast.success("Added to your cart ");
                    }}
                  >
                    Add to Cart
                  </button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Design Editor Section */}
      <motion.section
        className="absolute inset-0 z-30 flex items-center justify-center bg-black/80"
        initial={{ y: "100%" }}
        animate={{ y: showEditor ? 0 : "100%" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <div className="relative bg-white rounded-2xl p-6 shadow-2xl">
          <button
            className="absolute top-3 right-3 px-4 py-2 bg-red-500 text-white rounded-lg"
            onClick={() => setShowEditor(false)}
          >
            Close
          </button>
          <BasicEditor />
        </div>
      </motion.section>
    </div>
  );
}
