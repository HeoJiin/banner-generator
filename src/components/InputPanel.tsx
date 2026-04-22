'use client';

import React, { useState } from 'react';
import { PRESET_COLORS, PRESET_GRADIENTS, KEYWORDS, SEASON_ACCENTS, GradientPreset, BadgePosition, BgDecorationType, BgDecorationCategory, BG_DECO_CATEGORIES, isLightColor, buildGradientCss, SEASON_BLUR_ASSETS, THEME_MAIN_ASSETS, COMMON_ASSETS, pickRandomTheme, getBlurAssetsForKeywords, getMainAssetsForKeywords, getAllAssets, getAssetCategories, pickRandom } from '@/types/banner';
import { BannerStore } from '@/hooks/useBannerStore';
import { trackInteraction } from '@/utils/interactionTracker';
import { Toggle, ColorPicker, SectionTitle, showToast, Chip, ChipGroup, Button, SegmentControl, TabBar, FormField, FormGroup, SectionBlock } from './ui';
import { extractDarkestColor, extractImageBaseColor, extractPalette, getContrastTextColor } from '@/utils/colorExtract';
import { hasHighlightSyntax } from '@/utils/highlightText';

interface InputPanelProps {
  store: BannerStore;
}

type PanelTab = 'basic' | 'detail';

