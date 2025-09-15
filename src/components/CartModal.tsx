"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { placeOrder } from "@/lib/firestore";
import { toast } from "react-hot-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems = [], removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth();

  const [name, setName] = useState(user?.displayName || "");
  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error("Please sign in to place an order.");
      return;
    }

    if (!name || !phone || !address.street || !address.city || !address.state || !address.pincode || !address.country) {
      toast.error("Please fill in all shipping details.");
      return;
    }

    toast.loading("Placing your order...");

    try {
      const orderId = await placeOrder(user.uid, name, phone, address, cartItems, total);
      clearCart();
      toast.dismiss(); // remove loading toast
      toast.success(`Order placed successfully! Order ID: ${orderId}`);
      onClose();
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />}

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
          {cartItems.length === 0 && <p className="text-gray-400 text-center mt-20">Your cart is empty</p>}

          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition">
              <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
              <div className="flex-1">
                <h3 className="text-white font-semibold">{item.name}</h3>
                <p className="text-gray-300 font-bold">${item.price.toFixed(2)}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                    disabled={item.quantity <= 1}
                  >-</button>
                  <span className="text-white">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-1 bg-gray-700 rounded hover:bg-gray-600"
                  >+</button>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-auto text-red-500 font-semibold hover:text-red-400"
                  >Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Form */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-gray-700 space-y-3">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Street Address"
              value={address.street}
              onChange={(e) => setAddress({ ...address, street: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="City"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state}
                onChange={(e) => setAddress({ ...address, state: e.target.value })}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode}
                onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Country"
                value={address.country}
                onChange={(e) => setAddress({ ...address, country: e.target.value })}
                className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Subtotal */}
            <div className="flex justify-between items-center mt-2 mb-3">
              <span className="text-gray-300 font-semibold">Subtotal</span>
              <span className="text-white font-bold">${total.toFixed(2)}</span>
            </div>

            {/* Place Order Button */}
            <button
              onClick={handlePlaceOrder}
              className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
            >
              Place Order
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
