'use client';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  type?: 'button' | 'submit';
}

const VARIANTS = {
  primary: 'bg-accent hover:bg-accent-hover active:scale-[0.97] disabled:bg-accent-disabled text-content-inverse font-semibold shadow-sm hover:shadow',
  secondary: 'border border-border hover:border-border-strong hover:bg-fill-secondary active:scale-[0.97] text-content-secondary font-semibold',
  ghost: 'text-content-tertiary hover:text-content-primary hover:bg-fill-secondary active:scale-[0.97] font-medium',
  accent: 'bg-accent-bg text-accent-content hover:bg-accent-bg active:scale-95 font-medium',
};

const SIZES = {
  sm: 'px-2 py-1 text-caption',
  md: 'px-3 py-2 text-body',
  lg: 'px-4 py-2.5 text-body-lg',
};

export default function Button({ children, onClick, variant = 'primary', size = 'md', disabled, className = '', ...rest }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={rest.type ?? 'button'}
      aria-label={rest['aria-label']}
      aria-pressed={rest['aria-pressed']}
      className={`inline-flex items-center justify-center gap-2 rounded-md transition-all ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
    >
      {children}
    </button>
  );
}
