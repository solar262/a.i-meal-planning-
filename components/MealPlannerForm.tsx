import React, { useState } from 'react';
import type { MealPlannerFormData } from '../types';
import { GenerateIcon } from './Icons';

// Helper component for tag input fields
const TagInput: React.FC<{
  label: string;
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  placeholder: string;
}> = ({ label, tags, setTags, placeholder }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
        setTags([...tags, trimmedTag]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
      setInputValue('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <label className="block text-base font-medium text-brand-text-secondary mb-2">{label}</label>
      <div className="w-full p-2 border border-brand-border rounded-lg shadow-sm flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary">
        {tags.map(tag => (
          <span key={tag} className="flex items-center bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-emerald-600 hover:text-emerald-800" aria-label={`Remove ${tag}`}>&times;</button>
          </span>
        ))}
        <input
          type="text"
          className="flex-grow p-1 outline-none bg-transparent text-sm"
          placeholder={tags.length === 0 ? placeholder : ""}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
};

interface MealPlannerFormProps {
    onSubmit: (formData: MealPlannerFormData) => void;
    isLoading: boolean;
}

const MealPlannerForm: React.FC<MealPlannerFormProps> = ({ onSubmit, isLoading }) => {
    const [proteins, setProteins] = useState<string[]>(['chicken breast', 'salmon']);
    const [useUpIngredients, setUseUpIngredients] = useState<string[]>(['broccoli', 'carrots', 'onions']);
    const [days, setDays] = useState<number>(5);
    const [diet, setDiet] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (proteins.length > 0 || useUpIngredients.length > 0) {
            onSubmit({
                proteins: proteins.join(', '),
                useUpIngredients: useUpIngredients.join(', '),
                days,
                diet
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-down">
            <h2 className="text-xl font-bold font-serif text-brand-text-primary">Weekly Meal Planner</h2>
            
            <TagInput label="Core Proteins" tags={proteins} setTags={setProteins} placeholder="e.g., beef, tofu" />
            <TagInput label="Ingredients to Use Up" tags={useUpIngredients} setTags={setUseUpIngredients} placeholder="e.g., spinach, bell peppers" />

            <div>
              <label htmlFor="days" className="block text-base font-medium text-brand-text-secondary mb-2">
                Number of Days ({days})
              </label>
              <input 
                id="days"
                type="range" 
                min="1" 
                max="7" 
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full h-2 bg-brand-bg-dark rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label htmlFor="diet-planner" className="block text-base font-medium text-brand-text-secondary mb-1">Dietary Needs <span className="text-gray-400">(optional)</span></label>
              <input type="text" id="diet-planner" name="diet" className="w-full p-3 border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150" placeholder="e.g., vegan, low-carb" value={diet} onChange={(e) => setDiet(e.target.value)} />
            </div>

            <button
                type="submit"
                disabled={isLoading || (proteins.length === 0 && useUpIngredients.length === 0)}
                className="w-full flex justify-center items-center gap-3 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-brand-primary-dark focus:outline-none focus:ring-4 focus:ring-green-300 transition-all transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Planning...
                    </>
                ) : (
                    <>
                        <GenerateIcon />
                        Generate Meal Plan
                    </>
                )}
            </button>
        </form>
    );
};

export default MealPlannerForm;