export default function InputPanel({ store }: InputPanelProps) {
  const { state, setTitle, setSubtitle, setBackgroundColor, updateImageSettings, updatePopup, setTextColor, setHighlightColor, rerollHighlightColor, setBackgroundType, setBackgroundGradientId, setBackgroundGradientAngle, setGradientColors, setGradientFrom, setGradientTo, setMainGraphicUrl, setBlurBgUrl, setBgDecorationType, setBgDecorationUrl, setBgDecorationOpacity, clearKeywords } = store;
  const [panelTab, setPanelTab] = useState<PanelTab>('basic');


  const handleColorChange = (color: string) => {
    setBackgroundType('color');
    setBackgroundColor(color);
    setBackgroundGradientId(null);
    setTextColor(isLightColor(color) ? '#1A1A1A' : '#FFFFFF');
  };

  const handleGradientChange = (gradientId: string) => {
    const g = PRESET_GRADIENTS.find((p) => p.id === gradientId);
    if (!g) return;
    setBackgroundType('gradient');
    setBackgroundGradientId(gradientId);
    setGradientColors(g.from, g.to);
    setTextColor(g.textColor);
  };

  /** 그라데이션 세부 색상 수정 시 텍스트 색 자동 대비 */
  const autoTextColorForGradient = (from: string, to: string) => {
    const fromLight = isLightColor(from);
    const toLight = isLightColor(to);
    // 둘 다 밝으면 → 어두운 텍스트, 둘 다 어두우면 → 밝은 텍스트, 혼합이면 시작색 기준
    setTextColor(fromLight && toLight ? '#1A1A1A' : !fromLight && !toLight ? '#FFFFFF' : fromLight ? '#1A1A1A' : '#FFFFFF');
  };

  const handleGradientFromChange = (color: string) => {
    setGradientFrom(color);
    setBackgroundGradientId(null);
    autoTextColorForGradient(color, state.backgroundGradientTo);
  };

  const handleGradientToChange = (color: string) => {
    setGradientTo(color);
    setBackgroundGradientId(null);
    autoTextColorForGradient(state.backgroundGradientFrom, color);
  };

  return (
    <div>
      {/* 그래픽형: 기본/세부 탭 | 이미지형: 탭 없음 */}
      {state.mode === 'graphic' && (
        <TabBar
          tabs={[
            { value: 'basic' as PanelTab, label: '기본 설정' },
            { value: 'detail' as PanelTab, label: '세부 설정' },
          ]}
          value={panelTab}
          onChange={setPanelTab}
          sticky
        />
      )}

      <div className="p-5 pb-16">

      {/* ── 이미지형: 한 페이지 ── */}
      {state.mode === 'image' ? (
        <>
          {/* 텍스트 */}
          <SectionBlock first title="텍스트">
            <FormField label="타이틀" value={state.title} onChange={setTitle} placeholder="오늘만 {반값} 할인" defaultValue="타이틀을 입력하세요" multiline />
            <FormField label="서브타이틀" value={state.subtitle} onChange={setSubtitle} placeholder="서브타이틀을 입력하세요" defaultValue="서브타이틀을 입력하세요" multiline />
            <p className="text-caption text-content-quaternary">{'{ }'}로 감싸면 해당 글자가 하이라이트됩니다</p>
            {(hasHighlightSyntax(state.title) || hasHighlightSyntax(state.subtitle)) && (
              <div className="space-y-2">
                <label className="block text-field-label font-semibold text-content-tertiary">하이라이트 색상</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-7 h-7 rounded-full border border-border flex-shrink-0 cursor-pointer overflow-hidden" style={{ backgroundColor: state.highlightColor }} title={state.highlightColor}>
                    <input type="color" value={state.highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                  <Button variant="accent" size="sm" onClick={rerollHighlightColor}>🎲 다시 뽑기</Button>
                </div>
              </div>
            )}
          </SectionBlock>

          {/* 이미지 업로드 */}
          <SectionBlock title="이미지 업로드">
            <ImageUploader
              imageDataUrl={state.imageSettings.imageDataUrl}
              showGuide={false}
              onChange={(url) => {
                updateImageSettings({ imageDataUrl: url });
                if (url) {
                  extractDarkestColor(url).then((color) => {
                    updatePopup({ ctaColor: color });
                  }).catch(() => {});
                  extractImageBaseColor(url).then(({ color }) => {
                    updateImageSettings({ imageBaseColor: color });
                    setTextColor(getContrastTextColor(color));
                  }).catch(() => {});
                  extractPalette(url, 6).then((palette) => {
                    updateImageSettings({ imagePalette: palette });
                  }).catch(() => {});
                }
              }}
            />
          </SectionBlock>

          {/* 그라데이션 */}
          <SectionBlock title="그라데이션">
            {/* Image palette chips */}
            {state.imageSettings.imagePalette.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {state.imageSettings.imagePalette.map((color) => (
                  <button
                    key={color}
                    onClick={() => {
                      updateImageSettings({ imageBaseColor: color });
                      setTextColor(getContrastTextColor(color));
                    }}
                    className={`w-8 h-8 rounded-md border-2 transition-all ${
                      state.imageSettings.imageBaseColor === color
                        ? 'border-accent-border ring-2 ring-accent-border-subtle scale-110'
                        : 'border-border hover:border-border-strong'
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`팔레트 색상 ${color}`}
                  />
                ))}
              </div>
            )}
            <GradientControls
              settings={state.imageSettings}
              onUpdate={updateImageSettings}
            />
          </SectionBlock>

          {/* 그래픽 에셋 */}
          <SectionBlock title="그래픽 에셋" desc="롤링·BM 배너 왼쪽에 표시">
            <CategorizedAssetGrid
              store={store}
              selectedUrl={state.imageSettings.graphicAssetUrl}
              onSelect={(url) => updateImageSettings({ graphicAssetUrl: url })}
              onClear={() => updateImageSettings({ graphicAssetUrl: null })}
            />
          </SectionBlock>

          {/* 긴급 뱃지 */}
          <SectionBlock
            title="긴급 뱃지"
            toggle
            checked={state.badge.enabled}
            onToggle={(v) => store.updateBadge({ enabled: v })}
          >
            <BadgeEditor store={store} />
          </SectionBlock>
        </>
      ) : (

      /* ── 그래픽형: 기본/세부 탭 ── */
      panelTab === 'basic' ? (
        <>
          {/* 텍스트 */}
          <SectionBlock first title="텍스트">
            <FormField label="타이틀" value={state.title} onChange={setTitle} placeholder="오늘만 {반값} 할인" defaultValue="타이틀을 입력하세요" multiline />
            <FormField label="서브타이틀" value={state.subtitle} onChange={setSubtitle} placeholder="서브타이틀을 입력하세요" defaultValue="서브타이틀을 입력하세요" multiline />
            <p className="text-caption text-content-quaternary">{'{ }'}로 감싸면 해당 글자가 하이라이트됩니다</p>
            {(hasHighlightSyntax(state.title) || hasHighlightSyntax(state.subtitle)) && (
              <div className="space-y-2">
                <label className="block text-field-label font-semibold text-content-tertiary">하이라이트 색상</label>
                <div className="flex items-center gap-3">
                  <label className="relative w-7 h-7 rounded-full border border-border flex-shrink-0 cursor-pointer overflow-hidden" style={{ backgroundColor: state.highlightColor }} title={state.highlightColor}>
                    <input type="color" value={state.highlightColor} onChange={(e) => setHighlightColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </label>
                  <Button variant="accent" size="sm" onClick={rerollHighlightColor}>🎲 다시 뽑기</Button>
                </div>
              </div>
            )}
          </SectionBlock>

          {/* 소구점 키워드 */}
          <SectionBlock
            title="소구점 키워드"
            desc="선택하면 배경/그래픽이 자동 세팅됩니다"
            action={
              <Button
                variant="ghost"
                size="md"
                onClick={clearKeywords}
                className={state.selectedKeywords.length > 0 ? '' : 'invisible'}
              >
                키워드 해제
              </Button>
            }
          >
            <KeywordSelector store={store} />
          </SectionBlock>

          {/* 시즌 강조 */}
          <SectionBlock
            title="시즌 강조"
            action={
              <Button
                variant="ghost"
                size="md"
                onClick={() => store.setSeasonAccent(null)}
                className={state.seasonAccent ? '' : 'invisible'}
              >
                시즌 해제
              </Button>
            }
          >
            <SeasonSelector store={store} />
          </SectionBlock>

          {/* 긴급 뱃지 */}
          <SectionBlock
            title="긴급 뱃지"
            toggle
            checked={state.badge.enabled}
            onToggle={(v) => store.updateBadge({ enabled: v })}
          >
            <BadgeEditor store={store} />
          </SectionBlock>
        </>
      ) : (
        /* 세부 설정 탭 */
        <>
          {/* 배경 */}
          <SectionBlock
            first
            title="배경"
            action={
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  const kwId = state.selectedKeywords[0];
                  const src = state.seasonAccent || kwId;
                  if (!src) return;
                  const theme = pickRandomTheme([src]);
                  if (!theme) return;
                  setBackgroundColor(theme.backgroundColor);
                  if (theme.backgroundType === 'gradient' && theme.gradientFrom) {
                    setBackgroundType('gradient');
                    setGradientColors(theme.gradientFrom, theme.gradientTo || theme.gradientFrom);
                    const angles = [0, 45, 90, 135, 180, 225, 270, 315];
                    setBackgroundGradientAngle(angles[Math.floor(Math.random() * angles.length)]);
                  } else {
                    setBackgroundType('color');
                  }
                  setTextColor(theme.textColor);
                }}
              >
                🎲 다시 뽑기
              </Button>
            }
          >
            {/* 컬러 / 그라데이션 탭 */}
            <SegmentControl
              label=""
              options={[
                { value: 'color', label: '컬러' },
                { value: 'gradient', label: '그라데이션' },
              ]}
              value={state.backgroundType}
              onChange={(v) => setBackgroundType(v as 'color' | 'gradient')}
            />

            {state.backgroundType === 'color' ? (
              <>
                <p className="text-caption text-content-tertiary">밝은 배경 선택시, 텍스트가 어둡게 자동 설정됩니다
                </p>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className={`w-7 h-7 rounded-full border-2 transition-all duration-150 active:scale-90 ${
                        state.backgroundType === 'color' && state.backgroundColor === color
                          ? 'border-accent-border scale-110 ring-2 ring-accent-border-subtle shadow-sm'
                          : 'border-border hover:border-border-strong hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`배경색 ${color}`}
                    />
                  ))}
                </div>
                <ColorPicker label="커스텀 색상" value={state.backgroundColor} onChange={handleColorChange} compact />
              </>
            ) : (
              <>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_GRADIENTS.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => handleGradientChange(g.id)}
                      className={`h-10 rounded-lg border-2 transition-all ${
                        state.backgroundGradientId === g.id
                          ? 'border-accent-border ring-2 ring-accent-border-subtle scale-105'
                          : 'border-border hover:border-border-strong'
                      }`}
                      style={{ background: g.css }}
                      aria-label={g.label}
                      title={g.label}
                    />
                  ))}
                </div>

                {/* 시작/끝 피커 */}
                <div>
                  <label className="block text-field-label font-semibold text-content-tertiary mb-2">세부 색상</label>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1">
                      <input type="color" value={state.backgroundGradientFrom} onChange={(e) => handleGradientFromChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-caption text-content-tertiary">시작</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <input type="color" value={state.backgroundGradientTo} onChange={(e) => handleGradientToChange(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
                      <span className="text-caption text-content-tertiary">끝</span>
                    </div>
                  </div>
                </div>

                {/* 방향 회전 */}
                {state.backgroundType === 'gradient' && (
                  <div>
                    <label className="block text-field-label font-semibold text-content-tertiary mb-2">방향</label>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                          <button
                            key={angle}
                            onClick={() => setBackgroundGradientAngle(angle)}
                            className={`w-7 h-7 rounded-md border text-caption flex items-center justify-center transition-all ${
                              state.backgroundGradientAngle === angle
                                ? 'border-accent-border bg-accent-bg text-accent-content'
                                : 'border-border text-content-disabled hover:border-border-strong'
                            }`}
                            title={`${angle}°`}
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                              <line x1="8" y1="12" x2="8" y2="4" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '8px 8px' }} />
                              <polyline points="5,6 8,3 11,6" style={{ transform: `rotate(${angle}deg)`, transformOrigin: '8px 8px' }} />
                            </svg>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </SectionBlock>

          {/* 블러 배경 */}
          <SectionBlock
            title="블러 배경"
            toggle
            checked={state.blurEnabled}
            onToggle={(v) => {
              store.setBlurEnabled(v);
              if (v && !state.blurBgUrl) {
                const pool = getBlurAssetsForKeywords(state.selectedKeywords);
                store.setBlurBgUrl(pickRandom(pool));
              }
            }}
          >
            <BlurBgToggle store={store} />
          </SectionBlock>

          {/* 배경 꾸밈 */}
          <SectionBlock
            title="배경 꾸밈"
            toggle
            checked={state.bgDecorationType !== 'none'}
            onToggle={(v) => {
              if (!v) store.setBgDecorationType('none');
              else store.setBgDecorationType('confetti');
            }}
          >
            <BgDecorationSelector store={store} />
          </SectionBlock>

          {/* 전면 그래픽 에셋 */}
          <SectionBlock title="전면 그래픽 에셋" desc="키워드 선택 시 자동 세팅되며 자유롭게 변경 가능합니다">
            <CategorizedAssetGrid
              store={store}
              selectedUrl={state.mainGraphicUrl}
              onSelect={(url) => setMainGraphicUrl(url)}
              onClear={() => setMainGraphicUrl(null)}
            />
          </SectionBlock>
        </>
      )
      )}
      </div>
    </div>
  );
}

