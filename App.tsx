
import React, { useState, useCallback, useEffect } from 'react';
import type { Chat } from '@google/genai';
import type { Recipe, RecipeFormData, MealPlan, MealPlannerFormData, ChatMessage } from './types';
import { generateRecipe, generateRecipeImage, generateMealPlan, getChatSession } from './services/geminiService';
import Header from './components/Header';
import RecipeForm from './components/RecipeForm';
import MealPlannerForm from './components/MealPlannerForm';
import LoadingDisplay from './components/LoadingDisplay';
import RecipeDisplay from './components/RecipeDisplay';
import MealPlannerDisplay from './components/MealPlannerDisplay';
import ErrorDisplay from './components/ErrorDisplay';
import InitialState from './components/InitialState';
import ViewSwitcher from './components/ViewSwitcher';
import CookbookDisplay from './components/CookbookDisplay';
import ChatAssistant from './components/ChatAssistant';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ChatIcon } from './components/Icons';

type AppView = 'generator' | 'cookbook';
type GeneratorView = 'single' | 'planner';

const App: React.FC = () => {
  const [appView, setAppView] = useState<AppView>('generator');
  const [generatorView, setGeneratorView] = useState<GeneratorView>('single');
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const [savedRecipes, setSavedRecipes] = useLocalStorage<Recipe[]>("cookbook", []);
  const savedRecipeIds = React.useMemo(() => new Set(savedRecipes.map(r => r.id)), [savedRecipes]);

  // Chat state
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const chatRef = React.useRef<Chat | null>(null);

  useEffect(() => {
    chatRef.current = getChatSession();
    setChatMessages([
        { role: 'model', text: "Hi! I'm Gourmet, your AI Chef Assistant. How can I help you today? Ask me for a recipe, or for some cooking tips!" }
    ]);
  }, []);

  const handleSendChatMessage = async (message: string) => {
    if (!message.trim() || !chatRef.current) return;

    const userMessage: ChatMessage = { role: 'user', text: message };
    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
        const response = await chatRef.current.sendMessage({ message });
        const modelMessage: ChatMessage = { role: 'model', text: response.text };
        setChatMessages(prev => [...prev, modelMessage]);
    } catch (err) {
        console.error("Chat error:", err);
        const errorMessage: ChatMessage = { role: 'model', text: "Sorry, I'm having a little trouble right now. Please try again later." };
        setChatMessages(prev => [...prev, errorMessage]);
    } finally {
        setIsChatLoading(false);
    }
  };

  const handleSaveRecipe = (recipeToSave: Recipe) => {
    if (!savedRecipeIds.has(recipeToSave.id)) {
      setSavedRecipes(prev => [...prev, recipeToSave]);
    }
  };

  const handleDeleteRecipe = (recipeId: string) => {
    setSavedRecipes(prev => prev.filter(r => r.id !== recipeId));
  };

  const handleGenerateRecipe = useCallback(async (formData: RecipeFormData) => {
    if (!formData.ingredients.trim()) return;

    setIsLoading(true);
    setLoadingMessage('Generating a single recipe...');
    setError(null);
    setRecipe(null);
    setMealPlan(null);

    try {
      const recipeData = await generateRecipe(formData);
      
      const recipeWithId: Recipe = {
        ...recipeData,
        id: `recipe_${Date.now()}`
      };
      setRecipe(recipeWithId);
      
      const image = await generateRecipeImage(recipeWithId.recipeName);
      
      const recipeWithImage = { ...recipeWithId, imageUrl: image };
      setRecipe(recipeWithImage);
      
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

      for (const dayPlan of generatedPlan.plan) {
        setLoadingMessage(`Generating image for ${dayPlan.day}'s meal...`);
        try {
            const image = await generateRecipeImage(dayPlan.recipe.recipeName);
            dayPlan.recipe.imageUrl = image; 
            dayPlan.recipe.id = `recipe_${Date.now()}_${dayPlan.day}`;
            setImageUrls(prev => ({...prev, [dayPlan.recipe.recipeName]: image}));
        } catch (imgErr) {
            console.error(`Failed to generate image for ${dayPlan.recipe.recipeName}`, imgErr);
        }
      }
      setMealPlan({...generatedPlan});

    } catch (err) {
      console.error(err);
      setError('Failed to generate a meal plan. Please check your inputs and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderGeneratorForm = () => {
    if (generatorView === 'single') {
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

  const renderGeneratorContent = () => {
    if (isLoading) return <LoadingDisplay customMessage={loadingMessage} />;
    if (error) return <ErrorDisplay message={error} />;
    if (generatorView === 'planner' && mealPlan) {
      return <MealPlannerDisplay mealPlan={mealPlan} imageUrls={imageUrls} onSaveRecipe={handleSaveRecipe} savedRecipeIds={savedRecipeIds} />;
    }
    if (generatorView === 'single' && recipe) {
      return <RecipeDisplay recipe={recipe} onSave={handleSaveRecipe} isSaved={savedRecipeIds.has(recipe.id)} />;
    }
    return <InitialState view={generatorView}/>;
  };

  const renderGeneratorView = () => (
    <>
      <div className="p-4 sm:p-6">
        <ViewSwitcher currentView={generatorView} setView={setGeneratorView} />
        <div className="mt-6">
          {renderGeneratorForm()}
        </div>
      </div>
      <hr className="border-brand-border" />
      <div className="p-4 sm:p-6 min-h-[50vh] flex flex-col">
        {renderGeneratorContent()}
      </div>
    </>
  );

  return (
    <div className="min-h-screen font-sans text-brand-text-primary">
      <Header setAppView={setAppView} />
      <main className="container mx-auto p-2 sm:p-4 lg:p-8">
        <div className="max-w-5xl mx-auto bg-brand-surface rounded-2xl shadow-lg border border-brand-border overflow-hidden">
          {appView === 'generator' && renderGeneratorView()}
          {appView === 'cookbook' && <CookbookDisplay savedRecipes={savedRecipes} onDelete={handleDeleteRecipe} />}
        </div>
      </main>

      {/* Chat Feature */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-20">
        <button
          onClick={() => setIsChatOpen(true)}
          className="bg-brand-secondary text-white rounded-full p-4 shadow-lg hover:bg-amber-500 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all duration-200"
          aria-label="Open AI Chef Assistant"
        >
          <ChatIcon />
        </button>
      </div>

      <ChatAssistant
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendChatMessage}
        isLoading={isChatLoading}
      />
    </div>
  );
};

export default App;
