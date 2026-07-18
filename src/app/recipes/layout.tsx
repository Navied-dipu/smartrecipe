import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Explore Recipes — Search by Cuisine, Diet & Cook Time",
  description:
    "Browse hundreds of recipes on SmartRecipe. Filter by cuisine, dietary preference, and cook time to find your next favorite meal.",
  openGraph: {
    title: "Explore Recipes | SmartRecipe",
    description: "Search and filter hundreds of recipes by cuisine, diet, and cook time.",
    type: "website",
  },
};

export default function RecipesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
