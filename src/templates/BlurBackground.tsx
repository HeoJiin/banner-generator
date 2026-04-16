'use client';

import React from 'react';

interface BlurBackgroundProps {
  imageUrl: string;
  blur?: number;
  opacity?: number;
  scale?: number;
  /** How far outside the frame to push images. Higher = more outside */
  pushOut?: 'far' | 'medium' | 'close';
}

const PUSH_CONFIG = {
  far:    { top: '-55%', right: '-50%', bottom: '-50%', left: '-45%' },
  medium: { top: '-45%', right: '-40%', bottom: '-40%', left: '-35%' },
  close:  { top: '-25%', right: '-30%', bottom: '-20%', left: '-20%' },
};

export function BlurBackground({ imageUrl, blur = 30, opacity = 0.5, scale = 1.4, pushOut = 'medium' }: BlurBackgroundProps) {
  const pos = PUSH_CONFIG[pushOut];

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
      <img
        src={imageUrl}
        alt=""
        style={{
          position: 'absolute',
          top: pos.top,
          right: pos.right,
          width: `${65 * scale}%`,
          height: 'auto',
          filter: `blur(${blur}px)`,
          opacity,
          transform: 'rotate(-15deg)',
          pointerEvents: 'none',
        }}
      />
      <img
        src={imageUrl}
        alt=""
        style={{
          position: 'absolute',
          bottom: pos.bottom,
          left: pos.left,
          width: `${55 * scale}%`,
          height: 'auto',
          filter: `blur(${blur}px)`,
          opacity,
          transform: 'rotate(20deg) scaleX(-1)',
          pointerEvents: 'none',
        }}
      />
    </div>
  );
}
