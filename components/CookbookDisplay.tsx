import React, { useState } from 'react';
import type { Recipe } from '../types';
import RecipeDisplay from './RecipeDisplay';
import { TrashIcon, CookbookIcon, ArrowLeftIcon } from './Icons';

interface CookbookDisplayProps {
  savedRecipes: Recipe[];
  onDelete: (recipeId: string) => void;
}

const RecipeCard: React.FC<{ recipe: Recipe, onSelect: () => void, onDelete: () => void }> = ({ recipe, onSelect, onDelete }) => {
    return (
        <div className="relative group bg-white rounded-lg shadow border border-brand-border overflow-hidden transition-shadow hover:shadow-xl">
            <button onClick={onSelect} className="w-full text-left">
                <div className="aspect-w-16 aspect-h-9">
                    {recipe.imageUrl ? (
                        <img src={recipe.imageUrl} alt={recipe.recipeName} className="object-cover w-full h-full" />
                    ) : (
                        <div className="w-full h-full bg-brand-bg-dark flex items-center justify-center">
                            <CookbookIcon />
                        </div>
                    )}
                </div>
                <div className="p-4">
                    <h3 className="font-bold font-serif text-brand-text-primary truncate" title={recipe.recipeName}>{recipe.recipeName}</h3>
                    <p className="text-sm text-brand-text-secondary">{recipe.totalTime}</p>
                </div>
            </button>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    onDelete();
                }}
                className="absolute top-2 right-2 bg-white/70 text-red-500 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white hover:text-red-700"
                aria-label="Delete recipe"
            >
                <TrashIcon />
            </button>
        </div>
    );
};


const CookbookDisplay: React.FC<CookbookDisplayProps> = ({ savedRecipes, onDelete }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

    // This component won't need a real save function, just a dummy for RecipeDisplay prop
    const handleDummySave = () => {};

    if (selectedRecipe) {
        return (
            <div className="p-4 sm:p-6">
                <button 
                    onClick={() => setSelectedRecipe(null)} 
                    className="mb-6 text-sm font-semibold text-brand-primary hover:text-brand-primary-dark inline-flex items-center gap-2 bg-brand-bg-dark hover:bg-gray-200 px-3 py-2 rounded-lg transition-colors"
                >
                    <ArrowLeftIcon />
                    Back to Cookbook
                </button>
                <RecipeDisplay recipe={selectedRecipe} onSave={handleDummySave} isSaved={true} />
            </div>
        )
    }

    if (savedRecipes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center h-full p-8 min-h-[50vh]">
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-2xl font-semibold font-serif text-brand-text-primary mb-2">Your Cookbook is Empty</h3>
                <p className="text-brand-text-secondary max-w-md">
                    Looks like you haven't saved any recipes yet. Go to the generator, create a delicious recipe, and click "Save to Cookbook" to start your collection!
                </p>
            </div>
        );
    }
    

    return (
        <div className="p-4 sm:p-6">
            <h2 className="text-2xl font-bold font-serif text-brand-text-primary mb-6">My Saved Recipes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedRecipes.map(recipe => (
                    <RecipeCard 
                        key={recipe.id} 
                        recipe={recipe}
                        onSelect={() => setSelectedRecipe(recipe)}
                        onDelete={() => onDelete(recipe.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default CookbookDisplay;