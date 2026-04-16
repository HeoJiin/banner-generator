'use client';

import React, { useRef, useLayoutEffect, useEffect, useState } from 'react';
import Label from './Label';

interface SegmentControlProps<T extends string> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  size?: 'sm' | 'md';
}

const SIZES = {
  sm: 'px-2 py-1 text-caption',
  md: 'px-3 py-1.5 text-body',
};

const CONTAINER_SIZES = {
  sm: 'p-0.5 rounded-md',
  md: 'p-1 rounded-lg',
};

export default function SegmentControl<T extends string>({ label, options, value, onChange, size = 'sm' }: SegmentControlProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const [animate, setAnimate] = useState(false);

  // 마운트 시: layoutEffect로 paint 전에 위치 잡기 (애니메이션 없음)
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const idx = options.findIndex((o) => o.value === value);
    const buttons = containerRef.current.querySelectorAll<HTMLButtonElement>('[data-segment-item]');
    const btn = buttons[idx];
    if (btn) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const btnRect = btn.getBoundingClientRect();
      setIndicator({
        left: btnRect.left - containerRect.left,
        width: btnRect.width,
      });
    }
  }, [value, options]);

  // 첫 paint 이후에만 애니메이션 활성화
  useEffect(() => {
    requestAnimationFrame(() => setAnimate(true));
  }, []);

  return (
    <div className={label ? 'space-y-1' : ''}>
      {label && <Label>{label}</Label>}
      <div ref={containerRef} className={`relative flex gap-1 bg-fill-primary ${CONTAINER_SIZES[size]}`}>
        {/* Sliding indicator */}
        <div
          className={`absolute ${size === 'sm' ? 'top-0.5 bottom-0.5 rounded-[5px]' : 'top-1 bottom-1 rounded-md'} bg-layer-surface shadow-sm ease-out pointer-events-none ${animate ? 'transition-all duration-200' : ''}`}
          style={{ left: indicator.left, width: indicator.width }}
        />
        {options.map((opt) => (
          <button
            key={opt.value}
            data-segment-item
            onClick={() => onChange(opt.value)}
            className={`relative z-[1] flex-1 ${SIZES[size]} font-medium rounded transition-colors duration-200 active:scale-95 ${
              value === opt.value
                ? 'text-content-primary'
                : 'text-content-tertiary hover:text-content-primary'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
