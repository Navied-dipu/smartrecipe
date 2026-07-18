import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started — Create Your Account",
  description: "Create a free SmartRecipe account and start getting AI-powered recipe recommendations tailored to your taste.",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
