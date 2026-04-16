'use client';

import React, { useState, useEffect } from 'react';
import { BannerMode } from '@/types/banner';
import { downloadAllAsZip } from '@/utils/download';
import { generateShareUrl, copyToClipboard } from '@/utils/shareUrl';
import { BannerStore } from '@/hooks/useBannerStore';
import SaveLoadModal from './SaveLoadModal';
import { showToast, Button, IconButton } from './ui';
import SegmentControl from './ui/SegmentControl';

interface TopBarProps {
  store: BannerStore;
}

export default function TopBar({ store }: TopBarProps) {
  const { state, canvasRefs, setMode, undo, redo, canUndo, canRedo } = store;
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 4 });
  const [showSaveLoad, setShowSaveLoad] = useState(false);

  const handleDownloadAll = async () => {
    setDownloading(true);
    const enabledCount = state.instances.filter((i) => i.enabled).length;
    setProgress({ done: 0, total: enabledCount });
    try {
      await downloadAllAsZip(canvasRefs.current, state.instances, (done, total) => {
        setProgress({ done, total });
      });
    } catch (error) {
      console.error('ZIP download failed:', error);
      showToast({ text: '다운로드에 실패했습니다. 다시 시도해주세요.', type: 'error' });
    } finally {
      setDownloading(false);
    }
  };

  // 키보드 단축키: ⌘Z / Ctrl+Z (undo), ⌘⇧Z / Ctrl+⇧Z (redo)
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (!meta || e.key.toLowerCase() !== 'z') return;
      // input/textarea 포커스 중이면 스킵 (텍스트 편집 undo 우선)
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      e.preventDefault();
      if (e.shiftKey) redo();
      else undo();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo]);

  const modes: { value: BannerMode; label: string }[] = [
    { value: 'graphic', label: '그래픽형' },
    { value: 'image', label: '이미지형' },
  ];

  return (
    <header className="bg-layer-surface border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <h1 className="text-h1 font-bold text-content-primary mr-4">배너 생성기</h1>

        {/* Mode tabs */}
        <SegmentControl
          label=""
          options={modes}
          value={state.mode}
          onChange={setMode}
          size="md"
        />
      </div>

      <div className="flex items-center gap-2">
      {/* Undo / Redo */}
      <div className="flex items-center gap-1 mr-3 pr-3 border-r border-border">
        <IconButton onClick={undo} disabled={!canUndo} aria-label="되돌리기" title="되돌리기 (⌘Z)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a5 5 0 015 5v2M3 10l4-4M3 10l4 4" />
          </svg>
        </IconButton>
        <IconButton onClick={redo} disabled={!canRedo} aria-label="다시 실행" title="다시 실행 (⌘⇧Z)">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a5 5 0 00-5 5v2M21 10l-4-4M21 10l-4 4" />
          </svg>
        </IconButton>
      </div>

      {/* Save/Load */}
      <Button variant="secondary" size="lg" onClick={() => setShowSaveLoad(true)}>
        저장 / 불러오기
      </Button>

      {/* Share */}
      <Button variant="secondary" size="lg" onClick={async () => {
        try {
          const { url, isImageMode } = await generateShareUrl(state);
          const copied = await copyToClipboard(url);
          if (copied) {
            const msg = isImageMode
              ? '공유 링크가 복사되었습니다. 업로드 이미지는 포함되지 않습니다.'
              : '공유 링크가 복사되었습니다';
            showToast({ text: msg, type: 'info' });
            if (url.length > 2000) {
              showToast({ text: '링크가 길어 일부 메신저에서 잘릴 수 있습니다', type: 'info' });
            }
          } else {
            showToast({ text: '링크 복사에 실패했습니다. 브라우저 설정을 확인해주세요.', type: 'error' });
          }
        } catch {
          showToast({ text: '공유 링크 생성에 실패했습니다', type: 'error' });
        }
      }}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
        공유
      </Button>

      {/* Download ZIP */}
      <Button variant="primary" size="lg" onClick={handleDownloadAll} disabled={downloading} aria-label="전체 다운로드 ZIP">
        {downloading ? (
          <>
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            {progress.done}/{progress.total}
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            전체 다운로드 ZIP
          </>
        )}
      </Button>
      </div>

      {showSaveLoad && <SaveLoadModal store={store} onClose={() => setShowSaveLoad(false)} />}
    </header>
  );
}
