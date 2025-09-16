"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Contact Us</h1>
        <p className="text-gray-400">Get in touch with our support team.</p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-6 overflow-y-auto scrollbar-hide">
        <p>If you have any questions, feel free to contact us:</p>
        <p>Email:  invalidlifestyle.global@gmail.com</p>
        <p>Phone: +91 80924 18238</p>
        <p>We aim to respond within 24 hours.</p>
      </main>

      <footer className="w-full bg-gray-900 text-gray-400 py-6 text-center">
        <Link href="/" className="hover:text-white transition">← Back to Home</Link>
      </footer>
    </div>
  );
}
