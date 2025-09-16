"use client";

import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Terms & Conditions</h1>
        <p className="text-gray-400">Please read these terms carefully before using our services.</p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-6 overflow-y-auto scrollbar-hide">
        <p>By using our website, you agree to comply with and be bound by these terms and conditions.</p>
        <p>All sales are subject to our cancellation and refund policies. We reserve the right to modify these terms at any time.</p>
        <p>Use of our services constitutes acceptance of these terms.</p>
      </main>

      <footer className="w-full bg-gray-900 text-gray-400 py-6 text-center">
        <Link href="/" className="hover:text-white transition">← Back to Home</Link>
      </footer>
    </div>
  );
}
