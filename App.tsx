import React, { useState, useCallback } from 'react';
import type { Recipe, RecipeFormData, MealPlan, MealPlannerFormData } from './types';
import { generateRecipe, generateRecipeImage, generateMealPlan } from './services/geminiService';
import Header from './components/Header';
import RecipeForm from './components/RecipeForm';
import MealPlannerForm from './components/MealPlannerForm';
import LoadingDisplay from './components/LoadingDisplay';
import RecipeDisplay from './components/RecipeDisplay';
import MealPlannerDisplay from './components/MealPlannerDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import InitialState from './components/InitialState';

type View = 'single' | 'planner';

const App: React.FC = () => {
  const [view, setView] = useState<View>('single');
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [recipeImage, setRecipeImage] = useState<string | null>(null);

  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipe = useCallback(async (formData: RecipeFormData) => {
    if (!formData.ingredients.trim()) return;

    setIsLoading(true);
    setLoadingMessage('Generating a single recipe...');
    setError(null);
    setRecipe(null);
    setRecipeImage(null);
    setMealPlan(null);

    try {
      const generatedRecipe = await generateRecipe(formData);
      setRecipe(generatedRecipe);

      const image = await generateRecipeImage(generatedRecipe.recipeName);
      setRecipeImage(image);
      
    } catch (err) {
      console.error(err);
      setError('Failed to generate a recipe. The AI might be busy, please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateMealPlan = useCallback(async (formData: MealPlannerFormData) => {
    setIsLoading(true);
    setLoadingMessage('Planning your week...');
    setError(null);
    setRecipe(null);
    setMealPlan(null);
    setImageUrls({});

    try {
      const generatedPlan = await generateMealPlan(formData);
      setMealPlan(generatedPlan);

      // Incrementally generate images
      const urls: Record<string, string> = {};
      for (const [index, dayPlan] of generatedPlan.plan.entries()) {
        setLoadingMessage(`Generating image for ${dayPlan.day}'s meal...`);
        try {
            const image = await generateRecipeImage(dayPlan.recipe.recipeName);
            urls[dayPlan.recipe.recipeName] = image;
            setImageUrls(prev => ({...prev, ...urls}));
        } catch (imgErr) {
            console.error(`Failed to generate image for ${dayPlan.recipe.recipeName}`, imgErr);
        }
      }

    } catch (err) {
      console.error(err);
      setError('Failed to generate a meal plan. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderForm = () => {
    if (view === 'single') {
      return (
        <RecipeForm 
          onSubmit={handleGenerateRecipe}
          isLoading={isLoading}
        />
      );
    }
    return (
      <MealPlannerForm 
        onSubmit={handleGenerateMealPlan}
        isLoading={isLoading}
      />
    );
  };

  const renderContent = () => {
    if (isLoading) return <LoadingDisplay customMessage={loadingMessage} />;
    if (error) return <ErrorDisplay message={error} />;
    if (view === 'planner' && mealPlan) {
      return <MealPlannerDisplay mealPlan={mealPlan} imageUrls={imageUrls} />;
    }
    if (view === 'single' && recipe && recipeImage) {
      return <RecipeDisplay recipe={recipe} imageUrl={recipeImage} />;
    }
    return <InitialState view={view}/>;
  };

  return (
    <div className="min-h-screen font-sans text-brand-text-primary bg-brand-bg-light">
      <Header currentView={view} setView={setView} />
      <main className="container mx-auto p-4 lg:p-8">
        <div className="max-w-5xl mx-auto bg-brand-surface rounded-2xl shadow-lg border border-brand-border overflow-hidden">
          <div className="p-6 sm:p-8">
            {renderForm()}
          </div>
          
          <hr className="border-brand-border" />

          <div className="p-6 sm:p-8 min-h-[50vh] flex flex-col">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
