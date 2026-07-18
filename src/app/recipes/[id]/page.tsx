"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getRecipeById, getRelatedRecipes, logInteraction } from "@/lib/api";
import RecipeCard from "@/components/recipes/RecipeCard";
import SkeletonCard from "@/components/recipes/SkeletonCard";

export default function RecipeDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: recipe, isLoading, isError } = useQuery({
    queryKey: ["recipe", id],
    queryFn: () => getRecipeById(id),
    staleTime: 60000,
  });

  const { data: relatedRecipes, isLoading: isLoadingRelated } = useQuery({
    queryKey: ["relatedRecipes", id],
    queryFn: () => getRelatedRecipes(id),
    enabled: !!recipe,
    staleTime: 60000,
  });

  // Log view interaction on mount
  useEffect(() => {
    if (recipe) {
      logInteraction(recipe.id, "view").catch(console.error);
    }
  }, [recipe]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full animate-pulse">
        <div className="aspect-[21/9] w-full rounded-[2.5rem] bg-white/[0.03] shimmer mb-12" />
        <div className="h-10 w-3/4 bg-white/[0.03] rounded shimmer mb-6" />
        <div className="flex gap-4 mb-12">
          <div className="h-8 w-24 bg-white/[0.03] rounded-full shimmer" />
          <div className="h-8 w-24 bg-white/[0.03] rounded-full shimmer" />
        </div>
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1 space-y-4">
            <div className="h-6 w-32 bg-white/[0.03] rounded shimmer mb-6" />
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 w-full bg-white/[0.03] rounded shimmer" />)}
          </div>
          <div className="md:col-span-2 space-y-4">
            <div className="h-6 w-48 bg-white/[0.03] rounded shimmer mb-6" />
            {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-20 w-full bg-white/[0.03] rounded-2xl shimmer" />)}
          </div>
        </div>
      </div>
    );
  }

  if (isError || !recipe) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center pt-24 pb-20 px-4 text-center">
        <span className="text-6xl mb-6 opacity-50 block">🍽️</span>
        <h1 className="text-3xl font-bold text-white mb-4">Recipe Not Found</h1>
        <p className="text-neutral-400 mb-8 max-w-md">
          We couldn&apos;t find the recipe you&apos;re looking for. It might have been removed or the URL is incorrect.
        </p>
        <button onClick={() => window.history.back()} className="btn-primary px-8 py-3">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero Section ────────────────────────────────────────── */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full rounded-[2.5rem] overflow-hidden shadow-2xl mb-12 group flex items-center justify-center bg-[#1c1209]">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-900/30 to-secondary-900/30" />
          
          {/* Abstract background blobs for placeholder "image" */}
          <div className="absolute -top-1/2 -left-1/4 w-full aspect-square bg-primary-500/20 blur-[100px] rounded-full mix-blend-screen group-hover:bg-primary-500/30 transition-colors duration-700" />
          <div className="absolute -bottom-1/2 -right-1/4 w-full aspect-square bg-secondary-600/20 blur-[100px] rounded-full mix-blend-screen group-hover:bg-secondary-600/30 transition-colors duration-700" />
          
          <span className="text-[8rem] md:text-[12rem] drop-shadow-2xl relative z-10 opacity-90 group-hover:scale-110 transition-transform duration-700 ease-out">
            {recipe.cuisine === "Italian" ? "🍝" : 
             recipe.cuisine === "Mexican" ? "🌮" : 
             recipe.cuisine === "Japanese" ? "🍱" : 
             recipe.cuisine === "Indian" ? "🍛" : "🥗"}
          </span>

          <div className="absolute inset-0 bg-gradient-to-t from-[#100b05] via-[#100b05]/20 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-primary-500/20 text-primary-300 border border-primary-500/30 backdrop-blur-md shadow-sm">
                {recipe.cuisine}
              </span>
              {recipe.dietType.map((diet) => (
                <span key={diet} className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-500/20 text-accent-300 border border-accent-500/30 backdrop-blur-md shadow-sm">
                  {diet}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 leading-tight max-w-4xl text-balance">
              {recipe.title}
            </h1>
          </div>
        </div>

        {/* ── Key Info Row ────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Cook Time", value: `${recipe.cookTime} min`, icon: "⏱️" },
            { label: "Difficulty", value: recipe.difficulty, icon: "👨‍🍳" },
            { label: "Rating", value: `${recipe.rating} / 5`, icon: "⭐" },
            { label: "Added", value: new Date(recipe.createdAt).toLocaleDateString(), icon: "📅" },
          ].map((info, i) => (
            <div key={i} className="glass-card rounded-2xl p-5 flex flex-col items-center justify-center text-center">
              <span className="text-2xl mb-2">{info.icon}</span>
              <span className="text-sm text-neutral-400 mb-1">{info.label}</span>
              <span className="font-semibold text-white">{info.value}</span>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-12 gap-12 mb-24">
          {/* ── Left Column: Description & Ingredients ────────────── */}
          <div className="md:col-span-5 space-y-12">
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-4">Overview</h2>
              <p className="text-neutral-300 leading-relaxed text-lg text-balance">
                {recipe.description}
              </p>
            </section>

            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display text-2xl font-bold text-white">Ingredients</h2>
                <span className="text-sm font-medium text-neutral-500 bg-white/[0.05] px-3 py-1 rounded-full">
                  {recipe.ingredients.length} items
                </span>
              </div>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start gap-3 glass-card p-4 rounded-xl group hover:bg-white/[0.06] transition-colors">
                    <div className="mt-1 flex-shrink-0 w-5 h-5 rounded border border-primary-500/50 flex items-center justify-center text-primary-500 group-hover:bg-primary-500/10">
                      ✓
                    </div>
                    <span className="text-neutral-300 leading-relaxed">{ing}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* ── Right Column: Instructions ────────────────────────── */}
          <div className="md:col-span-7">
            <section>
              <h2 className="font-display text-2xl font-bold text-white mb-6">Instructions</h2>
              <div className="space-y-6">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-6 p-6 glass-card rounded-3xl relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-500 to-transparent opacity-50" />
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center font-bold text-white shadow-glow-primary">
                      {i + 1}
                    </div>
                    <div className="pt-1.5">
                      <p className="text-neutral-300 leading-relaxed text-lg">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ── Related Recipes ─────────────────────────────────────── */}
        <section className="pt-16 border-t border-white/[0.05]">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">You might also like</h2>
              <p className="text-neutral-400">More recipes matching your taste.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingRelated
              ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
              : relatedRecipes?.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </div>
        </section>
      </div>
    </div>
  );
}
