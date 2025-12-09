export interface Ingredient {
  item: string;
  amount: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  chefName: string; // "Grandma" or specific chef name
  prepTime: string;
  cookTime: string;
  calories: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  cuisine: string;
  tags: string[]; // e.g., "Vegan", "Gluten-Free", "Quick"
  ingredients: Ingredient[];
  instructions: string[];
  imageSeed?: number; // Used to generate consistent picsum images
}

export interface ShoppingItem {
  id: string;
  text: string;
  checked: boolean;
}

export type CategoryType = 'popular' | 'chef' | 'mom' | 'healthy' | 'quick';

export interface FilterState {
  search: string;
  tags: string[];
}