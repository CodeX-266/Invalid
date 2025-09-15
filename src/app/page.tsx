"use client";

import { useState } from "react";
import HeroShop from "@/components/Hero";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartModal";
import { useAuth } from "@/context/AuthProvider";
import { useCart } from "@/context/CartProvider";

export default function HomePage() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  const { cartItems = [] } = useCart(); // ✅ default to empty array

  return (
    <div className="relative w-full h-full">
      {/* Hero Section */}
      <HeroShop>
        <div className="absolute top-5 right-6 z-50 flex items-center gap-3">
          {/* User Button */}
          {user ? (
            <button
              className="px-5 py-2 text-base md:text-lg bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setShowAuthModal(true)}
            >
              {user.displayName || user.email || user.phoneNumber}
            </button>
          ) : (
            <button
              className="px-5 py-2 text-base md:text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In / Login
            </button>
          )}

          {/* Cart Button */}
          <button
            onClick={() => setShowCart(true)}
            className="relative px-4 py-2 bg-white/20 text-white rounded-full hover:bg-white/30 transition flex items-center justify-center"
          >
            🛒
            {/* Cart item count badge */}
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </HeroShop>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* Cart Sidebar */}
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}
