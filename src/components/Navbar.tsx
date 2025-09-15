"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import CartModal from "@/components/CartModal";
import AuthModal from "@/components/AuthModal";
import AboutModal from "@/components/AboutModal";
import ContactModal from "@/components/ContactModal";

export default function Navbar() {
  const { cart = [] } = useCart(); // Ensure cart is an array
  const { user } = useAuth();

  const [showCart, setShowCart] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <>
      <nav className="absolute top-5 left-0 w-full flex justify-between items-center px-6 py-2 z-50 bg-transparent">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            INVALID
          </span>
        </Link>

        {/* Nav Links + Cart + Sign In/User */}
        <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
          <button
            onClick={() => setShowAbout(true)}
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            About
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Contact
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
            aria-label="View Cart"
          >
            🛒
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                {cart.length > 99 ? "99+" : cart.length}
              </span>
            )}
          </button>

          {/* Sign In / User */}
          {user ? (
            <span className="px-4 py-2 text-base font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer">
              {user.displayName || user.email || user.phoneNumber}
            </span>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      {/* Modals */}
      {showCart && <CartModal isOpen={showCart} onClose={() => setShowCart(false)} />}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
    </>
  );
}
