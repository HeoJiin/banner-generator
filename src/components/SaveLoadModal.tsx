'use client';

import React, { useState, useEffect } from 'react';
import { BannerStore } from '@/hooks/useBannerStore';
import { getSavedConfigs, saveConfig, deleteConfig, SavedConfig } from '@/utils/savedConfigs';
import { showToast, Button, IconButton } from './ui';

interface SaveLoadModalProps {
  store: BannerStore;
  onClose: () => void;
}

function formatDate(ts: number): string {
  const d = new Date(ts);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const h = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${m}/${day} ${h}:${min}`;
}

export default function SaveLoadModal({ store, onClose }: SaveLoadModalProps) {
  const [configs, setConfigs] = useState<SavedConfig[]>(getSavedConfigs());
  const [saveName, setSaveName] = useState('');
  const [confirmLoad, setConfirmLoad] = useState<SavedConfig | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSave = () => {
    const name = saveName.trim() || undefined;
    saveConfig(store.state, name);
    setConfigs(getSavedConfigs());
    setSaveName('');
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleLoad = (config: SavedConfig) => {
    setConfirmLoad(config);
  };

  const handleConfirmLoad = () => {
    if (confirmLoad) {
      store.loadState(confirmLoad.state);
      setConfirmLoad(null);
      onClose();
    }
  };

  const handleDelete = (id: string) => {
    const backup = getSavedConfigs();
    deleteConfig(id);
    setConfigs(getSavedConfigs());
    const deleted = backup.find((c) => c.id === id);
    showToast({
      text: `"${deleted?.name || '저장'}" 삭제됨`,
      type: 'undo',
      onUndo: () => {
        // localStorage에 다시 저장
        localStorage.setItem('banner-saved-configs', JSON.stringify(backup));
        setConfigs(backup);
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-layer-elevated rounded-xl shadow-2xl w-[440px] max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
          <h2 className="text-h2 font-bold text-content-primary">저장 / 불러오기</h2>
          <IconButton onClick={onClose} aria-label="닫기">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </IconButton>
        </div>

        {/* Save section */}
        <div className="px-5 py-4 border-b border-border/50">
          <div className="flex gap-2">
            <input
              type="text"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
              placeholder="저장 이름 (비워두면 날짜/시간)"
              className="flex-1 px-3 py-2 text-body border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
            <Button variant="primary" size="md" onClick={handleSave} className="flex-shrink-0">
              {saved ? '저장됨!' : '저장'}
            </Button>
          </div>
          <p className="text-caption text-content-tertiary mt-1.5">이 브라우저에 최대 30개까지 저장됩니다</p>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-5 py-3">
          {configs.length === 0 ? (
            <p className="text-body text-content-tertiary text-center py-8">저장된 이력이 없습니다</p>
          ) : (
            <div className="space-y-1.5">
              {configs.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between px-3 py-2.5 rounded-md hover:bg-fill-secondary group transition-colors"
                >
                  <button
                    onClick={() => handleLoad(c)}
                    className="flex-1 text-left"
                  >
                    <div className="text-body font-medium text-content-primary">{c.name}</div>
                    <div className="text-caption text-content-tertiary">{formatDate(c.timestamp)}</div>
                  </button>
                  <IconButton variant="destructive" onClick={() => handleDelete(c.id)} title="삭제" className="opacity-0 group-hover:opacity-100">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </IconButton>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirm popup */}
      {confirmLoad && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setConfirmLoad(null)} />
          <div className="relative bg-layer-elevated rounded-xl shadow-xl p-6 w-[340px]">
            <p className="text-body-lg font-semibold text-content-primary mb-2">불러오기</p>
            <p className="text-body text-content-secondary mb-5">
              현재 작업 중인 내용이 사라집니다.<br />
              <span className="font-medium text-content-primary">"{confirmLoad.name}"</span>을 불러올까요?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="md" onClick={() => setConfirmLoad(null)}>취소</Button>
              <Button variant="primary" size="md" onClick={handleConfirmLoad}>불러오기</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
