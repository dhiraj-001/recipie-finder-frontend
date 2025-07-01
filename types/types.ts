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
  userId: string | undefined;
  recipeId: string;
  title: string;
  image: string;
  createdAt: string; // ISO 8601 date string
}