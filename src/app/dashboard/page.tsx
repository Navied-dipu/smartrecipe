"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import SkeletonCard from "@/components/recipes/SkeletonCard";
import { useSession } from "@/lib/auth-client";
import {
  getRecommendations,
  postInteraction,
  type RecommendedRecipe,
} from "@/lib/api";

// ── Filter options ──────────────────────────────────────────────────────────
const DIET_OPTIONS = [
  { label: "All Diets", value: "All" },
  { label: "Vegan", value: "Vegan" },
  { label: "Vegetarian", value: "Vegetarian" },
  { label: "Keto", value: "Keto" },
  { label: "Gluten-Free", value: "Gluten-Free" },
  { label: "Paleo", value: "Paleo" },
];

const COOK_TIME_OPTIONS = [
  { label: "Any time", value: 0 },
  { label: "Under 15 min", value: 15 },
  { label: "Under 30 min", value: 30 },
  { label: "Under 45 min", value: 45 },
  { label: "Under 60 min", value: 60 },
];

const cuisineEmoji = (cuisine: string) =>
  cuisine === "Italian"
    ? "🍝"
    : cuisine === "Mexican"
    ? "🌮"
    : cuisine === "Japanese"
    ? "🍱"
    : cuisine === "Indian"
    ? "🍛"
    : cuisine === "Thai"
    ? "🍲"
    : cuisine === "Mediterranean"
    ? "🥙"
    : "🥗";

