import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Dashboard — Personalized Recommendations",
  description:
    "Your personalized SmartRecipe dashboard with AI-powered recipe recommendations based on your taste, diet, and cooking history.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
