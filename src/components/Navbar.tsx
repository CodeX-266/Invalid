"use client";

import { useState } from "react";
import { useCart } from "@/context/CartProvider";
import { useAuth } from "@/context/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import AboutModal from "@/components/AboutModal";
import ContactModal from "@/components/ContactModal";
import MyOrders from "@/components/MyOrders";
import { Menu, X } from "lucide-react"; // ✅ icons for mobile menu

interface NavbarProps {
  onCartClick?: () => void;
  onAuthClick?: () => void;
}

export default function Navbar({ onCartClick, onAuthClick }: NavbarProps) {
  const { cartItems = [] } = useCart();
  const { user } = useAuth();

  const [showAbout, setShowAbout] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false); // ✅ mobile menu state

  return (
    <>
      <nav className="absolute top-5 left-0 w-full flex justify-between items-center px-6 py-2 z-50 bg-transparent">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform"
        >
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <span className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            INVALID
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-4 text-white font-semibold">
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

          {/* Cart */}
          <button
            onClick={onCartClick}
            className="relative px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
            aria-label="View Cart"
          >
            🛒
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                {cartItems.length > 99 ? "99+" : cartItems.length}
              </span>
            )}
          </button>

          {/* Auth + Orders */}
          {user ? (
            <>
              <span
                onClick={onAuthClick}
                className="px-4 py-2 text-base font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg hover:scale-105 transition-transform cursor-pointer"
              >
                {user.displayName || user.email || user.phoneNumber}
              </span>

              <button
                onClick={() => setShowOrders(true)}
                className="px-4 py-2 text-base font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg hover:scale-105 transition-transform"
              >
                My Orders
              </button>
            </>
          ) : (
            <button
              onClick={onAuthClick}
              className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-lg shadow-lg hover:scale-105 transition-transform"
            >
              Sign In
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileOpen(true)}
          aria-label="Open Menu"
        >
          <Menu size={28} />
        </button>
      </nav>

      {/* ✅ Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col">
          <div className="flex justify-between items-center p-6">
            <Link
              href="/"
              className="flex items-center space-x-3"
              onClick={() => setMobileOpen(false)}
            >
              <Image src="/logo.png" alt="Logo" width={32} height={32} />
              <span className="text-white text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                INVALID
              </span>
            </Link>

            <button
              onClick={() => setMobileOpen(false)}
              className="text-white"
              aria-label="Close Menu"
            >
              <X size={28} />
            </button>
          </div>

          {/* Mobile Links */}
          <div className="flex flex-col space-y-6 p-6 text-white font-semibold text-lg">
            <button onClick={() => { setShowAbout(true); setMobileOpen(false); }}>
              About
            </button>
            <button onClick={() => { setShowContact(true); setMobileOpen(false); }}>
              Contact
            </button>

            <button
              onClick={() => { onCartClick?.(); setMobileOpen(false); }}
              className="relative px-3 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition flex items-center justify-center"
            >
              🛒 Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 text-xs bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                  {cartItems.length > 99 ? "99+" : cartItems.length}
                </span>
              )}
            </button>

            {user ? (
              <>
                <span
                  onClick={() => { onAuthClick?.(); setMobileOpen(false); }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg text-white cursor-pointer"
                >
                  {user.displayName || user.email || user.phoneNumber}
                </span>

                <button
                  onClick={() => { setShowOrders(true); setMobileOpen(false); }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg text-white"
                >
                  My Orders
                </button>
              </>
            ) : (
              <button
                onClick={() => { onAuthClick?.(); setMobileOpen(false); }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 shadow-lg text-white"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      {showContact && <ContactModal onClose={() => setShowContact(false)} />}
      <MyOrders isOpen={showOrders} onClose={() => setShowOrders(false)} />
    </>
  );
}
