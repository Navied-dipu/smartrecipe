export interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookTime: number; // in minutes
  rating: number; // 0 to 5
  difficulty: "Easy" | "Medium" | "Hard";
  cuisine: string;
  dietType: string[];
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
