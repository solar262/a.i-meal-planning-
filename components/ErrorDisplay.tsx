import React from 'react';

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center h-full p-8 bg-red-50 border-2 border-red-200 rounded-lg animate-fade-in-down">
        <div className="text-5xl mb-4">😟</div>
        <h3 className="text-2xl font-semibold font-serif text-red-800 mb-2">Oops! Something went wrong.</h3>
        <p className="text-red-600 max-w-md">{message}</p>
    </div>
  );
};

export default ErrorDisplay;