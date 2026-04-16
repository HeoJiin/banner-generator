'use client';

import React from 'react';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: 'sm' | 'md';
}

const SIZES = {
  sm: { track: 'h-4 w-7', thumb: 'h-2.5 w-2.5', on: 'translate-x-[15px]', off: 'translate-x-[3px]' },
  md: { track: 'h-5 w-9', thumb: 'h-3.5 w-3.5', on: 'translate-x-[19px]', off: 'translate-x-[3px]' },
};

export default function Toggle({ checked, onChange, size = 'md' }: ToggleProps) {
  const s = SIZES[size];
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex ${s.track} items-center rounded-full transition-colors duration-200 flex-shrink-0 hover:opacity-80 active:scale-95 ${
        checked ? 'bg-accent' : 'bg-border'
      }`}
    >
      <span className={`inline-block ${s.thumb} transform rounded-full bg-white shadow-sm transition-transform duration-200 ease-out ${
        checked ? s.on : s.off
      }`} />
    </button>
  );
}
