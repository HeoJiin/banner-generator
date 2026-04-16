'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  BannerType,
  BannerMode,
  BannerState,
  BannerInstance,
  AnyBannerSettings,
  DEFAULT_STATE,
  BANNER_TYPES,
  RollingBannerSettings,
  BmBannerSettings,
  PopupBannerSettings,
  ContentBannerSettings,
  ImageModeSettings,
  BadgeSettings,
  KEYWORDS,
  pickRandomTheme,
  ThemeVariation,
  SEASON_BLUR_ASSETS,
  THEME_MAIN_ASSETS,
  COMMON_ASSETS,
  pickRandom,
  getDefaultSettingsForType,
} from '@/types/banner';
import { pickRandomHighlightColor } from '@/utils/highlightText';

/** 이미지 프리로딩: 풀에서 랜덤 N장을 미리 브라우저 캐시에 로드 */
const preloadedUrls = new Set<string>();
function preloadImages(pool: string[], count = 6) {
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const url of shuffled.slice(0, count)) {
    if (preloadedUrls.has(url)) continue;
    preloadedUrls.add(url);
    const img = new Image();
    img.src = url;
  }
}

/** 모든 이미지 로드 완료 후 resolve — 동시 교체용 */
function waitForImages(urls: (string | null | undefined)[]): Promise<void> {
  const valid = urls.filter((u): u is string => !!u);
  if (valid.length === 0) return Promise.resolve();
  return Promise.all(valid.map((url) => {
    if (preloadedUrls.has(url)) return Promise.resolve();
    return new Promise<void>((resolve) => {
      const img = new Image();
      img.onload = () => { preloadedUrls.add(url); resolve(); };
      img.onerror = () => resolve();
      img.src = url;
    });
  })).then(() => {});
}

/** 동적 에셋: 파일명 토큰으로 키워드 자동 매핑 (API에서 그룹핑) */

