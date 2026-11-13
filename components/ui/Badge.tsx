import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'amber' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-primary/10 text-primary border-primary/25',
    success: 'bg-success/15 text-success border-success/30',
    amber: 'bg-amber-approval/15 text-amber-approval border-amber-approval/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    info: 'bg-surface text-ink-muted border-border',
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
