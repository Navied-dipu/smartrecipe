"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Recipe } from "@/types/recipe";
import { getMyRecipes, deleteRecipe as deleteRecipeApi } from "@/lib/api";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-[#E8872B]" : "text-white/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-neutral-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const colors: Record<string, string> = {
    Easy: "bg-accent-500/15 text-accent-400 border-accent-500/20",
    Medium: "bg-primary-500/15 text-primary-400 border-primary-500/20",
    Hard: "bg-secondary-500/15 text-secondary-400 border-secondary-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${colors[difficulty] || "bg-white/10 text-white"}`}>
      {difficulty}
    </span>
  );
}

function DeleteConfirmDialog({
  recipeName,
  onConfirm,
  onCancel,
  isDeleting,
}: {
  recipeName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative glass-card rounded-2xl p-8 max-w-sm w-full shadow-2xl border border-red-500/20 z-10">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-2xl mx-auto mb-5">
            🗑️
          </div>
          <h3 className="text-white font-bold text-xl mb-2">Delete Recipe?</h3>
          <p className="text-neutral-400 text-sm mb-1">
            You&apos;re about to permanently delete:
          </p>
          <p className="text-white font-semibold mb-6 truncate px-4">
            &ldquo;{recipeName}&rdquo;
          </p>
          <p className="text-neutral-500 text-xs mb-8">
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 btn-outline py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 py-2.5 text-sm font-semibold rounded-full bg-red-500 hover:bg-red-600 text-white transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isDeleting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonRow() {
  return (
    <tr className="border-b border-white/[0.05]">
      {[40, 160, 80, 80, 80, 100].map((w, i) => (
        <td key={i} className="px-4 py-4">
          <div className={`h-4 w-${w === 40 ? "10" : "auto"} rounded shimmer`} style={{ width: `${w}px` }} />
        </td>
      ))}
    </tr>
  );
}

function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-4 space-y-3">
      <div className="flex gap-3">
        <div className="w-16 h-16 rounded-lg shimmer shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 w-3/4 shimmer rounded" />
          <div className="h-3 w-1/2 shimmer rounded" />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="h-8 flex-1 shimmer rounded-xl" />
        <div className="h-8 flex-1 shimmer rounded-xl" />
      </div>
    </div>
  );
}

function ManageRecipesContent() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [deleteTarget, setDeleteTarget] = useState<Recipe | null>(null);

  const {
    data: recipes,
    isLoading,
    isError,
    error,
  } = useQuery<Recipe[]>({
    queryKey: ["my-recipes"],
    queryFn: getMyRecipes,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteRecipeApi(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-recipes"] });
      setDeleteTarget(null);
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-white mb-2">
            My <span className="gradient-text">Recipes</span>
          </h1>
          <p className="text-neutral-400">
            Manage, view, and delete the recipes you&apos;ve published.
          </p>
        </div>
        <Link
          href="/recipes/add"
          className="btn-primary px-6 py-3 text-sm flex items-center gap-2 self-start sm:self-auto shrink-0"
        >
          + Add New Recipe
        </Link>
      </div>

      {/* Error State */}
      {isError && (
        <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error instanceof Error ? error.message : "Failed to load recipes."}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !isError && recipes?.length === 0 && (
        <div className="text-center py-24">
          <div className="text-7xl mb-5 opacity-40">🍽️</div>
          <h3 className="text-2xl font-bold text-white mb-3">No recipes yet</h3>
          <p className="text-neutral-400 mb-8">
            You haven&apos;t published any recipes. Create your first one!
          </p>
          <Link href="/recipes/add" className="btn-primary px-8 py-3 inline-flex">
            Create a Recipe
          </Link>
        </div>
      )}

      {/* ── Desktop Table ── */}
      {(isLoading || (recipes && recipes.length > 0)) && (
        <div className="hidden md:block glass-card rounded-2xl overflow-hidden border border-white/[0.06]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Thumb</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Title</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Cuisine</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Rating</th>
                <th className="text-right px-4 py-3.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading
                ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
                : recipes?.map((recipe) => (
                    <tr
                      key={recipe.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-4 py-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/[0.05] border border-white/10 shrink-0">
                          {recipe.imageUrl || recipe.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={recipe.imageUrl || recipe.image}
                              alt={recipe.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xl opacity-40">
                              🍴
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-white font-semibold text-sm group-hover:text-[#E8872B] transition-colors">
                          {recipe.title}
                        </p>
                        <p className="text-neutral-500 text-xs mt-0.5 truncate max-w-xs">
                          {recipe.description}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-300">{recipe.cuisine}</span>
                      </td>
                      <td className="px-4 py-3">
                        <DifficultyBadge difficulty={recipe.difficulty} />
                      </td>
                      <td className="px-4 py-3">
                        <StarRating rating={recipe.rating} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => router.push(`/recipes/${recipe.id}`)}
                            className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-medium text-white hover:bg-white/[0.05] transition-all"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setDeleteTarget(recipe)}
                            className="px-3 py-1.5 rounded-lg border border-red-500/20 text-xs font-medium text-red-400 hover:bg-red-500/10 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {recipes && recipes.length > 0 && (
            <div className="px-4 py-3 bg-white/[0.01] border-t border-white/[0.05]">
              <p className="text-xs text-neutral-500">
                {recipes.length} recipe{recipes.length !== 1 ? "s" : ""} total
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Mobile Card Grid ── */}
      {(isLoading || (recipes && recipes.length > 0)) && (
        <div className="md:hidden space-y-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            : recipes?.map((recipe) => (
                <div
                  key={recipe.id}
                  className="glass-card rounded-2xl p-4 border border-white/[0.06] recipe-card"
                >
                  <div className="flex gap-3 mb-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/[0.05] border border-white/10 shrink-0">
                      {recipe.imageUrl || recipe.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={recipe.imageUrl || recipe.image}
                          alt={recipe.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">
                          🍴
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-bold text-base truncate">{recipe.title}</h3>
                      <p className="text-neutral-400 text-sm mt-0.5">{recipe.cuisine}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <DifficultyBadge difficulty={recipe.difficulty} />
                        <StarRating rating={recipe.rating} />
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/recipes/${recipe.id}`)}
                      className="flex-1 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-white hover:bg-white/[0.05] transition-all"
                    >
                      View
                    </button>
                    <button
                      onClick={() => setDeleteTarget(recipe)}
                      className="flex-1 py-2.5 rounded-xl border border-red-500/20 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <DeleteConfirmDialog
          recipeName={deleteTarget.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}

export default function ManageRecipesPage() {
  return (
    <ProtectedRoute>
      <ManageRecipesContent />
    </ProtectedRoute>
  );
}
