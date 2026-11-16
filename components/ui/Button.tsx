import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'amber' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';
    
    const sizeStyles = {
      sm: 'text-xs px-3 py-2 rounded-[12px] gap-1.5 min-h-[38px]',
      md: 'text-sm px-4 py-2.5 rounded-[16px] gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 rounded-[18px] gap-2.5 min-h-[48px]',
    };

    const variantStyles = {
      primary: 'bg-primary text-white font-bold shadow-clay-button hover:bg-brand-hover active:bg-brand-active border border-primary/40',
      secondary: 'bg-moss/10 text-moss hover:bg-moss/20 border border-moss/25 font-bold shadow-clay-button-subtle',
      outline: 'bg-surface text-ink border border-border shadow-clay-button-subtle hover:bg-surface-panel hover:border-primary/40',
      danger: 'bg-danger text-white shadow-clay-button hover:bg-danger/90 border border-danger/40',
      amber: 'bg-coral text-white font-black shadow-clay-button hover:bg-coral-hover border border-coral/40',
      ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-surface',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
