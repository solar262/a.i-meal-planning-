import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe, RecipeFormData, MealPlan, MealPlannerFormData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.OBJECT,
    properties: {
        recipeName: { type: Type.STRING, description: "The name of the recipe." },
        description: { type: Type.STRING, description: "A short, enticing description of the dish." },
        prepTime: { type: Type.STRING, description: "Preparation time, e.g., '15 minutes'." },
        cookTime: { type: Type.STRING, description: "Cooking time, e.g., '30 minutes'." },
        totalTime: { type: Type.STRING, description: "Total time from start to finish." },
        servings: { type: Type.STRING, description: "Number of servings, e.g., '4 people'." },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of ingredients with measurements."
        },
        instructions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Step-by-step cooking instructions."
        },
        nutrition: {
            type: Type.OBJECT,
            description: "Estimated nutritional information per serving.",
            properties: {
                calories: { type: Type.STRING, description: "Estimated calories, e.g., '450 kcal'." },
                protein: { type: Type.STRING, description: "Estimated protein, e.g., '30g'." },
                carbs: { type: Type.STRING, description: "Estimated carbohydrates, e.g., '40g'." },
                fat: { type: Type.STRING, description: "Estimated fat, e.g., '15g'." }
            },
            required: ["calories", "protein", "carbs", "fat"]
        }
    },
    required: ["recipeName", "description", "prepTime", "cookTime", "totalTime", "servings", "ingredients", "instructions", "nutrition"]
};

const mealPlanSchema = {
    type: Type.OBJECT,
    properties: {
        plan: {
            type: Type.ARRAY,
            description: "The meal plan, with one entry per day.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.STRING, description: "The day of the week for this meal, e.g., 'Monday'." },
                    recipe: recipeSchema
                },
                required: ["day", "recipe"]
            }
        },
        shoppingList: {
            type: Type.ARRAY,
            description: "A consolidated list of extra ingredients needed to make all the recipes in the plan, excluding what the user already has. This list should be items that are not pantry staples.",
            items: { type: Type.STRING }
        }
    },
    required: ["plan", "shoppingList"]
};


export const generateRecipe = async (formData: RecipeFormData): Promise<Recipe> => {
    const { ingredients, diet, cuisine, time } = formData;

    const prompt = `You are a creative and experienced chef. Your task is to generate a delicious and easy-to-follow recipe based on the user's criteria.

    User's available ingredients: ${ingredients}
    Dietary restrictions: ${diet || 'None'}
    Cuisine preference: ${cuisine || 'Any'}
    Maximum cooking/prep time: ${time || 'Any'}
    
    Please create a recipe that primarily uses the available ingredients but feel free to include a few common pantry staples if necessary (like oil, salt, pepper, spices).
    Also provide estimated nutritional information per serving.
    The final output must be in the specified JSON format. Do not include any text, markdown, or backticks outside of the JSON object.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: recipeSchema,
            temperature: 0.7,
        },
    });

    try {
        const text = response.text.trim();
        return JSON.parse(text) as Recipe;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("The AI returned an invalid recipe format. Please try again.");
    }
};

export const generateMealPlan = async (formData: MealPlannerFormData): Promise<MealPlan> => {
    const { proteins, useUpIngredients, days, diet } = formData;

    const prompt = `You are an expert meal planner and efficiency chef. Your goal is to create a delicious and varied meal plan for ${days} days that minimizes food waste.

    Core proteins to use: ${proteins}
    Ingredients to use up: ${useUpIngredients}
    Number of days to plan: ${days}
    Dietary restrictions: ${diet || 'None'}

    Instructions:
    1. Create a cohesive plan for ${days} distinct meals.
    2. Prioritize using the 'Ingredients to use up' and 'Core proteins'.
    3. Be creative and ensure variety in the meals.
    4. Design recipes that intelligently share secondary ingredients to reduce waste (e.g., use half an onion one day, the other half another day).
    5. Generate a consolidated 'shoppingList' for ONLY the items NOT listed in the user's provided ingredients. Assume common pantry staples like oil, salt, pepper are already available and should not be on the shopping list.
    6. Ensure every part of the response schema is filled out correctly.
    7. The final output must be in the specified JSON format. Do not include any text, markdown, or backticks outside of the JSON object.`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: mealPlanSchema,
            temperature: 0.8,
        },
    });
    
    try {
        const text = response.text.trim();
        return JSON.parse(text) as MealPlan;
    } catch (e) {
        console.error("Failed to parse Gemini response:", response.text);
        throw new Error("The AI returned an invalid meal plan format. Please try again.");
    }
};


export const generateRecipeImage = async (recipeName: string): Promise<string> => {
    const prompt = `Photorealistic, stunning, appetizing, professional food photography of '${recipeName}'. Shot with a DSLR camera, shallow depth of field, high detail, vibrant colors, on a clean, modern surface with soft, natural side lighting and a beautifully blurred background.`;

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: prompt,
        config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } else {
        throw new Error("Image generation failed.");
    }
};