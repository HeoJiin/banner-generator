'use client';

import React from 'react';
import { BannerType, BannerTypeConfig, BannerInstance, buildStateForInstance } from '@/types/banner';
import { BannerStore } from '@/hooks/useBannerStore';
import { Toggle, IconButton } from './ui';
import RollingBanner from '@/templates/RollingBanner';
import BmBanner from '@/templates/BmBanner';
import PopupBanner from '@/templates/PopupBanner';
import ContentBanner from '@/templates/ContentBanner';

interface BannerPreviewCardProps {
  config: BannerTypeConfig;
  instance: BannerInstance;
  store: BannerStore;
  downloading: boolean;
  onDownload: () => void;
  onToggleSettings: () => void;
  onDuplicate: () => void;
  onRemove?: () => void;
  isSettingsOpen: boolean;
}

function renderBanner(type: BannerType, store: BannerStore, instance: BannerInstance) {
  const patchedState = buildStateForInstance(store.state, instance);
  switch (type) {
    case 'rolling':
      return <RollingBanner state={patchedState} />;
    case 'bm':
      return <BmBanner state={patchedState} />;
    case 'popup':
      return <PopupBanner state={patchedState} />;
    case 'content':
      return <ContentBanner state={patchedState} />;
  }
}

export default function BannerPreviewCard({
  config,
  instance,
  store,
  downloading,
  onDownload,
  onToggleSettings,
  onDuplicate,
  onRemove,
  isSettingsOpen,
}: BannerPreviewCardProps) {
  const maxWidth = config.type === 'rolling' ? 800 : 580;
  const scale = Math.min(maxWidth / config.width, 0.85);

  return (
    <div className={`rounded-lg border border-border overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.06)] ${!instance.enabled ? 'bg-fill-secondary' : 'bg-layer-surface'} ${isSettingsOpen ? 'ring-2 ring-accent-border-subtle' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-12 border-b border-border/50">
        <div className="flex items-center gap-2">
          <Toggle size="sm" checked={instance.enabled} onChange={() => store.toggleBannerEnabled(instance.id)} />
          <h3 className={`text-body font-bold ${instance.enabled ? 'text-content-primary' : 'text-content-tertiary'}`}>{instance.label}</h3>
          <span className="text-caption text-content-tertiary font-mono">
            {config.width}x{config.height}
          </span>
          {instance.enabled && scale < 1 && (
            <span className="text-caption text-content-tertiary/50">
              ({Math.round(scale * 100)}%)
            </span>
          )}
        </div>
        {instance.enabled && (
          <div className="flex items-center gap-1">
            {/* Duplicate */}
            <IconButton onClick={onDuplicate} aria-label={`${instance.label} 복제`} title="복제">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </IconButton>

            {/* Delete (복제본만) */}
            {!instance.isOriginal && onRemove && (
              <IconButton variant="destructive" onClick={onRemove} aria-label={`${instance.label} 삭제`} title="삭제">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </IconButton>
            )}

            {/* Settings */}
            <IconButton variant={isSettingsOpen ? 'active' : 'default'} onClick={onToggleSettings} aria-label={`${instance.label} 세부 설정 ${isSettingsOpen ? '닫기' : '열기'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </IconButton>

            {/* Download */}
            <IconButton onClick={onDownload} disabled={downloading} aria-label={`${instance.label} 다운로드`}>
              {downloading ? (
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
            </IconButton>
          </div>
        )}
      </div>

      {/* Canvas */}
      {instance.enabled && (
        <div className="p-4 flex justify-center overflow-hidden bg-layer-base-top">
          <div
            className="relative group/canvas cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-focus focus-visible:ring-offset-2 rounded"
            style={{ width: Math.floor(config.width * scale), height: Math.floor(config.height * scale) }}
            onClick={onToggleSettings}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onToggleSettings();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label={`${instance.label} 세부 설정 열기`}
          >
            <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: config.width, height: config.height }}>
              <div ref={(el) => store.setCanvasRef(instance.id, el)}>
                {renderBanner(config.type, store, instance)}
              </div>
            </div>
            {/* Hover/Focus 오버레이: 세부 설정 CTA */}
            {!isSettingsOpen && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/canvas:opacity-100 group-focus-visible/canvas:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="flex items-center gap-2 px-4 py-2.5 bg-layer-surface rounded-full shadow-lg text-body font-semibold text-content-primary">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  배너별 설정하기
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
