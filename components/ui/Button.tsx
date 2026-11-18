import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'amber' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-all duration-clay disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98] select-none';

    // Blueprint Section 02: 8px controls, with mobile-friendly touch heights
    const sizeStyles = {
      sm: 'text-xs px-3 py-2 rounded-control gap-1.5 min-h-[38px]',
      md: 'text-sm px-4 py-2.5 rounded-control gap-2 min-h-[44px]',
      lg: 'text-base px-6 py-3.5 rounded-control gap-2.5 min-h-[48px]',
    };

    // Blueprint Section 02 3-Colour Palette: Warm Ivory, Muted Sage, Dusty Plum
    const variantStyles = {
      primary:
        'bg-primary text-white font-bold shadow-clay-button hover:bg-plum-hover active:bg-plum-active border border-plum-deep/20',
      secondary:
        'bg-sage-light text-sage-dark hover:bg-sage/20 border border-sage-border font-bold shadow-clay-button-subtle',
      outline:
        'bg-surface text-ink border border-border shadow-clay-button-subtle hover:bg-surface-panel hover:border-plum-border',
      danger:
        'bg-danger text-white font-bold shadow-clay-button hover:bg-plum-deep border border-plum-deep/30',
      amber:
        'bg-sage-deep text-white font-bold shadow-clay-button hover:bg-sage-dark border border-sage-deep/30',
      ghost:
        'bg-transparent text-ink-muted hover:text-ink hover:bg-sage-light/60 font-medium',
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
