'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { BANNER_TYPES } from '@/types/banner';
import { BannerStore } from '@/hooks/useBannerStore';
import { downloadBannerAsPng } from '@/utils/download';
import { showToast } from './ui';
import BannerPreviewCard from './BannerPreviewCard';

interface BannerPreviewListProps {
  store: BannerStore;
}

export default function BannerPreviewList({ store }: BannerPreviewListProps) {
  const { state } = store;
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [newInstanceId, setNewInstanceId] = useState<string | null>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 복제 후 새 카드로 스크롤
  useEffect(() => {
    if (newInstanceId && cardRefs.current[newInstanceId]) {
      cardRefs.current[newInstanceId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const timer = setTimeout(() => setNewInstanceId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [newInstanceId]);

  const handleIndividualDownload = useCallback(
    async (instanceId: string, type: string) => {
      const el = store.canvasRefs.current[instanceId];
      const config = BANNER_TYPES.find((t) => t.type === type);
      if (!el || !config) return;

      setDownloadingId(instanceId);
      try {
        await downloadBannerAsPng(el, instanceId, config.width, config.height);
        showToast({ text: `${config.label} 다운로드 완료`, type: 'info', duration: 1500 });
      } catch (error) {
        console.error('Download failed:', error);
        showToast({ text: '다운로드에 실패했습니다.', type: 'error' });
      } finally {
        setDownloadingId(null);
      }
    },
    [store.canvasRefs]
  );

  const handleDuplicate = useCallback((instanceId: string) => {
    const prevIds = state.instances.map((i) => i.id);
    store.duplicateInstance(instanceId);
    // 다음 렌더에서 새 인스턴스 ID를 찾음
    requestAnimationFrame(() => {
      const newInst = store.state.instances.find((i) => !prevIds.includes(i.id));
      if (newInst) setNewInstanceId(newInst.id);
    });
  }, [state.instances, store]);

  const allDisabled = state.instances.every((i) => !i.enabled);

  return (
    <div className="space-y-6">
      {allDisabled && (
        <div className="flex items-center justify-center py-16 text-body text-content-tertiary">
          배너를 활성화하면 여기에 미리보기가 표시됩니다
        </div>
      )}
      {state.instances.map((instance) => {
        const config = BANNER_TYPES.find((t) => t.type === instance.type);
        if (!config) return null;
        const isOpen = state.activeSettingsPanel === instance.id;
        const isNew = newInstanceId === instance.id;
        return (
          <div
            key={instance.id}
            ref={(el) => { cardRefs.current[instance.id] = el; }}
            className="transition-all duration-500"
          >
            <BannerPreviewCard
              config={config}
              instance={instance}
              store={store}
              downloading={downloadingId === instance.id}
              onDownload={() => handleIndividualDownload(instance.id, instance.type)}
              onToggleSettings={() => store.toggleSettingsPanel(instance.id)}
              onDuplicate={() => handleDuplicate(instance.id)}
              onRemove={instance.isOriginal ? undefined : () => {
                const backup = JSON.parse(JSON.stringify(state.instances));
                store.removeInstance(instance.id);
                showToast({
                  text: `${config.label} 삭제됨`,
                  type: 'undo',
                  onUndo: () => store.setState((prev: typeof state) => ({ ...prev, instances: backup })),
                });
              }}
              isSettingsOpen={isOpen}
            />
          </div>
        );
      })}
    </div>
  );
}
