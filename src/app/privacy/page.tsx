"use client";

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-gray-300 flex flex-col">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-gray-400">Your privacy is important to us.</p>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-6 py-10 space-y-6 overflow-y-auto scrollbar-hide">
        <p>
          We respect your privacy and do not share personal information with third parties without your consent.
        </p>
        <p>
          All data is securely stored in our database and handled in compliance with applicable laws. 
          By using our services, you agree to the collection and use of information in accordance with this policy.
        </p>
        <p>
          We may update this policy from time to time. You are advised to review this page periodically for any changes.
        </p>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-900 text-gray-400 py-6 text-center">
        <Link href="/" className="hover:text-white transition">← Back to Home</Link>
      </footer>
    </div>
  );
}
