"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal"; // Make sure path is correct
import { useAuth } from "@/context/AuthProvider";

export default function Navbar() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="absolute top-5 left-0 w-full flex justify-between items-center px-6 py-2 z-50 bg-transparent">
        {/* Logo */}
        <div className="flex items-center space-x-3 cursor-pointer hover:scale-105 transition-transform">
          <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
          <span className="text-white text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            INVALID
          </span>
        </div>

        {/* Nav Links + Sign In */}
        <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
          <a
            href="#"
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Home
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Shop
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            Contact
          </a>

          {/* Sign In / User Button */}
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

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
