import * as React from 'react';
import { cn } from '@slipstream-ui/core';

export interface Suggestion {
  id: string;
  text: string;
  type?: 'action' | 'query' | 'follow-up';
}

export interface SuggestionsProps {
  suggestions: Suggestion[];
  onSelect?: (suggestion: Suggestion) => void;
  className?: string;
  maxDisplay?: number;
}

const Suggestions = React.forwardRef<HTMLDivElement, SuggestionsProps>(
  ({ suggestions, onSelect, className, maxDisplay = 4, ...props }, ref) => {
  const displaySuggestions = maxDisplay ? suggestions.slice(0, maxDisplay) : suggestions;

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className={cn('mt-4 space-y-2', className)} {...props}>
      {displaySuggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          className={cn(
            'w-full text-left h-auto py-2 px-3 text-sm rounded-md',
            'hover:bg-accent hover:text-accent-foreground',
            'transition-colors',
            'text-muted-foreground',
            'focus:outline-none focus:ring-2 focus:ring-ring'
          )}
          onClick={() => onSelect?.(suggestion)}
        >
          {suggestion.text}
        </button>
      ))}
    </div>
  );
});
Suggestions.displayName = 'Suggestions';

export { Suggestions };
