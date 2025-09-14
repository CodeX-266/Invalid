"use client";

import React, { useState, useEffect } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  User,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "@/lib/firebaseClient";

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  // Google login
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-gray-900 rounded-xl shadow-xl max-w-md w-full p-8 space-y-6 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-400"
        >
          ✕
        </button>

        {user ? (
          <div className="text-center space-y-4">
            <p className="text-white text-lg">Signed in as:</p>
            <p className="text-xl font-semibold text-indigo-400">
              {user.displayName || user.email}
            </p>
            <button
              onClick={logout}
              className="mt-2 px-6 py-2 bg-red-600 rounded-lg font-semibold hover:bg-red-500 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={loginWithGoogle}
              disabled={loading}
              className="w-full px-4 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Continue with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
