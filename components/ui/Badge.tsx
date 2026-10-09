import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'amber' | 'danger' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variantStyles = {
    default: 'bg-cloud-blue text-primary-deep border-[#D0DFEF]',
    success: 'bg-[#E5F4EC] text-[#2D6A53] border-[#C8E8D7]',
    amber: 'bg-[#FDF4E7] text-[#8C5D1E] border-[#F5E2C4]',
    danger: 'bg-[#FDECEC] text-[#9E3636] border-[#F8D2D2]',
    info: 'bg-soft-lavender text-[#584B87] border-[#D9D3EE]',
    outline: 'bg-white text-ink-muted border-border',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border shadow-xs select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
