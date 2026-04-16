'use client';

import React from 'react';
import { BgDecorationType } from '@/types/banner';
import { BlurBackground } from './BlurBackground';

interface BgDecorationProps {
  type: BgDecorationType;
  decorationUrl: string | null;
  decorationOpacity?: number;
  blurBgUrl: string | null;
  graphicImageUrl: string | null;
  blurPushOut?: 'far' | 'medium' | 'close';
  blurAmount?: number;
  blurOpacity?: number;
  blurScale?: number;
  bannerWidth: number;
  bannerHeight: number;
}

export function BgDecoration({
  type,
  decorationUrl,
  decorationOpacity = 80,
  blurBgUrl,
  graphicImageUrl,
  blurPushOut = 'medium',
  blurAmount = 30,
  blurOpacity = 0.5,
  blurScale = 1.4,
  bannerWidth,
  bannerHeight,
}: BgDecorationProps) {
  if (type === 'none') return null;

  const decoOpacity = decorationOpacity / 100;
  const isSquare = Math.abs(bannerWidth - bannerHeight) < 50; // 팝업
  const isBm = bannerWidth > 600 && bannerWidth < 700 && bannerHeight < 200; // BM 665x146
  const isWide = bannerWidth / bannerHeight > 3 && !isBm; // 롤링 1330x128
  const bannerKey = isSquare ? 'popup' : isBm ? 'bm' : isWide ? 'rolling' : 'content';

  // 블러
  if (type === 'blur') {
    const url = blurBgUrl || graphicImageUrl;
    if (!url) return null;
    return <BlurBackground imageUrl={url} blur={blurAmount} opacity={blurOpacity} scale={blurScale} pushOut={blurPushOut} />;
  }

  // 배너별 전용 PNG 사용
  const fullPngTypes: BgDecorationType[] = ['confetti', 'confetti2', 'confetti3', 'confetti4', 'winter', 'winter2', 'winter3', 'winter4', 'flower1', 'flower2', 'flower3', 'tree', 'sandcastle', 'tube', 'wave', 'leaves', 'maple', 'berries', 'arrows'];
  if (fullPngTypes.includes(type)) {
    const prefixMap: Record<string, string> = {
      confetti: 'confetti-01', confetti2: 'confetti-02', confetti3: 'confetti-03', confetti4: 'confetti-04',
      winter: 'winter-01', winter2: 'winter-02', winter3: 'winter-03', winter4: 'winter-04',
      flower1: 'flower-01', flower2: 'flower-02', flower3: 'flower-03',
      tree: 'tree-01', sandcastle: 'sandcastle', tube: 'tube', wave: 'wave',
      leaves: 'leaves-01', maple: 'maple', berries: 'berry', arrows: 'arrow',
    };
    const prefix = prefixMap[type] || type;
    const nameMap: Record<string, string> = {
      popup: `${prefix}-popup.webp`,
      content: `${prefix}-content.webp`,
      rolling: `${prefix}-rolling.webp`,
      bm: `${prefix}-bm.webp`,
    };
    const src = `/assets/backgrounds/${nameMap[bannerKey]}`;

    return (
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
        <img src={src} alt="" style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: decoOpacity, pointerEvents: 'none',
        }} />
      </div>
    );
  }


  return null;
}
