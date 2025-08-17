export interface Recipe {
  id: string; // Unique ID for each recipe
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
  imageUrl?: string; // Optional field to store the generated image URL
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
  nutritionSummary?: {
    targetCalories: string;
    targetProtein: string;
    targetCarbs: string;
    targetFat: string;
    explanation: string;
  };
}

export interface MealPlannerFormData {
  proteins: string;
  useUpIngredients: string;
  days: number;
  diet: string;
  // Fitness goal properties
  goal?: 'lose' | 'maintain' | 'gain';
  age?: number;
  gender?: 'male' | 'female' | 'unspecified';
  height?: number;
  heightUnit?: 'cm' | 'in';
  weight?: number;
  weightUnit?: 'kg' | 'lbs';
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'very' | 'extra';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}
