'use client';

import React from 'react';
import { BannerState } from '@/types/banner';
import { ImageOverlay } from './ImageOverlay';
import { getBackground } from './backgroundHelper';
import { BadgeBanner } from './BadgeBanner';
import { BgDecoration } from './BgDecoration';
import { BlurBackground } from './BlurBackground';
import { getCtaTextColor } from '@/utils/dominantColor';
import { HighlightText } from '@/components/HighlightText';

interface PopupBannerProps {
  state: BannerState;
}

export default function PopupBanner({ state }: PopupBannerProps) {
  const { title: globalTitle, subtitle: globalSubtitle, textColor, highlightColor, popup, mode, imageSettings, graphicImageUrl, mainGraphicUrl, blurBgUrl } = state;
  const title = popup.titleOverride ?? globalTitle;
  const subtitle = popup.subtitleOverride ?? globalSubtitle;
  const bg = getBackground(state, popup.backgroundColorOverride);
  const { subtitleTop, subtitleBottom, ctaText, ctaColor, notice } = popup;

  const isImage = mode === 'image' && imageSettings.imageDataUrl;
  const { subTextPosition } = popup;
  // 메인 서브타이틀 = 글로벌 subtitle (subTextPosition 위치에 표시)
  // 추가 서브텍스트 = 반대 위치에 표시
  const extraSub = subTextPosition === 'top' ? subtitleBottom : subtitleTop;
  const hasExtra = !!extraSub;
  const graphicSize = (subtitle && hasExtra) ? 340 : 390;

  // 텍스트 높이 추정 → 그래픽 top 오프셋 계산
  const titleLineCount = (title.match(/\n/g)?.length || 0) + Math.max(1, Math.ceil(title.replace(/\n/g, '').length / 12));
  const textOffset = (titleLineCount - 1) * 21
    + (hasExtra ? 24 : 0);

  return (
    <div style={{ width: 520, height: 520, background: isImage ? (imageSettings.imageBaseColor || '#000000') : bg, fontFamily: 'Pretendard, sans-serif', position: 'relative', overflow: 'hidden' }}>
      <BadgeBanner badge={state.badge} />
      {mode === 'graphic' && state.blurEnabled && (blurBgUrl || graphicImageUrl) && (
        <BlurBackground imageUrl={(blurBgUrl || graphicImageUrl)!} blur={30} pushOut="close" />
      )}
      {mode === 'graphic' && (
        <BgDecoration type={state.bgDecorationType} decorationUrl={state.bgDecorationUrl} decorationOpacity={state.bgDecorationOpacity} blurBgUrl={blurBgUrl} graphicImageUrl={graphicImageUrl} blurPushOut="close" blurAmount={30} bannerWidth={520} bannerHeight={520} />
      )}

      {isImage && <ImageOverlay imageUrl={imageSettings.imageDataUrl!} settings={imageSettings} variant="popup" override={popup.imageOverride} />}

      {/* Text area — z-index 10 (최상위) */}
      <div style={{ position: 'absolute', top: 60, left: 40, right: 40, textAlign: 'center', zIndex: 10 }}>
        {/* 상단: subTextPosition=top이면 메인 서브타이틀, bottom이면 추가 서브텍스트 */}
        {subTextPosition === 'top' && subtitle && (
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.18, whiteSpace: 'pre-line', lineHeight: 1.33, marginBottom: 12 }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {subTextPosition === 'bottom' && extraSub && (
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.18, whiteSpace: 'pre-line', lineHeight: 1.33, marginBottom: 12 }}>
            <HighlightText text={extraSub} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}

        <div style={{ fontSize: 33.75, fontWeight: 700, letterSpacing: -0.34, whiteSpace: 'pre-line', lineHeight: 1.24 }}>
          <HighlightText text={title} textColor={textColor} highlightColor={highlightColor} />
        </div>

        {/* 하단: subTextPosition=bottom이면 메인 서브타이틀, top이면 추가 서브텍스트 */}
        {subTextPosition === 'bottom' && subtitle && (
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.18, whiteSpace: 'pre-line', lineHeight: 1.33, marginTop: 12 }}>
            <HighlightText text={subtitle} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
        {subTextPosition === 'top' && extraSub && (
          <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.18, whiteSpace: 'pre-line', lineHeight: 1.33, marginTop: 12 }}>
            <HighlightText text={extraSub} textColor={textColor} highlightColor={highlightColor} dimOpacity={0.6} />
          </div>
        )}
      </div>

      {/* Graphic: main + sub composed */}
      {mode === 'graphic' && mainGraphicUrl && (
        <div style={{ position: 'absolute', top: `calc(50% + ${30 + textOffset}px)`, left: '50%', transform: 'translate(-50%, -50%)', width: 320, height: 320, zIndex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={mainGraphicUrl} alt="" style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
        </div>
      )}

      {/* CTA — z-index 10 */}
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, zIndex: 10, textAlign: 'center' }}>
        <div style={{
          width: 440, height: 46, borderRadius: 8, backgroundColor: ctaColor,
          color: getCtaTextColor(ctaColor), fontSize: 14, fontWeight: 600, fontFamily: 'Pretendard, sans-serif',
          lineHeight: '46px', textAlign: 'center', margin: '0 auto',
        }}>
          {ctaText}
        </div>
        {popup.noticeEnabled && notice && (
          <div style={{ fontSize: 13, fontWeight: 400, color: textColor, opacity: 0.7, lineHeight: 1.38, marginTop: 8 }}>
            {notice}
          </div>
        )}
      </div>
    </div>
  );
}
