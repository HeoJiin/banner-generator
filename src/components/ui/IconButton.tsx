'use client';

import React from 'react';

interface IconButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'destructive' | 'active';
  disabled?: boolean;
  'aria-label'?: string;
  title?: string;
  className?: string;
}

const VARIANTS = {
  default: 'text-content-tertiary hover:text-accent-content hover:bg-accent-bg',
  destructive: 'text-content-tertiary hover:text-negative hover:bg-negative/10',
  active: 'bg-accent-bg text-accent-content',
};

export default function IconButton({ children, onClick, variant = 'default', disabled, className = '', ...rest }: IconButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-md transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-content-tertiary active:scale-90 ${VARIANTS[variant]} ${className}`}
      aria-label={rest['aria-label']}
      title={rest.title}
    >
      {children}
    </button>
  );
}
