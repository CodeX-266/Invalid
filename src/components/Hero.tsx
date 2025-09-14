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
  const [slice, setSlice] = useState(false);
  const [showValid, setShowValid] = useState(false);

  // Background slide every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Animation sequence: line comes → IN disappears → VALID shows
  useEffect(() => {
    const timer1 = setTimeout(() => setSlice(true), 800);
    const timer2 = setTimeout(() => setShowValid(true), 1600);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-black">
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
      <nav className="absolute top-5 left-0 w-full flex justify-between items-center px-6 py-2 z-50 bg-transparent">
        {/* Logo + Brand together */}
        <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            INVALID
          </span>
        </div>

        {/* Menu */}
        <div className="hidden md:flex space-x-6 text-white font-semibold">
          <a href="#" className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            Home
          </a>
          <a href="#" className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            Shop
          </a>
          <a href="#" className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            About
          </a>
          <a href="#" className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105">
            Contact
          </a>
        </div>
      </nav>



      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full h-full px-8 md:px-16">
        {/* Left Side */}
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
            >
              Shop Now
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="px-8 py-4 rounded-full bg-gray-200 text-gray-900 font-semibold hover:bg-gray-300 transition"
            >
              Learn More
            </motion.button>
          </div>
        </div>

        {/* Right Side: INVALID → IN moves → VALID */}
        <div className="mt-12 md:mt-0 w-full h-[700px] relative flex items-center justify-end overflow-hidden">
          <div className="relative">
            <div className="flex text-white text-[12rem] md:text-[14rem] relative">
              {/* Show 'IN' separately for animation, thin font */}
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
              {/* Show 'VALID' aligned with IN disappearing */}
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

            {/* Glow Strike Line */}
            <motion.div
              className="absolute h-2 bg-white top-1/2 w-full -translate-y-1/2 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.7)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: slice ? 1 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
