"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  // Slide background images every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen flex items-center px-6 md:px-16 overflow-hidden">
      
      {/* Sliding Background */}
      <motion.div
        key={index}
        className="absolute inset-0 w-full h-full bg-cover bg-center"
        style={{ backgroundImage: `url(${images[index]})` }}
        initial={{ x: "100%" }}
        animate={{ x: "0%" }}
        exit={{ x: "-100%" }}
        transition={{ duration: 2 }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full h-full">
        
        {/* Left Side */}
        <div className="max-w-xl space-y-6 text-white">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-4">
            <img src="/logo.png" alt="ClothWave Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold">ClothWave</span>
          </div>

          {/* Headline with typing effect */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
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

          {/* Subtext */}
          <p className="text-lg font-semibold text-white/90">
            Premium clothing blending comfort and elegance. Crafted to match your everyday energy.
          </p>

          {/* CTA Buttons */}
          <div className="flex space-x-4 pt-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-gradient-to-r from-gray-800 via-indigo-900 to-blue-900 text-white font-semibold shadow-md"
            >
              Shop Now
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-6 py-3 rounded-full bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
            >
              Learn More
            </motion.button>
          </div>
        </div>

        {/* Right Side Placeholder */}
        <div className="mt-12 md:mt-0 w-80 md:w-96 h-80 md:h-96 bg-white/20 rounded-xl flex items-center justify-center text-white/70">
          Your Image Here
        </div>
      </div>
    </section>
  );
}
