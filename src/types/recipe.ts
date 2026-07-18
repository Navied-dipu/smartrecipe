export interface Recipe {
  id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image?: string;
  imageUrl?: string;
  cookTime: number; // in minutes
  cookTimeMinutes?: number;
  rating: number; // 0 to 5
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  dietType: string[];
  ingredients: string[];
  instructions: string[];
  steps?: string[];
  createdAt: string;
  userId?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
