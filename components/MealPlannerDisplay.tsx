import React, { useState } from 'react';
import type { MealPlan, Recipe } from '../types';
import RecipeDisplay from './RecipeDisplay';
import { PlannerIcon, ShoppingListIcon, ExternalLinkIcon, TargetIcon, ProteinIcon, CarbsIcon, FatIcon } from './Icons';

interface MealPlannerDisplayProps {
  mealPlan: MealPlan;
  imageUrls: Record<string, string>;
  onSaveRecipe: (recipe: Recipe) => void;
  savedRecipeIds: Set<string>;
}

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex flex-col items-center justify-center bg-brand-bg-dark text-brand-text-primary p-3 rounded-lg text-center h-full border border-brand-border">
        <div className="text-brand-primary">{icon}</div>
        <span className="text-xs font-semibold uppercase mt-1 text-brand-text-secondary">{label}</span>
        <span className="text-sm font-bold">{value}</span>
    </div>
);

const NutritionSummary: React.FC<{ summary: MealPlan['nutritionSummary'] }> = ({ summary }) => {
    if (!summary || !summary.targetCalories) return null;

    return (
        <div className="p-4 sm:p-6 mb-6 bg-emerald-50 border border-emerald-200 rounded-2xl animate-fade-in-down">
            <h3 className="text-xl font-bold font-serif text-brand-text-primary mb-4">Your Daily Nutrition Targets</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <InfoPill icon={<TargetIcon />} label="Calories" value={summary.targetCalories} />
                <InfoPill icon={<ProteinIcon />} label="Protein" value={summary.targetProtein} />
                <InfoPill icon={<CarbsIcon />} label="Carbs" value={summary.targetCarbs} />
                <InfoPill icon={<FatIcon />} label="Fat" value={summary.targetFat} />
            </div>
            <p className="text-sm text-brand-text-secondary text-center md:text-left">{summary.explanation}</p>
        </div>
    );
};

const MealPlannerDisplay: React.FC<MealPlannerDisplayProps> = ({ mealPlan, imageUrls, onSaveRecipe, savedRecipeIds }) => {
  const [activeTab, setActiveTab] = useState<'plan' | 'shopping'>('plan');
  const [expandedDay, setExpandedDay] = useState<string | null>(mealPlan.plan.length > 0 ? mealPlan.plan[0].day : null);

  const handleShopOnline = () => {
    const cleanIngredients = mealPlan.shoppingList.map(item => {
      return item
        .replace(/^[0-9/.\s-]+(\s*\w+\(s\))?/, '')
        .replace(/\(.*\)/, '')
        .split(',')[0]
        .trim();
    });

    const uniqueIngredients = [...new Set(cleanIngredients.filter(Boolean))];
    const searchKeywords = uniqueIngredients.join(', ');
    const url = `https://www.amazon.com/alm/search?keywords=${encodeURIComponent(searchKeywords)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const TabButton: React.FC<{ tabName: 'plan' | 'shopping'; label: string; icon: React.ReactNode }> = ({ tabName, label, icon }) => {
    const isActive = activeTab === tabName;
    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`flex-1 flex items-center justify-center p-3 font-semibold border-b-2 transition-colors ${
          isActive
            ? 'border-brand-primary text-brand-primary'
            : 'border-transparent text-brand-text-secondary hover:text-brand-text-primary'
        }`}
        role="tab"
        aria-selected={isActive}
      >
        {icon} {label}
      </button>
    );
  };
  
  const DayAccordion: React.FC<{ dayPlan: MealPlan['plan'][0] }> = ({ dayPlan }) => {
    const { day, recipe } = dayPlan;
    const isExpanded = expandedDay === day;
    const imageUrl = imageUrls[recipe.recipeName];
    const panelId = `panel-${day.replace(/\s+/g, '-')}`;

    return (
      <div className={`border rounded-lg overflow-hidden transition-all duration-300 ${isExpanded ? 'bg-emerald-50 border-emerald-200' : 'bg-transparent border-brand-border'}`}>
        <button
          className="w-full text-left p-4 flex items-center justify-between hover:bg-brand-bg-dark transition-colors"
          onClick={() => setExpandedDay(isExpanded ? null : day)}
          aria-expanded={isExpanded}
          aria-controls={panelId}
        >
          <div className="flex items-center">
            {imageUrl ? (
                <img src={imageUrl} alt={recipe.recipeName} className="w-12 h-12 rounded-md object-cover mr-4"/>
            ) : (
                <div className="w-12 h-12 rounded-md bg-brand-bg-dark animate-pulse mr-4"></div>
            )}
            <div>
                <p className="font-semibold text-brand-text-secondary text-sm">{day}</p>
                <p className="font-bold font-serif text-brand-text-primary text-lg">{recipe.recipeName}</p>
            </div>
          </div>
          <svg className={`w-6 h-6 transform transition-transform text-brand-text-secondary ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {isExpanded && (
          <div id={panelId} role="region" className="p-4 sm:p-6 border-t border-brand-border bg-white">
            <RecipeDisplay recipe={recipe} onSave={onSaveRecipe} isSaved={savedRecipeIds.has(recipe.id)} />
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="animate-fade-in-down w-full">
      <NutritionSummary summary={mealPlan.nutritionSummary} />

      <div className="border-b border-brand-border flex mb-6">
        <TabButton tabName="plan" label="Meal Plan" icon={<PlannerIcon />} />
        <TabButton tabName="shopping" label="Shopping List" icon={<ShoppingListIcon />} />
      </div>

      {activeTab === 'plan' && (
        <div className="space-y-4">
           {mealPlan.plan.map(dayPlan => (
            <DayAccordion key={dayPlan.day} dayPlan={dayPlan} />
          ))}
        </div>
      )}

      {activeTab === 'shopping' && (
        <div>
          {mealPlan.shoppingList.length > 0 ? (
            <>
              <button 
                onClick={handleShopOnline}
                className="w-full mb-4 flex justify-center items-center gap-2 bg-amber-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-amber-600 focus:outline-none focus:ring-4 focus:ring-amber-300 transition-all transform hover:scale-105 duration-200"
              >
                Shop Ingredients with Amazon Fresh
                <ExternalLinkIcon />
              </button>
              <ul className="space-y-3">
                {mealPlan.shoppingList.map((item, index) => (
                  <li key={index} className="flex items-center p-3 bg-brand-bg-light rounded-md border border-brand-border">
                    <input id={`item-${index}`} type="checkbox" className="h-5 w-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                    <label htmlFor={`item-${index}`} className="ml-3 text-brand-text-primary">{item}</label>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="text-center p-8 bg-brand-bg-light rounded-lg">
                <p className="text-2xl mb-2">🎉</p>
                <p className="font-semibold text-brand-text-primary">Your shopping list is empty!</p>
                <p className="text-brand-text-secondary">Looks like you have everything you need for this meal plan.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealPlannerDisplay;
