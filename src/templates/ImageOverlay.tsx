'use client';

import React from 'react';
import { ImageModeSettings, ImageOverride, DEFAULT_IMAGE_OVERRIDE } from '@/types/banner';

export type ImageOverlayVariant = 'rolling' | 'bm' | 'popup' | 'content';

interface ImageOverlayProps {
  imageUrl: string;
  settings: ImageModeSettings;
  variant?: ImageOverlayVariant;
  override?: ImageOverride;
}

export function ImageOverlay({ imageUrl, settings, variant, override }: ImageOverlayProps) {
  const baseColor = settings.imageBaseColor || '#000000';
  const overlayOpacity = settings.gradientOpacity / 100;

  const ov = override ?? DEFAULT_IMAGE_OVERRIDE;

  // 그라데이션 영역: spread 값으로 솔리드 끝 위치 이동, 페이드 폭은 고정(30%)
  const FADE_WIDTH = 30;
  const spread = ov.gradientSpread;
  const solidStop = Math.round(spread * 0.7); // 0~70%
  const fadeStop = Math.min(100, solidStop + FADE_WIDTH); // solid + 30%

  // 이미지 영역 조절: 크기 배율 + 오프셋 + 맞춤 방식
  const { areaScale, offsetX, offsetY } = ov;
  const fitMode = ov.fitMode ?? 'cover';

  // variant 없으면 레거시
  if (!variant) {
    return (
      <>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, ${baseColor}00 0%, ${baseColor} 100%)`, opacity: overlayOpacity, zIndex: 1 }} />
      </>
    );
  }

  if (variant === 'rolling') {
    // 롤링: 우측 이미지 영역 고정. areaScale→이미지 확대, offsetX/Y→크롭 위치 이동(objectPosition)
    const width = 400;
    const objectPos = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
    return (
      <>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          overflow: 'hidden', zIndex: 0, width,
          background: fitMode === 'contain' ? baseColor : 'transparent',
        }}>
          <img src={imageUrl} alt="" style={{
            width: '100%', height: '100%',
            objectFit: fitMode, objectPosition: objectPos,
            transform: `scale(${areaScale})`, transformOrigin: 'center',
          }} />
        </div>
        {/* 블러 레이어 — 이미지 경계를 부드럽게 (좁게) */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width + 2, zIndex: 1, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', maskImage: 'linear-gradient(to right, black 0%, transparent 30%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 30%)', pointerEvents: 'none' }} />
        {/* 좌→우 그라데이션 — spread 슬라이더 반영 */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width + 2, zIndex: 2, background: `linear-gradient(to right, ${baseColor} 0%, ${baseColor} ${solidStop}%, transparent ${fadeStop}%)`, pointerEvents: 'none' }} />
      </>
    );
  }

  if (variant === 'bm') {
    const width = 200;
    const objectPos = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
    return (
      <>
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0,
          overflow: 'hidden', zIndex: 0, width,
          background: fitMode === 'contain' ? baseColor : 'transparent',
        }}>
          <img src={imageUrl} alt="" style={{
            width: '100%', height: '100%',
            objectFit: fitMode, objectPosition: objectPos,
            transform: `scale(${areaScale})`, transformOrigin: 'center',
          }} />
        </div>
        {/* 블러 레이어 — 이미지 경계를 부드럽게 (좁게) */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width + 2, zIndex: 1, backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)', maskImage: 'linear-gradient(to right, black 0%, transparent 30%)', WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 30%)', pointerEvents: 'none' }} />
        {/* 좌→우 그라데이션 — spread 슬라이더 반영 */}
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: width + 2, zIndex: 2, background: `linear-gradient(to right, ${baseColor} 0%, ${baseColor} ${solidStop}%, transparent ${fadeStop}%)`, pointerEvents: 'none' }} />
      </>
    );
  }

  if (variant === 'popup') {
    // 팝업: 배너 전체 영역에 이미지. areaScale→확대, offsetX/Y→크롭 위치, fitMode→맞춤
    const objectPos = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
    return (
      <>
        {/* 사진 — 배너 전체 채움, 크기/위치 조절 가능 */}
        <div style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden', zIndex: 0,
          background: fitMode === 'contain' ? baseColor : 'transparent',
        }}>
          <img src={imageUrl} alt="" style={{
            width: '100%', height: '100%',
            objectFit: fitMode, objectPosition: objectPos,
            transform: `scale(${areaScale})`, transformOrigin: 'center',
          }} />
        </div>

        {/* 그라데이션 — 위→아래 (이미지 추출색 사용, 텍스트 영역 확실히 덮기) */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 1,
          background: `linear-gradient(to bottom, ${baseColor} 0%, ${baseColor} ${solidStop}%, transparent ${fadeStop}%)`,
          opacity: overlayOpacity,
        }} />
      </>
    );
  }

  // content: areaScale→scale, offsetX/Y→크롭 위치, fitMode→맞춤
  const objectPosContent = `calc(50% + ${offsetX}px) calc(50% + ${offsetY}px)`;
  return (
    <>
      {/* 사진 — 배너 전체 채움 */}
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0, background: fitMode === 'contain' ? baseColor : 'transparent' }}>
        <img src={imageUrl} alt="" style={{
          width: '100%', height: '100%',
          objectFit: fitMode, objectPosition: objectPosContent,
          transform: `scale(${areaScale})`, transformOrigin: 'center',
        }} />
      </div>

      {/* 그라데이션 — 위→아래 (이미지 추출색 사용) */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `linear-gradient(to bottom, ${baseColor} 0%, ${baseColor} ${solidStop}%, transparent ${fadeStop}%)`,
        opacity: overlayOpacity,
      }} />
    </>
  );
}
