import { Recipe, PaginatedResponse } from "@/types/recipe";

// All /api/* requests are proxied to the Express backend via the Next.js
// rewrites defined in next.config.mjs. We default to a relative path so the
// browser stays on the same origin (localhost:3000) and the Better Auth
// session cookie is shared with the protected endpoints. NEXT_PUBLIC_API_URL
// can still force an absolute backend URL when needed (e.g. server-side).
const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function apiPath(path: string): string {
  return API_URL ? `${API_URL}${path}` : path;
}

// ─── Backend → Frontend transformer ────────────────────────────────────────
// The backend MongoDB model uses different field names and casing than the
// frontend Recipe interface. This function normalises a single raw backend
// document into the shape the UI components expect.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function transformRecipe(raw: any): Recipe {
  const capitalize = (s: string) =>
    s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

  return {
    id: raw._id ?? raw.id,
    title: raw.title,
    description: raw.shortDescription ?? raw.description ?? "",
    fullDescription: raw.fullDescription,
    image: raw.image,
    imageUrl: raw.imageUrl,
    cookTime: raw.cookTimeMinutes ?? raw.cookTime ?? 0,
    cookTimeMinutes: raw.cookTimeMinutes,
    rating: raw.rating ?? 0,
    difficulty: capitalize(raw.difficulty) as Recipe["difficulty"],
    cuisine: raw.cuisine ?? "",
    dietType: Array.isArray(raw.dietType)
      ? raw.dietType
      : [raw.dietType].filter(Boolean),
    ingredients: raw.ingredients ?? [],
    instructions: raw.steps ?? raw.instructions ?? [],
    steps: raw.steps,
    createdAt: raw.createdAt,
    userId: raw.createdBy ?? raw.userId,
  };
}

// ─── Response envelope handling ────────────────────────────────────────────
// Every backend success response looks like:
//   { success, message, data, statusCode }
// but for /recipes/mine the `data` is the array directly, and AI/other
// endpoints nest extra fields. We unwrap `json.data` when present.
function unwrap<T>(json: unknown): T {
  if (json && typeof json === "object" && "data" in (json as object)) {
    return (json as { data: T }).data;
  }
  return json as T;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiPath(path), {
    headers: { Accept: "application/json", ...(init?.headers || {}) },
    credentials: "include",
    cache: "no-store",
    ...init,
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      /* ignore non-JSON error bodies */
    }
    throw new Error(message || `Request failed with status ${res.status}`);
  }

  const json = await res.json();
  return unwrap<T>(json);
}

// ─── Recipes ───────────────────────────────────────────────────────────────

export interface FetchRecipesParams {
  q?: string;
  cuisine?: string;
  dietType?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export const fetchRecipes = async (
  params: FetchRecipesParams = {}
): Promise<PaginatedResponse<Recipe>> => {
  const query = new URLSearchParams();
  if (params.q) query.set("q", params.q);
  if (params.cuisine && params.cuisine !== "All")
    query.set("cuisine", params.cuisine);
  if (params.dietType && params.dietType !== "All")
    query.set("dietType", params.dietType);
  if (params.sort) query.set("sort", params.sort);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const qs = query.toString();
  const payload = await request<{
    data: unknown[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }>(`/api/recipes${qs ? `?${qs}` : ""}`);

  return {
    ...payload,
    data: (payload.data ?? []).map(transformRecipe),
  };
};

export const getRecipeById = async (id: string): Promise<Recipe | null> => {
  try {
    const raw = await request<unknown>(`/api/recipes/${id}`);
    return transformRecipe(raw);
  } catch (err) {
    if (
      err instanceof Error &&
      (err.message.includes("not found") || err.message.includes("404"))
    ) {
      return null;
    }
    throw err;
  }
};

export const getRelatedRecipes = async (id: string): Promise<Recipe[]> => {
  try {
    const raw = await request<unknown[]>(`/api/recipes/${id}/related`);
    return Array.isArray(raw) ? raw.map(transformRecipe) : [];
  } catch {
    return [];
  }
};

export interface CreateRecipeInput {
  title: string;
  shortDescription: string;
  fullDescription?: string;
  ingredients: string[];
  steps: string[];
  cuisine: string;
  dietType: string;
  cookTimeMinutes: number;
  difficulty: "easy" | "medium" | "hard";
  imageUrl?: string;
}

export const createRecipe = async (
  input: CreateRecipeInput
): Promise<Recipe> => {
  const raw = await request<unknown>("/api/recipes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return transformRecipe(raw);
};

export const deleteRecipe = async (id: string): Promise<void> => {
  await request<void>(`/api/recipes/${id}`, { method: "DELETE" });
};

export const getMyRecipes = async (): Promise<Recipe[]> => {
  try {
    const raw = await request<unknown[]>("/api/recipes/mine");
    return Array.isArray(raw) ? raw.map(transformRecipe) : [];
  } catch {
    return [];
  }
};

// ─── AI ──────────────────────────────────────────────────────────────────────

export interface RecommendationParams {
  dietType?: string;
  maxCookTime?: number;
}

export interface RecommendedRecipe extends Recipe {
  reason: string;
}

export interface RecommendationResponse {
  recipes: RecommendedRecipe[];
  hasInteractions: boolean;
}

export const getRecommendations = async (
  params: RecommendationParams = {}
): Promise<RecommendationResponse> => {
  const query = new URLSearchParams();
  if (params.dietType && params.dietType !== "All")
    query.set("dietType", params.dietType);
  if (params.maxCookTime) query.set("maxCookTime", String(params.maxCookTime));

  const qs = query.toString();
  const payload = await request<{
    recipes: unknown[];
    hasInteractions: boolean;
  }>(`/api/ai/recommendations${qs ? `?${qs}` : ""}`);

  return {
    ...payload,
    recipes: (payload.recipes ?? []).map((r: any) => ({
      ...transformRecipe(r),
      reason: r.reason ?? "",
    })),
  };
};

// Shape returned by POST /api/ai/generate-recipe
export interface GeneratedRecipeDraft {
  title: string;
  shortDescription: string;
  fullDescription: string;
  ingredients: { name: string; quantity: string }[];
  steps: string[];
  cuisine: string;
  dietType: string;
  cookTimeMinutes: number;
  difficulty: "easy" | "medium" | "hard";
}

export const generateRecipe = async (
  prompt: string,
  length: "short" | "detailed"
): Promise<GeneratedRecipeDraft> => {
  return request<GeneratedRecipeDraft>("/api/ai/generate-recipe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, length }),
  });
};

// ─── Interactions ────────────────────────────────────────────────────────────

export const postInteraction = async (
  recipeId: string,
  action: "view" | "save" | "cook"
): Promise<void> => {
  try {
    await request<void>("/api/interactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId, action }),
    });
  } catch (err) {
    console.error("[API Error] Failed to post interaction", err);
  }
};

// ─── Health ─────────────────────────────────────────────────────────────────

export const getHealth = async (): Promise<{
  status: string;
  services: { database: { status: string; healthy: boolean } };
}> => {
  return request<{
    status: string;
    services: { database: { status: string; healthy: boolean } };
  }>("/api/health");
};
