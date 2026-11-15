'use client';

import React from 'react';

interface HeroWorkflowStepperProps {
  activeStage: number;
  setActiveStage: (stage: number) => void;
  className?: string;
}

export function HeroWorkflowStepper({
  activeStage,
  setActiveStage,
  className = '',
}: HeroWorkflowStepperProps) {
  const steps = [
    { id: 0, num: '1', title: 'Comment received', desc: 'New lead from Instagram' },
    { id: 1, num: '2', title: 'Understand', desc: 'AI analyzes intent' },
    { id: 2, num: '3', title: 'Human approval', desc: 'You review & approve' },
    { id: 3, num: '4', title: 'DM delivered', desc: 'Lead in your inbox' },
  ];

  return (
    <div
      className={`w-full max-w-6xl mx-auto px-4 sm:px-6 py-3 rounded-full bg-white/90 dark:bg-pine/90 backdrop-blur-md border border-border shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 select-none ${className}`}
    >
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 sm:gap-6 lg:gap-8 w-full md:w-auto">
        {steps.map((step, idx) => {
          const isActive = activeStage === step.id;
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setActiveStage(step.id)}
              className="flex items-center gap-2.5 text-left group transition-all"
            >
              {/* Step Number Circle */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isActive
                    ? 'bg-primary text-pine shadow-md scale-105'
                    : 'bg-surface-inset text-ink-muted group-hover:bg-border/60'
                }`}
              >
                {step.num}
              </div>

              {/* Step Text */}
              <div className="text-xs">
                <div
                  className={`font-bold transition-colors ${
                    isActive ? 'text-ink' : 'text-ink-muted group-hover:text-ink'
                  }`}
                >
                  {step.title}
                </div>
                <div className="text-[11px] text-ink-muted hidden sm:block">
                  {step.desc}
                </div>
              </div>

              {/* Connecting Divider line between steps */}
              {idx < steps.length - 1 && (
                <div className="hidden lg:block w-6 h-px bg-border/60 ml-2" />
              )}
            </button>
          );
        })}
      </div>

      {/* Brand Signoff Right Pill */}
      <div className="hidden xl:flex items-center gap-2 text-[10px] font-mono font-bold text-ink-muted uppercase tracking-wider pr-2">
        <span>BUILT FOR WHAT&apos;S NEXT</span>
        <span className="w-3 h-px bg-border" />
      </div>
    </div>
  );
}
