"use client";

import { useState } from "react";
import HeroShop from "@/components/Hero";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartModal";
import { useAuth } from "@/context/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="relative w-full h-full">
      {/* Hero Section (includes Navbar internally) */}
      <HeroShop
        onCartClick={() => setShowCart(true)}
        onAuthClick={() => setShowAuthModal(true)}
      />

      {/* Modals */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
      <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}
