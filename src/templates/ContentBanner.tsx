'use client';

import React from 'react';
import { BannerState, DEFAULT_GRAPHIC_ADJUST, ContentBannerSettings } from '@/types/banner';
import { ImageOverlay } from './ImageOverlay';
import { getBackground } from './backgroundHelper';
import { BadgeBanner } from './BadgeBanner';
import { BgDecoration } from './BgDecoration';
import { BlurBackground } from './BlurBackground';
import { HighlightText } from '@/components/HighlightText';

interface ContentBannerProps {
  state: BannerState;
}

export default function ContentBanner({ state }: ContentBannerProps) {
  const { title: globalTitle, subtitle: globalSubtitle, textColor, highlightColor, content, mode, imageSettings, graphicImageUrl, mainGraphicUrl, blurBgUrl } = state;
  const title = content.titleOverride ?? globalTitle;
  const subtitle = content.subtitleOverride ?? globalSubtitle;
  const bg = getBackground(state, content.backgroundColorOverride);
  const { subtitleTop, subtitleBottom } = content;

  const isImage = mode === 'image' && imageSettings.imageDataUrl;
  const { subTextPosition } = content;
  const extraSub = subTextPosition === 'top' ? subtitleBottom : subtitleTop;

  return (
    <div style={{ width: 1000, height: 600, background: isImage ? (imageSettings.imageBaseColor || '#000000') : bg, fontFamily: 'Pretendard, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <BadgeBanner badge={state.badge} />
      {mode === 'graphic' && state.blurEnabled && (blurBgUrl || graphicImageUrl) && (
        <BlurBackground imageUrl={(blurBgUrl || graphicImageUrl)!} blur={34} opacity={0.5} scale={1.5} pushOut="far" />
      )}
      {mode === 'graphic' && (
        <BgDecoration type={state.bgDecorationType} decorationUrl={state.bgDecorationUrl} decorationOpacity={state.bgDecorationOpacity} blurBgUrl={blurBgUrl} graphicImageUrl={graphicImageUrl} blurPushOut="far" blurAmount={34} blurOpacity={0.5} blurScale={1.5} bannerWidth={1000} bannerHeight={600} />
      )}
      {isImage && <ImageOverlay imageUrl={imageSettings.imageDataUrl!} settings={imageSettings} variant="content" override={content.imageOverride} />}

      {/* Left text */}
      <div style={{
        position: 'absolute', top: 58, left: 78, right: 78, zIndex: 10,
      }}>
        {/* 상단: subTextPosition=top이면 메인 서브타이틀, bottom이면 추가 서브텍스트 */}
        {subTextPosition === 'top' && subtitle && (
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.32, whiteSpace: 'pre-line', lineHeight: 1.31, marginBottom: 26 }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {subTextPosition === 'bottom' && extraSub && (
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.32, whiteSpace: 'pre-line', lineHeight: 1.31, marginBottom: 26 }}>
            <HighlightText text={extraSub} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}

        <div style={{ fontSize: 60, fontWeight: 700, letterSpacing: -0.6, whiteSpace: 'pre-line', lineHeight: 1.2 }}>
          <HighlightText text={title} textColor={textColor} highlightColor={highlightColor} />
        </div>

        {/* 하단: subTextPosition=bottom이면 메인 서브타이틀, top이면 추가 서브텍스트 */}
        {subTextPosition === 'bottom' && subtitle && (
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.32, whiteSpace: 'pre-line', lineHeight: 1.31, marginTop: 26 }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {subTextPosition === 'top' && extraSub && (
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: -0.32, whiteSpace: 'pre-line', lineHeight: 1.31, marginTop: 26 }}>
            <HighlightText text={extraSub} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
      </div>

      {/* Right graphic: main + sub — 피그마 기준 left:calc(50%+235), top:calc(50%+35) */}
      {mode === 'graphic' && mainGraphicUrl && (() => {
        const ga = (content as ContentBannerSettings).graphicAdjust ?? DEFAULT_GRAPHIC_ADJUST;
        return (
          <div style={{ position: 'absolute', left: 'calc(50% + 225px)', top: 'calc(50% + 35px)', transform: `translate(-50%, -50%) translate(${ga.offsetX}px, ${ga.offsetY}px) scale(${ga.scale})`, width: 500, height: 500, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={mainGraphicUrl} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
          </div>
        );
      })()}
    </div>
  );
}
