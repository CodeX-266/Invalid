import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthProvider";
import { CartProvider } from "@/context/CartProvider";
import ToastProvider from "@/components/ToastProvider"; // client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "𝐈𝐍𝐕𝐀𝐋𝐈𝐃",
  description: "The Clothing Company - Shop the latest fashion trends.",
  icons: { icon: "/logo.png" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <CartProvider>
            {children}
            <ToastProvider /> {/* client component inside server layout */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
