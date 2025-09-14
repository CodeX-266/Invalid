"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect } from "react";
import { Typewriter } from "react-simple-typewriter";

const images = [
  "/images/hero1.jpg",
  "/images/hero2.jpg",
  "/images/hero3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Slide background images every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Track mouse for text tilt
  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouseX.set((e.clientX / window.innerWidth - 0.5) * 10);
      mouseY.set((e.clientY / window.innerHeight - 0.5) * 10);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, (y) => -y / 2);
  const rotateY = useTransform(mouseX, (x) => x / 2);

  // Generate small blobs
  const blobCount = 25;
  const blobs = Array.from({ length: blobCount });

  return (
    <section className="relative w-full h-screen flex flex-col md:flex-row items-center px-6 md:px-16 overflow-hidden">
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

          {/* Headline (slightly smaller for balance) */}
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide">
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
          <p className="text-lg md:text-xl font-semibold text-white/90 max-w-lg">
            Premium clothing blending comfort and elegance. Crafted to match
            your everyday energy.
          </p>

          {/* CTA Buttons */}
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

        {/* Right Side: Giant INVALID Banner + Small Blobs */}
        <div className="mt-12 md:mt-0 w-full h-[700px] relative flex items-center justify-center overflow-hidden">
          {/* Small animated blobs */}
          {blobs.map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full blur-xl opacity-30"
              style={{
                width: 15 + Math.random() * 25,
                height: 15 + Math.random() * 25,
                background: `radial-gradient(circle, rgba(255,255,255,0.1), transparent)`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [
                  Math.random() * 50 - 25,
                  Math.random() * 50 - 25,
                  Math.random() * 50 - 25,
                ],
                y: [
                  Math.random() * 50 - 25,
                  Math.random() * 50 - 25,
                  Math.random() * 50 - 25,
                ],
              }}
              transition={{ repeat: Infinity, duration: 12 + i, ease: "easeInOut" }}
            />
          ))}

          {/* INVALID Text */}
          <motion.h1
            className="text-[12rem] md:text-[14rem] font-extrabold text-white tracking-widest drop-shadow-2xl z-10 text-center whitespace-nowrap"
            style={{ rotateX, rotateY }}
          >
            INVALID
          </motion.h1>
        </div>
      </div>
    </section>
  );
}
