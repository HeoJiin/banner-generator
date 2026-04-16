'use client';

import React from 'react';
import Toggle from './Toggle';

interface SectionBlockProps {
  /** 섹션 타이틀 */
  title: string;
  /** 첫 번째 섹션이면 구분선 생략 */
  first?: boolean;
  /** 타이틀 아래 설명 텍스트 */
  desc?: string;
  /** 우측 액션 영역 (버튼 등) — toggle과 동시 사용 가능 */
  action?: React.ReactNode;
  /** 토글 모드: 토글 off면 children 숨김 */
  toggle?: boolean;
  checked?: boolean;
  onToggle?: (v: boolean) => void;
  /** children 사이 간격 */
  gap?: 'default' | 'loose';
  children?: React.ReactNode;
}

const GAP_MAP = {
  default: 'space-y-3', // 12px — 기본
  loose: 'space-y-4',   // 16px — 넓음
};

export default function SectionBlock({
  title,
  first,
  desc,
  action,
  toggle,
  checked,
  onToggle,
  gap = 'default',
  children,
}: SectionBlockProps) {
  const showContent = toggle ? checked : true;

  return (
    <div>
      {/* 구분선 */}
      {!first && <hr className="border-t border-border mt-5 -mx-5" />}

      {/* 헤더: 타이틀 + 우측 (액션/토글) */}
      <div className={`flex items-center justify-between min-h-[32px] ${first ? 'mb-4' : 'pt-5 mb-4'}`}>
        <h2 className="text-h2 font-bold text-content-primary">{title}</h2>
        <div className="flex items-center gap-2">
          {action}
          {toggle && onToggle && <Toggle checked={!!checked} onChange={onToggle} />}
        </div>
      </div>

      {/* 설명 */}
      {desc && <p className="text-caption text-content-tertiary -mt-2 mb-4">{desc}</p>}

      {/* 콘텐츠 */}
      {showContent && children && (
        <div className={GAP_MAP[gap]}>
          {children}
        </div>
      )}
    </div>
  );
}