/* ── Graphic Image Uploader (for blur background) ── */
function GraphicImageUploader({ store }: { store: BannerStore }) {
  const { state, setGraphicImageUrl } = store;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하만 가능합니다.');
      return;
    }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      alert('JPG, PNG, WebP 파일만 업로드 가능합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => store.setGraphicImageUrl(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-fill-secondary hover:bg-fill-primary rounded-lg text-body font-medium text-content-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 선택
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
        </label>
        {state.graphicImageUrl && (
          <Button variant="ghost" size="sm" onClick={() => store.setGraphicImageUrl(null)}>제거</Button>
        )}
      </div>
      {state.graphicImageUrl && (
        <div className="w-full h-24 rounded-lg overflow-hidden border border-border">
          <img src={state.graphicImageUrl} alt="블러 배경 이미지" className="w-full h-full object-cover" />
        </div>
      )}
    </>
  );
}

/* ── Graphic Placeholder shapes ── */
function GraphicPlaceholder({ assetId, size, color }: { assetId: string; size: number; color: string }) {
  const s = size;
  switch (assetId) {
    case 'circle':
      return <div style={{ width: s, height: s, borderRadius: '50%', backgroundColor: color }} />;
    case 'square':
      return <div style={{ width: s, height: s, borderRadius: 4, backgroundColor: color }} />;
    case 'triangle':
      return (
        <div
          style={{
            width: 0, height: 0,
            borderLeft: `${s / 2}px solid transparent`,
            borderRight: `${s / 2}px solid transparent`,
            borderBottom: `${s}px solid ${color}`,
          }}
        />
      );
    case 'star':
      return <div style={{ width: s, height: s, backgroundColor: color, clipPath: 'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)' }} />;
    default:
      return <div style={{ width: s, height: s, borderRadius: 6, backgroundColor: color, opacity: 0.7 }} />;
  }
}

