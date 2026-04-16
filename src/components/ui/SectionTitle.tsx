import React from 'react';

interface SectionTitleProps {
  children: React.ReactNode;
  /** 첫 번째 섹션이면 구분선/상단 패딩 생략 */
  first?: boolean;
  /** 패딩/마진 기준 (InputPanel vs DetailSettings) */
  variant?: 'panel' | 'detail';
}

export default function SectionTitle({ children, first, variant = 'panel' }: SectionTitleProps) {
  const hrMargin = variant === 'panel' ? '-mx-5' : '-mx-4';
  const topPad = variant === 'panel' ? 'mt-5 pt-5' : '';
  return (
    <>
      {!first && <hr className={`border-t border-border ${topPad ? 'mt-5' : ''} ${hrMargin}`} />}
      <h2 className={`text-h2 font-bold text-content-primary ${first ? 'mb-3' : variant === 'panel' ? 'pt-5 mb-3' : ''}`}>
        {children}
      </h2>
    </>
  );
}
