import React from 'react';
import ViewSwitcher from './ViewSwitcher';

const ChefHatIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-primary" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.69 2 6 4.69 6 8c0 1.95.91 3.69 2.31 4.79C6.48 13.97 5 16.3 5 19v1h14v-1c0-2.7-1.48-5.03-3.31-6.21C17.09 11.69 18 10.04 18 8.1C18 4.74 15.31 2 12 2zm0 2c1.47 0 2.75.81 3.45 2H8.55C9.25 4.81 10.53 4 12 4z"/>
  </svg>
);

interface HeaderProps {
  currentView: 'single' | 'planner';
  setView: (view: 'single' | 'planner') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-brand-surface py-4 border-b border-brand-border sticky top-0 z-10">
      <div className="container mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <ChefHatIcon />
          <h1 className="text-2xl font-bold font-serif text-brand-text-primary">
            AI Meal Planner
          </h1>
        </div>
        <ViewSwitcher currentView={currentView} setView={setView} />
      </div>
    </header>
  );
};

export default Header;