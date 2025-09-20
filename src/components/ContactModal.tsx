"use client";

interface ContactModalProps {
  onClose: () => void;
}

export default function ContactModal({ onClose }: ContactModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative bg-gray-900 text-white rounded-2xl max-w-lg w-full p-10 shadow-2xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          Contact Us
        </h2>
        <p className="text-lg text-gray-300">
          Have questions? Reach out to us anytime.
        </p>

        <div className="mt-6 space-y-3 text-gray-400">
          <p>📧 Email: invalidlifestyle.global@gmail.com</p>
          <p>📞 Phone: +91 80924 18238</p>
          <p>📍 Location: Chennai, India</p>
        </div>
      </div>
    </div>
  );
}
