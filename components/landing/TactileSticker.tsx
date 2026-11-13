'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ShieldCheck, Cpu } from 'lucide-react';

interface TactileStickerProps {
  className?: string;
  variant?: 'seal' | 'badge' | 'hardware';
  rotation?: number;
}

export function TactileSticker({
  className = '',
  variant = 'badge',
  rotation = -2.5,
}: TactileStickerProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (variant === 'seal') {
    return (
      <div
        className={`relative inline-block cursor-pointer select-none group ${className}`}
        style={{
          transform: isHovered ? 'scale(1.05) rotate(0deg)' : `rotate(${rotation}deg)`,
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-surface border-2 border-dashed border-primary/50 shadow-clay-card flex items-center justify-center">
          <Image
            src="/stickers/autonomous-seal.svg"
            alt="Qwenton Autonomous Core Spec Sticker"
            width={128}
            height={128}
            className="w-full h-full drop-shadow-md select-none pointer-events-none"
            priority
          />
          {/* Holographic Sheen Pill */}
          <div className="absolute -bottom-2 px-2 py-0.5 rounded-full bg-primary text-white font-mono text-[9px] font-black uppercase tracking-wider shadow-xs border border-white/20">
            SPEC. 2026
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'hardware') {
    return (
      <div
        className={`relative inline-block cursor-pointer select-none ${className}`}
        style={{
          transform: isHovered ? 'scale(1.04) rotate(0deg)' : `rotate(${rotation}deg)`,
          transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="tactile-sticker rounded-xl px-3.5 py-2.5 font-mono text-xs flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-ink text-white flex items-center justify-center shrink-0">
            <Cpu className="w-4 h-4 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-ink tracking-tight uppercase text-[11px]">
                HW-CERTIFIED
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold border border-primary/20">
                100% DISPATCH
              </span>
            </div>
            <div className="text-[10px] text-ink-muted">META_V20_GRAPH // NO_SLOP</div>
          </div>
        </div>
      </div>
    );
  }

  // Default 'badge' sticker: Hardware QA / Serial inspection stamp
  return (
    <div
      className={`relative inline-block cursor-pointer select-none ${className}`}
      style={{
        transform: isHovered ? 'scale(1.04) rotate(0deg)' : `rotate(${rotation}deg)`,
        transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tactile-sticker rounded-2xl p-3 sm:px-4 sm:py-3 flex items-center gap-3 font-mono">
        <div className="w-8 h-8 rounded-full bg-primary/15 border border-primary/30 text-primary flex items-center justify-center shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-primary tracking-wider">
              FLEET CERTIFIED
            </span>
            <span className="text-[9px] text-ink-muted font-bold">#QW-8821</span>
          </div>
          <div className="text-[11px] font-bold text-ink">
            HUMAN FIREWALL ACTIVE
          </div>
          <div className="text-[9px] text-ink-muted flex items-center gap-1.5 pt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success inline-block" />
            <span>0% UNAPPROVED MUTATIONS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