export function useBannerStore() {
  const [state, setState] = useState<BannerState>({ ...DEFAULT_STATE });
  const [dynamicAssets, setDynamicAssets] = useState<Record<string, string[]>>({});
  const initializedRef = useRef(false);

  /* ── Undo / Redo 히스토리 ──
   * historyIdx 는 ref 로만 관리 (state 업데이트 중첩 방지),
   * UI 갱신은 historyVersion(숫자 증가)로 강제 리렌더. */
  const HISTORY_LIMIT = 50;
  const historyRef = useRef<BannerState[]>([{ ...DEFAULT_STATE }]);
  const historyIdxRef = useRef(0);
  const isTimeTravelRef = useRef(false);
  const isInitialMountRef = useRef(true);
  const [, setHistoryVersion] = useState(0);
  const bumpHistoryVersion = useCallback(() => setHistoryVersion((v) => v + 1), []);

  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      return;
    }
    if (isTimeTravelRef.current) {
      isTimeTravelRef.current = false;
      return;
    }
    // 현재 위치 이후 history 잘라내고 새 state 추가
    const hist = historyRef.current.slice(0, historyIdxRef.current + 1);
    hist.push(state);
    if (hist.length > HISTORY_LIMIT) hist.shift();
    historyRef.current = hist;
    historyIdxRef.current = hist.length - 1;
    bumpHistoryVersion();
  }, [state, bumpHistoryVersion]);

  const undo = useCallback(() => {
    const idx = historyIdxRef.current;
    if (idx <= 0) return;
    const newIdx = idx - 1;
    historyIdxRef.current = newIdx;
    isTimeTravelRef.current = true;
    setState({ ...historyRef.current[newIdx], activeSettingsPanel: null });
    bumpHistoryVersion();
  }, [bumpHistoryVersion]);

  const redo = useCallback(() => {
    const idx = historyIdxRef.current;
    if (idx >= historyRef.current.length - 1) return;
    const newIdx = idx + 1;
    historyIdxRef.current = newIdx;
    isTimeTravelRef.current = true;
    setState({ ...historyRef.current[newIdx], activeSettingsPanel: null });
    bumpHistoryVersion();
  }, [bumpHistoryVersion]);

  const canUndo = historyIdxRef.current > 0;
  const canRedo = historyIdxRef.current < historyRef.current.length - 1;

  /* ── Canvas refs for download (instance id 기반) ── */
  const canvasRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const setCanvasRef = useCallback((instanceId: string, el: HTMLDivElement | null) => {
    canvasRefs.current[instanceId] = el;
  }, []);

  /* ── 동적 에셋 로딩: 파일명 토큰으로 키워드별 자동 그룹핑 ── */
  useEffect(() => {
    fetch('/assets/asset-groups.json')
      .then((r) => r.json())
      .then((data: { groups: Record<string, string[]> }) => {
        setDynamicAssets(data.groups);
        // 동적 에셋 로딩 완료 후, 이미 선택된 키워드가 있으면 에셋 재세팅
        setState((prev) => {
          const kwId = prev.selectedKeywords[0];
          if (!kwId) return prev;
          const dynPool = data.groups[kwId] || [];
          const staticPool = THEME_MAIN_ASSETS[kwId] || [];
          const pool = dynPool.length > 0 ? dynPool : (staticPool.length > 0 ? staticPool : COMMON_ASSETS);
          const mainGraphicUrl = pool[Math.floor(Math.random() * pool.length)];
          let mainGraphicUrl2 = pool[Math.floor(Math.random() * pool.length)];
          if (pool.length > 1) {
            let attempts = 0;
            while (mainGraphicUrl2 === mainGraphicUrl && attempts < 10) {
              mainGraphicUrl2 = pool[Math.floor(Math.random() * pool.length)];
              attempts++;
            }
          }
          return { ...prev, mainGraphicUrl, mainGraphicUrl2 };
        });
      })
      .catch(() => {});
  }, []);

  /* ── Mode ── */
  const setMode = useCallback((mode: BannerMode) => {
    setState((prev) => ({ ...prev, mode }));
  }, []);

  /* ── Common fields ── */
  const setTitle = useCallback((title: string) => {
    setState((prev) => ({ ...prev, title }));
  }, []);

  const setSubtitle = useCallback((subtitle: string) => {
    setState((prev) => ({ ...prev, subtitle }));
  }, []);

  const setBackgroundColor = useCallback((backgroundColor: string) => {
    setState((prev) => {
      const bgColors = prev.backgroundType === 'gradient'
        ? [prev.backgroundGradientFrom, prev.backgroundGradientTo]
        : [backgroundColor];
      return { ...prev, backgroundColor, highlightColor: pickRandomHighlightColor(bgColors) };
    });
  }, []);

  const setGraphicAsset = useCallback((graphicAsset: string) => {
    setState((prev) => ({ ...prev, graphicAsset }));
  }, []);

  const setTextColor = useCallback((textColor: string) => {
    setState((prev) => ({ ...prev, textColor }));
  }, []);

  const setHighlightColor = useCallback((highlightColor: string) => {
    setState((prev) => ({ ...prev, highlightColor }));
  }, []);

  const rerollHighlightColor = useCallback(() => {
    setState((prev) => {
      const bgColors = prev.backgroundType === 'gradient'
        ? [prev.backgroundGradientFrom, prev.backgroundGradientTo]
        : [prev.backgroundColor];
      return { ...prev, highlightColor: pickRandomHighlightColor(bgColors) };
    });
  }, []);

  const setBackgroundType = useCallback((backgroundType: 'color' | 'gradient') => {
    setState((prev) => ({ ...prev, backgroundType }));
  }, []);

  const setBackgroundGradientId = useCallback((backgroundGradientId: string | null) => {
    setState((prev) => ({ ...prev, backgroundGradientId }));
  }, []);

  const setBackgroundGradientAngle = useCallback((backgroundGradientAngle: number) => {
    setState((prev) => ({ ...prev, backgroundGradientAngle }));
  }, []);

  const setGradientColors = useCallback((from: string, to: string) => {
    setState((prev) => ({ ...prev, backgroundGradientFrom: from, backgroundGradientTo: to }));
  }, []);

  const setGradientFrom = useCallback((c: string) => { setState((prev) => ({ ...prev, backgroundGradientFrom: c })); }, []);
  const setGradientTo = useCallback((c: string) => { setState((prev) => ({ ...prev, backgroundGradientTo: c })); }, []);

  /* ── Apply theme helper — background only (from season keywords) ── */
  const applyBgTheme = (theme: ThemeVariation): Partial<BannerState> => {
    const bgColors = theme.gradientFrom
      ? [theme.gradientFrom, theme.gradientTo || theme.gradientFrom]
      : [theme.backgroundColor];
    return {
      backgroundType: theme.backgroundType,
      backgroundColor: theme.backgroundColor,
      textColor: theme.textColor,
      highlightColor: pickRandomHighlightColor(bgColors),
      ...(theme.gradientFrom ? {
        backgroundGradientFrom: theme.gradientFrom,
        backgroundGradientTo: theme.gradientTo || theme.gradientFrom,
      } : {}),
    };
  };

  /* ── 키워드별 배경 꾸밈 후보 ── */
  const KEYWORD_DECO_MAP: Record<string, BannerState['bgDecorationType'][]> = {
    spring: ['flower1', 'flower2', 'flower3', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    summer: ['tree', 'sandcastle', 'tube', 'wave', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    autumn: ['leaves', 'maple', 'berries', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    winter: ['winter', 'winter2', 'winter3', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    christmas: ['winter', 'winter2', 'winter3', 'winter4', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    newyear: ['confetti', 'confetti2', 'confetti3', 'confetti4'],
    chuseok: ['leaves', 'maple', 'berries', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    benefit: ['confetti', 'confetti2', 'confetti3', 'confetti4'],
    info: ['confetti', 'confetti2', 'confetti3', 'confetti4'],
    growth: ['arrows', 'confetti', 'confetti2', 'confetti3', 'confetti4'],
    urgent: ['confetti', 'confetti2', 'confetti3', 'confetti4'],
    hundred: ['confetti', 'confetti2', 'confetti3', 'confetti4'],
  };

  /* ── Pick all assets for a keyword + optional season accent ── */
  // dynamicAssets를 ref로 유지 — useCallback 클로저에서 항상 최신 값 참조
  const dynamicAssetsRef = useRef(dynamicAssets);
  dynamicAssetsRef.current = dynamicAssets;

  const pickAllForKeyword = (kwId: string, seasonAccent: string | null = null): Partial<BannerState> => {
    const updates: Partial<BannerState> = {};
    const dynAssets = dynamicAssetsRef.current;

    // 배경색: 시즌 강조가 있으면 배경 유지 (시즌 배경은 setSeasonAccent에서 처리)
    if (!seasonAccent) {
      const bgTheme = pickRandomTheme([kwId]);
      if (bgTheme) {
        Object.assign(updates, applyBgTheme(bgTheme));
        const angles = [0, 45, 90, 135, 180, 225, 270, 315];
        updates.backgroundGradientAngle = angles[Math.floor(Math.random() * angles.length)];
      }
    }

    // 메인 그래픽: 시즌 강조 유무에 따라 풀 구성
    const seasonComboKey = seasonAccent ? `${kwId}_${seasonAccent}` : null;
    const dynComboPool = seasonComboKey ? (dynAssets[seasonComboKey] || []) : [];
    const staticComboPool = seasonComboKey ? (THEME_MAIN_ASSETS[seasonComboKey] || []) : [];
    const dynKwPool = dynAssets[kwId] || [];
    const staticKwPool = THEME_MAIN_ASSETS[kwId] || [];
    const basePool = dynKwPool.length > 0 ? dynKwPool : staticKwPool.length > 0 ? staticKwPool : COMMON_ASSETS;

    let mainPool: string[];
    if (seasonAccent) {
      const comboPool = dynComboPool.length > 0 ? dynComboPool : staticComboPool;
      if (comboPool.length > 0) {
        // 시즌 조합 에셋(3배 비중) + 범용 에셋 혼합
        mainPool = [...comboPool, ...comboPool, ...comboPool, ...basePool];
      } else {
        // 시즌 조합 없으면 범용 fallback
        mainPool = basePool;
      }
    } else {
      // 시즌 없음 → 범용만
      mainPool = basePool;
    }
    updates.mainGraphicUrl = pickRandom(mainPool);
    // 두번째 그래픽 (롤링/BM 우측용) — 같은 풀에서 다른 거 뽑기
    let second = pickRandom(mainPool);
    if (mainPool.length > 1) {
      let attempts = 0;
      while (second === updates.mainGraphicUrl && attempts < 10) { second = pickRandom(mainPool); attempts++; }
    }
    updates.mainGraphicUrl2 = second;

    // 블러 배경: 시즌 강조가 있으면 시즌 에셋, 없으면 키워드 에셋, 둘 다 없으면 메인 그래픽 사용
    const blurSource = seasonAccent || kwId;
    const blurPool = SEASON_BLUR_ASSETS[blurSource];
    if (blurPool) {
      updates.blurBgUrl = pickRandom(blurPool);
    } else {
      // 블러 전용 풀이 없으면 메인 그래픽을 블러용으로 사용
      updates.blurBgUrl = updates.mainGraphicUrl;
    }
    updates.blurEnabled = true;

    // 배경 꾸밈: 시즌 강조 있으면 유지 (시즌 꾸밈은 setSeasonAccent에서 처리)
    if (!seasonAccent) {
      const kwDecos = KEYWORD_DECO_MAP[kwId] || ['none'];
      const pickedDeco = kwDecos[Math.floor(Math.random() * kwDecos.length)]!;
      updates.bgDecorationType = pickedDeco;
      updates.bgDecorationUrl = null;
    }

    // 다음 reroll 대비 이미지 프리로딩
    preloadImages(mainPool);

    return updates;
  };

  /* ── Keywords (1개만 선택) ── */
  const toggleKeyword = useCallback((keywordId: string) => {
    setState((prev) => {
      const isSelected = prev.selectedKeywords.includes(keywordId);

      if (isSelected) {
        return { ...prev, selectedKeywords: [] };
      }

      // 시즌 키워드면 시즌 강조 초기화
      const isSeasonKw = ['spring', 'summer', 'autumn', 'winter', 'christmas'].includes(keywordId);
      const accent = isSeasonKw ? null : prev.seasonAccent;

      const updates: Partial<BannerState> = {
        selectedKeywords: [keywordId],
        seasonAccent: accent,
        ...pickAllForKeyword(keywordId, accent),
      };

      return { ...prev, ...updates };
    });
  }, []);

  /* ── Season Accent (시즌 강조) ── */
  const setSeasonAccent = useCallback((seasonId: string | null) => {
    setState((prev) => {
      const updates: Partial<BannerState> = { seasonAccent: seasonId };
      const kwId = prev.selectedKeywords[0];

      if (kwId && seasonId) {
        // 키워드 유지 + 시즌 강조로 배경/블러/꾸밈/그래픽 덮어쓰기
        const bgTheme = pickRandomTheme([seasonId]);
        if (bgTheme) Object.assign(updates, applyBgTheme(bgTheme));

        const blurPool = SEASON_BLUR_ASSETS[seasonId];
        if (blurPool) {
          updates.blurBgUrl = pickRandom(blurPool);
          updates.blurEnabled = true;
        }

        // 시즌 배경 꾸밈 자동 적용
        const seasonDecos = KEYWORD_DECO_MAP[seasonId];
        if (seasonDecos && seasonDecos.length > 0) {
          updates.bgDecorationType = seasonDecos[Math.floor(Math.random() * seasonDecos.length)];
        }

        // 그래픽 에셋: 시즌 조합 풀 (비중 높음) + 범용 혼합
        const dynAssets = dynamicAssetsRef.current;
        const comboKey = `${kwId}_${seasonId}`;
        const dCombo = dynAssets[comboKey] || [];
        const sCombo = THEME_MAIN_ASSETS[comboKey] || [];
        const dKw = dynAssets[kwId] || [];
        const sKw = THEME_MAIN_ASSETS[kwId] || [];
        const baseKw = dKw.length > 0 ? dKw : sKw.length > 0 ? sKw : COMMON_ASSETS;
        const comboAssets = dCombo.length > 0 ? dCombo : sCombo;
        const graphicPool = comboAssets.length > 0
          ? [...comboAssets, ...comboAssets, ...comboAssets, ...baseKw]
          : baseKw;
        updates.mainGraphicUrl = pickRandom(graphicPool);
        let second = pickRandom(graphicPool);
        if (graphicPool.length > 1) {
          let attempts = 0;
          while (second === updates.mainGraphicUrl && attempts < 10) { second = pickRandom(graphicPool); attempts++; }
        }
        updates.mainGraphicUrl2 = second;
      } else if (kwId && !seasonId) {
        // 시즌 강조 해제 → 키워드 기본으로 복원
        Object.assign(updates, pickAllForKeyword(kwId, null));
      }

      return { ...prev, ...updates };
    });
  }, []);

  /* ── Reroll 소구점: 메인 에셋 + 배경 다시 뽑기 (키워드 기준) ── */
  const rerollTheme = useCallback(() => {
    // 먼저 updates를 계산하고, 이미지 로드 완료 후 state 일괄 적용
    const kwId = state.selectedKeywords[0];
    if (!kwId) return;
    const updates = pickAllForKeyword(kwId, state.seasonAccent);
    waitForImages([updates.mainGraphicUrl, updates.mainGraphicUrl2, updates.blurBgUrl]).then(() => {
      setState((prev) => ({ ...prev, ...updates }));
    });
  }, [state.selectedKeywords, state.seasonAccent]);

  /* ── Reroll 시즌: 배경만 다시 뽑기 (시즌 강조 기준) ── */
  const rerollSeasonAccent = useCallback(() => {
    const seasonId = state.seasonAccent;
    if (!seasonId) return;
    const updates: Partial<BannerState> = {};

    const bgTheme = pickRandomTheme([seasonId]);
    if (bgTheme) {
      Object.assign(updates, applyBgTheme(bgTheme));
      const angles = [0, 45, 90, 135, 180, 225, 270, 315];
      updates.backgroundGradientAngle = angles[Math.floor(Math.random() * angles.length)];
    }

    const blurPool = SEASON_BLUR_ASSETS[seasonId];
    if (blurPool) {
      updates.blurBgUrl = pickRandom(blurPool);
      updates.blurEnabled = true;
    }

    const seasonDecos = KEYWORD_DECO_MAP[seasonId];
    if (seasonDecos) {
      updates.bgDecorationType = seasonDecos[Math.floor(Math.random() * seasonDecos.length)];
    }

    waitForImages([updates.blurBgUrl]).then(() => {
      setState((prev) => ({ ...prev, ...updates }));
    });
  }, [state.seasonAccent]);

  /* ── Clear all keywords ── */
  const clearKeywords = useCallback(() => {
    setState((prev) => ({ ...prev, selectedKeywords: [] }));
  }, []);

  /* ── Badge ── */
  const updateBadge = useCallback((partial: Partial<BadgeSettings>) => {
    setState((prev) => ({ ...prev, badge: { ...prev.badge, ...partial } }));
  }, []);

  const setGraphicImageUrl = useCallback((graphicImageUrl: string | null) => {
    setState((prev) => ({ ...prev, graphicImageUrl }));
  }, []);

  const setMainGraphicUrl = useCallback((mainGraphicUrl: string | null) => {
    setState((prev) => ({ ...prev, mainGraphicUrl }));
  }, []);

  const setMainGraphicUrl2 = useCallback((mainGraphicUrl2: string | null) => {
    setState((prev) => ({ ...prev, mainGraphicUrl2 }));
  }, []);

  const setBlurBgUrl = useCallback((blurBgUrl: string | null) => {
    setState((prev) => ({ ...prev, blurBgUrl }));
  }, []);

  const setBlurEnabled = useCallback((blurEnabled: boolean) => {
    setState((prev) => ({ ...prev, blurEnabled }));
  }, []);

  const setBgDecorationType = useCallback((bgDecorationType: BannerState['bgDecorationType']) => {
    setState((prev) => ({ ...prev, bgDecorationType }));
  }, []);

  const setBgDecorationUrl = useCallback((bgDecorationUrl: string | null) => {
    setState((prev) => ({ ...prev, bgDecorationUrl }));
  }, []);

  const setBgDecorationOpacity = useCallback((bgDecorationOpacity: number) => {
    setState((prev) => ({ ...prev, bgDecorationOpacity }));
  }, []);

  /* ── Image mode ── */
  const updateImageSettings = useCallback((partial: Partial<ImageModeSettings>) => {
    setState((prev) => ({
      ...prev,
      imageSettings: { ...prev.imageSettings, ...partial },
    }));
  }, []);

  /* ── Per-banner settings (active instance 래퍼) ── */
  const updateInstanceSettings = useCallback((instanceId: string, partial: Partial<AnyBannerSettings>) => {
    setState((prev) => ({
      ...prev,
      instances: prev.instances.map((inst) =>
        inst.id === instanceId ? { ...inst, settings: { ...inst.settings, ...partial } } : inst
      ),
    }));
  }, []);

  // 기존 API 호환 래퍼: activeSettingsPanel에 해당하는 인스턴스를 업데이트
  const updateRolling = useCallback((partial: Partial<RollingBannerSettings>) => {
    setState((prev) => {
      const id = prev.activeSettingsPanel;
      if (!id) return prev;
      return { ...prev, instances: prev.instances.map((inst) =>
        inst.id === id ? { ...inst, settings: { ...inst.settings, ...partial } } : inst
      ) };
    });
  }, []);

  const updateBm = useCallback((partial: Partial<BmBannerSettings>) => {
    setState((prev) => {
      const id = prev.activeSettingsPanel;
      if (!id) return prev;
      return { ...prev, instances: prev.instances.map((inst) =>
        inst.id === id ? { ...inst, settings: { ...inst.settings, ...partial } } : inst
      ) };
    });
  }, []);

  const updatePopup = useCallback((partial: Partial<PopupBannerSettings>) => {
    setState((prev) => {
      const id = prev.activeSettingsPanel;
      if (!id) return prev;
      return { ...prev, instances: prev.instances.map((inst) =>
        inst.id === id ? { ...inst, settings: { ...inst.settings, ...partial } } : inst
      ) };
    });
  }, []);

  const updateContent = useCallback((partial: Partial<ContentBannerSettings>) => {
    setState((prev) => {
      const id = prev.activeSettingsPanel;
      if (!id) return prev;
      return { ...prev, instances: prev.instances.map((inst) =>
        inst.id === id ? { ...inst, settings: { ...inst.settings, ...partial } } : inst
      ) };
    });
  }, []);

  /* ── Instance management ── */
  const duplicateInstance = useCallback((instanceId: string) => {
    setState((prev) => {
      const srcIdx = prev.instances.findIndex((i) => i.id === instanceId);
      if (srcIdx < 0) return prev;
      const src = prev.instances[srcIdx];
      const sameTypeCount = prev.instances.filter((i) => i.type === src.type).length;
      const config = BANNER_TYPES.find((t) => t.type === src.type);
      const newInst: BannerInstance = {
        id: `${src.type}-${Date.now()}`,
        type: src.type,
        isOriginal: false,
        label: `${config?.label || src.type} (${sameTypeCount + 1})`,
        enabled: true,
        settings: JSON.parse(JSON.stringify(src.settings)),
      };
      const instances = [...prev.instances];
      instances.splice(srcIdx + 1, 0, newInst);
      return { ...prev, instances };
    });
  }, []);

  const removeInstance = useCallback((instanceId: string) => {
    setState((prev) => ({
      ...prev,
      instances: prev.instances.filter((i) => i.id !== instanceId || i.isOriginal),
      activeSettingsPanel: prev.activeSettingsPanel === instanceId ? null : prev.activeSettingsPanel,
    }));
  }, []);

  /* ── Settings panel toggle ── */
  const toggleSettingsPanel = useCallback((instanceId: string) => {
    setState((prev) => ({
      ...prev,
      activeSettingsPanel: prev.activeSettingsPanel === instanceId ? null : instanceId,
    }));
  }, []);

  const closeSettingsPanel = useCallback(() => {
    setState((prev) => ({ ...prev, activeSettingsPanel: null }));
  }, []);

  const loadState = useCallback((savedState: BannerState) => {
    const defaults = DEFAULT_STATE;
    const patched: any = {
      ...defaults,
      ...savedState,
      activeSettingsPanel: null,
      rolling: { ...defaults.rolling, ...savedState.rolling },
      bm: { ...defaults.bm, ...savedState.bm },
      popup: { ...defaults.popup, ...savedState.popup },
      content: { ...defaults.content, ...savedState.content },
    };
    // 이전 버전 호환: instances 없으면 기존 필드에서 마이그레이션
    if (!patched.instances) {
      patched.instances = [
        { id: 'rolling-0', type: 'rolling', isOriginal: true, label: '상단 롤링 배너', enabled: patched.enabledBanners?.rolling ?? true, settings: { ...patched.rolling } },
        { id: 'bm-0', type: 'bm', isOriginal: true, label: 'BM 배너', enabled: patched.enabledBanners?.bm ?? true, settings: { ...patched.bm } },
        { id: 'popup-0', type: 'popup', isOriginal: true, label: '이미지 팝업', enabled: patched.enabledBanners?.popup ?? true, settings: { ...patched.popup } },
        { id: 'content-0', type: 'content', isOriginal: true, label: '컨텐츠 팝업', enabled: patched.enabledBanners?.content ?? true, settings: { ...patched.content } },
      ];
    } else {
      // 기존 instances 의 settings 에 누락된 필드(imageOverride 등) 기본값 보정
      patched.instances = patched.instances.map((inst: any) => ({
        ...inst,
        settings: { ...getDefaultSettingsForType(inst.type), ...inst.settings },
      }));
    }
    // 불러오기 시점의 상태를 히스토리 시작점으로 초기화 (이전 세션 undo 방지)
    historyRef.current = [patched as BannerState];
    historyIdxRef.current = 0;
    isTimeTravelRef.current = true;
    setState(patched as BannerState);
    bumpHistoryVersion();
  }, [bumpHistoryVersion]);

  const toggleBannerEnabled = useCallback((instanceId: string) => {
    setState((prev) => ({
      ...prev,
      instances: prev.instances.map((inst) =>
        inst.id === instanceId ? { ...inst, enabled: !inst.enabled } : inst
      ),
    }));
  }, []);

  // 초기 로드 시 랜덤 키워드 자동 선택 → 배경/그래픽 전부 세팅
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    const randomKw = KEYWORDS[Math.floor(Math.random() * KEYWORDS.length)];
    if (randomKw) {
      setState((prev) => ({
        ...prev,
        selectedKeywords: [randomKw.id],
        ...pickAllForKeyword(randomKw.id, null),
      }));
    }
  }, []);

  return {
    state,
    canvasRefs,
    setCanvasRef,
    setMode,
    setTitle,
    setSubtitle,
    setBackgroundColor,
    setGraphicAsset,
    setTextColor,
    setHighlightColor,
    rerollHighlightColor,
    setBackgroundType,
    setBackgroundGradientId,
    setBackgroundGradientAngle,
    setGradientColors,
    setGradientFrom,
    setGradientTo,
    toggleKeyword,
    setSeasonAccent,
    rerollTheme,
    rerollSeasonAccent,
    clearKeywords,
    updateBadge,
    setGraphicImageUrl,
    setMainGraphicUrl,
    setMainGraphicUrl2,
    setBlurBgUrl,
    setBlurEnabled,
    setBgDecorationType,
    setBgDecorationUrl,
    setBgDecorationOpacity,
    updateImageSettings,
    updateRolling,
    updateBm,
    updatePopup,
    updateContent,
    toggleSettingsPanel,
    toggleBannerEnabled,
    closeSettingsPanel,
    loadState,
    undo,
    redo,
    canUndo,
    canRedo,
    dynamicAssets,
    duplicateInstance,
    removeInstance,
    updateInstanceSettings,
    setState,
  };
}

export type BannerStore = ReturnType<typeof useBannerStore>;