/* ── Image Uploader ── */
function ImageUploader({
  imageDataUrl,
  onChange,
  showGuide,
}: {
  imageDataUrl: string | null;
  onChange: (url: string | null) => void;
  showGuide?: boolean;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하만 가능합니다.'); return; }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { alert('JPG, PNG, WebP 파일만 업로드 가능합니다.'); return; }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="flex items-center gap-2">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-fill-secondary hover:bg-fill-primary rounded-lg text-body font-medium text-content-secondary transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 선택
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
        </label>
        {imageDataUrl && (
          <Button variant="ghost" size="sm" onClick={() => onChange(null)}>제거</Button>
        )}
      </div>
      {showGuide !== false && <p className="text-caption text-content-quaternary">권장: 2660×256px (롤링), 1330×292px (BM), 1040×1040px (팝업), 2000×1200px (컨텐츠) · 2배율 기준</p>}
      {imageDataUrl && (
        <div className="w-full h-24 rounded-lg overflow-hidden border border-border">
          <img src={imageDataUrl} alt="업로드 이미지" className="w-full h-full object-cover" />
        </div>
      )}
    </>
  );
}

/* ── Gradient Controls ── */
function GradientControls({
  settings,
  onUpdate,
}: {
  settings: { gradientPreset: GradientPreset; gradientCustomColor: string; gradientOpacity: number };
  onUpdate: (p: Partial<typeof settings>) => void;
}) {
  return (
    <div>
      <label className="block text-field-label font-semibold text-content-tertiary mb-2">그라데이션 투명도: {settings.gradientOpacity}%</label>
      <input type="range" min={40} max={100} step={5} value={settings.gradientOpacity} onChange={(e) => onUpdate({ gradientOpacity: Number(e.target.value) })} className="w-full" style={{ '--range-progress': `${((settings.gradientOpacity - 40) / (100 - 40)) * 100}%` } as React.CSSProperties} />
      <div className="flex justify-between text-caption text-content-tertiary"><span>40%</span><span>100%</span></div>
    </div>
  );
}

