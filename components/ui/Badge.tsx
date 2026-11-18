import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'amber' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  // Blueprint Section 02 3-Colour Palette
  const variantStyles = {
    default: 'bg-primary/10 text-primary border-primary/25',
    success: 'bg-sage-light text-sage-dark border-sage-border',
    amber: 'bg-sage-light text-sage-deep border-sage-border',
    danger: 'bg-plum-light text-plum-deep border-plum-border',
    info: 'bg-surface-panel text-ink-muted border-border',
    outline: 'bg-surface text-ink border-border',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border shadow-xs select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
