'use client';

import React from 'react';

interface ChipProps {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  /** 좁은 패널용 작은 사이즈 */
  size?: 'sm' | 'md';
  'aria-pressed'?: boolean;
}

const SIZES = {
  sm: 'px-2.5 py-1',
  md: 'px-3 py-1.5',
};

export default function Chip({ children, selected, onClick, size = 'md', ...rest }: ChipProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={rest['aria-pressed'] ?? selected}
      className={`${SIZES[size]} rounded-full text-caption font-medium border transition-all duration-150 active:scale-95 ${
        selected
          ? 'bg-accent text-content-inverse border-accent shadow-sm'
          : 'bg-layer-surface text-content-secondary border-border hover:border-accent-border hover:text-accent-content hover:shadow-sm'
      }`}
    >
      {children}
    </button>
  );
}
