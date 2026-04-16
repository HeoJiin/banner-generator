'use client';

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';

interface TabBarProps<T extends string> {
  tabs: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  sticky?: boolean;
}

export default function TabBar<T extends string>({ tabs, value, onChange, sticky }: TabBarProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [animate, setAnimate] = useState(false);

  // 마운트 시: layoutEffect로 paint 전에 위치 잡기 (애니메이션 없음)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const idx = tabs.findIndex((t) => t.value === value);
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-tab-item]');
    const btn = buttons[idx];
    if (btn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [value, tabs]);

  // 첫 paint 이후에만 애니메이션 활성화
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative flex border-b border-border bg-layer-surface ${sticky ? 'sticky top-0 z-10' : ''}`}
    >
      {/* Sliding underline indicator */}
      <div
        className={`absolute bottom-0 h-0.5 bg-accent ease-out ${animate ? 'transition-all duration-200' : ''}`}
        style={{ left: indicator.left, width: indicator.width }}
      />
      {tabs.map((tab) => (
        <button
          key={tab.value}
          data-tab-item
          onClick={() => onChange(tab.value)}
          className={`flex-1 py-3 text-body font-semibold transition-colors duration-200 active:scale-[0.97] ${
            value === tab.value
              ? 'text-accent-content'
              : 'text-content-tertiary hover:text-content-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
