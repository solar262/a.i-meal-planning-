export interface Recipe {
  recipeName: string;
  description: string;
  prepTime: string;
  cookTime: string;
  totalTime: string;
  servings: string;
  ingredients: string[];
  instructions: string[];
  nutrition: {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export interface RecipeFormData {
  ingredients: string;
  diet: string;
  cuisine: string;
  time: string;
}

export interface MealPlan {
  plan: {
    day: string; // e.g., "Monday"
    recipe: Recipe;
  }[];
  shoppingList: string[];
}

export interface MealPlannerFormData {
  proteins: string;
  useUpIngredients: string;
  days: number;
  diet: string;
}
