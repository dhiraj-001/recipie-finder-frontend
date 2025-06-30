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