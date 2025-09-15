"use client";

interface AboutModalProps {
  onClose: () => void;
}

export default function AboutModal({ onClose }: AboutModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6">
      <div className="relative bg-gray-900 text-white rounded-2xl max-w-2xl w-full p-10 shadow-2xl animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          About Us
        </h2>
        <p className="text-lg leading-relaxed text-gray-300">
          Welcome to <span className="font-semibold">INVALID</span> — where innovation meets design.  
          Our mission is to create futuristic, sleek, and user-friendly experiences that stand out.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-gray-300">
          Built with passion, our platform merges creativity with technology.  
          We believe every user deserves something unique, aesthetic, and powerful.
        </p>
      </div>
    </div>
  );
}
