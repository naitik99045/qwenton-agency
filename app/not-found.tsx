import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full clay-surface p-8 space-y-6 shadow-clay-card">
        <div className="w-16 h-16 rounded-[22px] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-clay-button-subtle">
          <span className="text-2xl font-extrabold text-primary">404</span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-ink tracking-tight">Page Not Found</h1>
          <p className="text-xs text-ink-muted leading-relaxed">
            The page you are looking for does not exist, has been removed, or is not accessible on this domain.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full gap-2 shadow-clay-button">
              <Home className="w-4 h-4" />
              <span>Back to Dashboard</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
