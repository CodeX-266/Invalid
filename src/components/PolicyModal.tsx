"use client";

import { motion } from "framer-motion";
import { FC } from "react";

interface PolicyModalProps {
  title: string;
  content: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const PolicyModal: FC<PolicyModalProps> = ({ title, content, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Sliding/Centered Modal */}
      <motion.div
        className="fixed top-0 left-1/2 transform -translate-x-1/2 h-full sm:h-auto max-h-[90vh] w-full sm:w-3/4 md:w-2/3 lg:w-1/2 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl rounded-xl z-50 overflow-hidden"
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white text-2xl hover:text-gray-400"
          >
            ✕
          </button>
        </div>
        <div className="p-6 overflow-y-auto no-scrollbar space-y-4 text-gray-200">
          {content}
        </div>
      </motion.div>
    </>
  );
};

export default PolicyModal;
