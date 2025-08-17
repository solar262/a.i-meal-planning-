import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, ServingsIcon, TotalTimeIcon, NutritionIcon } from './Icons';

interface RecipeDisplayProps {
  recipe: Recipe;
  imageUrl: string;
}

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-brand-bg-dark text-brand-text-primary p-3 rounded-lg text-center h-full border border-brand-border">
        <div className="text-brand-primary">{icon}</div>
        <span className="text-xs font-semibold uppercase mt-1 text-brand-text-secondary">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, imageUrl }) => {
  return (
    <div className="animate-fade-in-down">
      <div className="mb-6">
        <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-text-primary mb-2">{recipe.recipeName}</h2>
        <p className="text-base text-brand-text-secondary">{recipe.description}</p>
      </div>

      <div className="aspect-w-16 aspect-h-9 mb-6 rounded-xl overflow-hidden shadow-lg border border-brand-border">
        <img src={imageUrl} alt={recipe.recipeName} className="object-cover w-full h-full" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 text-center">
        <InfoPill icon={<ClockIcon />} label="Prep Time" value={recipe.prepTime} />
        <InfoPill icon={<FireIcon />} label="Cook Time" value={recipe.cookTime} />
        <InfoPill icon={<TotalTimeIcon />} label="Total Time" value={recipe.totalTime} />
        <InfoPill icon={<ServingsIcon />} label="Servings" value={recipe.servings} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <h3 className="text-xl font-bold font-serif mb-4 border-b-2 border-brand-primary pb-2 flex items-center gap-2"><NutritionIcon />Nutrition</h3>
          <div className="space-y-2 text-sm text-brand-text-secondary">
             <div className="flex justify-between p-2 bg-brand-bg-dark rounded-md"><span>Calories:</span> <span className="font-semibold text-brand-text-primary">{recipe.nutrition.calories}</span></div>
             <div className="flex justify-between p-2 rounded-md"><span>Protein:</span> <span className="font-semibold text-brand-text-primary">{recipe.nutrition.protein}</span></div>
             <div className="flex justify-between p-2 bg-brand-bg-dark rounded-md"><span>Carbs:</span> <span className="font-semibold text-brand-text-primary">{recipe.nutrition.carbs}</span></div>
             <div className="flex justify-between p-2 rounded-md"><span>Fat:</span> <span className="font-semibold text-brand-text-primary">{recipe.nutrition.fat}</span></div>
          </div>
        </div>
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold font-serif mb-4 border-b-2 border-brand-primary pb-2">Ingredients</h3>
          <ul className="space-y-2 list-disc list-inside text-brand-text-primary marker:text-brand-primary">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="pl-2">{ingredient}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-2xl font-bold font-serif mb-4 border-b-2 border-brand-primary pb-2">Instructions</h3>
        <ol className="space-y-4">
          {recipe.instructions.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="flex-shrink-0 bg-brand-primary text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4">{index + 1}</span>
              <p className="text-brand-text-primary flex-1 pt-0.5">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default RecipeDisplay;