'use client';

import React, { useState } from 'react';
import {
  BannerType,
  TextAlign,
  SubTextPosition,
  ObjectPlacement,
  BM_VARIANTS,
  THEME_MAIN_ASSETS,
  COMMON_ASSETS,
  RollingBannerSettings,
  BmBannerSettings,
  PopupBannerSettings,
  ContentBannerSettings,
  ImageOverride,
  CommonBannerSettings,
  DEFAULT_IMAGE_OVERRIDE,
  GraphicAdjust,
  DEFAULT_GRAPHIC_ADJUST,
  getMainAssetsForKeywords,
  getAllAssets,
  getAssetCategories,
  getSubGraphicCategories,
} from '@/types/banner';
import { BannerStore } from '@/hooks/useBannerStore';
import { Toggle, ColorPicker, Label as MiniLabel, SegmentControl as MiniToggle, SectionTitle as SectionHeading, Accordion, Chip, ChipGroup, FormField, SectionBlock, Button } from './ui';
import { adjustCtaColorForBackground } from '@/utils/dominantColor';
import { extractPalette } from '@/utils/colorExtract';

interface DetailSettingsPanelProps {
  bannerType: BannerType;
  store: BannerStore;
}


function DecoRemoveButton({ store, bannerType }: { store: BannerStore; bannerType: 'rolling' | 'bm' }) {
  const inst = store.state.instances.find((i) => i.id === store.state.activeSettingsPanel);
  const settings = inst?.settings as (RollingBannerSettings | BmBannerSettings) | undefined;
  const hidden = settings?.hideDecoration ?? false;
  const toggle = () => {
    if (bannerType === 'rolling') {
      store.updateRolling({ hideDecoration: !hidden });
    } else {
      store.updateBm({ hideDecoration: !hidden });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <MiniLabel>배경 꾸밈 숨기기</MiniLabel>
      <Toggle size="sm" checked={hidden} onChange={toggle} />
    </div>
  );
}

/* ── 이미지 조절 훅 (이미지 모드 전용) ── */
function useImageOverride(store: BannerStore, bannerType: BannerType) {
  const { state } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const settings = inst?.settings as CommonBannerSettings | undefined;
  const override: ImageOverride = settings?.imageOverride ?? DEFAULT_IMAGE_OVERRIDE;

  const update = (patch: Partial<ImageOverride>) => {
    const next = { ...override, ...patch };
    const p = { imageOverride: next };
    if (bannerType === 'rolling') store.updateRolling(p);
    else if (bannerType === 'bm') store.updateBm(p);
    else if (bannerType === 'popup') store.updatePopup(p);
    else if (bannerType === 'content') store.updateContent(p);
  };

  const reset = () => update({ ...DEFAULT_IMAGE_OVERRIDE });

  const isChanged =
    override.gradientSpread !== DEFAULT_IMAGE_OVERRIDE.gradientSpread ||
    override.areaScale !== DEFAULT_IMAGE_OVERRIDE.areaScale ||
    override.offsetX !== DEFAULT_IMAGE_OVERRIDE.offsetX ||
    override.offsetY !== DEFAULT_IMAGE_OVERRIDE.offsetY ||
    (override.fitMode ?? 'cover') !== DEFAULT_IMAGE_OVERRIDE.fitMode;

  return { override, update, reset, isChanged };
}

/* ── 이미지 조절 리셋 버튼 (SectionBlock action 용) ── */
function ImageAreaResetButton({ store, bannerType }: { store: BannerStore; bannerType: BannerType }) {
  const { isChanged, reset } = useImageOverride(store, bannerType);
  if (!isChanged) return null;
  return <Button variant="ghost" size="md" onClick={reset}>초기화</Button>;
}

/* ── 이미지 조절 (이미지 모드 전용) ── */
function ImageAreaControls({ store, bannerType }: { store: BannerStore; bannerType: BannerType }) {
  const { override, update } = useImageOverride(store, bannerType);

  /** 기본값 근처 값이 들어오면 기본값으로 스냅 */
  const snap = (value: number, defaultValue: number, threshold: number) =>
    Math.abs(value - defaultValue) <= threshold ? defaultValue : value;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <MiniLabel>이미지 맞춤</MiniLabel>
        <div className="flex-1 ml-3">
          <MiniToggle<'cover' | 'contain'>
            label=""
            options={[
              { value: 'cover', label: '영역 채움' },
              { value: 'contain', label: '비율 유지' },
            ]}
            value={override.fitMode ?? 'cover'}
            onChange={(v) => update({ fitMode: v })}
          />
        </div>
      </div>

      <div>
        <MiniLabel>그라데이션 영역: {override.gradientSpread}%</MiniLabel>
        <input
          type="range" min={0} max={100} step={1}
          aria-label="그라데이션 영역"
          value={override.gradientSpread}
          onChange={(e) => update({ gradientSpread: snap(Number(e.target.value), 50, 3) })}
          className="w-full"
          style={{ '--range-progress': `${override.gradientSpread}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>덜 가림</span><span>더 가림</span></div>
      </div>

      <div>
        <MiniLabel>이미지 크기: {Math.round(override.areaScale * 100)}%</MiniLabel>
        <input
          type="range" min={100} max={300} step={1}
          aria-label="이미지 크기"
          value={Math.round(override.areaScale * 100)}
          onChange={(e) => update({ areaScale: snap(Number(e.target.value), 100, 5) / 100 })}
          className="w-full"
          style={{ '--range-progress': `${((override.areaScale * 100) - 100) / (300 - 100) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>100%</span><span>300%</span></div>
        <p className="mt-1 text-caption text-content-tertiary/80">이미지 전체를 보고 싶으면 맨 위 &apos;비율 유지&apos; 로 전환</p>
      </div>

      <div>
        <MiniLabel>좌우 이동: {override.offsetX}px</MiniLabel>
        <input
          type="range" min={-200} max={200} step={1}
          aria-label="좌우 이동"
          value={override.offsetX}
          onChange={(e) => update({ offsetX: snap(Number(e.target.value), 0, 8) })}
          className="w-full"
          style={{ '--range-progress': `${((override.offsetX + 200) / 400) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>-200</span><span>+200</span></div>
      </div>

      <div>
        <MiniLabel>상하 이동: {override.offsetY}px</MiniLabel>
        <input
          type="range" min={-200} max={200} step={1}
          aria-label="상하 이동"
          value={override.offsetY}
          onChange={(e) => update({ offsetY: snap(Number(e.target.value), 0, 8) })}
          className="w-full"
          style={{ '--range-progress': `${((override.offsetY + 200) / 400) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>-200</span><span>+200</span></div>
      </div>
    </div>
  );
}

/* ── 그래픽 미세 조정 훅 (그래픽 모드, 팝업/콘텐츠 전용) ── */
function useGraphicAdjust(store: BannerStore, bannerType: 'popup' | 'content') {
  const { state } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const settings = inst?.settings as (PopupBannerSettings | ContentBannerSettings) | undefined;
  const adjust: GraphicAdjust = settings?.graphicAdjust ?? DEFAULT_GRAPHIC_ADJUST;

  const update = (patch: Partial<GraphicAdjust>) => {
    const next = { ...adjust, ...patch };
    const p = { graphicAdjust: next };
    if (bannerType === 'popup') store.updatePopup(p);
    else store.updateContent(p);
  };

  const reset = () => update({ ...DEFAULT_GRAPHIC_ADJUST });

  const isChanged =
    adjust.scale !== DEFAULT_GRAPHIC_ADJUST.scale ||
    adjust.offsetX !== DEFAULT_GRAPHIC_ADJUST.offsetX ||
    adjust.offsetY !== DEFAULT_GRAPHIC_ADJUST.offsetY;

  return { adjust, update, reset, isChanged };
}

/* ── 그래픽 미세 조정 리셋 버튼 ── */
function GraphicAdjustResetButton({ store, bannerType }: { store: BannerStore; bannerType: 'popup' | 'content' }) {
  const { isChanged, reset } = useGraphicAdjust(store, bannerType);
  if (!isChanged) return null;
  return <Button variant="ghost" size="md" onClick={reset}>초기화</Button>;
}

/* ── 그래픽 미세 조정 슬라이더 (그래픽 모드, 팝업/콘텐츠 전용) ── */
function GraphicAdjustControls({ store, bannerType }: { store: BannerStore; bannerType: 'popup' | 'content' }) {
  const { adjust, update } = useGraphicAdjust(store, bannerType);
  const hasGraphic = !!store.state.mainGraphicUrl;
  const yRange = bannerType === 'content' ? 80 : 20;

  const snap = (value: number, defaultValue: number, threshold: number) =>
    Math.abs(value - defaultValue) <= threshold ? defaultValue : value;

  return (
    <div className={`flex flex-col gap-3 ${!hasGraphic ? 'opacity-50 pointer-events-none' : ''}`}>
      <div>
        <MiniLabel>크기: {Math.round(adjust.scale * 100)}%</MiniLabel>
        <input
          type="range" min={85} max={100} step={1}
          aria-label="그래픽 크기"
          value={Math.round(adjust.scale * 100)}
          onChange={(e) => update({ scale: snap(Number(e.target.value), 100, 2) / 100 })}
          className="w-full"
          style={{ '--range-progress': `${((adjust.scale * 100) - 85) / (100 - 85) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>85%</span><span>100%</span></div>
      </div>

      <div>
        <MiniLabel>좌우 이동: {adjust.offsetX}px</MiniLabel>
        <input
          type="range" min={-20} max={20} step={1}
          aria-label="좌우 이동"
          value={adjust.offsetX}
          onChange={(e) => update({ offsetX: snap(Number(e.target.value), 0, 2) })}
          className="w-full"
          style={{ '--range-progress': `${((adjust.offsetX + 20) / 40) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>-20</span><span>+20</span></div>
      </div>

      <div>
        <MiniLabel>{bannerType === 'content' ? '하단 이동' : '상하 이동'}: {adjust.offsetY}px</MiniLabel>
        <input
          type="range" min={bannerType === 'content' ? 0 : -yRange} max={yRange} step={1}
          aria-label={bannerType === 'content' ? '하단 이동' : '상하 이동'}
          value={adjust.offsetY}
          onChange={(e) => update({ offsetY: snap(Number(e.target.value), 0, 2) })}
          className="w-full"
          style={{ '--range-progress': `${bannerType === 'content' ? (adjust.offsetY / yRange) * 100 : ((adjust.offsetY + yRange) / (yRange * 2)) * 100}%` } as React.CSSProperties}
        />
        <div className="flex justify-between text-caption text-content-tertiary"><span>{bannerType === 'content' ? '0' : `-${yRange}`}</span><span>+{yRange}</span></div>
      </div>
    </div>
  );
}

/* ── 개별 수정: 긴급 뱃지 숨기기 (뱃지 활성화 시에만 노출) ── */
function BadgeHideToggle({ store, bannerType }: { store: BannerStore; bannerType: BannerType }) {
  const { state } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const settings = inst?.settings as CommonBannerSettings | undefined;
  const hidden = settings?.hideBadge ?? false;
  const badgeEnabled = state.badge.enabled;

  if (!badgeEnabled) return null;

  const toggle = () => {
    const patch = { hideBadge: !hidden };
    if (bannerType === 'rolling') store.updateRolling(patch);
    else if (bannerType === 'bm') store.updateBm(patch);
    else if (bannerType === 'popup') store.updatePopup(patch);
    else if (bannerType === 'content') store.updateContent(patch);
  };

  return (
    <div className="flex items-center justify-between">
      <MiniLabel>긴급 뱃지 숨기기</MiniLabel>
      <Toggle size="sm" checked={hidden} onChange={toggle} />
    </div>
  );
}


/* ── 개별 수정: 타이틀/서브타이틀 ──
 * null = 오버라이드 없음 (메인 값 사용), 문자열("" 포함) = 오버라이드 활성 */
function TitleOverrideInputs({
  titleOverride,
  subtitleOverride,
  globalTitle,
  globalSubtitle,
  onTitleChange,
  onSubtitleChange,
}: {
  titleOverride: string | null;
  subtitleOverride: string | null;
  globalTitle: string;
  globalSubtitle: string;
  onTitleChange: (v: string | null) => void;
  onSubtitleChange: (v: string | null) => void;
}) {
  const isOverriddenTitle = titleOverride !== null;
  const isOverriddenSubtitle = subtitleOverride !== null;

  const handleTitleFocus = () => {
    if (titleOverride === null) onTitleChange(globalTitle);
  };
  const handleSubtitleFocus = () => {
    if (subtitleOverride === null) onSubtitleChange(globalSubtitle);
  };

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-2 h-7">
          <label className="text-field-label font-semibold text-content-tertiary">타이틀</label>
          {isOverriddenTitle && (
            <Button variant="ghost" size="sm" onClick={() => onTitleChange(null)}>메인 설정으로 복원</Button>
          )}
        </div>
        <textarea
          rows={2}
          value={isOverriddenTitle ? (titleOverride as string) : globalTitle}
          onChange={(e) => onTitleChange(e.target.value)}
          onFocus={handleTitleFocus}
          className="w-full px-3 py-2 text-body-lg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus resize-none"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-2 h-7">
          <label className="text-field-label font-semibold text-content-tertiary">서브타이틀</label>
          {isOverriddenSubtitle && (
            <Button variant="ghost" size="sm" onClick={() => onSubtitleChange(null)}>메인 설정으로 복원</Button>
          )}
        </div>
        <textarea
          rows={2}
          value={isOverriddenSubtitle ? (subtitleOverride as string) : globalSubtitle}
          onChange={(e) => onSubtitleChange(e.target.value)}
          onFocus={handleSubtitleFocus}
          className="w-full px-3 py-2 text-body-lg border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus resize-none"
        />
      </div>
    </>
  );
}

/* ── Mini Asset Selector (서브 그래픽용 — 카테고리 탭) ── */
function MiniAssetSelector({ store, label }: { store: BannerStore; label: string }) {
  const { state, setMainGraphicUrl2, dynamicAssets } = store;
  const categories = getSubGraphicCategories(dynamicAssets);
  const [activeCat, setActiveCat] = useState(categories[0]?.id || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const activeAssets = categories.find((c) => c.id === activeCat)?.assets || [];

  const getDisplayName = (path: string) => {
    const filename = path.split('/').pop() || '';
    return filename.replace('.webp', '').replace('.png', '');
  };

  return (
    <Accordion label={label}>
      {state.mainGraphicUrl2 && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-fill-tertiary">
          <div className="w-8 h-8 rounded-md overflow-hidden bg-layer-surface flex-shrink-0">
            <img src={state.mainGraphicUrl2} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-caption text-content-tertiary truncate flex-1">{getDisplayName(state.mainGraphicUrl2)}</span>
          <Button variant="ghost" size="sm" onClick={() => setMainGraphicUrl2(null)}>제거</Button>
        </div>
      )}
      {/* 이미지 업로드 */}
      <div className="mb-3 pb-3 border-b border-border">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하만 가능합니다.'); return; }
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { alert('JPG, PNG, WebP 파일만 업로드 가능합니다.'); return; }
          const reader = new FileReader();
          reader.onload = () => setMainGraphicUrl2(reader.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }} className="hidden" />
        <Button variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 업로드
        </Button>
      </div>
      <div className="mb-3">
        <ChipGroup size="md">
          {categories.map((cat) => (
            <Chip key={cat.id} size="md" selected={activeCat === cat.id} onClick={() => setActiveCat(cat.id)}>
              {cat.label}
            </Chip>
          ))}
        </ChipGroup>
      </div>
      <div className="grid grid-cols-5 gap-1 max-h-[200px] overflow-y-auto">
        {activeAssets.map((url) => (
          <button
            key={url}
            onClick={() => setMainGraphicUrl2(url)}
            aria-label={getDisplayName(url)}
            aria-pressed={state.mainGraphicUrl2 === url}
            className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${
              state.mainGraphicUrl2 === url
                ? 'border-accent-border bg-accent-bg'
                : 'border-transparent hover:border-border-strong bg-fill-tertiary'
            }`}
            title={getDisplayName(url)}
          >
            <img src={url} alt="" className="w-8 h-8 object-contain" loading="lazy" />
          </button>
        ))}
      </div>
    </Accordion>
  );
}

/* ── 개별 수정: 메인 그래픽 ── */
function MainGraphicSelector({ store, currentOverride, onChange }: {
  store: BannerStore;
  currentOverride: string | null;
  onChange: (url: string | null) => void;
}) {
  const { dynamicAssets } = store;
  const categories = getAssetCategories(dynamicAssets);
  const [activeCat, setActiveCat] = useState(categories[0]?.id || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const globalUrl = store.state.mainGraphicUrl;
  const selectedUrl = currentOverride || globalUrl;

  const activeAssets = categories.find((c) => c.id === activeCat)?.assets || [];

  const getDisplayName = (path: string) => {
    const filename = path.split('/').pop() || '';
    return filename.replace('.webp', '').replace('.png', '');
  };

  return (
    <Accordion label="메인 그래픽">
      {selectedUrl && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-fill-tertiary">
          <div className="w-8 h-8 rounded-md overflow-hidden bg-layer-surface flex-shrink-0">
            <img src={selectedUrl} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-caption text-content-tertiary truncate flex-1">{getDisplayName(selectedUrl)}</span>
          {currentOverride && (
            <Button variant="ghost" size="sm" onClick={() => onChange(null)}>메인으로 복원</Button>
          )}
        </div>
      )}
      {/* 이미지 업로드 */}
      <div className="mb-3 pb-3 border-b border-border">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하만 가능합니다.'); return; }
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { alert('JPG, PNG, WebP 파일만 업로드 가능합니다.'); return; }
          const reader = new FileReader();
          reader.onload = () => onChange(reader.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }} className="hidden" />
        <Button variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 업로드
        </Button>
      </div>
      <div className="mb-3">
        <ChipGroup size="md">
          {categories.map((cat) => (
            <Chip key={cat.id} size="md" selected={activeCat === cat.id} onClick={() => setActiveCat(cat.id)}>
              {cat.label}
            </Chip>
          ))}
        </ChipGroup>
      </div>
      <div className="grid grid-cols-5 gap-1 max-h-[200px] overflow-y-auto">
        {activeAssets.map((url) => (
          <button
            key={url}
            onClick={() => onChange(url)}
            aria-label={getDisplayName(url)}
            aria-pressed={selectedUrl === url}
            className={`flex flex-col items-center p-1 rounded-lg border-2 transition-all ${
              selectedUrl === url
                ? 'border-accent-border bg-accent-bg'
                : 'border-transparent hover:border-border-strong bg-fill-tertiary'
            }`}
            title={getDisplayName(url)}
          >
            <img src={url} alt="" className="w-8 h-8 object-contain" loading="lazy" />
          </button>
        ))}
      </div>
    </Accordion>
  );
}

/* ── Rolling Settings ── */
function RollingDetailSettings({ store }: { store: BannerStore }) {
  const { state, updateRolling } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const s = (inst?.settings ?? state.rolling) as RollingBannerSettings;

  return (
    <div>
      <SectionBlock first title="텍스트">
        <TitleOverrideInputs titleOverride={s.titleOverride} subtitleOverride={s.subtitleOverride} globalTitle={state.title} globalSubtitle={state.subtitle} onTitleChange={(v) => updateRolling({ titleOverride: v })} onSubtitleChange={(v) => updateRolling({ subtitleOverride: v })} />
        <MiniToggle<SubTextPosition> label="서브텍스트 위치" options={[{ value: 'top', label: '상단' }, { value: 'bottom', label: '하단' }]} value={s.subTextPosition} onChange={(v) => updateRolling({ subTextPosition: v })} />
      </SectionBlock>
      {state.mode === 'graphic' && (
        <SectionBlock title="그래픽">
          <MiniToggle<ObjectPlacement> label="오브제 배치" options={[{ value: 'left', label: '좌' }, { value: 'both', label: '양쪽' }, { value: 'right', label: '우' }]} value={s.objectPlacement} onChange={(v) => updateRolling({ objectPlacement: v })} />
          <MainGraphicSelector store={store} currentOverride={s.mainGraphicOverride} onChange={(url) => updateRolling({ mainGraphicOverride: url })} />
          <MiniAssetSelector store={store} label="서브 그래픽" />
        </SectionBlock>
      )}
      {state.mode === 'image' && (
        <SectionBlock title="이미지 조절" action={<ImageAreaResetButton store={store} bannerType="rolling" />}>
          <ImageAreaControls store={store} bannerType="rolling" />
        </SectionBlock>
      )}
      {(state.mode === 'graphic' || state.badge.enabled) && (
        <SectionBlock title="기타">
          {state.mode === 'graphic' && <DecoRemoveButton store={store} bannerType="rolling" />}
          <BadgeHideToggle store={store} bannerType="rolling" />
        </SectionBlock>
      )}
    </div>
  );
}

/* ── BM Settings ── */
function BmDetailSettings({ store }: { store: BannerStore }) {
  const { state, updateBm } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const s = (inst?.settings ?? state.bm) as BmBannerSettings;

  return (
    <div>
      <SectionBlock first title="텍스트">
        <TitleOverrideInputs titleOverride={s.titleOverride} subtitleOverride={s.subtitleOverride} globalTitle={state.title} globalSubtitle={state.subtitle} onTitleChange={(v) => updateBm({ titleOverride: v })} onSubtitleChange={(v) => updateBm({ subtitleOverride: v })} />
        <MiniToggle<SubTextPosition> label="서브텍스트 위치" options={[{ value: 'top', label: '상단' }, { value: 'bottom', label: '하단' }]} value={s.subTextPosition} onChange={(v) => updateBm({ subTextPosition: v })} />
        <FormField label="서브텍스트 2" value={s.subtitle2} onChange={(v) => updateBm({ subtitle2: v })} placeholder="추가 서브텍스트" />
      </SectionBlock>
      {state.mode === 'graphic' && (
        <SectionBlock title="그래픽">
          <MiniToggle<ObjectPlacement> label="오브제 배치" options={[{ value: 'both', label: '양쪽' }, { value: 'left', label: '좌' }, { value: 'right', label: '우' }, { value: 'none', label: '없음' }]} value={s.objectPlacement} onChange={(v) => updateBm({ objectPlacement: v })} />
          <MainGraphicSelector store={store} currentOverride={s.mainGraphicOverride} onChange={(url) => updateBm({ mainGraphicOverride: url })} />
          <MiniAssetSelector store={store} label="서브 그래픽" />
        </SectionBlock>
      )}
      {state.mode === 'image' && (
        <SectionBlock title="이미지 조절" action={<ImageAreaResetButton store={store} bannerType="bm" />}>
          <ImageAreaControls store={store} bannerType="bm" />
        </SectionBlock>
      )}
      {(state.mode === 'graphic' || state.badge.enabled) && (
        <SectionBlock title="기타">
          {state.mode === 'graphic' && <DecoRemoveButton store={store} bannerType="bm" />}
          <BadgeHideToggle store={store} bannerType="bm" />
        </SectionBlock>
      )}
    </div>
  );
}

/* ── Popup Settings ── */
function PopupDetailSettings({ store }: { store: BannerStore }) {
  const { state, updatePopup } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const s = (inst?.settings ?? state.popup) as PopupBannerSettings;
  const [extracting, setExtracting] = useState(false);

  const handleExtractColor = async () => {
    // 이미지 모드면 업로드 이미지, 그래픽 모드면 메인 그래픽에서 추출
    const src = state.mode === 'image'
      ? state.imageSettings.imageDataUrl
      : state.mainGraphicUrl || state.graphicImageUrl;
    if (!src) return;

    setExtracting(true);
    try {
      const palette = await extractPalette(src, 6);
      // 채도·명도 높은 색만 필터
      const vivid = palette.filter((hex) => {
        const c = hex.replace('#', '');
        const r = parseInt(c.substring(0, 2), 16) / 255;
        const g = parseInt(c.substring(2, 4), 16) / 255;
        const b = parseInt(c.substring(4, 6), 16) / 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        const l = (max + min) / 2;
        const s = max === min ? 0 : (max - min) / (l > 0.5 ? 2 - max - min : max + min);
        return s > 0.3 && l > 0.25 && l < 0.85;
      });
      const pool = [...(vivid.length > 0 ? vivid : palette), '#FFFFFF', '#000000'];
      const picked = pool[Math.floor(Math.random() * pool.length)];
      const bgColor = state.backgroundColor || '#FFFFFF';
      const adjusted = adjustCtaColorForBackground(picked, bgColor);
      updatePopup({ ctaColor: adjusted });
    } catch {
      // 실패 시 무시
    } finally {
      setExtracting(false);
    }
  };

  const hasImageSource = state.mode === 'image'
    ? !!state.imageSettings.imageDataUrl
    : !!(state.mainGraphicUrl || state.graphicImageUrl);

  return (
    <div>
      <SectionBlock first title="텍스트">
        <TitleOverrideInputs titleOverride={s.titleOverride} subtitleOverride={s.subtitleOverride} globalTitle={state.title} globalSubtitle={state.subtitle} onTitleChange={(v) => updatePopup({ titleOverride: v })} onSubtitleChange={(v) => updatePopup({ subtitleOverride: v })} />
        <MiniToggle<SubTextPosition> label="서브텍스트 위치" options={[{ value: 'top', label: '상단' }, { value: 'bottom', label: '하단' }]} value={s.subTextPosition} onChange={(v) => updatePopup({ subTextPosition: v })} />
        <FormField label={`추가 서브텍스트 (${s.subTextPosition === 'top' ? '하단' : '상단'})`} value={s.subTextPosition === 'top' ? s.subtitleBottom : s.subtitleTop} onChange={(v) => updatePopup(s.subTextPosition === 'top' ? { subtitleBottom: v } : { subtitleTop: v })} placeholder="추가 서브텍스트" />
      </SectionBlock>
      <SectionBlock title="그래픽">
        <MainGraphicSelector store={store} currentOverride={s.mainGraphicOverride} onChange={(url) => updatePopup({ mainGraphicOverride: url })} />
      </SectionBlock>
      {state.mode === 'graphic' && (
        <SectionBlock title="그래픽 미세 조정" action={<GraphicAdjustResetButton store={store} bannerType="popup" />}>
          <GraphicAdjustControls store={store} bannerType="popup" />
        </SectionBlock>
      )}
      <SectionBlock title="CTA">
        <FormField label="CTA 텍스트" value={s.ctaText} onChange={(v) => updatePopup({ ctaText: v })} />
        <div>
          <MiniLabel>CTA 색상</MiniLabel>
          <div className="flex items-center gap-2">
            <ColorPicker label="" value={s.ctaColor} onChange={(v) => updatePopup({ ctaColor: v })} compact />
            <button onClick={handleExtractColor} disabled={!hasImageSource || extracting} className={`px-2 py-1 text-caption font-medium rounded-md transition-all ${hasImageSource && !extracting ? 'bg-accent-bg text-accent-content hover:bg-accent-bg' : 'bg-fill-secondary text-content-tertiary/50 cursor-not-allowed'}`} title={hasImageSource ? '이미지에서 대표 컬러 추출' : '이미지를 먼저 설정하세요'}>
              {extracting ? <span className="inline-flex items-center gap-1"><svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12" /></svg>추출 중</span> : '자동 추출'}
            </button>
          </div>
        </div>
      </SectionBlock>
      <SectionBlock title="안내 문구" toggle checked={s.noticeEnabled} onToggle={(v) => updatePopup({ noticeEnabled: v })}>
        <input type="text" value={s.notice} onChange={(e) => updatePopup({ notice: e.target.value })} placeholder="이벤트 내용은 변경될 수 있습니다" className="w-full px-2.5 py-1.5 text-caption border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus" />
      </SectionBlock>
      {state.mode === 'image' && (
        <SectionBlock title="이미지 조절" action={<ImageAreaResetButton store={store} bannerType="popup" />}>
          <ImageAreaControls store={store} bannerType="popup" />
        </SectionBlock>
      )}
      {state.badge.enabled && (
        <SectionBlock title="기타">
          <BadgeHideToggle store={store} bannerType="popup" />
        </SectionBlock>
      )}
    </div>
  );
}

/* ── Content Settings ── */
function ContentDetailSettings({ store }: { store: BannerStore }) {
  const { state, updateContent } = store;
  const inst = state.instances.find((i) => i.id === state.activeSettingsPanel);
  const s = (inst?.settings ?? state.content) as ContentBannerSettings;

  return (
    <div>
      <SectionBlock first title="텍스트">
        <TitleOverrideInputs titleOverride={s.titleOverride} subtitleOverride={s.subtitleOverride} globalTitle={state.title} globalSubtitle={state.subtitle} onTitleChange={(v) => updateContent({ titleOverride: v })} onSubtitleChange={(v) => updateContent({ subtitleOverride: v })} />
        <MiniToggle<SubTextPosition> label="서브텍스트 위치" options={[{ value: 'top', label: '상단' }, { value: 'bottom', label: '하단' }]} value={s.subTextPosition} onChange={(v) => updateContent({ subTextPosition: v })} />
        <FormField label={`추가 서브텍스트 (${s.subTextPosition === 'top' ? '하단' : '상단'})`} value={s.subTextPosition === 'top' ? s.subtitleBottom : s.subtitleTop} onChange={(v) => updateContent(s.subTextPosition === 'top' ? { subtitleBottom: v } : { subtitleTop: v })} placeholder="추가 서브텍스트" />
      </SectionBlock>
      <SectionBlock title="그래픽">
        <MainGraphicSelector store={store} currentOverride={s.mainGraphicOverride} onChange={(url) => updateContent({ mainGraphicOverride: url })} />
      </SectionBlock>
      {state.mode === 'graphic' && (
        <SectionBlock title="그래픽 미세 조정" action={<GraphicAdjustResetButton store={store} bannerType="content" />}>
          <GraphicAdjustControls store={store} bannerType="content" />
        </SectionBlock>
      )}
      {state.mode === 'image' && (
        <SectionBlock title="이미지 조절" action={<ImageAreaResetButton store={store} bannerType="content" />}>
          <ImageAreaControls store={store} bannerType="content" />
        </SectionBlock>
      )}
      {state.badge.enabled && (
        <SectionBlock title="기타">
          <BadgeHideToggle store={store} bannerType="content" />
        </SectionBlock>
      )}
    </div>
  );
}

/* ── Main switch ── */
export default function DetailSettingsPanel({ bannerType, store }: DetailSettingsPanelProps) {
  switch (bannerType) {
    case 'rolling':
      return <RollingDetailSettings store={store} />;
    case 'bm':
      return <BmDetailSettings store={store} />;
    case 'popup':
      return <PopupDetailSettings store={store} />;
    case 'content':
      return <ContentDetailSettings store={store} />;
  }
}
