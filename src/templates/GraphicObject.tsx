'use client';

import React from 'react';

interface GraphicObjectProps {
  assetId: string;
  size: number;
  variant?: 'default' | 'alt';
  mainGraphicUrl?: string | null;
}

export function GraphicObject({ assetId, size, variant = 'default', mainGraphicUrl }: GraphicObjectProps) {
  // 3D 이미지가 있으면 실제 이미지 렌더링 (store에서 프리로드 완료 후 URL 세팅됨)
  if (mainGraphicUrl) {
    return (
      <img
        src={mainGraphicUrl}
        alt=""
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
          pointerEvents: 'none',
          transform: variant === 'alt' ? 'scaleX(-1)' : 'none',
        }}
      />
    );
  }

  // Legacy placeholder shapes
  const half = size / 2;
  const rotate = variant === 'alt' ? 'rotate(45deg)' : 'none';

  switch (assetId) {
    case 'circle':
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), rgba(255,255,255,0.05))',
            transform: rotate,
          }}
        />
      );

    case 'square':
      return (
        <div
          style={{
            width: size * 0.85,
            height: size * 0.85,
            borderRadius: size * 0.1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.35), rgba(255,255,255,0.08))',
            transform: rotate,
          }}
        />
      );

    case 'triangle':
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${half}px solid transparent`,
            borderRight: `${half}px solid transparent`,
            borderBottom: `${size}px solid rgba(255,255,255,0.25)`,
            transform: rotate,
          }}
        />
      );

    case 'star':
      return (
        <div
          style={{
            width: size,
            height: size,
            background: 'rgba(255,255,255,0.2)',
            clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
            transform: rotate,
          }}
        />
      );

    case 'tree':
      return (
        <div style={{ width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ width: 0, height: 0, borderLeft: `${size * 0.35}px solid transparent`, borderRight: `${size * 0.35}px solid transparent`, borderBottom: `${size * 0.6}px solid rgba(255,255,255,0.25)` }} />
          <div style={{ width: size * 0.12, height: size * 0.2, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 2 }} />
        </div>
      );

    case 'snowman':
      return (
        <div style={{ width: size, height: size, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end' }}>
          <div style={{ width: size * 0.3, height: size * 0.3, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.3)' }} />
          <div style={{ width: size * 0.4, height: size * 0.4, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.25)', marginTop: -size * 0.06 }} />
        </div>
      );

    case 'gift':
      return (
        <div style={{ width: size * 0.7, height: size * 0.7, position: 'relative', transform: rotate }}>
          <div style={{ width: '100%', height: '75%', backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: size * 0.05, position: 'absolute', bottom: 0 }} />
          <div style={{ width: '100%', height: '25%', backgroundColor: 'rgba(255,255,255,0.28)', borderRadius: size * 0.05, position: 'absolute', top: 0 }} />
          <div style={{ width: '12%', height: '100%', backgroundColor: 'rgba(255,255,255,0.15)', position: 'absolute', left: '44%', top: 0 }} />
        </div>
      );

    case 'leaf':
      return (
        <div
          style={{
            width: size * 0.7,
            height: size * 0.9,
            borderRadius: `${size * 0.1}px ${size * 0.45}px`,
            backgroundColor: 'rgba(255,255,255,0.2)',
            transform: variant === 'alt' ? 'rotate(-30deg)' : 'rotate(15deg)',
          }}
        />
      );

    default:
      return (
        <div
          style={{
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0.05))',
          }}
        />
      );
  }
}
