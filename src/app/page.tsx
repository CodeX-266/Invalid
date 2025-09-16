"use client";

import { useState } from "react";
import HeroShop from "@/components/Hero";
import AuthModal from "@/components/AuthModal";
import CartSidebar from "@/components/CartModal";
import PolicyModal from "@/components/PolicyModal";
import { useAuth } from "@/context/AuthProvider";

export default function HomePage() {
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showCart, setShowCart] = useState(false);

  // Policy Modals
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showContact, setShowContact] = useState(false);

  return (
    <div className="relative w-full h-full flex flex-col min-h-screen overflow-hidden">
      {/* Hero Section with internal Navbar */}
      <div className="flex-grow relative">
        <HeroShop
          onCartClick={() => setShowCart(true)}
          onAuthClick={() => setShowAuthModal(true)}
        />

        {/* Footer as part of Hero section */}
        <footer className="absolute bottom-6 w-full text-gray-400 text-sm flex justify-center gap-6 z-50">
          <button
            onClick={() => setShowPrivacy(true)}
            className="hover:text-white transition cursor-pointer"
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setShowTerms(true)}
            className="hover:text-white transition cursor-pointer"
          >
            Terms & Conditions
          </button>
          <button
            onClick={() => setShowRefund(true)}
            className="hover:text-white transition cursor-pointer"
          >
            Cancellation & Refunds
          </button>
          <button
            onClick={() => setShowShipping(true)}
            className="hover:text-white transition cursor-pointer"
          >
            Shipping Policy
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="hover:text-white transition cursor-pointer"
          >
            Contact Us
          </button>
        </footer>

        {/* Auth Modal */}
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

        {/* Cart Sidebar */}
        <CartSidebar isOpen={showCart} onClose={() => setShowCart(false)} />

        {/* Policy Modals */}
        <PolicyModal
          title="Privacy Policy"
          isOpen={showPrivacy}
          onClose={() => setShowPrivacy(false)}
          content={
            <div className="space-y-2 text-gray-300">
              <p>
                We value your privacy and ensure that your personal information is protected.
                All data collected will be used solely to improve your experience.
              </p>
              <p>
                We do not sell or share your information with third parties without your consent.
              </p>
              <p>For any questions regarding privacy, contact us.</p>
            </div>
          }
        />
        <PolicyModal
          title="Terms & Conditions"
          isOpen={showTerms}
          onClose={() => setShowTerms(false)}
          content={
            <div className="space-y-2 text-gray-300">
              <p>
                By using this website, you agree to our terms and conditions.
                All purchases are subject to our policies.
              </p>
              <p>
                Unauthorized use of our content or services may lead to legal action.
              </p>
              <p>Always review terms before completing a purchase.</p>
            </div>
          }
        />
        <PolicyModal
          title="Cancellation & Refunds"
          isOpen={showRefund}
          onClose={() => setShowRefund(false)}
          content={
            <div className="space-y-2 text-gray-300">
              <p>
                Orders can be cancelled within 24 hours of placement.
                Refunds will be processed within 5-7 business days.
              </p>
              <p>
                Certain products may be non-refundable, please check the product description.
              </p>
              <p>Contact us for any cancellation or refund queries.</p>
            </div>
          }
        />
        <PolicyModal
          title="Shipping Policy"
          isOpen={showShipping}
          onClose={() => setShowShipping(false)}
          content={
            <div className="space-y-2 text-gray-300">
              <p>
                We ship products within 2-5 business days.
                Delivery times may vary depending on location.
              </p>
              <p>
                Shipping charges are calculated at checkout.
                We are not responsible for delays caused by third-party carriers.
              </p>
              <p>Track your order using the provided tracking number.</p>
            </div>
          }
        />
        <PolicyModal
          title="Contact Us"
          isOpen={showContact}
          onClose={() => setShowContact(false)}
          content={
            <div className="space-y-2 text-gray-300">
              <p>Email:  invalidlifestyle.global@gmail.com</p>
              <p>Phone: +91 80924 18238</p>
              <p>Address: chennai,600127, Tamil Nadu</p>
              <p>We are available Monday to Friday, 9 AM to 6 PM.</p>
            </div>
          }
        />
      </div>
    </div>
  );
}
