import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MoreLife Healthcare - Accessible Healthcare for All",
  description: "A digital ecosystem connecting patients with quality healthcare providers across Africa",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen relative`}
      >
        {/* Ambient Background Wrapper */}
        <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 rounded-full blur-[100px] animate-blob mix-blend-multiply filter opacity-70"></div>
          <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000 mix-blend-multiply filter opacity-70"></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] bg-purple-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000 mix-blend-multiply filter opacity-70"></div>
        </div>
        
        {children}
      </body>
    </html>
  );
}

