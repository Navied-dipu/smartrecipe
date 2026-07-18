import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import QueryProvider from "@/components/layout/QueryProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "SmartRecipe — AI-Powered Cooking, Personalized for You",
    template: "%s | SmartRecipe",
  },
  description:
    "Discover, create, and save recipes tailored to your taste. SmartRecipe uses AI to suggest meals based on your pantry, dietary needs, and cuisine preferences.",
  keywords: ["recipes", "AI cooking", "meal planner", "smart recipes", "food"],
  openGraph: {
    title: "SmartRecipe — Cook Smarter Every Day",
    description: "AI-powered recipe discovery and personalized meal recommendations.",
    type: "website",
    siteName: "SmartRecipe",
  },
  twitter: {
    card: "summary_large_image",
    title: "SmartRecipe — Cook Smarter Every Day",
    description: "AI-powered recipe discovery and personalized meal recommendations.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
