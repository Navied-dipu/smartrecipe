import { Recipe, PaginatedResponse } from "@/types/recipe";

// Mock data generator
const generateMockRecipes = (count: number): Recipe[] => {
  const cuisines = ["Italian", "Mexican", "Indian", "Japanese", "Thai", "Mediterranean", "American"];
  const dietTypes = ["Vegan", "Vegetarian", "Keto", "Gluten-Free", "Paleo", "None"];
  const difficulties: ("Easy" | "Medium" | "Hard")[] = ["Easy", "Medium", "Hard"];

  return Array.from({ length: count }).map((_, i) => ({
    id: `recipe-${i + 1}`,
    title: `Delicious Recipe ${i + 1}`,
    description: `A fantastic and easy-to-make dish featuring fresh ingredients. Perfect for a weeknight dinner or a special occasion.`,
    cookTime: Math.floor(Math.random() * 60) + 15,
    rating: Number((Math.random() * 2 + 3).toFixed(1)), // 3.0 to 5.0
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    cuisine: cuisines[Math.floor(Math.random() * cuisines.length)],
    dietType: [dietTypes[Math.floor(Math.random() * dietTypes.length)]],
    ingredients: [
      "2 cups of fresh ingredients",
      "1 tbsp olive oil",
      "1/2 tsp salt and pepper to taste",
      "A pinch of culinary magic",
    ],
    instructions: [
      "Prepare all your ingredients by washing and chopping them as needed.",
      "Heat the olive oil in a large pan over medium heat.",
      "Add the main ingredients and sauté until perfectly cooked.",
      "Season with salt, pepper, and serve hot.",
    ],
    createdAt: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString(),
  }));
};

const mockRecipes = generateMockRecipes(100);

export interface FetchRecipesParams {
  q?: string;
  cuisine?: string;
  dietType?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const fetchRecipes = async (params: FetchRecipesParams): Promise<PaginatedResponse<Recipe>> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  let filtered = [...mockRecipes];

  // Apply search
  if (params.q) {
    const query = params.q.toLowerCase();
    filtered = filtered.filter(
      (r) => r.title.toLowerCase().includes(query) || r.description.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (params.cuisine && params.cuisine !== "All") {
    filtered = filtered.filter((r) => r.cuisine.toLowerCase() === params.cuisine?.toLowerCase());
  }
  if (params.dietType && params.dietType !== "All") {
    filtered = filtered.filter((r) => r.dietType.some((d) => d.toLowerCase() === params.dietType?.toLowerCase()));
  }

  // Apply sort
  if (params.sort) {
    switch (params.sort) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "highest-rated":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "cook-time":
        filtered.sort((a, b) => a.cookTime - b.cookTime);
        break;
    }
  }

  // Apply pagination
  const page = params.page || 1;
  const limit = params.limit || 12;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const paginatedData = filtered.slice(start, start + limit);

  return {
    data: paginatedData,
    total,
    page,
    limit,
    totalPages,
  };
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const recipe = mockRecipes.find((r) => r.id === id);
  return recipe || null;
};

export const getRelatedRecipes = async (id: string): Promise<Recipe[]> => {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const recipe = mockRecipes.find((r) => r.id === id);
  if (!recipe) return [];
  // Return 4 random recipes from the same cuisine, or just any 4
  const related = mockRecipes.filter((r) => r.id !== id && r.cuisine === recipe.cuisine);
  if (related.length < 4) {
    related.push(...mockRecipes.filter((r) => r.id !== id && !related.includes(r)).slice(0, 4 - related.length));
  }
  return related.slice(0, 4);
};

export const logInteraction = async (recipeId: string, action: 'view' | 'save' | 'share'): Promise<void> => {
  // Simulate network delay and silent exit if not logged in (mock)
  await new Promise((resolve) => setTimeout(resolve, 300));
  console.log(`[API Mock] Logged interaction '${action}' for recipe ${recipeId}`);
};

// ── AI Recommendations ──────────────────────────────────────────────────────
export interface RecommendedRecipe extends Recipe {
  /** One-line AI explanation for why this recipe was recommended. */
  reason: string;
}

export interface RecommendationParams {
  dietType?: string;
  maxCookTime?: number;
}

export interface RecommendationResponse {
  recipes: RecommendedRecipe[];
  /** True when the user has no interaction history yet (cold start). */
  hasInteractions: boolean;
}

const reasonTemplates = [
  (r: Recipe) => `Because you've saved several ${r.cuisine} dishes recently`,
  (r: Recipe) => `Matches your love for quick ${r.cookTime}-minute meals`,
  () => `Similar to recipes you rated highly`,
  (r: Recipe) => `A ${r.difficulty.toLowerCase()} pick that fits your cooking style`,
  (r: Recipe) => `Popular with cooks who share your taste in ${r.cuisine} food`,
  (r: Recipe) => `Fits your ${r.dietType[0]} preferences from past saves`,
];

/**
 * GET /api/ai/recommendations
 * Falls back to locally generated mock recommendations when the endpoint
 * is unavailable (e.g. during frontend-only development).
 */
export const getRecommendations = async (
  params: RecommendationParams = {}
): Promise<RecommendationResponse> => {
  const query = new URLSearchParams();
  if (params.dietType && params.dietType !== "All") query.set("dietType", params.dietType);
  if (params.maxCookTime) query.set("maxCookTime", String(params.maxCookTime));
  const qs = query.toString();

  try {
    const res = await fetch(`/api/ai/recommendations${qs ? `?${qs}` : ""}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      credentials: "include",
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    return (await res.json()) as RecommendationResponse;
  } catch {
    // ── Mock fallback ──────────────────────────────────────────────────────
    await new Promise((resolve) => setTimeout(resolve, 900));

    let pool = [...mockRecipes];
    if (params.dietType && params.dietType !== "All") {
      pool = pool.filter((r) =>
        r.dietType.some((d) => d.toLowerCase() === params.dietType?.toLowerCase())
      );
    }
    if (params.maxCookTime) {
      pool = pool.filter((r) => r.cookTime <= params.maxCookTime!);
    }

    const recipes: RecommendedRecipe[] = pool
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 8)
      .map((r, i) => ({
        ...r,
        reason: reasonTemplates[i % reasonTemplates.length](r),
      }));

    return { recipes, hasInteractions: true };
  }
};

/**
 * POST /api/interactions
 * Records a user interaction (e.g. saving a recipe). Fails silently on the
 * mock fallback so navigation is never blocked.
 */
export const postInteraction = async (
  recipeId: string,
  action: "view" | "save" | "share"
): Promise<void> => {
  try {
    const res = await fetch("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ recipeId, action }),
    });
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  } catch {
    // Mock fallback — do not block navigation on failure
    console.log(`[API Mock] POST /api/interactions { recipeId: ${recipeId}, action: ${action} }`);
  }
};
