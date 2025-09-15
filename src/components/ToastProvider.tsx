// src/components/ToastProvider.tsx
"use client"; // must be a client component

import { Toaster } from "react-hot-toast";

export default function ToastProvider() {
  return <Toaster position="top-right" />;
}
