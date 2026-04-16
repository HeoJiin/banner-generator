'use client';

import React from 'react';
import { BadgeSettings } from '@/types/banner';

interface BadgeBannerProps {
  badge: BadgeSettings;
}

export function BadgeBanner({ badge }: BadgeBannerProps) {
  if (!badge.enabled || !badge.text) return null;

  const isLeft = badge.position === 'top-left';

  return (
    <div
      style={{
        position: 'absolute',
        top: 12,
        [isLeft ? 'left' : 'right']: 12,
        zIndex: 10,
        backgroundColor: '#FF3333',
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 700,
        fontFamily: 'Pretendard, sans-serif',
        padding: '4px 10px',
        borderRadius: 4,
        lineHeight: 1.3,
        letterSpacing: -0.2,
      }}
    >
      {badge.text}
    </div>
  );
}
