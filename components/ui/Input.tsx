import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', error, ...props }, ref) => {
    return (
      <div className="w-full">
        <input
          type={type}
          className={cn(
            'w-full px-3.5 py-2.5 bg-white border border-border text-ink placeholder:text-ink-light rounded-control text-sm transition-all shadow-clay-button-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-gray-50',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-xs text-danger mt-1.5 ml-1">{error}</p> : null}
      </div>
    );
  }
);
Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="w-full">
        <textarea
          className={cn(
            'w-full px-3.5 py-2.5 bg-white border border-border text-ink placeholder:text-ink-light rounded-control text-sm transition-all shadow-clay-button-subtle focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:bg-gray-50 resize-y',
            error && 'border-danger focus:border-danger focus:ring-danger/20',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? <p className="text-xs text-danger mt-1.5 ml-1">{error}</p> : null}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