function greetingForNow(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

// ── Recommended card ────────────────────────────────────────────────────────
function RecommendedCard({
  recipe,
  onSelect,
  saving,
}: {
  recipe: RecommendedRecipe;
  onSelect: (recipe: RecommendedRecipe) => void;
  saving: boolean;
}) {
  return (
    <div className="flex flex-col h-full">
      <button
        type="button"
        onClick={() => onSelect(recipe)}
        disabled={saving}
        aria-label={`Save and view ${recipe.title}`}
        className="text-left glass-card rounded-3xl overflow-hidden recipe-card flex flex-col flex-1 bg-[#1c1209]/80 border-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary-500/50 disabled:opacity-70 disabled:cursor-wait"
      >
        {/* Image placeholder */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#2d1810] to-[#1a0e05] flex items-center justify-center">
          <span className="text-6xl drop-shadow-lg opacity-80">
            {cuisineEmoji(recipe.cuisine)}
          </span>
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-xs font-semibold text-white border border-white/10 shadow-sm">
            {recipe.difficulty}
          </div>
          {saving && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-primary-500/10 text-primary-400 border border-primary-500/20">
              {recipe.cuisine}
            </span>
            {recipe.dietType.map((diet) => (
              <span
                key={diet}
                className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase bg-accent-500/10 text-accent-400 border border-accent-500/20"
              >
                {diet}
              </span>
            ))}
          </div>

          <h3 className="font-display text-xl font-bold text-white mb-2 line-clamp-1">
            {recipe.title}
          </h3>
          <p className="text-sm text-neutral-400 line-clamp-2 mb-4 flex-1">
            {recipe.description}
          </p>

          <div className="flex items-center justify-between text-xs font-medium text-neutral-300">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-500">⏱️</span> {recipe.cookTime} min
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-primary-400">★</span> {recipe.rating}
            </div>
          </div>
        </div>
      </button>

      {/* AI reason — shown below the card */}
      <div className="mt-3 flex items-start gap-2 px-1">
        <span className="text-primary-400 text-sm mt-0.5 shrink-0" aria-hidden>
          ✨
        </span>
        <p className="text-xs text-neutral-400 italic leading-relaxed">
          {recipe.reason}
        </p>
      </div>
    </div>
  );
}

// ── Dashboard content ───────────────────────────────────────────────────────
function DashboardContent() {
  const router = useRouter();
  const { data: session } = useSession();

  const [dietType, setDietType] = useState("All");
  const [maxCookTime, setMaxCookTime] = useState(0);
  const [savingId, setSavingId] = useState<string | null>(null);

  const firstName = useMemo(() => {
    const name = session?.user?.name?.trim();
    if (name) return name.split(" ")[0];
    const email = session?.user?.email;
    return email ? email.split("@")[0] : "there";
  }, [session]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    // Filters are part of the key, so changing them re-triggers the fetch.
    queryKey: ["recommendations", dietType, maxCookTime],
    queryFn: () =>
      getRecommendations({
        dietType: dietType === "All" ? undefined : dietType,
        maxCookTime: maxCookTime || undefined,
      }),
    staleTime: 30_000,
  });

  const recipes = data?.recipes ?? [];
  const hasInteractions = data?.hasInteractions ?? true;

  const handleSelect = async (recipe: RecommendedRecipe) => {
    setSavingId(recipe.id);
    try {
      // Fire the save interaction BEFORE navigating to the details page.
      await postInteraction(recipe.id, "save");
    } finally {
      router.push(`/recipes/${recipe.id}`);
    }
  };

  const resetFilters = () => {
    setDietType("All");
    setMaxCookTime(0);
  };

  const filtersActive = dietType !== "All" || maxCookTime !== 0;

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* ── Greeting ── */}
      <div className="mb-8">
        <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">
          Your Dashboard
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-3">
          {greetingForNow()}, <span className="gradient-text">{firstName}</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl">
          Here are fresh recommendations picked just for you — based on what
          you&apos;ve saved, rated, and cooked.
        </p>
      </div>

      {/* ── Filter controls ── */}
      <div className="glass-card p-4 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3">
          {/* Diet type */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="diet-filter"
              className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-1"
            >
              Diet type
            </label>
            <select
              id="diet-filter"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500/50 appearance-none min-w-40"
            >
              {DIET_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Max cook time */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="cooktime-filter"
              className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 px-1"
            >
              Max cook time
            </label>
            <select
              id="cooktime-filter"
              value={maxCookTime}
              onChange={(e) => setMaxCookTime(Number(e.target.value))}
              className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500/50 appearance-none min-w-40"
            >
              {COOK_TIME_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 md:self-end">
          {filtersActive && (
            <button
              onClick={resetFilters}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="btn-outline px-5 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60"
          >
            {isFetching ? (
              <span className="w-4 h-4 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            ) : (
              <span aria-hidden>↻</span>
            )}
            Refresh
          </button>
        </div>
      </div>

      {/* ── Loading state ── */}
      {isLoading && (
        <>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-5 h-5 border-2 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
            <p className="text-neutral-300 font-medium">
              Finding recipes you&apos;ll love...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </>
      )}

      {/* ── Error state ── */}
      {isError && !isLoading && (
        <div className="text-center py-24">
          <div className="text-6xl mb-5 opacity-50">⚠️</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            We couldn&apos;t load your recommendations
          </h3>
          <p className="text-neutral-400 mb-8">
            Something went wrong while fetching your picks. Please try again.
          </p>
          <button onClick={() => refetch()} className="btn-primary px-8 py-3 inline-flex">
            Retry
          </button>
        </div>
      )}

      {/* ── Empty state: no interactions (cold start) ── */}
      {!isLoading && !isError && !hasInteractions && (
        <div className="text-center py-24 max-w-lg mx-auto">
          <div className="text-7xl mb-6 opacity-60">🧑‍🍳</div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Let&apos;s learn what you love
          </h3>
          <p className="text-neutral-400 mb-8 leading-relaxed">
            We don&apos;t have enough to go on yet. Explore some recipes and save
            a few favorites — the more you interact, the smarter your personalized
            recommendations become.
          </p>
          <Link href="/recipes" className="btn-primary px-8 py-3 inline-flex">
            Explore Recipes
          </Link>
        </div>
      )}

      {/* ── Empty state: filters returned nothing ── */}
      {!isLoading && !isError && hasInteractions && recipes.length === 0 && (
        <div className="text-center py-24">
          <span className="text-6xl mb-4 block opacity-50">🍽️</span>
          <h3 className="text-xl font-bold text-white mb-2">No matches right now</h3>
          <p className="text-neutral-400 mb-6">
            No recommendations fit these filters. Try loosening them up.
          </p>
          <button onClick={resetFilters} className="btn-outline px-6 py-2 text-sm">
            Clear Filters
          </button>
        </div>
      )}

      {/* ── Recommendations grid ── */}
      {!isLoading && !isError && hasInteractions && recipes.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl font-bold text-white">
              Recommended for you
            </h2>
            <span className="text-sm text-neutral-500">
              {recipes.length} pick{recipes.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recipes.map((recipe) => (
              <RecommendedCard
                key={recipe.id}
                recipe={recipe}
                onSelect={handleSelect}
                saving={savingId === recipe.id}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
