'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const hasDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(hasDarkClass);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      try {
        localStorage.setItem('theme', 'dark');
      } catch (e) {}
    } else {
      document.documentElement.classList.remove('dark');
      try {
        localStorage.setItem('theme', 'light');
      } catch (e) {}
    }
  };

  // Avoid layout shift before mount
  if (!mounted) {
    return (
      <div
        className={`w-9 h-9 rounded-control border border-border bg-surface text-ink flex items-center justify-center opacity-70 ${className}`}
        aria-hidden="true"
      >
        <span className="w-4 h-4" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative w-9 h-9 rounded-control border border-border bg-surface text-ink hover:text-primary transition-all duration-200 flex items-center justify-center shadow-clay-button-subtle active:scale-95 group ${className}`}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-primary transition-transform duration-200 group-hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-ink transition-transform duration-200 group-hover:-rotate-12" />
      )}
    </button>
  );
}
