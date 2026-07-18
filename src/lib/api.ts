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
