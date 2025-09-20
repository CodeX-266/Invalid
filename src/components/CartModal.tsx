"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart, CartItem } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import { placeOrder } from "@/lib/firestore";
import { toast } from "react-hot-toast";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export default function CartModal({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems = [], removeFromCart, updateQuantity, clearCart } = useCart();
  const { user } = useAuth(); // type inferred from context

  const [step, setStep] = useState<number>(0);
  const [name, setName] = useState<string>(user?.displayName || "");
  const [phone, setPhone] = useState<string>(user?.phoneNumber || "");
  const [address, setAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false);

  const total: number = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const canProceedToShipping: boolean = cartItems.length > 0;
  const canProceedToReview: boolean =
    !!name &&
    !!phone &&
    !!address.street &&
    !!address.city &&
    !!address.state &&
    !!address.pincode &&
    !!address.country;

  // Load Razorpay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handleRazorpayPayment = async (): Promise<void> => {
    if (!user) {
      toast.error("Please sign in to proceed with payment.");
      return;
    }

    try {
      const res = await fetch("/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, currency: "INR" }),
      });

      if (!res.ok) throw new Error("Failed to create order");

      const order: { id: string; amount: number; currency: string } = await res.json();

      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "INVALID Lifestyle",
        description: "Purchase",
        order_id: order.id,
        handler: async function () {
          setIsPlacingOrder(true);
          const loadingToastId = toast.loading("Placing your order...");

          try {
            const orderId = await placeOrder(user.uid, name, phone, address, cartItems, total);
            clearCart();
            toast.dismiss(loadingToastId);
            toast.success(`Payment & Order Successful! Order ID: ${orderId}`);
            onClose();
            setStep(0);
          } catch (err) {
            console.error(err);
            toast.dismiss(loadingToastId);
            toast.error("Failed to save order after payment.");
          } finally {
            setIsPlacingOrder(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPlacingOrder(false);
            toast.error("Payment cancelled.");
          },
        },
        prefill: {
          name: name || "Customer",
          email: user.email || "",
          contact: phone || "",
        },
        theme: { color: "#7e22ce" },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
      setIsPlacingOrder(true);
    } catch (err) {
      console.error(err);
      setIsPlacingOrder(false);
      toast.error("Failed to initiate payment. Try again!");
    }
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      <motion.div
        className="fixed top-0 right-0 h-full z-50 w-full sm:w-80 md:w-96 lg:w-[35%] flex flex-col shadow-2xl bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-l border-gray-700"
        initial={{ x: "100%" }}
        animate={{ x: isOpen ? 0 : "100%" }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Your Cart</h2>
          <button onClick={onClose} className="text-white text-2xl hover:text-gray-400">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* Step 0: Cart */}
          {step === 0 && (
            <>
              {cartItems.length === 0 ? (
                <p className="text-gray-400 text-center mt-20">Your cart is empty</p>
              ) : (
                cartItems.map((item: CartItem) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4 bg-gray-800 p-4 rounded-lg shadow-md hover:bg-gray-700 transition"
                  >
                    <Image src={item.image} alt={item.name} width={80} height={80} className="rounded" />
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
                ))
              )}

              {cartItems.length > 0 && (
                <div className="mt-4">
                  <div className="flex justify-between text-white font-bold mb-3">
                    <span>Subtotal:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <button
                    disabled={!canProceedToShipping}
                    onClick={() => setStep(1)}
                    className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50"
                  >
                    Proceed to Shipping
                  </button>
                </div>
              )}
            </>
          )}

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">Shipping Information</h3>
              <input
                type="text"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isPlacingOrder}
              />
              <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isPlacingOrder}
              />
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={isPlacingOrder}
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isPlacingOrder}
                />
                <input
                  type="text"
                  placeholder="State"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isPlacingOrder}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Pincode"
                  value={address.pincode}
                  onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isPlacingOrder}
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="px-4 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={isPlacingOrder}
                />
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setStep(0)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                  disabled={isPlacingOrder}
                >
                  Back
                </button>
                <button
                  disabled={!canProceedToReview || isPlacingOrder}
                  onClick={() => setStep(2)}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
                >
                  Continue to Review
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">Review Your Cart</h3>
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {cartItems.map((item: CartItem) => (
                  <div key={item.id} className="flex items-center space-x-4 bg-gray-800 p-3 rounded-lg">
                    <Image src={item.image} alt={item.name} width={60} height={60} className="rounded" />
                    <div className="flex-1 text-white">
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-gray-300">${item.price.toFixed(2)}</p>
                      <p>Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-2 mb-3 text-white font-bold">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="flex-1 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow hover:scale-105 transition"
                >
                  Confirm & Place Order
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirm & Razorpay */}
          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-white text-xl font-semibold">Confirm Your Order</h3>
              <p className="text-gray-300">Shipping To:</p>
              <div className="bg-gray-800 p-4 rounded-lg text-white space-y-1">
                <p>{name}</p>
                <p>{phone}</p>
                <p>
                  {address.street}, {address.city}, {address.state}
                </p>
                <p>
                  {address.pincode}, {address.country}
                </p>
              </div>
              <div className="flex justify-between items-center mt-2 mb-3 text-white font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
                  disabled={isPlacingOrder}
                >
                  Back
                </button>
                <button
                  onClick={handleRazorpayPayment}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-lg shadow hover:scale-105 transition disabled:opacity-50"
                  disabled={isPlacingOrder}
                >
                  {isPlacingOrder ? "Processing..." : "Pay & Place Order"}
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </>
  );
}
