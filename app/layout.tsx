import type { Metadata } from "next";
import { Inter, Oswald, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import Navbar from "@/components/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "HiyanBlog — Share Your Stories",
  description: "A modern, full-stack blog platform to share your ideas with the world.",
  keywords: ["blog", "writing", "stories", "HiyanBlog"],
  openGraph: {
    title: "HiyanBlog — Share Your Stories",
    description: "A modern blog platform built with Next.js and MongoDB.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${oswald.variable} ${playfair.variable}`}>
      <body className="bg-gray-950 text-white antialiased min-h-screen">
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
