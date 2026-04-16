'use client';

import React from 'react';
import { parseHighlightText } from '@/utils/highlightText';

interface HighlightTextProps {
  text: string;
  textColor: string;
  highlightColor: string;
  /** 서브타이틀용: 일반 텍스트에 opacity 적용, 하이라이트는 1.0 */
  dimOpacity?: number;
  style?: React.CSSProperties;
}

export function HighlightText({ text, textColor, highlightColor, dimOpacity, style }: HighlightTextProps) {
  const segments = parseHighlightText(text);
  const hasHighlight = segments.some((s) => s.highlight);

  // 하이라이트 없으면 단순 렌더링 (기존과 동일)
  if (!hasHighlight) {
    return (
      <span style={{ ...style, color: textColor, opacity: dimOpacity }}>
        {text}
      </span>
    );
  }

  return (
    <span style={style}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <span key={i} style={{ color: highlightColor, opacity: dimOpacity !== undefined ? 1.0 : undefined }}>
            {seg.text}
          </span>
        ) : (
          <span key={i} style={{ color: textColor, opacity: dimOpacity }}>
            {seg.text}
          </span>
        )
      )}
    </span>
  );
}