/* ── Keyword Selector ── */
function KeywordSelector({ store }: { store: BannerStore }) {
  const { state, toggleKeyword, rerollTheme } = store;
  const selected = state.selectedKeywords;

  return (
    <>
      <ChipGroup>
        {KEYWORDS.map((kw) => {
          const isSelected = selected.includes(kw.id);
          return (
            <Chip
              key={kw.id}
              selected={isSelected}
              onClick={() => toggleKeyword(kw.id)}
            >
              {kw.label}
            </Chip>
          );
        })}
      </ChipGroup>

      {selected.length > 0 && (
        <Button
          variant="accent"
          size="md"
          onClick={rerollTheme}
        >
          🎲 소구점 다시 뽑기
        </Button>
      )}
    </>
  );
}

/* ── Season Selector ── */
function SeasonSelector({ store }: { store: BannerStore }) {
  const { state, setSeasonAccent, rerollSeasonAccent } = store;

  return (
    <>
      <ChipGroup>
        {SEASON_ACCENTS.map((s) => {
          const isActive = state.seasonAccent === s.id;
          return (
            <Chip
              key={s.id}
              selected={isActive}
              onClick={() => setSeasonAccent(isActive ? null : s.id)}
            >
              {s.label}
            </Chip>
          );
        })}
      </ChipGroup>

      {state.seasonAccent && (
        <Button
          variant="accent"
          size="md"
          onClick={rerollSeasonAccent}
        >
          🎲 시즌 배경 다시 뽑기
        </Button>
      )}
    </>
  );
}

/* ── 3D Asset Grid ── */
function AssetGrid({
  assets,
  selectedUrl,
  onSelect,
  onClear,
  label,
}: {
  assets: string[];
  selectedUrl: string | null;
  onSelect: (url: string) => void;
  onClear: () => void;
  label: string;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? assets : assets.slice(0, 12);

  /** Extract display name from asset path */
  const getDisplayName = (path: string) => {
    const filename = path.split('/').pop() || '';
    return filename.replace('.webp', '').replace('.png', '');
  };

  return (
    <>
      {selectedUrl && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-lg overflow-hidden bg-fill-tertiary flex-shrink-0">
            <img src={selectedUrl} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-caption text-content-secondary truncate flex-1">{getDisplayName(selectedUrl)}</span>
          <Button variant="ghost" size="sm" onClick={onClear}>제거</Button>
        </div>
      )}
      <div className="grid grid-cols-5 gap-1.5">
        {displayed.map((url) => (
          <button
            key={url}
            onClick={() => onSelect(url)}
            className={`flex flex-col items-center p-1.5 rounded-lg border-2 transition-all ${
              selectedUrl === url
                ? 'border-accent-border bg-accent-bg'
                : 'border-transparent hover:border-border-strong bg-fill-tertiary'
            }`}
            aria-label={`${getDisplayName(url)} ${label} 선택`}
            title={getDisplayName(url)}
          >
            <img src={url} alt="" className="w-10 h-10 object-contain" loading="lazy" />
            <span className="text-[9px] text-content-tertiary mt-0.5 truncate w-full text-center">{getDisplayName(url)}</span>
          </button>
        ))}
      </div>
      {assets.length > 12 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="w-full text-center text-caption text-accent-content hover:text-accent-hover py-1"
        >
          {showAll ? `접기` : `전체보기 (${assets.length}개)`}
        </button>
      )}
    </>
  );
}

