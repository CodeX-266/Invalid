"use client";

import { motion } from "framer-motion";

const products = [
  { id: 1, name: "Classic Jacket", price: "$120", image: "/images/product1.webp" },
  { id: 2, name: "Elegant Shirt", price: "$80", image: "/images/product2.webp" },
  { id: 3, name: "Stylish Pants", price: "$90", image: "/images/product3.webp" },
  { id: 4, name: "Trendy Sneakers", price: "$110", image: "/images/product4.webp" },
  { id: 5, name: "Classic Jacket", price: "$120", image: "/images/product5.jpg" },
  { id: 6, name: "Classic Jacket", price: "$120", image: "/images/product6.webp" },
];

export default function Shop() {
  return (
    <motion.section
      className="relative w-full py-24 bg-gray-900 text-white"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Our Collection
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={`${product.id}-${index}`} // ensures unique key
              className="relative bg-gray-800 rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 shadow-xl"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
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

              {/* Hover overlay */}
              <motion.div
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <button className="px-6 py-3 bg-indigo-600 rounded-full font-semibold hover:bg-indigo-500 transition">
                  Shop Now
                </button>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
