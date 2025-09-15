"use client";

import { motion } from "framer-motion";
import { useCart } from "@/context/CartProvider";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems = [], removeFromCart, updateQuantity } = useCart(); // default empty array

  const total = cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0) || 0;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Cart Panel */}
      <motion.div
        className="fixed top-0 right-0 h-full bg-gray-900 z-50 shadow-2xl w-full sm:w-80 md:w-96 lg:w-[35%] flex flex-col"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-400">✕</button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 && (
            <p className="text-gray-400 text-center mt-20">Your cart is empty</p>
          )}

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{item.name}</h3>
                <p className="text-gray-300 font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    disabled={item.quantity <= 1}
                  >
                    -
                  </button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >
                    +
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto text-red-500 font-semibold hover:text-red-400"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-300 font-semibold">Subtotal</span>
            <span className="text-white font-bold">${total.toFixed(2)}</span>
          </div>
          <button
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
          >
            Checkout
          </button>
        </div>
      </motion.div>
    </>
  );
}