/* ── Categorized Asset Grid (카테고리 탭 + 에셋 그리드) ── */
function CategorizedAssetGrid({
  store,
  selectedUrl,
  onSelect,
  onClear,
}: {
  store: BannerStore;
  selectedUrl: string | null;
  onSelect: (url: string) => void;
  onClear: () => void;
}) {
  const categories = getAssetCategories(store.dynamicAssets);
  const [activeCat, setActiveCat] = useState(categories[0]?.id || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const activeAssets = categories.find((c) => c.id === activeCat)?.assets || [];

  const getDisplayName = (path: string) => {
    const filename = path.split('/').pop() || '';
    return filename.replace('.webp', '').replace('.png', '');
  };

  return (
    <>
      {selectedUrl && (
        <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-lg bg-fill-tertiary">
          <div className="w-10 h-10 rounded-md overflow-hidden bg-layer-surface flex-shrink-0">
            <img src={selectedUrl} alt="" className="w-full h-full object-contain" />
          </div>
          <span className="text-caption text-content-secondary truncate flex-1">{getDisplayName(selectedUrl)}</span>
          <Button variant="ghost" size="sm" onClick={onClear}>제거</Button>
        </div>
      )}
      {/* 이미지 업로드 */}
      <div className="mb-4 pb-4 border-b border-border">
        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.size > 5 * 1024 * 1024) { alert('파일 크기는 5MB 이하만 가능합니다.'); return; }
          if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { alert('JPG, PNG, WebP 파일만 업로드 가능합니다.'); return; }
          const reader = new FileReader();
          reader.onload = () => onSelect(reader.result as string);
          reader.readAsDataURL(file);
          e.target.value = '';
        }} className="hidden" />
        <Button variant="secondary" size="md" onClick={() => fileInputRef.current?.click()}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          이미지 업로드
        </Button>
        <p className="text-caption text-content-quaternary mt-1">권장: 750×580px · 배경 투명 PNG</p>
      </div>
      {/* 카테고리 탭 */}
      <div className="mb-3">
        <ChipGroup size="md">
          {categories.map((cat) => (
            <Chip
              key={cat.id}
              selected={activeCat === cat.id}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.label}
            </Chip>
          ))}
        </ChipGroup>
      </div>
      {/* 에셋 그리드 */}
      <div className="grid grid-cols-5 gap-1.5 max-h-[240px] overflow-y-auto">
        {activeAssets.map((url) => (
          <button
            key={url}
            onClick={() => onSelect(url)}
            className={`flex flex-col items-center p-1.5 rounded-lg border-2 transition-all ${
              selectedUrl === url
                ? 'border-accent-border bg-accent-bg'
                : 'border-transparent hover:border-border-strong bg-fill-tertiary'
            }`}
            title={getDisplayName(url)}
          >
            <img src={url} alt="" className="w-10 h-10 object-contain" loading="lazy" />
            <span className="text-[9px] text-content-tertiary mt-0.5 truncate w-full text-center">{getDisplayName(url)}</span>
          </button>
        ))}
      </div>
    </>
  );
}

/* ── Badge Editor ── */
function BadgeEditor({ store }: { store: BannerStore }) {
  const { state, updateBadge } = store;
  const { badge } = state;

  return (
    <>
      {badge.enabled && (
        <>
          <input
            type="text"
            value={badge.text}
            onChange={(e) => updateBadge({ text: e.target.value })}
            onFocus={(e) => e.target.select()}
            placeholder="예: 72H, D-3, NOW"
            className="w-full px-3 py-2 text-body border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-accent-focus"
          />
          <SegmentControl
            label=""
            options={[
              { value: 'top-left', label: '좌상단' },
              { value: 'top-right', label: '우상단' },
            ]}
            value={badge.position}
            onChange={(v) => updateBadge({ position: v as BadgePosition })}
          />
        </>
      )}
    </>
  );
}

