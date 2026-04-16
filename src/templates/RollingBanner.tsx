'use client';

import React from 'react';
import { BannerState } from '@/types/banner';
import { ImageOverlay } from './ImageOverlay';
import { getBackground } from './backgroundHelper';
import { BadgeBanner } from './BadgeBanner';
import { BgDecoration } from './BgDecoration';
import { BlurBackground } from './BlurBackground';
import { HighlightText } from '@/components/HighlightText';

interface RollingBannerProps {
  state: BannerState;
}

export default function RollingBanner({ state }: RollingBannerProps) {
  const { title: globalTitle, subtitle: globalSubtitle, textColor, highlightColor, rolling, mode, imageSettings, graphicImageUrl, mainGraphicUrl, mainGraphicUrl2, blurBgUrl } = state;
  const title = rolling.titleOverride ?? globalTitle;
  const subtitle = rolling.subtitleOverride ?? globalSubtitle;
  const bg = getBackground(state, rolling.backgroundColorOverride);
  const { textAlign, subTextPosition, objectPlacement } = rolling;

  const showLeft = objectPlacement === 'left' || objectPlacement === 'both';
  const showRight = objectPlacement === 'right' || objectPlacement === 'both';
  const isImage = mode === 'image' && imageSettings.imageDataUrl;

  // 블러 배경: 시즌 에셋 자동 선택 > 수동 업로드 순서
  const blurImageUrl = blurBgUrl || graphicImageUrl;

  return (
    <div style={{ width: 1330, height: 128, background: isImage ? (imageSettings.imageBaseColor || '#000000') : bg, fontFamily: 'Pretendard, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <BadgeBanner badge={state.badge} />
      {mode === 'graphic' && state.blurEnabled && (blurBgUrl || graphicImageUrl) && (
        <BlurBackground imageUrl={(blurBgUrl || graphicImageUrl)!} blur={25} opacity={0.4} scale={1.2} />
      )}
      {mode === 'graphic' && (
        <BgDecoration type={rolling.hideDecoration ? 'none' : state.bgDecorationType} decorationUrl={state.bgDecorationUrl} decorationOpacity={state.bgDecorationOpacity} blurBgUrl={blurBgUrl} graphicImageUrl={graphicImageUrl} blurAmount={25} blurOpacity={0.4} blurScale={1.2} bannerWidth={1330} bannerHeight={128} />
      )}
      {isImage && <ImageOverlay imageUrl={imageSettings.imageDataUrl!} settings={imageSettings} variant="rolling" override={rolling.imageOverride} />}

      {/* Objects — absolutely positioned so they don't push text */}
      {/* 그래픽형: 좌=서브, 우=메인 / 한쪽만: 메인 사용 */}
      {showLeft && mode === 'graphic' && (objectPlacement === 'both' ? (mainGraphicUrl2 || mainGraphicUrl) : mainGraphicUrl) && (
        <div style={{ position: 'absolute', left: 60, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <img src={objectPlacement === 'both' ? (mainGraphicUrl2 || mainGraphicUrl!) : mainGraphicUrl!} alt="" style={{ height: 160, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}
      {showRight && mode === 'graphic' && (objectPlacement === 'both' ? mainGraphicUrl : mainGraphicUrl) && (
        <div style={{ position: 'absolute', right: 60, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <img src={mainGraphicUrl!} alt="" style={{ height: 160, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}
      {/* 이미지형: 왼쪽 그래픽 에셋 */}
      {isImage && imageSettings.graphicAssetUrl && (
        <div style={{ position: 'absolute', left: 60, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
          <img src={imageSettings.graphicAssetUrl} alt="" style={{ height: 160, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}

      {/* Text — 이미지형: 중앙, 그래픽형: 중앙 */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center' as const, paddingLeft: 32, paddingRight: 32, zIndex: 10 }}>
        {subTextPosition === 'top' && (
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.15, whiteSpace: "pre-line", lineHeight: '20px', marginBottom: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.28, whiteSpace: "pre-line", lineHeight: '36px', fontFamily: 'Pretendard, sans-serif' }}>
          <HighlightText text={title} textColor={textColor} highlightColor={highlightColor} />
        </div>
        {subTextPosition === 'bottom' && (
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.15, whiteSpace: "pre-line", lineHeight: '20px', marginTop: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
      </div>
    </div>
  );
}
