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
      sm: 'text-xs px-3 py-1.5 rounded-[12px] gap-1.5',
      md: 'text-sm px-4 py-2 rounded-[16px] gap-2',
      lg: 'text-base px-6 py-3 rounded-[18px] gap-2.5',
    };

    const variantStyles = {
      primary: 'bg-gradient-to-b from-[#4667B1] to-[#34518F] text-white shadow-clay-button hover:brightness-105',
      secondary: 'bg-[#E6EEF8] text-[#34518F] hover:bg-[#D6E4F5] shadow-clay-button-subtle border border-[#D0DFEF]',
      outline: 'bg-white text-ink border border-border shadow-clay-button-subtle hover:bg-[#F8F6F1]',
      danger: 'bg-gradient-to-b from-[#D9534F] to-[#B95151] text-white shadow-clay-button hover:brightness-105',
      amber: 'bg-gradient-to-b from-[#C9913E] to-[#B98232] text-white shadow-clay-button hover:brightness-105',
      ghost: 'bg-transparent text-ink-muted hover:text-ink hover:bg-black/5',
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
