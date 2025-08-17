import React from 'react';

interface ViewSwitcherProps {
  currentView: 'single' | 'planner';
  setView: (view: 'single' | 'planner') => void;
}

const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ currentView, setView }) => {
  const baseClasses = "px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary";
  const activeClasses = "bg-brand-primary text-white shadow";
  const inactiveClasses = "text-brand-text-secondary hover:bg-brand-bg-dark";

  return (
    <div role="tablist" aria-label="Generator View" className="flex items-center bg-brand-bg-dark p-1 rounded-xl max-w-sm mx-auto">
      <button
        role="tab"
        aria-selected={currentView === 'single'}
        onClick={() => setView('single')}
        className={`w-1/2 ${baseClasses} ${currentView === 'single' ? activeClasses : inactiveClasses}`}
      >
        Single Recipe
      </button>
      <button
        role="tab"
        aria-selected={currentView === 'planner'}
        onClick={() => setView('planner')}
        className={`w-1/2 ${baseClasses} ${currentView === 'planner' ? activeClasses : inactiveClasses}`}
      >
        Meal Planner
      </button>
    </div>
  );
};

export default ViewSwitcher;