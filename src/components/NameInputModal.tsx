'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui';

interface NameInputModalProps {
  onConfirm: (name: string) => void;
  onClose: () => void;
}

export default function NameInputModal({ onConfirm, onClose }: NameInputModalProps) {
  const [name, setName] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleConfirm = () => {
    onConfirm(name.trim() || '익명');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-layer-elevated rounded-xl shadow-xl p-6 w-[340px]">
        <p className="text-body-lg font-semibold text-content-primary mb-2">
          다운로드 전 이름 입력
        </p>
        <p className="text-caption text-content-tertiary mb-4">
          이름은 다운로드 기록 관리에 사용됩니다
        </p>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          placeholder="이름을 입력하세요"
          className="w-full px-3 py-2 text-body border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus mb-4"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="md" onClick={() => onConfirm('익명')}>
            건너뛰기
          </Button>
          <Button variant="primary" size="md" onClick={handleConfirm}>
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