/* ── Background Decoration Selector ── */
function BgDecorationSelector({ store }: { store: BannerStore }) {
  const { state, setBgDecorationType, setBgDecorationUrl, setBgDecorationOpacity } = store;

  // 현재 선택된 카테고리 찾기
  const currentCat = BG_DECO_CATEGORIES.find((c) =>
    c.variations.some((v) => v.type === state.bgDecorationType)
  )?.category
    || (state.bgDecorationType === 'none' ? 'none' : null);

  const handleCategoryChange = (cat: BgDecorationCategory) => {
    const catDef = BG_DECO_CATEGORIES.find((c) => c.category === cat);
    if (!catDef || cat === 'none') {
      setBgDecorationType('none');
      setBgDecorationUrl(null);
      return;
    }
    if (catDef.variations.length > 0) {
      setBgDecorationType(catDef.variations[0].type);
      setBgDecorationUrl(null);
    }
  };

  const handleVariationClick = (type: BgDecorationType) => {
    setBgDecorationType(type);
    setBgDecorationUrl(null);
  };

  const activeCatDef = BG_DECO_CATEGORIES.find((c) => c.category === currentCat);
  const isActive = state.bgDecorationType !== 'none';

  return (
    <>
      {/* 카테고리 드롭다운 — "없음" 제외 */}
      <div className="relative">
        <select
          value={currentCat || 'none'}
          onChange={(e) => handleCategoryChange(e.target.value as BgDecorationCategory)}
          className="w-full px-3 pr-8 py-2 text-body border border-border rounded-md bg-layer-surface focus:outline-none focus:ring-1 focus:ring-accent-focus cursor-pointer appearance-none"
        >
          {BG_DECO_CATEGORIES.filter((c) => c.category !== 'none').map((c) => (
            <option key={c.category} value={c.category}>{c.label}</option>
          ))}
        </select>
        <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-content-tertiary pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isActive && (
        <>
          {/* variation 썸네일 박스 */}
          {activeCatDef && activeCatDef.variations.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {activeCatDef.variations.map((v) => (
                <button
                  key={v.type}
                  onClick={() => handleVariationClick(v.type)}
                  className={`w-16 h-16 rounded-lg border overflow-hidden transition-all bg-black ${
                    state.bgDecorationType === v.type ? 'border-accent-border ring-1 ring-accent-border-subtle' : 'border-border hover:border-border-strong'
                  }`}
                  title={v.label}
                >
                  <img src={v.thumbnail} alt={v.label} className="w-full h-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}

          {/* 투명도 */}
          <div className="mt-[16px]">
            <label className="block text-field-label font-semibold text-content-tertiary">투명도: {state.bgDecorationOpacity}%</label>
            <input type="range" min={20} max={100} step={5} value={state.bgDecorationOpacity} onChange={(e) => setBgDecorationOpacity(Number(e.target.value))} className="w-full" style={{ '--range-progress': `${((state.bgDecorationOpacity - 20) / (100 - 20)) * 100}%` } as React.CSSProperties} />
            <div className="flex justify-between text-caption text-content-tertiary"><span>20%</span><span>100%</span></div>
          </div>
        </>
      )}
    </>
  );
}


/* ── Blur Background Toggle (legacy, kept for manual upload) ── */
function BlurBgToggle({ store }: { store: BannerStore }) {
  const { state, setBlurBgUrl } = store;

  const handleReroll = () => {
    trackInteraction('reroll_background');
    const pool = getBlurAssetsForKeywords(state.selectedKeywords);
    const picked = pool[Math.floor(Math.random() * pool.length)] || null;
    setBlurBgUrl(picked);
  };

  return (
    <>
      {state.blurBgUrl && (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg border border-border overflow-hidden bg-fill-tertiary flex-shrink-0">
            <img src={state.blurBgUrl} alt="" className="w-full h-full object-contain" />
          </div>
          <Button
            variant="accent"
            size="md"
            onClick={handleReroll}
          >
            🎲 다시 뽑기
          </Button>
        </div>
      )}
    </>
  );
}
