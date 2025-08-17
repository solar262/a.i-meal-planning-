import React from 'react';
import { CookbookIcon } from './Icons';

const ChefHatIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.95.91 3.69 2.31 4.79C6.48 13.97 5 16.3 5 19v1h14v-1c0-2.7-1.48-5.03-3.31-6.21C17.09 11.69 18 10.04 18 8.1C18 4.74 15.31 2 12 2zm0 2c1.47 0 2.75.81 3.45 2H8.55C9.25 4.81 10.53 4 12 4z"/>
  </svg>
);

interface HeaderProps {
  setAppView: (view: 'generator' | 'cookbook') => void;
}

const Header: React.FC<HeaderProps> = ({ setAppView }) => {
  return (
    <header className="bg-brand-surface/80 backdrop-blur-sm py-3 border-b border-brand-border sticky top-0 z-10">
      <div className="container mx-auto px-2 sm:px-4 lg:px-8 flex items-center justify-between gap-4">
        <button className="flex items-center gap-3" onClick={() => setAppView('generator')}>
          <ChefHatIcon />
          <h1 className="text-xl sm:text-2xl font-bold font-serif text-brand-text-primary">
            AI<span className="hidden sm:inline"> Meal</span> Planner
          </h1>
        </button>
        <button 
          onClick={() => setAppView('cookbook')}
          className="flex items-center gap-2 text-sm font-semibold text-brand-text-primary bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-2 sm:px-4 rounded-lg transition-colors"
        >
          <CookbookIcon />
          <span className="hidden sm:inline">My </span>Cookbook
        </button>
      </div>
    </header>
  );
};

export default Header;