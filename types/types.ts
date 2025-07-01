export interface Recipe {
  area: string;
  category: string;
  id: string;
  ingredients: { ingredient: string; measure: string }[];
  instructions: string[];
  name: string;
  tags: string[];
  thumbnail: string;
  youtube: string;
}

export interface UserFavorite {
  id: number;
  userId: string;
  recipeId: number;
  title: string;
  image: string;
  cookTime: string;
  servings: string;
  createdAt: string; // ISO 8601 date string
}