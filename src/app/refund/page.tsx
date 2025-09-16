"use client";

import Link from "next/link";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 flex flex-col">
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Cancellation & Refunds</h1>
        <p className="text-gray-400">Understand our cancellation and refund process.</p>
      </header>

      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-6 overflow-y-auto scrollbar-hide">
        <p>Orders can be cancelled within 24 hours of placement.</p>
        <p>Refunds will be processed to the original payment method within 5-7 business days.</p>
        <p>For more details, please contact our support team.</p>
      </main>

      <footer className="w-full bg-gray-900 text-gray-400 py-6 text-center">
        <Link href="/" className="hover:text-white transition">← Back to Home</Link>
      </footer>
    </div>
  );
}
