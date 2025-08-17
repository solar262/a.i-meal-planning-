import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';
import { CloseIcon, SendIcon, SurpriseIcon } from './Icons';

interface ChatAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const SimpleMarkdown: React.FC<{ text: string }> = ({ text }) => {
  const processLine = (line: string) => {
    // Bold: **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
    return line;
  };

  const createMarkup = () => {
    const html = text
      .split('\n')
      .map(line => {
        if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
          return `<li>${processLine(line.substring(2))}</li>`;
        }
        return `<p>${processLine(line)}</p>`;
      })
      .join('')
      // Basic grouping of lists
      .replace(/<\/p>(\s*?)<li>/g, '</li><li>')
      .replace(/<\/li>(\s*?)<p>/g, '</li><p>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');

    return { __html: html };
  };

  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={createMarkup()} />;
};


const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onClose, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = [
    'Quick dinner for two',
    'What can I make with chicken and rice?',
    'Low-carb breakfast ideas'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);
  
  useEffect(() => {
    if (isOpen) {
        setTimeout(() => inputRef.current?.focus(), 300); // Allow for transition
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };
  
  const handleSuggestionClick = (suggestion: string) => {
    onSendMessage(suggestion);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-end justify-center sm:items-end sm:justify-end" role="dialog" aria-modal="true" aria-labelledby="chat-assistant-title">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" aria-hidden="true" onClick={onClose}></div>

      <div className="relative bg-white w-full h-full sm:h-[90vh] sm:max-h-[700px] sm:w-[440px] sm:m-6 rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col transform transition-transform sm:translate-y-0 animate-fade-in-down">
        {/* Header */}
        <header className="flex-shrink-0 flex items-center justify-between p-4 border-b border-brand-border">
          <div className="flex items-center gap-2">
            <SurpriseIcon />
            <h2 id="chat-assistant-title" className="text-lg font-bold font-serif text-brand-text-primary">AI Chef Assistant</h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-brand-text-secondary hover:bg-brand-bg-dark" aria-label="Close chat">
            <CloseIcon />
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-sm rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-brand-primary text-white rounded-br-lg' 
                    : 'bg-brand-bg-dark text-brand-text-primary rounded-bl-lg'
                }`}
              >
                <SimpleMarkdown text={msg.text} />
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-xs md:max-w-sm rounded-2xl px-4 py-3 bg-brand-bg-dark text-brand-text-primary rounded-bl-lg flex items-center gap-2">
                <span className="h-2 w-2 bg-brand-primary rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-brand-primary rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-brand-primary rounded-full animate-pulse"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <footer className="flex-shrink-0 p-4 border-t border-brand-border bg-white sm:rounded-b-2xl">
           {messages.length <= 1 && (
                <div className="flex gap-2 mb-3 text-xs">
                    {suggestions.map(s => (
                        <button key={s} onClick={() => handleSuggestionClick(s)} className="bg-brand-bg-dark px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors">{s}</button>
                    ))}
                </div>
            )}
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a recipe..."
              className="w-full p-3 border border-brand-border rounded-lg shadow-sm focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition duration-150"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="p-3 bg-brand-primary text-white rounded-lg shadow-md hover:bg-brand-primary-dark disabled:bg-gray-400"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              <SendIcon />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatAssistant;
