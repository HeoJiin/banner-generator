'use client';

import React from 'react';

interface ChipGroupProps {
  children: React.ReactNode;
  size?: 'sm' | 'md';
}

const GAPS = {
  sm: 'flex flex-wrap gap-x-1 gap-y-2.5',
  md: 'flex flex-wrap gap-x-1.5 gap-y-2.5',
};

export default function ChipGroup({ children, size = 'md' }: ChipGroupProps) {
  return <div className={`${GAPS[size]} pb-2`}>{children}</div>;
}
