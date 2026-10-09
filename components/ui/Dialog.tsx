'use client';

import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}: DialogProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-2xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog Body */}
      <div
        className={cn(
          'relative w-full bg-white rounded-card shadow-clay-card border border-border p-6 z-10 animate-in zoom-in-95 duration-150',
          maxWidthStyles[maxWidth]
        )}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-ink-muted hover:text-ink rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {title ? (
          <div className="mb-4 pr-6">
            <h2 className="text-xl font-bold text-ink">{title}</h2>
            {description ? <p className="text-sm text-ink-muted mt-1">{description}</p> : null}
          </div>
        ) : null}

        <div>{children}</div>
      </div>
    </div>
  );
}
