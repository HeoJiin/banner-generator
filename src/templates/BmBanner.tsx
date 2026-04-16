'use client';

import React from 'react';
import { BannerState } from '@/types/banner';
import { ImageOverlay } from './ImageOverlay';
import { getBackground } from './backgroundHelper';
import { BadgeBanner } from './BadgeBanner';
import { BgDecoration } from './BgDecoration';
import { BlurBackground } from './BlurBackground';
import { HighlightText } from '@/components/HighlightText';

interface BmBannerProps {
  state: BannerState;
}

export default function BmBanner({ state }: BmBannerProps) {
  const { title: globalTitle, subtitle: globalSubtitle, textColor, highlightColor, bm, mode, imageSettings, graphicImageUrl, mainGraphicUrl, mainGraphicUrl2, blurBgUrl } = state;
  const title = bm.titleOverride ?? globalTitle;
  const subtitle = bm.subtitleOverride ?? globalSubtitle;
  const bg = getBackground(state, bm.backgroundColorOverride);

  const isImage = mode === 'image' && imageSettings.imageDataUrl;
  const showLeft = bm.objectPlacement === 'left' || bm.objectPlacement === 'both';
  const showRight = bm.objectPlacement === 'right' || bm.objectPlacement === 'both';

  return (
    <div style={{ width: 665, height: 146, background: isImage ? (imageSettings.imageBaseColor || '#000000') : bg, fontFamily: 'Pretendard, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <BadgeBanner badge={state.badge} />
      {mode === 'graphic' && state.blurEnabled && (blurBgUrl || graphicImageUrl) && (
        <BlurBackground imageUrl={(blurBgUrl || graphicImageUrl)!} blur={25} opacity={0.35} scale={1} />
      )}
      {mode === 'graphic' && (
        <BgDecoration type={bm.hideDecoration ? 'none' : state.bgDecorationType} decorationUrl={state.bgDecorationUrl} decorationOpacity={state.bgDecorationOpacity} blurBgUrl={blurBgUrl} graphicImageUrl={graphicImageUrl} blurAmount={25} blurOpacity={0.35} blurScale={1} bannerWidth={665} bannerHeight={146} />
      )}
      {isImage && <ImageOverlay imageUrl={imageSettings.imageDataUrl!} settings={imageSettings} variant="bm" override={bm.imageOverride} />}

      {/* Objects — absolute, don't affect text */}
      {/* 그래픽형: 좌=서브, 우=메인 / 한쪽만: 메인 사용 */}
      {showLeft && mode === 'graphic' && (bm.objectPlacement === 'both' ? (mainGraphicUrl2 || mainGraphicUrl) : mainGraphicUrl) && (
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <img src={bm.objectPlacement === 'both' ? (mainGraphicUrl2 || mainGraphicUrl!) : mainGraphicUrl!} alt="" style={{ height: 110, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}
      {showRight && mode === 'graphic' && mainGraphicUrl && (
        <div style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 2 }}>
          <img src={mainGraphicUrl!} alt="" style={{ height: 110, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}
      {/* 이미지형: 왼쪽 그래픽 에셋 */}
      {isImage && imageSettings.graphicAssetUrl && (
        <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 3 }}>
          <img src={imageSettings.graphicAssetUrl} alt="" style={{ height: 110, width: 'auto', objectFit: 'contain' }} />
        </div>
      )}

      {/* Text — center fixed */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', paddingLeft: 32, paddingRight: 32, zIndex: 10 }}>
        {bm.subTextPosition === 'top' && (
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.13, whiteSpace: 'pre-line', lineHeight: '18px', marginBottom: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {bm.subTextPosition === 'top' && bm.subtitle2 && (
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.13, whiteSpace: 'pre-line', lineHeight: '18px', marginBottom: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={bm.subtitle2} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: -0.24, whiteSpace: 'pre-line', lineHeight: '32px', fontFamily: 'Pretendard, sans-serif' }}>
          <HighlightText text={title} textColor={textColor} highlightColor={highlightColor} />
        </div>
        {bm.subTextPosition === 'bottom' && (
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.13, whiteSpace: 'pre-line', lineHeight: '18px', marginTop: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {bm.subTextPosition === 'bottom' && bm.subtitle2 && (
          <div style={{ fontSize: 13, fontWeight: 600, letterSpacing: -0.13, whiteSpace: 'pre-line', lineHeight: '18px', marginTop: 2, fontFamily: 'Pretendard, sans-serif' }}>
            <HighlightText text={bm.subtitle2} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
      </div>
    </div>
  );
}
