import React from 'react';

interface InitialStateProps {
    view: 'single' | 'planner';
}

const InitialState: React.FC<InitialStateProps> = ({ view }) => {
    const content = {
        single: {
            icon: '🍲',
            title: 'Ready to cook something amazing?',
            description: 'Use the form on the left to add ingredients, select your preferences, and let our AI chef create a custom recipe just for you.'
        },
        planner: {
            icon: '🗓️',
            title: 'Plan your week, reduce food waste!',
            description: 'Tell us what proteins and ingredients you need to use up, and our AI will craft a delicious weekly meal plan and a smart shopping list for you.'
        }
    }

    const currentContent = content[view];

    return (
        <div className="flex flex-col items-center justify-center text-center h-full p-8 animate-fade-in-down">
            <div className="text-6xl mb-4">{currentContent.icon}</div>
            <h3 className="text-2xl font-semibold font-serif text-brand-text-primary mb-2">{currentContent.title}</h3>
            <p className="text-brand-text-secondary max-w-md">
                {currentContent.description}
            </p>
        </div>
    );
};

export default InitialState;