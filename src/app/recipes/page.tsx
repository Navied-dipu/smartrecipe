"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchRecipes } from "@/lib/api";
import { useDebounce } from "@/hooks/useDebounce";
import RecipeCard from "@/components/recipes/RecipeCard";
import SkeletonCard from "@/components/recipes/SkeletonCard";

function RecipesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from URL params
  const initialSearch = searchParams.get("q") || "";
  const initialCuisine = searchParams.get("cuisine") || "All";
  const initialDietType = searchParams.get("dietType") || "All";
  const initialSort = searchParams.get("sort") || "newest";
  const initialPage = parseInt(searchParams.get("page") || "1", 10);

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const [cuisine, setCuisine] = useState(initialCuisine);
  const [dietType, setDietType] = useState(initialDietType);
  const [sort, setSort] = useState(initialSort);
  const [page, setPage] = useState(initialPage);

  // Sync state to URL when dependencies change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (cuisine !== "All") params.set("cuisine", cuisine);
    if (dietType !== "All") params.set("dietType", dietType);
    if (sort !== "newest") params.set("sort", sort);
    if (page > 1) params.set("page", page.toString());

    const queryString = params.toString();
    router.replace(`/recipes${queryString ? `?${queryString}` : ""}`, { scroll: false });
  }, [debouncedSearch, cuisine, dietType, sort, page, router]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, cuisine, dietType, sort]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["recipes", debouncedSearch, cuisine, dietType, sort, page],
    queryFn: () =>
      fetchRecipes({
        q: debouncedSearch,
        cuisine: cuisine === "All" ? undefined : cuisine,
        dietType: dietType === "All" ? undefined : dietType,
        sort,
        page,
        limit: 12,
      }),
    staleTime: 5000,
  });

  const handlePreviousPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (data && page < data.totalPages) setPage((p) => p + 1);
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-4">
          Explore <span className="gradient-text">Recipes</span>
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl">
          Discover your next favorite meal. Use the filters below to narrow down by cuisine, diet, or just search for what you&apos;re craving.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="glass-card p-4 rounded-2xl mb-10 flex flex-col md:flex-row gap-4 items-center justify-between border-white/[0.08]">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">🔍</span>
          <input
            type="text"
            placeholder="Search recipes, ingredients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder:text-neutral-500 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50 transition-all"
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <select
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500/50 appearance-none min-w-32"
          >
            <option value="All">All Cuisines</option>
            <option value="Italian">Italian</option>
            <option value="Mexican">Mexican</option>
            <option value="Indian">Indian</option>
            <option value="Japanese">Japanese</option>
            <option value="Thai">Thai</option>
            <option value="Mediterranean">Mediterranean</option>
            <option value="American">American</option>
          </select>

          <select
            value={dietType}
            onChange={(e) => setDietType(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500/50 appearance-none min-w-32"
          >
            <option value="All">All Diets</option>
            <option value="Vegan">Vegan</option>
            <option value="Vegetarian">Vegetarian</option>
            <option value="Keto">Keto</option>
            <option value="Gluten-Free">Gluten-Free</option>
            <option value="Paleo">Paleo</option>
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-primary-500/50 appearance-none min-w-32 ml-auto md:ml-0"
          >
            <option value="newest">Newest</option>
            <option value="highest-rated">Highest Rated</option>
            <option value="cook-time">Cook Time</option>
          </select>
        </div>
      </div>

      {/* Results State */}
      {isError && (
        <div className="py-20 text-center text-red-400">
          <p>Failed to load recipes. Please try again.</p>
        </div>
      )}

      {!isLoading && !isError && data?.data.length === 0 && (
        <div className="py-20 text-center">
          <span className="text-6xl mb-4 block opacity-50">🍽️</span>
          <h3 className="text-xl font-bold text-white mb-2">No recipes found</h3>
          <p className="text-neutral-400">Try adjusting your search or filters to find what you&apos;re looking for.</p>
          <button 
            onClick={() => { setSearchTerm(""); setCuisine("All"); setDietType("All"); }}
            className="mt-6 btn-outline px-6 py-2 text-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => <SkeletonCard key={i} />)
          : data?.data.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)}
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="mt-auto pt-8 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-sm text-neutral-400">
            Showing <span className="text-white font-medium">{(page - 1) * data.limit + 1}</span> to{" "}
            <span className="text-white font-medium">{Math.min(page * data.limit, data.total)}</span> of{" "}
            <span className="text-white font-medium">{data.total}</span> recipes
          </p>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={page === 1 || isLoading}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm font-medium text-neutral-400 px-4">
              Page {page} of {data.totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page === data.totalPages || isLoading}
              className="px-4 py-2 rounded-lg border border-white/10 text-sm font-medium text-white hover:bg-white/[0.05] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function RecipesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-32 px-8 max-w-7xl mx-auto">
        <div className="h-10 w-48 bg-white/[0.05] rounded shimmer mb-10" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    }>
      <RecipesContent />
    </Suspense>
  );
}
