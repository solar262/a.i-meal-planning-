import React from 'react';

interface ViewSwitcherProps {
  currentView: 'single' | 'planner';
  setView: (view: 'single' | 'planner') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setView }) => {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
  const activeClasses = "bg-brand-primary text-white shadow";
  const inactiveClasses = "text-brand-text-secondary hover:bg-brand-bg-dark";

  return (
    <div className="flex items-center bg-brand-bg-dark p-1 rounded-lg">
      <button
        onClick={() => setView('single')}
        className={`${baseClasses} ${currentView === 'single' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'single'}
      >
        Single Recipe
      </button>
      <button
        onClick={() => setView('planner')}
        className={`${baseClasses} ${currentView === 'planner' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'planner'}
      >
        Meal Planner
      </button>
    </div>
  );
};

export default ViewSwitcher;
