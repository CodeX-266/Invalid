"use client";

import { useState } from "react";
import HeroShop from "@/components/Hero";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthProvider";
import { Analytics } from "@vercel/analytics/next"

// ⬇️ Add this line to disable prerendering issues with Firebase
export const dynamic = "force-dynamic";

export default function HomePage() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Hero Section with Navbar */}
      <HeroShop>
        {/* Login/User Button */}
        <div className="absolute top-5 right-6 z-50">
          {user ? (
            <button
              className="px-6 py-3 text-lg md:text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setShowAuthModal(true)}
            >
              {user.displayName || user.email}
            </button>
          ) : (
            <button
              className="px-6 py-3 text-lg md:text-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-300"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In / Login
            </button>
          )}
        </div>
      </HeroShop>

      {/* Auth Modal */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </div>
  );
}
