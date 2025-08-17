import React, { useState, useEffect } from 'react';
import type { RecipeFormData } from '../types';
import { SurpriseIcon, GenerateIcon } from './Icons';

interface RecipeFormProps {
  onSubmit: (formData: RecipeFormData) => void;
  isLoading: boolean;
}

const popularIngredients = [
  "chicken breast", "rice", "broccoli", "salmon", "potatoes", "spinach", "tomatoes", "ground beef", "onions", "garlic", "pasta", "eggs", "avocado", "bell peppers"
];

const RecipeForm: React.FC<RecipeFormProps> = ({ onSubmit, isLoading }) => {
  const [tags, setTags] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [otherData, setOtherData] = useState({ diet: '', cuisine: '', time: '' });

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
  
  const handleSurpriseMe = () => {
    const shuffled = [...popularIngredients].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 3); // Get 3-5 ingredients
    setTags(selected);
  };

  const handleOtherDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setOtherData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tags.length > 0) {
      const formData: RecipeFormData = {
        ingredients: tags.join(', '),
        ...otherData
      };
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in-down">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold font-serif text-brand-text-primary">Single Recipe</h2>
        <button
          type="button"
          onClick={handleSurpriseMe}
          className="flex items-center gap-2 text-sm font-medium text-brand-primary hover:text-brand-primary-dark transition-colors"
        >
          <SurpriseIcon />
          Surprise Me!
        </button>
      </div>

      <div>
        <label htmlFor="ingredients" className="block text-base font-medium text-brand-text-secondary mb-2">
          Available Ingredients
        </label>
        <div className="w-full p-2 border border-brand-border rounded-lg shadow-sm flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-brand-primary focus-within:border-brand-primary">
          {tags.map(tag => (
            <span key={tag} className="flex items-center bg-emerald-100 text-emerald-800 text-sm font-medium px-2.5 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="ml-2 text-emerald-600 hover:text-emerald-800" aria-label={`Remove ${tag}`}>&times;</button>
            </span>
          ))}
          <input
            id="ingredients" type="text"
            className="flex-grow p-1 outline-none bg-transparent text-sm"
            placeholder={tags.length === 0 ? "Add ingredients (e.g., chicken)" : ""}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="diet" className="block text-base font-medium text-brand-text-secondary mb-1">Dietary Needs <span className="text-gray-400">(optional)</span></label>
          <input type="text" id="diet" name="diet" className="w-full p-3 border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150" placeholder="e.g., vegetarian, gluten-free" value={otherData.diet} onChange={handleOtherDataChange} />
        </div>
        <div>
          <label htmlFor="cuisine" className="block text-base font-medium text-brand-text-secondary mb-1">Cuisine Type <span className="text-gray-400">(optional)</span></label>
          <input type="text" id="cuisine" name="cuisine" className="w-full p-3 border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150" placeholder="e.g., Italian, Mexican" value={otherData.cuisine} onChange={handleOtherDataChange} />
        </div>
        <div>
          <label htmlFor="time" className="block text-base font-medium text-brand-text-secondary mb-1">Max Time <span className="text-gray-400">(optional)</span></label>
          <input type="text" id="time" name="time" className="w-full p-3 border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150" placeholder="e.g., under 30 minutes" value={otherData.time} onChange={handleOtherDataChange} />
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isLoading || tags.length === 0}
        className="w-full flex justify-center items-center gap-3 bg-brand-primary text-white font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-brand-primary-dark focus:outline-none focus:ring-4 focus:ring-green-300 transition-all transform hover:scale-105 duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>
            <GenerateIcon />
            Generate Recipe
          </>
        )}
      </button>
    </form>
  );
};

export default RecipeForm;