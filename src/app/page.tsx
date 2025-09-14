"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import Shop from "@/components/Shop";

export default function HomePage() {
  const [showShop, setShowShop] = useState(false);

  return (
    <div className="relative w-full h-full">
      {!showShop && <Hero setShowShop={setShowShop} />}
      {showShop && <Shop />}
    </div>
  );
}
