import React from 'react';
import { cn } from '@/lib/utils';
import { Bot, User as UserIcon, Sparkles } from 'lucide-react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  role?: string;
  variant?: 'agent' | 'user' | 'system';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Avatar({ name = '', role, variant = 'agent', size = 'md', className, ...props }: AvatarProps) {
  const sizeStyles = {
    sm: 'w-7 h-7 text-xs rounded-[10px]',
    md: 'w-10 h-10 text-sm rounded-[14px]',
    lg: 'w-14 h-14 text-base rounded-[18px]',
    xl: 'w-20 h-20 text-xl rounded-[24px]',
  };

  const variantStyles = {
    agent: 'bg-[#E6EEF8] text-primary-deep border border-[#C5D7EF] shadow-clay-button-subtle',
    user: 'bg-[#F5DED1] text-[#7A3F22] border border-[#DFC3B2] shadow-clay-button-subtle',
    system: 'bg-[#EAE7F5] text-[#523E8C] border border-[#CEC5EB] shadow-clay-button-subtle',
  };

  const getInitials = (str: string) => {
    if (!str) return '';
    return str
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center font-bold select-none shrink-0',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {name ? (
        getInitials(name)
      ) : variant === 'agent' ? (
        <Bot className="w-1/2 h-1/2" />
      ) : variant === 'user' ? (
        <UserIcon className="w-1/2 h-1/2" />
      ) : (
        <Sparkles className="w-1/2 h-1/2" />
      )}
    </div>
  );
}
