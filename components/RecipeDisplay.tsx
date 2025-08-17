import React from 'react';
import type { Recipe } from '../types';
import { ClockIcon, FireIcon, ServingsIcon, TotalTimeIcon, NutritionIcon, HeartIcon } from './Icons';

interface RecipeDisplayProps {
  recipe: Recipe;
  onSave: (recipe: Recipe) => void;
  isSaved: boolean;
}

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-brand-bg-dark text-brand-text-primary p-3 rounded-lg text-center h-full border border-brand-border">
        <div className="text-brand-primary">{icon}</div>
        <span className="text-xs font-semibold uppercase mt-1 text-brand-text-secondary">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

const RecipeDisplay: React.FC<RecipeDisplayProps> = ({ recipe, onSave, isSaved }) => {
  return (
    <div className="animate-fade-in-down">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-serif text-brand-text-primary mb-2">{recipe.recipeName}</h2>
                <p className="text-base text-brand-text-secondary">{recipe.description}</p>
            </div>
            <button
                onClick={() => onSave(recipe)}
                disabled={isSaved}
                className="flex-shrink-0 flex items-center justify-center gap-2 w-full sm:w-auto bg-white text-brand-primary font-bold py-2 px-4 rounded-lg border-2 border-brand-primary hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-green-200 transition-all duration-200 disabled:bg-emerald-500 disabled:text-white disabled:border-emerald-500 disabled:cursor-not-allowed"
            >
                <HeartIcon filled={isSaved} />
                {isSaved ? 'Saved!' : 'Save to Cookbook'}
            </button>
        </div>
      </div>

      <div className="aspect-w-16 aspect-h-9 mb-6 rounded-xl overflow-hidden shadow-lg border border-brand-border bg-brand-bg-dark">
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} alt={recipe.recipeName} className="object-cover w-full h-full" />
        ) : (
           <div className="w-full h-full flex items-center justify-center animate-pulse">
             <p className="text-brand-text-secondary font-medium">Generating image...</p>
           </div>
        )}
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