import React, { useState, useEffect } from 'react';

const loadingMessages = [
  "Preheating the AI ovens...",
  "Sourcing the freshest ideas...",
  "Consulting with digital chefs...",
  "Simmering creative juices...",
  "Plating your perfect plan...",
  "Organizing your shopping list...",
  "Finalizing the delicious details...",
];

interface LoadingDisplayProps {
  customMessage?: string;
}

const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ customMessage }) => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-8 animate-fade-in-down">
      <div className="w-16 h-16 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-6"></div>
      <h3 className="text-2xl font-semibold font-serif text-brand-text-primary mb-2">
        {customMessage || "Crafting your recipes..."}
      </h3>
      <p className="text-brand-text-secondary transition-opacity duration-500 ease-in-out">
        {loadingMessages[messageIndex]}
      </p>
    </div>
  );
};

export default LoadingDisplay;