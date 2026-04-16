'use client';

import React, { useEffect, useRef } from 'react';
import { BANNER_TYPES } from '@/types/banner';
import { useBannerStore } from '@/hooks/useBannerStore';
import { parseShareUrl } from '@/utils/shareUrl';
import TopBar from '@/components/TopBar';
import InputPanel from '@/components/InputPanel';
import BannerPreviewList from '@/components/BannerPreviewList';
import DetailSettingsPanel from '@/components/DetailSettingsPanel';
import { showToast } from '@/components/ui';

export default function Home() {
  const store = useBannerStore();
  const shareLoadedRef = useRef(false);

  // URL 해시에서 공유 설정 복원 (마운트 시 1회)
  useEffect(() => {
    if (shareLoadedRef.current) return;
    shareLoadedRef.current = true;

    const hash = window.location.hash.slice(1); // # 제거
    if (!hash) return;

    parseShareUrl(hash).then((restored) => {
      if (!restored) {
        showToast({ text: '유효하지 않은 공유 링크입니다', type: 'error' });
        return;
      }
      store.loadState(restored);
      showToast({ text: '공유된 배너 설정이 로드되었습니다', type: 'info' });
      // URL 해시 제거 (새로고침 시 재로드 방지)
      history.replaceState(null, '', window.location.pathname);
    });
  }, []);
  const activePanel = store.state.activeSettingsPanel;
  const activeInstance = activePanel
    ? store.state.instances.find((i) => i.id === activePanel)
    : null;
  const activeConfig = activeInstance
    ? BANNER_TYPES.find((t) => t.type === activeInstance.type)
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <TopBar store={store} />

      <div className="flex-1 flex overflow-hidden">
        <aside className="w-[320px] flex-shrink-0 bg-layer-surface border-r border-border overflow-y-auto">
          <InputPanel store={store} />
        </aside>

        <main className="flex-1 overflow-y-auto bg-layer-base p-6">
          <BannerPreviewList store={store} />
        </main>

        {activePanel && activeInstance && activeConfig && (
          <aside className="w-[300px] flex-shrink-0 bg-layer-surface border-l border-border overflow-y-auto animate-slide-in">
            <div className="p-5">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-border -mx-5 px-5">
                <h4 className="text-h2 font-bold text-content-primary">
                  {activeInstance.label} 세부 설정
                </h4>
                <button
                  onClick={() => store.toggleSettingsPanel(activePanel)}
                  className="p-1 rounded-md text-content-tertiary hover:text-content-primary hover:bg-fill-secondary transition-colors"
                  aria-label="세부 설정 닫기"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DetailSettingsPanel bannerType={activeInstance.type} store={store} />
              <div className="h-16" aria-hidden />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
