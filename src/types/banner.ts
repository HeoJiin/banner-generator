/* ───────────────────────── Banner Types v3.0 ───────────────────────── */

export type BannerType = 'rolling' | 'bm' | 'popup' | 'content';
export type BannerMode = 'graphic' | 'image';

export interface BannerTypeConfig {
  type: BannerType;
  label: string;
  description: string;
  width: number;
  height: number;
}

export const BANNER_TYPES: BannerTypeConfig[] = [
  { type: 'rolling', label: '상단 롤링 배너', description: '파트너센터 상단 띠배너', width: 1330, height: 128 },
  { type: 'bm', label: 'BM 배너', description: '파트너센터 BM 배너', width: 665, height: 146 },
  { type: 'popup', label: '이미지 팝업', description: '파트너센터 진입 시 정사각형 팝업', width: 520, height: 520 },
  { type: 'content', label: '컨텐츠 팝업', description: '도메인 진입 시 가로형 팝업', width: 1000, height: 600 },
];

/* ───────────────────────── Shared Option Types ───────────────────────── */

export type TextAlign = 'left' | 'center' | 'right';
export type SubTextPosition = 'top' | 'bottom';
export type ObjectPlacement = 'left' | 'right' | 'both' | 'none';
export type GradientPreset = 'black' | 'white' | 'custom';
export type BgDecorationType = 'none' | 'blur' | 'confetti' | 'confetti2' | 'confetti3' | 'confetti4' | 'winter' | 'winter2' | 'winter3' | 'winter4' | 'flower1' | 'flower2' | 'flower3' | 'tree' | 'sandcastle' | 'tube' | 'wave' | 'leaves' | 'maple' | 'berries' | 'arrows';

export type BgDecorationCategory = 'none' | 'winter' | 'flower' | 'summer' | 'autumn' | 'confetti';

export interface BgDecoVariation {
  type: BgDecorationType;
  label: string;
  /** 팝업 썸네일 경로 (미리보기용) */
  thumbnail: string;
}

export interface BgDecoCategory {
  category: BgDecorationCategory;
  label: string;
  variations: BgDecoVariation[];
}

export const BG_DECO_CATEGORIES: BgDecoCategory[] = [
  { category: 'none', label: '없음', variations: [] },
  {
    category: 'winter', label: '겨울', variations: [
      { type: 'winter', label: '겨울 1', thumbnail: '/assets/backgrounds/winter-01-popup.webp' },
      { type: 'winter2', label: '겨울 2', thumbnail: '/assets/backgrounds/winter-02-popup.webp' },
      { type: 'winter3', label: '겨울 3', thumbnail: '/assets/backgrounds/winter-03-popup.webp' },
      { type: 'winter4', label: '겨울 4', thumbnail: '/assets/backgrounds/winter-04-popup.webp' },
    ],
  },
  {
    category: 'flower', label: '꽃', variations: [
      { type: 'flower1', label: '꽃 1', thumbnail: '/assets/backgrounds/flower-01-popup.webp' },
      { type: 'flower2', label: '꽃 2', thumbnail: '/assets/backgrounds/flower-02-popup.webp' },
      { type: 'flower3', label: '꽃 3', thumbnail: '/assets/backgrounds/flower-03-popup.webp' },
    ],
  },
  {
    category: 'summer', label: '여름', variations: [
      { type: 'tree', label: '나무', thumbnail: '/assets/backgrounds/tree-01-popup.webp' },
      { type: 'sandcastle', label: '모래성', thumbnail: '/assets/backgrounds/sandcastle-popup.webp' },
      { type: 'tube', label: '튜브', thumbnail: '/assets/backgrounds/tube-popup.webp' },
      { type: 'wave', label: '파도', thumbnail: '/assets/backgrounds/wave-popup.webp' },
    ],
  },
  {
    category: 'autumn', label: '가을', variations: [
      { type: 'leaves', label: '낙엽', thumbnail: '/assets/backgrounds/leaves-01-popup.webp' },
      { type: 'maple', label: '단풍', thumbnail: '/assets/backgrounds/maple-popup.webp' },
      { type: 'berries', label: '열매', thumbnail: '/assets/backgrounds/berry-popup.webp' },
    ],
  },
  {
    category: 'confetti', label: '컨페티', variations: [
      { type: 'confetti', label: '컨페티 1', thumbnail: '/assets/backgrounds/confetti-01-popup.webp' },
      { type: 'confetti2', label: '컨페티 2', thumbnail: '/assets/backgrounds/confetti-02-popup.webp' },
      { type: 'confetti3', label: '컨페티 3', thumbnail: '/assets/backgrounds/confetti-03-popup.webp' },
      { type: 'confetti4', label: '컨페티 4', thumbnail: '/assets/backgrounds/confetti-04-popup.webp' },
    ],
  },
];

/* ───────────────────────── BM Variant (10종) ───────────────────────── */

export interface BmVariant {
  id: number;
  label: string;
  textAlign: TextAlign;
  subTextCount: 1 | 2;
  objectPlacement: ObjectPlacement;
  pagination: boolean;
}

export const BM_VARIANTS: BmVariant[] = [
  { id: 2, label: '텍스트 중앙', textAlign: 'center', subTextCount: 2, objectPlacement: 'none', pagination: false },
];

/* ───────────────────────── Graphic Adjust (그래픽 모드 미세 조정) ───────────────────────── */

export interface GraphicAdjust {
  scale: number;    // 0.85 ~ 1.0, default 1.0
  offsetX: number;  // -20 ~ +20, default 0
  offsetY: number;  // -20 ~ +20, default 0
}

export const DEFAULT_GRAPHIC_ADJUST: GraphicAdjust = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
};

/* ───────────────────────── Per-Banner Settings ───────────────────────── */

/** 이미지형 전용 배너별 조절값 */
export type ImageFitMode = 'cover' | 'contain';

export interface ImageOverride {
  gradientSpread: number; // 0~100, 그라데이션 덮는 영역
  areaScale: number;      // 0.5~1.5, 이미지 영역 크기 배율
  offsetX: number;        // -200~200 (px), 이미지 수평 이동
  offsetY: number;        // -200~200 (px), 이미지 수직 이동
  fitMode: ImageFitMode;  // 'cover'=영역 꽉 채움(잘림 허용), 'contain'=원본 비율 유지
}

export const DEFAULT_IMAGE_OVERRIDE: ImageOverride = {
  gradientSpread: 50, areaScale: 1, offsetX: 0, offsetY: 0, fitMode: 'cover',
};

/** 4개 BannerSettings 가 공통으로 갖는 필드 */
export interface CommonBannerSettings {
  backgroundColorOverride: string | null;
  hideBadge: boolean;
  titleOverride: string | null;
  subtitleOverride: string | null;
  mainGraphicOverride: string | null;
  imageOverride: ImageOverride;
}

export interface RollingBannerSettings {
  textAlign: TextAlign;
  subTextPosition: SubTextPosition;
  objectPlacement: ObjectPlacement;
  backgroundColorOverride: string | null;
  hideDecoration: boolean;
  hideBadge: boolean;
  titleOverride: string | null;
  subtitleOverride: string | null;
  mainGraphicOverride: string | null;
  imageOverride: ImageOverride;
}

export interface BmBannerSettings {
  variantId: number;
  subTextPosition: SubTextPosition;
  objectPlacement: ObjectPlacement;
  subtitle2: string;
  backgroundColorOverride: string | null;
  hideDecoration: boolean;
  hideBadge: boolean;
  titleOverride: string | null;
  subtitleOverride: string | null;
  mainGraphicOverride: string | null;
  imageOverride: ImageOverride;
}

export interface PopupBannerSettings {
  subTextPosition: SubTextPosition;
  subtitleTop: string;
  subtitleBottom: string;
  ctaText: string;
  ctaColor: string;
  noticeEnabled: boolean;
  notice: string;
  backgroundColorOverride: string | null;
  hideBadge: boolean;
  titleOverride: string | null;
  subtitleOverride: string | null;
  mainGraphicOverride: string | null;
  imageOverride: ImageOverride;
  graphicAdjust: GraphicAdjust;
}

export interface ContentBannerSettings {
  subTextPosition: SubTextPosition;
  subtitleTop: string;
  subtitleBottom: string;
  backgroundColorOverride: string | null;
  hideBadge: boolean;
  titleOverride: string | null;
  subtitleOverride: string | null;
  mainGraphicOverride: string | null;
  imageOverride: ImageOverride;
  graphicAdjust: GraphicAdjust;
}

/* ───────────────────────── Image Mode Settings ───────────────────────── */

export interface ImageModeSettings {
  imageDataUrl: string | null;
  gradientPreset: GradientPreset;
  gradientCustomColor: string;
  gradientOpacity: number; // 40~100
  imageBaseColor: string; // 이미지에서 자동 추출된 배경/그라데이션 색상
  imagePalette: string[]; // 이미지에서 추출된 6색 팔레트
  graphicAssetUrl: string | null; // 이미지형 왼쪽 그래픽 에셋 URL
}

/* ───────────────────────── Banner Instance ───────────────────────── */

export type AnyBannerSettings = RollingBannerSettings | BmBannerSettings | PopupBannerSettings | ContentBannerSettings;

export interface BannerInstance {
  id: string;
  type: BannerType;
  isOriginal: boolean;
  label: string;
  enabled: boolean;
  settings: AnyBannerSettings;
}

/** 렌더링 전에 인스턴스의 settings를 state에 주입 — 템플릿 무변경 */
export function buildStateForInstance(state: BannerState, instance: BannerInstance): BannerState {
  const s = instance.settings;
  const graphicOverride = 'mainGraphicOverride' in s ? s.mainGraphicOverride : null;
  const hideBadge = 'hideBadge' in s ? s.hideBadge : false;
  return {
    ...state,
    [instance.type]: s,
    ...(graphicOverride ? { mainGraphicUrl: graphicOverride } : {}),
    ...(hideBadge ? { badge: { ...state.badge, enabled: false } } : {}),
  };
}

export function getDefaultSettingsForType(type: BannerType): AnyBannerSettings {
  switch (type) {
    case 'rolling': return { ...DEFAULT_ROLLING };
    case 'bm': return { ...DEFAULT_BM };
    case 'popup': return { ...DEFAULT_POPUP };
    case 'content': return { ...DEFAULT_CONTENT };
  }
}

/* ───────────────────────── Global Banner Store State ───────────────────────── */

export interface BannerState {
  mode: BannerMode;
  title: string;
  subtitle: string;
  selectedKeywords: string[]; // keyword id (1개)
  seasonAccent: string | null; // 시즌 강조 (spring/summer/autumn/winter) — 선택사항
  badge: BadgeSettings;
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundGradientId: string | null;
  backgroundGradientAngle: number;
  backgroundGradientFrom: string;
  backgroundGradientTo: string;
  textColor: string;
  highlightColor: string;
  graphicAsset: string;
  graphicImageUrl: string | null;
  mainGraphicUrl: string | null;
  mainGraphicUrl2: string | null;
  blurBgUrl: string | null;
  blurEnabled: boolean;
  bgDecorationType: BgDecorationType;
  bgDecorationUrl: string | null;
  bgDecorationOpacity: number;

  imageSettings: ImageModeSettings;

  // 템플릿 호환용 (buildStateForInstance가 덮어씀)
  rolling: RollingBannerSettings;
  bm: BmBannerSettings;
  popup: PopupBannerSettings;
  content: ContentBannerSettings;

  instances: BannerInstance[];
  activeSettingsPanel: string | null; // instance id
}

/* ───────────────────────── Defaults ───────────────────────── */

export type ColorMode = 'dark' | 'light';

const DEFAULT_ROLLING: RollingBannerSettings = {
  textAlign: 'center', subTextPosition: 'top', objectPlacement: 'both',
  backgroundColorOverride: null, hideDecoration: false, hideBadge: false,
  titleOverride: null, subtitleOverride: null, mainGraphicOverride: null,
  imageOverride: { ...DEFAULT_IMAGE_OVERRIDE },
};
const DEFAULT_BM: BmBannerSettings = {
  variantId: 2, subTextPosition: 'top', objectPlacement: 'both', subtitle2: '',
  backgroundColorOverride: null, hideDecoration: false, hideBadge: false,
  titleOverride: null, subtitleOverride: null, mainGraphicOverride: null,
  imageOverride: { ...DEFAULT_IMAGE_OVERRIDE },
};
const DEFAULT_POPUP: PopupBannerSettings = {
  subTextPosition: 'top', subtitleTop: '', subtitleBottom: '',
  ctaText: '자세히 보기', ctaColor: '#000000', noticeEnabled: true,
  notice: '이벤트 내용은 변경될 수 있습니다', backgroundColorOverride: null,
  hideBadge: false, titleOverride: null, subtitleOverride: null, mainGraphicOverride: null,
  imageOverride: { ...DEFAULT_IMAGE_OVERRIDE },
  graphicAdjust: { ...DEFAULT_GRAPHIC_ADJUST },
};
const DEFAULT_CONTENT: ContentBannerSettings = {
  subTextPosition: 'top', subtitleTop: '', subtitleBottom: '',
  backgroundColorOverride: null, hideBadge: false,
  titleOverride: null, subtitleOverride: null, mainGraphicOverride: null,
  imageOverride: { ...DEFAULT_IMAGE_OVERRIDE },
  graphicAdjust: { ...DEFAULT_GRAPHIC_ADJUST },
};

export const DEFAULT_STATE: BannerState = {
  mode: 'graphic',
  title: '타이틀을 입력하세요',
  subtitle: '서브타이틀을 입력하세요',
  selectedKeywords: [],
  seasonAccent: null,
  badge: { enabled: false, text: '', position: 'top-left' },
  backgroundType: 'color',
  backgroundColor: '#1F3522',
  backgroundGradientId: null,
  backgroundGradientAngle: 180,
  backgroundGradientFrom: '#000000',
  backgroundGradientTo: '#666666',
  textColor: '#FFFFFF',
  highlightColor: '#FFD700',
  graphicAsset: 'circle',
  graphicImageUrl: null,
  mainGraphicUrl: null,
  mainGraphicUrl2: null,
  blurBgUrl: null,
  blurEnabled: false,
  bgDecorationType: 'none',
  bgDecorationUrl: null,
  bgDecorationOpacity: 80,

  imageSettings: {
    imageDataUrl: null,
    gradientPreset: 'black',
    gradientCustomColor: '#000000',
    gradientOpacity: 60,
    imageBaseColor: '#000000',
    imagePalette: [],
    graphicAssetUrl: null,
  },

  rolling: DEFAULT_ROLLING,
  bm: DEFAULT_BM,
  popup: DEFAULT_POPUP,
  content: DEFAULT_CONTENT,

  instances: [
    { id: 'rolling-0', type: 'rolling', isOriginal: true, label: '상단 롤링 배너', enabled: true, settings: { ...DEFAULT_ROLLING } },
    { id: 'bm-0', type: 'bm', isOriginal: true, label: 'BM 배너', enabled: true, settings: { ...DEFAULT_BM } },
    { id: 'popup-0', type: 'popup', isOriginal: true, label: '이미지 팝업', enabled: true, settings: { ...DEFAULT_POPUP } },
    { id: 'content-0', type: 'content', isOriginal: true, label: '컨텐츠 팝업', enabled: true, settings: { ...DEFAULT_CONTENT } },
  ],
  activeSettingsPanel: null,
};

/* ───────────────────────── Preset Colors ───────────────────────── */

export const PRESET_COLORS = [
  '#000000',
  '#B83D3D', '#C75B2A', '#C79A2A', '#3D8B3D',
  '#2A7AC7', '#3D3DB8', '#7B3DB8', '#1F3522',
  '#2D3436', '#1A1A2E',
  '#F5C6C6', '#F5D6C6', '#F5ECC6', '#C6F5C6',
  '#C6D6F5', '#D6C6F5',
];

export type BackgroundType = 'color' | 'gradient';

export interface GradientDef {
  id: string;
  label: string;
  from: string;
  to: string;
  css: string;
  textColor: string;
}

export const PRESET_GRADIENTS: GradientDef[] = [
  { id: 'dark-purple', label: '다크 퍼플', from: '#12001a', to: '#45184a', css: '', textColor: '#FFFFFF' },
  { id: 'dark-gray', label: '다크 그레이', from: '#0e0e0e', to: '#383838', css: '', textColor: '#FFFFFF' },
  { id: 'coral-yellow', label: '코랄 옐로', from: '#f07070', to: '#f5c050', css: '', textColor: '#FFFFFF' },
  { id: 'lime-mint', label: '라임 민트', from: '#c5e855', to: '#60eba0', css: '', textColor: '#1A1A1A' },
  { id: 'cyan-blue', label: '시안 블루', from: '#45d8c8', to: '#2878c8', css: '', textColor: '#FFFFFF' },
  { id: 'blue-purple', label: '블루 퍼플', from: '#4880e8', to: '#9060e0', css: '', textColor: '#FFFFFF' },
  { id: 'purple-pink', label: '퍼플 핑크', from: '#8860e0', to: '#d840c0', css: '', textColor: '#FFFFFF' },
  { id: 'pink-coral', label: '핑크 코랄', from: '#e050b0', to: '#f07070', css: '', textColor: '#FFFFFF' },
];

/** Build gradient CSS from 2 colors + angle */
export function buildGradientCss(from: string, to: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${from} 0%, ${to} 100%)`;
}

// Pre-fill css for chip previews
PRESET_GRADIENTS.forEach((g) => {
  g.css = buildGradientCss(g.from, g.to, 180);
});

/** Returns true if the color is light (text should be dark) */
export function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.55;
}

/* ───────────────────────── Keywords & Themes ───────────────────────── */

export interface Keyword {
  id: string;
  label: string;
}


export const KEYWORDS: Keyword[] = [
  { id: 'benefit', label: '혜택' },
  { id: 'info', label: '정보 제공' },
  { id: 'growth', label: '성장' },
  { id: 'urgent', label: '긴급' },
  { id: 'hundred', label: '100원' },
];

export const SEASON_ACCENTS = [
  { id: 'spring', label: '봄' },
  { id: 'summer', label: '여름' },
  { id: 'autumn', label: '가을' },
  { id: 'winter', label: '겨울' },
  { id: 'christmas', label: '크리스마스' },
  { id: 'newyear', label: '신년' },
  { id: 'chuseok', label: '추석' },
];

export type BadgePosition = 'top-left' | 'top-right';

export interface BadgeSettings {
  enabled: boolean;
  text: string;
  position: BadgePosition;
}

/** Theme variation for a keyword */
export interface ThemeVariation {
  backgroundColor: string;
  backgroundType: BackgroundType;
  gradientFrom?: string;
  gradientTo?: string;
  textColor: string;
  graphicAsset: string;
  weight?: number; // 가중치 (기본 1, 높을수록 자주 뽑힘)
}

/** 소구점 키워드 공유 배경 팔레트 (긴급 제외) — 혜택 기반 확장 */
const SHARED_KEYWORD_BACKGROUNDS: ThemeVariation[] = [
  // ── 그라데이션: 블루·시안 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#00BCD4', gradientFrom: '#00BCD4', gradientTo: '#1565C0', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#0288D1', gradientFrom: '#0288D1', gradientTo: '#00838F', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#0D47A1', gradientFrom: '#0D47A1', gradientTo: '#00ACC1', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#01579B', gradientFrom: '#01579B', gradientTo: '#4FC3F7', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },

  // ── 그라데이션: 블루·퍼플 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#1976D2', gradientFrom: '#1976D2', gradientTo: '#7E57C2', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#1565C0', gradientFrom: '#1565C0', gradientTo: '#AB47BC', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#283593', gradientFrom: '#283593', gradientTo: '#5C6BC0', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },

  // ── 그라데이션: 퍼플·핑크 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#7B1FA2', gradientFrom: '#7B1FA2', gradientTo: '#F06292', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#8E24AA', gradientFrom: '#8E24AA', gradientTo: '#EC407A', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#512DA8', gradientFrom: '#512DA8', gradientTo: '#E040FB', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#7B1FA2', gradientFrom: '#7B1FA2', gradientTo: '#1976D2', textColor: '#FFFFFF', graphicAsset: 'square', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#EC407A', gradientFrom: '#EC407A', gradientTo: '#42A5F5', textColor: '#FFFFFF', graphicAsset: 'square', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#EC407A', gradientFrom: '#EC407A', gradientTo: '#7E57C2', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#AD1457', gradientFrom: '#AD1457', gradientTo: '#6A1B9A', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },

  // ── 그라데이션: 레드·오렌지 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#D32F2F', gradientFrom: '#D32F2F', gradientTo: '#FF9800', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#C62828', gradientFrom: '#C62828', gradientTo: '#EC407A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#E65100', gradientFrom: '#E65100', gradientTo: '#FFEB3B', textColor: '#3E2723', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#B71C1C', gradientFrom: '#B71C1C', gradientTo: '#F44336', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#D84315', gradientFrom: '#D84315', gradientTo: '#FFB74D', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },

  // ── 그라데이션: 골드·옐로 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#F9A825', gradientFrom: '#F9A825', gradientTo: '#EF6C00', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#FF8F00', gradientFrom: '#FF8F00', gradientTo: '#FFD54F', textColor: '#3E2723', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#F57F17', gradientFrom: '#F57F17', gradientTo: '#FFF176', textColor: '#3E2723', graphicAsset: 'star', weight: 2 },

  // ── 그라데이션: 그린·틸 계열 ──
  { backgroundType: 'gradient', backgroundColor: '#00897B', gradientFrom: '#00897B', gradientTo: '#26C6DA', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#2E7D32', gradientFrom: '#2E7D32', gradientTo: '#66BB6A', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#004D40', gradientFrom: '#004D40', gradientTo: '#00BFA5', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },

  // ── 단색: 비비드 ──
  { backgroundColor: '#1565C0', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#6A1B9A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 2 },
  { backgroundColor: '#D32F2F', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#00838F', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 2 },
  { backgroundColor: '#2E7D32', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 2 },
  { backgroundColor: '#E65100', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
  { backgroundColor: '#AD1457', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 2 },

  // ── 단색: 다크 ──
  { backgroundColor: '#121212', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#1A1A2E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#0D2848', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#1B0A2E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 2 },

  // ── 미색: 파스텔 단색 ──
  { backgroundColor: '#E0F2F1', backgroundType: 'color', textColor: '#004D40', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#E0F7FA', backgroundType: 'color', textColor: '#006064', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#EDE7F6', backgroundType: 'color', textColor: '#311B92', graphicAsset: 'square', weight: 3 },
  { backgroundColor: '#FFE0B2', backgroundType: 'color', textColor: '#5D2600', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#F3E5F5', backgroundType: 'color', textColor: '#4A148C', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#FCE4EC', backgroundType: 'color', textColor: '#880E4F', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#FFF8E1', backgroundType: 'color', textColor: '#5D4037', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#E8EAF6', backgroundType: 'color', textColor: '#1A237E', graphicAsset: 'square', weight: 3 },
  { backgroundColor: '#E1F5FE', backgroundType: 'color', textColor: '#01579B', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#F1F8E9', backgroundType: 'color', textColor: '#33691E', graphicAsset: 'circle', weight: 3 },
  { backgroundColor: '#FBE9E7', backgroundType: 'color', textColor: '#BF360C', graphicAsset: 'star', weight: 3 },
  { backgroundColor: '#F8BBD0', backgroundType: 'color', textColor: '#880E4F', graphicAsset: 'circle', weight: 3 },

  // ── 미색: 파스텔 그라데이션 ──
  { backgroundType: 'gradient', backgroundColor: '#BBDEFB', gradientFrom: '#BBDEFB', gradientTo: '#B2DFDB', textColor: '#0D2848', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#F8BBD0', gradientFrom: '#F8BBD0', gradientTo: '#E1BEE7', textColor: '#4A148C', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#C8E6C9', gradientFrom: '#C8E6C9', gradientTo: '#B2DFDB', textColor: '#1B5E20', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#FFE0B2', gradientFrom: '#FFE0B2', gradientTo: '#FFCCBC', textColor: '#5D2600', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#E1BEE7', gradientFrom: '#E1BEE7', gradientTo: '#BBDEFB', textColor: '#311B92', graphicAsset: 'square', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#FFF9C4', gradientFrom: '#FFF9C4', gradientTo: '#FFE082', textColor: '#5D4037', graphicAsset: 'star', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#E1BEE7', textColor: '#1A237E', graphicAsset: 'circle', weight: 3 },
  { backgroundType: 'gradient', backgroundColor: '#FFCDD2', gradientFrom: '#FFCDD2', gradientTo: '#F8BBD0', textColor: '#880E4F', graphicAsset: 'circle', weight: 3 },
  // 베이비블루↔베이비핑크
  { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#F8BBD0', textColor: '#4A148C', graphicAsset: 'circle', weight: 3 },
  // 연그린↔개나리색
  { backgroundType: 'gradient', backgroundColor: '#C8E6C9', gradientFrom: '#C8E6C9', gradientTo: '#FFF176', textColor: '#33691E', graphicAsset: 'circle', weight: 3 },
  // 라벤더↔민트
  { backgroundType: 'gradient', backgroundColor: '#D1C4E9', gradientFrom: '#D1C4E9', gradientTo: '#B2DFDB', textColor: '#311B92', graphicAsset: 'circle', weight: 3 },
  // 연살구↔연노랑
  { backgroundType: 'gradient', backgroundColor: '#FFCCBC', gradientFrom: '#FFCCBC', gradientTo: '#FFF9C4', textColor: '#BF360C', graphicAsset: 'star', weight: 3 },
  // 연핑크↔연노랑 (석양)
  { backgroundType: 'gradient', backgroundColor: '#F8BBD0', gradientFrom: '#F8BBD0', gradientTo: '#FFF9C4', textColor: '#880E4F', graphicAsset: 'circle', weight: 3 },
  // 스카이↔라일락
  { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#D1C4E9', textColor: '#1A237E', graphicAsset: 'circle', weight: 3 },

  // ── 비비드 그라데이션 추가 ──
  // 코랄↔핫핑크
  { backgroundType: 'gradient', backgroundColor: '#FF7043', gradientFrom: '#FF7043', gradientTo: '#EC407A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  // 틸↔라임
  { backgroundType: 'gradient', backgroundColor: '#00897B', gradientFrom: '#00897B', gradientTo: '#C0CA33', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  // 인디고↔시안
  { backgroundType: 'gradient', backgroundColor: '#3949AB', gradientFrom: '#3949AB', gradientTo: '#00BCD4', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  // 마젠타↔오렌지
  { backgroundType: 'gradient', backgroundColor: '#D81B60', gradientFrom: '#D81B60', gradientTo: '#FF9800', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  // 블루↔그린
  { backgroundType: 'gradient', backgroundColor: '#1976D2', gradientFrom: '#1976D2', gradientTo: '#43A047', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
];

/** Keyword → variation pool (명도 다양하게) */
export const THEME_VARIATIONS: Record<string, ThemeVariation[]> = {
  // ── 시즌 (weight 미지정 = 기본 1) ──
  winter: [
    // ── 딥 네이비/포레스트 ──
    { backgroundColor: '#1B4332', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundColor: '#14213D', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#0A1628', gradientFrom: '#0A1628', gradientTo: '#3A6898', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundColor: '#0D2137', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#1A3050', gradientFrom: '#1A3050', gradientTo: '#2A5080', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#2C3E50', gradientFrom: '#2C3E50', gradientTo: '#4A6FA5', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundColor: '#1C2833', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },

    // ── 얼음/프로스트 블루 ──
    { backgroundType: 'gradient', backgroundColor: '#C8D8F0', gradientFrom: '#C8D8F0', gradientTo: '#88A8D8', textColor: '#1A2840', graphicAsset: 'tree' },
    { backgroundColor: '#B0C8E8', backgroundType: 'color', textColor: '#1A2840', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#E3F2FD', gradientFrom: '#E3F2FD', gradientTo: '#BBDEFB', textColor: '#0D47A1', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#81D4FA', textColor: '#01579B', graphicAsset: 'tree' },

    // ── 은색/눈 톤 ──
    { backgroundColor: '#E8EEF4', backgroundType: 'color', textColor: '#1A2840', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#D0DAE8', gradientFrom: '#D0DAE8', gradientTo: '#A0B8D0', textColor: '#1A2840', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#ECEFF1', gradientFrom: '#ECEFF1', gradientTo: '#CFD8DC', textColor: '#263238', graphicAsset: 'tree' },

    // ── 바이올렛/보라 야경 ──
    { backgroundType: 'gradient', backgroundColor: '#311B92', gradientFrom: '#311B92', gradientTo: '#5E35B1', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#1A237E', gradientFrom: '#1A237E', gradientTo: '#512DA8', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundColor: '#4527A0', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },

    // ── 차콜/모노 ──
    { backgroundType: 'gradient', backgroundColor: '#263238', gradientFrom: '#263238', gradientTo: '#455A64', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundColor: '#37474F', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },

    // ── 민트/아이스그린 ──
    { backgroundType: 'gradient', backgroundColor: '#B2DFDB', gradientFrom: '#B2DFDB', gradientTo: '#80CBC4', textColor: '#004D40', graphicAsset: 'tree' },
    { backgroundColor: '#004D40', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },

    // ── 오로라 (블루↔퍼플 크로스) ──
    { backgroundType: 'gradient', backgroundColor: '#0D47A1', gradientFrom: '#0D47A1', gradientTo: '#6A1B9A', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#1565C0', gradientFrom: '#1565C0', gradientTo: '#00695C', textColor: '#FFFFFF', graphicAsset: 'tree' },
  ],
  christmas: [
    // 기존
    { backgroundColor: '#1B4332', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#0A1628', gradientFrom: '#0A1628', gradientTo: '#3A6898', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#4A78C8', gradientFrom: '#4A78C8', gradientTo: '#88B0F0', textColor: '#FFFFFF', graphicAsset: 'snowman' },
    { backgroundType: 'gradient', backgroundColor: '#C8D8F0', gradientFrom: '#C8D8F0', gradientTo: '#88A8D8', textColor: '#1A2840', graphicAsset: 'gift' },
    { backgroundColor: '#B0C8E8', backgroundType: 'color', textColor: '#1A2840', graphicAsset: 'snowman' },
    { backgroundType: 'gradient', backgroundColor: '#14213D', gradientFrom: '#14213D', gradientTo: '#4A6898', textColor: '#FFFFFF', graphicAsset: 'gift' },
    // 추가 — 레드/그린/골드
    { backgroundColor: '#B71C1C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#C62828', gradientFrom: '#C62828', gradientTo: '#E53935', textColor: '#FFFFFF', graphicAsset: 'tree', weight: 3 },
    { backgroundColor: '#2E7D32', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'gift', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#1B5E20', gradientFrom: '#1B5E20', gradientTo: '#388E3C', textColor: '#FFFFFF', graphicAsset: 'tree', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#8B0000', gradientFrom: '#8B0000', gradientTo: '#1B4332', textColor: '#FFFFFF', graphicAsset: 'gift', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#BF360C', gradientFrom: '#BF360C', gradientTo: '#F9A825', textColor: '#FFFFFF', graphicAsset: 'tree', weight: 2 },
    // 겨울 배경 포함
    { backgroundColor: '#14213D', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#C8D8F0', gradientFrom: '#C8D8F0', gradientTo: '#88A8D8', textColor: '#1A2840', graphicAsset: 'gift' },
    { backgroundColor: '#E8EEF4', backgroundType: 'color', textColor: '#1A2840', graphicAsset: 'snowman' },
    { backgroundType: 'gradient', backgroundColor: '#D0DAE8', gradientFrom: '#D0DAE8', gradientTo: '#A0B8D0', textColor: '#1A2840', graphicAsset: 'gift' },
    { backgroundColor: '#0D2137', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#1A3050', gradientFrom: '#1A3050', gradientTo: '#2A5080', textColor: '#FFFFFF', graphicAsset: 'tree' },
    { backgroundType: 'gradient', backgroundColor: '#2C3E50', gradientFrom: '#2C3E50', gradientTo: '#4A6FA5', textColor: '#FFFFFF', graphicAsset: 'snowman' },
    { backgroundColor: '#1C2833', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'gift' },
  ],
  newyear: [
    // ── 레드 (전통 새해) ──
    { backgroundColor: '#D32F2F', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#B71C1C', gradientFrom: '#B71C1C', gradientTo: '#E53935', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#8B0000', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#C62828', gradientFrom: '#C62828', gradientTo: '#FF6F00', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#E65100', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },

    // ── 블랙/딥 네이비 (야경) ──
    { backgroundColor: '#1A1A2E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#121212', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundColor: '#0D0D0D', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#0D0D0D', gradientFrom: '#0D0D0D', gradientTo: '#B71C1C', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#1A1A2E', gradientFrom: '#1A1A2E', gradientTo: '#311B92', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },

    // ── 골드/옐로 (불꽃놀이) ──
    { backgroundType: 'gradient', backgroundColor: '#FF8F00', gradientFrom: '#FF8F00', gradientTo: '#FFB74D', textColor: '#3E2723', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#E53935', gradientFrom: '#E53935', gradientTo: '#FFD54F', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#F57F17', gradientFrom: '#F57F17', gradientTo: '#FFD54F', textColor: '#1A1A2E', graphicAsset: 'star', weight: 2 },
    { backgroundColor: '#B8860B', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#A67C00', gradientFrom: '#A67C00', gradientTo: '#FDD835', textColor: '#1A1A2E', graphicAsset: 'star', weight: 3 },

    // ── 퍼플/바이올렛 (야경 불꽃) ──
    { backgroundColor: '#4A148C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#311B92', gradientFrom: '#311B92', gradientTo: '#D81B60', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#6A1B9A', gradientFrom: '#6A1B9A', gradientTo: '#EC407A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundColor: '#311B92', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },

    // ── 불꽃놀이 크로스 (레드↔골드↔퍼플) ──
    { backgroundType: 'gradient', backgroundColor: '#B71C1C', gradientFrom: '#B71C1C', gradientTo: '#FFD54F', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#6A1B9A', gradientFrom: '#6A1B9A', gradientTo: '#FF8F00', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#0D47A1', gradientFrom: '#0D47A1', gradientTo: '#E53935', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },

    // ── 버건디/와인 (럭셔리) ──
    { backgroundColor: '#4A0000', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#5A0000', gradientFrom: '#5A0000', gradientTo: '#B71C1C', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  ],
  chuseok: [
    // ── 단풍 오렌지/레드 ──
    { backgroundType: 'gradient', backgroundColor: '#BF4A20', gradientFrom: '#BF4A20', gradientTo: '#F8A850', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundColor: '#BF360C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#5A2000', gradientFrom: '#5A2000', gradientTo: '#C06020', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#E65100', gradientFrom: '#E65100', gradientTo: '#8B2500', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },

    // ── 보름달 야경 (딥 네이비/블랙) ──
    { backgroundColor: '#1A1A2E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#0D0D0D', gradientFrom: '#0D0D0D', gradientTo: '#4E342E', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#1A1A2E', gradientFrom: '#1A1A2E', gradientTo: '#5A2A0A', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundColor: '#2C1810', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },

    // ── 황금빛/골드 ──
    { backgroundType: 'gradient', backgroundColor: '#E8B04B', gradientFrom: '#E8B04B', gradientTo: '#F5D0A8', textColor: '#3A2010', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#B8860B', gradientFrom: '#B8860B', gradientTo: '#E8B04B', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundColor: '#A67C00', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#F9A825', gradientFrom: '#F9A825', gradientTo: '#FDD835', textColor: '#3E2723', graphicAsset: 'leaf', weight: 2 },

    // ── 브라운/우드 (한옥 분위기) ──
    { backgroundColor: '#3E2723', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#4E342E', gradientFrom: '#4E342E', gradientTo: '#8D6E63', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundColor: '#6D4C41', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#8D6E63', gradientFrom: '#8D6E63', gradientTo: '#D7CCC8', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundColor: '#5D4037', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },

    // ── 베이지/전통 한지 톤 ──
    { backgroundColor: '#F5D0A8', backgroundType: 'color', textColor: '#4A2810', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#EFDCC0', gradientFrom: '#EFDCC0', gradientTo: '#D7CCC8', textColor: '#4E342E', graphicAsset: 'leaf', weight: 2 },
    { backgroundColor: '#EFEBE9', backgroundType: 'color', textColor: '#3E2723', graphicAsset: 'leaf', weight: 2 },

    // ── 단풍 + 보름달 크로스 ──
    { backgroundType: 'gradient', backgroundColor: '#1A1A2E', gradientFrom: '#1A1A2E', gradientTo: '#E8B04B', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#2C1810', gradientFrom: '#2C1810', gradientTo: '#BF360C', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 3 },

    // ── 와인/버건디 ──
    { backgroundColor: '#4A1A1A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
    { backgroundType: 'gradient', backgroundColor: '#6A0F0F', gradientFrom: '#6A0F0F', gradientTo: '#BF360C', textColor: '#FFFFFF', graphicAsset: 'leaf', weight: 2 },
  ],
  autumn: [
    // ── 단풍 레드/오렌지 ──
    { backgroundColor: '#BF360C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundColor: '#E65100', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#BF4A20', gradientFrom: '#BF4A20', gradientTo: '#F8A850', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#D84315', gradientFrom: '#D84315', gradientTo: '#FF8F00', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#5A2000', gradientFrom: '#5A2000', gradientTo: '#C06020', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#FF6F00', gradientFrom: '#FF6F00', gradientTo: '#FFB300', textColor: '#3A2010', graphicAsset: 'leaf' },

    // ── 베이지/샌드/크림 ──
    { backgroundType: 'gradient', backgroundColor: '#F0C090', gradientFrom: '#F0C090', gradientTo: '#D88050', textColor: '#3A2010', graphicAsset: 'leaf' },
    { backgroundColor: '#F5D0A8', backgroundType: 'color', textColor: '#4A2810', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#FFE0B2', gradientFrom: '#FFE0B2', gradientTo: '#FFCC80', textColor: '#4E342E', graphicAsset: 'leaf' },
    { backgroundColor: '#EFDCC0', backgroundType: 'color', textColor: '#4E342E', graphicAsset: 'leaf' },

    // ── 브라운/우드 ──
    { backgroundColor: '#8B4513', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundColor: '#795548', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#6D4C41', gradientFrom: '#6D4C41', gradientTo: '#A1887F', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundColor: '#4E342E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#3E2723', gradientFrom: '#3E2723', gradientTo: '#6D4C41', textColor: '#FFFFFF', graphicAsset: 'leaf' },

    // ── 머스타드/옐로 ──
    { backgroundColor: '#F57F17', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#F9A825', gradientFrom: '#F9A825', gradientTo: '#FFD54F', textColor: '#3E2723', graphicAsset: 'leaf' },
    { backgroundColor: '#FFB300', backgroundType: 'color', textColor: '#3E2723', graphicAsset: 'leaf' },

    // ── 와인/버건디 ──
    { backgroundColor: '#4A1A1A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#6A0F0F', gradientFrom: '#6A0F0F', gradientTo: '#B71C1C', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundColor: '#8E0000', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },

    // ── 올리브/카키 ──
    { backgroundType: 'gradient', backgroundColor: '#827717', gradientFrom: '#827717', gradientTo: '#AFB42B', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundColor: '#6D7A00', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'leaf' },

    // ── 단풍 크로스 그라데이션 ──
    { backgroundType: 'gradient', backgroundColor: '#BF360C', gradientFrom: '#BF360C', gradientTo: '#F9A825', textColor: '#FFFFFF', graphicAsset: 'leaf' },
    { backgroundType: 'gradient', backgroundColor: '#8B0000', gradientFrom: '#8B0000', gradientTo: '#E65100', textColor: '#FFFFFF', graphicAsset: 'leaf' },
  ],
  spring: [
    // ── 핑크/마젠타 (벚꽃) ──
    { backgroundType: 'gradient', backgroundColor: '#FF8AAE', gradientFrom: '#FF8AAE', gradientTo: '#D068D8', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#F48FB1', gradientFrom: '#F48FB1', gradientTo: '#B39DDB', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundColor: '#EC407A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FFD0E0', gradientFrom: '#FFD0E0', gradientTo: '#E0A0C8', textColor: '#4A1030', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#880E4F', gradientFrom: '#880E4F', gradientTo: '#D81B60', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundColor: '#F8BBD0', backgroundType: 'color', textColor: '#4A1030', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FCE4EC', gradientFrom: '#FCE4EC', gradientTo: '#F8BBD0', textColor: '#880E4F', graphicAsset: 'circle' },

    // ── 연두/민트 (새싹) ──
    { backgroundType: 'gradient', backgroundColor: '#80CBC4', gradientFrom: '#80CBC4', gradientTo: '#C5E1A5', textColor: '#1A3030', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#AED581', gradientFrom: '#AED581', gradientTo: '#81C784', textColor: '#1A3020', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#C8E6C9', gradientFrom: '#C8E6C9', gradientTo: '#A5D6A7', textColor: '#1B5E20', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#DCEDC8', gradientFrom: '#DCEDC8', gradientTo: '#C5E1A5', textColor: '#33691E', graphicAsset: 'circle' },
    { backgroundColor: '#7CB342', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },

    // ── 라벤더/퍼플 ──
    { backgroundType: 'gradient', backgroundColor: '#CE93D8', gradientFrom: '#CE93D8', gradientTo: '#F48FB1', textColor: '#4A148C', graphicAsset: 'circle' },
    { backgroundColor: '#E1BEE7', backgroundType: 'color', textColor: '#4A148C', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#B39DDB', gradientFrom: '#B39DDB', gradientTo: '#CE93D8', textColor: '#311B92', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#EDE7F6', gradientFrom: '#EDE7F6', gradientTo: '#D1C4E9', textColor: '#311B92', graphicAsset: 'circle' },

    // ── 파스텔 옐로/피치 ──
    { backgroundType: 'gradient', backgroundColor: '#FFF9C4', gradientFrom: '#FFF9C4', gradientTo: '#FFE082', textColor: '#5D4037', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FFECB3', gradientFrom: '#FFECB3', gradientTo: '#FFD54F', textColor: '#5D4037', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FFF3E0', gradientFrom: '#FFF3E0', gradientTo: '#FFCCBC', textColor: '#4E342E', graphicAsset: 'circle' },
    { backgroundColor: '#FFCCBC', backgroundType: 'color', textColor: '#4E342E', graphicAsset: 'circle' },

    // ── 스카이/하늘 ──
    { backgroundType: 'gradient', backgroundColor: '#E1F5FE', gradientFrom: '#E1F5FE', gradientTo: '#B3E5FC', textColor: '#01579B', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#F8BBD0', textColor: '#0D47A1', graphicAsset: 'circle' },

    // ── 봄 하늘: 핑크↔블루 크로스 ──
    { backgroundType: 'gradient', backgroundColor: '#FF80AB', gradientFrom: '#FF80AB', gradientTo: '#80D8FF', textColor: '#FFFFFF', graphicAsset: 'circle' },

    // ── 연두↔옐로 (들판) ──
    { backgroundType: 'gradient', backgroundColor: '#9CCC65', gradientFrom: '#9CCC65', gradientTo: '#FFF176', textColor: '#1B5E20', graphicAsset: 'circle' },
  ],
  summer: [
    // ── 바다/하늘 블루 ──
    { backgroundColor: '#0277BD', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#0288D1', gradientFrom: '#0288D1', gradientTo: '#4FC3F7', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#B3E5FC', gradientFrom: '#B3E5FC', gradientTo: '#4FC3F7', textColor: '#0A3050', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#004D6E', gradientFrom: '#004D6E', gradientTo: '#00ACC1', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundColor: '#80DEEA', backgroundType: 'color', textColor: '#004D40', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#01579B', gradientFrom: '#01579B', gradientTo: '#0288D1', textColor: '#FFFFFF', graphicAsset: 'circle' },

    // ── 열대/그린/틸 ──
    { backgroundType: 'gradient', backgroundColor: '#00897B', gradientFrom: '#00897B', gradientTo: '#4DB6AC', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundColor: '#00695C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#0097A7', gradientFrom: '#0097A7', gradientTo: '#80DEEA', textColor: '#00332A', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#26C6DA', gradientFrom: '#26C6DA', gradientTo: '#80CBC4', textColor: '#00332A', graphicAsset: 'circle' },
    { backgroundColor: '#006064', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#004D40', gradientFrom: '#004D40', gradientTo: '#00897B', textColor: '#FFFFFF', graphicAsset: 'circle' },

    // ── 선셋: 오렌지/코랄/핑크 ──
    { backgroundType: 'gradient', backgroundColor: '#FF6F61', gradientFrom: '#FF6F61', gradientTo: '#FFB088', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FF7043', gradientFrom: '#FF7043', gradientTo: '#FFAB91', textColor: '#2A0A00', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#F06292', gradientFrom: '#F06292', gradientTo: '#FFB199', textColor: '#4A0025', graphicAsset: 'circle' },
    { backgroundColor: '#FF8A65', backgroundType: 'color', textColor: '#3E1A00', graphicAsset: 'circle' },

    // ── 트로피컬 퍼플/바이올렛 (저녁 해변 하늘) ──
    { backgroundType: 'gradient', backgroundColor: '#7E57C2', gradientFrom: '#7E57C2', gradientTo: '#BA68C8', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#5E35B1', gradientFrom: '#5E35B1', gradientTo: '#EC407A', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#3949AB', gradientFrom: '#3949AB', gradientTo: '#AB47BC', textColor: '#FFFFFF', graphicAsset: 'circle' },
    { backgroundColor: '#6A1B9A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'circle' },

    // ── 시트러스 옐로/라임 ──
    { backgroundType: 'gradient', backgroundColor: '#FDD835', gradientFrom: '#FDD835', gradientTo: '#FFF176', textColor: '#4A3800', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#C0CA33', gradientFrom: '#C0CA33', gradientTo: '#AED581', textColor: '#1B3B00', graphicAsset: 'circle' },

    // ── 아이스크림 파스텔 ──
    { backgroundType: 'gradient', backgroundColor: '#F8BBD0', gradientFrom: '#F8BBD0', gradientTo: '#B3E5FC', textColor: '#4A1A2E', graphicAsset: 'circle' },
    { backgroundType: 'gradient', backgroundColor: '#FFE0B2', gradientFrom: '#FFE0B2', gradientTo: '#FFCCBC', textColor: '#4A2600', graphicAsset: 'circle' },

    // ── 워터멜론/트로피컬 믹스 ──
    { backgroundType: 'gradient', backgroundColor: '#EF5350', gradientFrom: '#EF5350', gradientTo: '#66BB6A', textColor: '#FFFFFF', graphicAsset: 'circle' },
  ],

  // ── 소구점 키워드 (긴급 제외 공유 팔레트) ──
  benefit: SHARED_KEYWORD_BACKGROUNDS,
  info: SHARED_KEYWORD_BACKGROUNDS,
  growth: SHARED_KEYWORD_BACKGROUNDS,
  urgent: [
    // 블랙 단색
    { backgroundColor: '#121212', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#0A0A0A', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크네이비 단색
    { backgroundColor: '#0D2848', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크퍼플 단색
    { backgroundColor: '#1A0030', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크레드 단색
    { backgroundColor: '#4A0000', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크그린 단색
    { backgroundColor: '#0A2618', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 레드↔블랙 크로스
    { backgroundType: 'gradient', backgroundColor: '#B71C1C', gradientFrom: '#B71C1C', gradientTo: '#121212', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 퍼플↔블랙 크로스
    { backgroundType: 'gradient', backgroundColor: '#6A1B9A', gradientFrom: '#6A1B9A', gradientTo: '#0A0A0A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 네이비↔블랙 크로스
    { backgroundType: 'gradient', backgroundColor: '#0D47A1', gradientFrom: '#0D47A1', gradientTo: '#0A0A0A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크레드↔다크퍼플 크로스
    { backgroundType: 'gradient', backgroundColor: '#5A0000', gradientFrom: '#5A0000', gradientTo: '#1A0050', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크그린↔블랙 크로스
    { backgroundType: 'gradient', backgroundColor: '#1B4332', gradientFrom: '#1B4332', gradientTo: '#0A0A0A', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크블루↔다크퍼플 크로스
    { backgroundType: 'gradient', backgroundColor: '#0D2848', gradientFrom: '#0D2848', gradientTo: '#2A0845', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 다크레드↔다크오렌지 크로스
    { backgroundType: 'gradient', backgroundColor: '#5A0000', gradientFrom: '#5A0000', gradientTo: '#BF6C00', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 블랙↔다크시안 크로스
    { backgroundType: 'gradient', backgroundColor: '#0A0A0A', gradientFrom: '#0A0A0A', gradientTo: '#00695C', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 블랙↔다크레드 그라데이션
    { backgroundType: 'gradient', backgroundColor: '#0A0A0A', gradientFrom: '#0A0A0A', gradientTo: '#B71C1C', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
  ],
  hundred: [
    // 레드 계열
    { backgroundColor: '#D32F2F', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#B71C1C', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#D32F2F', gradientFrom: '#D32F2F', gradientTo: '#FF9800', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundType: 'gradient', backgroundColor: '#E53935', gradientFrom: '#E53935', gradientTo: '#FFD54F', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 블랙 계열
    { backgroundColor: '#121212', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    { backgroundColor: '#1A1A2E', backgroundType: 'color', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 골드↔오렌지
    { backgroundType: 'gradient', backgroundColor: '#F9A825', gradientFrom: '#F9A825', gradientTo: '#EF6C00', textColor: '#FFFFFF', graphicAsset: 'star', weight: 3 },
    // 퍼플↔핑크
    { backgroundType: 'gradient', backgroundColor: '#7B1FA2', gradientFrom: '#7B1FA2', gradientTo: '#F06292', textColor: '#FFFFFF', graphicAsset: 'circle', weight: 3 },
  ],
};

/** Pick a random theme from selected keywords' variation pools */
export function pickRandomTheme(selectedKeywordIds: string[]): ThemeVariation | null {
  if (selectedKeywordIds.length === 0) return null;

  const allVariations: ThemeVariation[] = [];
  for (const id of selectedKeywordIds) {
    const pool = THEME_VARIATIONS[id];
    if (pool) allVariations.push(...pool);
  }
  // weight 0 완전 제거
  const filtered = allVariations.filter((v) => (v.weight ?? 1) > 0);
  if (filtered.length === 0) return null;

  // 가중치 기반 랜덤 뽑기
  const totalWeight = filtered.reduce((sum, v) => sum + (v.weight ?? 1), 0);
  let roll = Math.random() * totalWeight;
  for (const v of filtered) {
    roll -= (v.weight ?? 1);
    if (roll <= 0) return v;
  }
  return filtered[filtered.length - 1];
}

/* ───────────────────────── 3D Asset Pools ───────────────────────── */

/** 시즌 키워드 → 블러 배경 장식 이미지 풀 */
export const SEASON_BLUR_ASSETS: Record<string, string[]> = {
  spring: [
    '/assets/3d/flower-01.webp', '/assets/3d/flower-02.webp', '/assets/3d/flower-03.webp', '/assets/3d/flower-04.webp',
    '/assets/3d/flower-05.webp', '/assets/3d/flower-06.webp', '/assets/3d/flower-07.webp', '/assets/3d/flower-08.webp',
    '/assets/3d/flower-09.webp', '/assets/3d/flower-10.webp', '/assets/3d/flower-11.webp', '/assets/3d/flower-12.webp',
    '/assets/3d/flower-13.webp', '/assets/3d/flower-14.webp', '/assets/3d/flower-15.webp', '/assets/3d/flower-16.webp',
    '/assets/3d/flower-17.webp', '/assets/3d/flower-18.webp', '/assets/3d/flower-19.webp', '/assets/3d/flower-20.webp',
    '/assets/3d/flower-21.webp', '/assets/3d/flower-22.webp',
    '/assets/3d/butterfly.webp', '/assets/3d/sprout-01.webp', '/assets/3d/fourleafclover.webp',
    '/assets/3d/pot-01.webp', '/assets/3d/pot-02.webp', '/assets/3d/pot-03.webp',
    '/assets/3d/pot-04.webp', '/assets/3d/pot-05.webp', '/assets/3d/pot-06.webp', '/assets/3d/pot-07.webp',
    '/assets/3d/sunflower.webp', '/assets/3d/cherry.webp',
  ],
  summer: [
    '/assets/3d/palmtree-01.webp', '/assets/3d/palmtree-02.webp',
    '/assets/3d/sunglasses-01.webp', '/assets/3d/sunglasses-02.webp', '/assets/3d/sunglasses-03.webp', '/assets/3d/sunglasses-04.webp',
    '/assets/3d/surfboard.webp', '/assets/3d/beachball.webp', '/assets/3d/watermelon.webp',
    '/assets/3d/parasol-01.webp', '/assets/3d/parasol-02.webp', '/assets/3d/parasol-03.webp',
    '/assets/3d/icecream-01.webp', '/assets/3d/icecream-02.webp',
    '/assets/3d/goggles-01.webp', '/assets/3d/goggles-02.webp',
    '/assets/3d/tube.webp', '/assets/3d/flamingotube.webp',
    '/assets/3d/sandcastle-01.webp', '/assets/3d/sandcastle-02.webp',
  ],
  autumn: [
    '/assets/3d/mapleleaf-01.webp', '/assets/3d/mapleleaf-02.webp', '/assets/3d/mapleleaf-03.webp',
    '/assets/3d/mapleleaf-04.webp', '/assets/3d/mapleleaf-05.webp', '/assets/3d/mapleleaf-06.webp',
    '/assets/3d/ginkgoleaf-01.webp', '/assets/3d/ginkgoleaf-02.webp', '/assets/3d/ginkgoleaf-03.webp',
    '/assets/3d/acorn.webp', '/assets/3d/pinecone.webp', '/assets/3d/pumpkin.webp',
    '/assets/3d/berry-01.webp', '/assets/3d/berry-02.webp',
  ],
  christmas: [
    '/assets/3d/snow-01.webp', '/assets/3d/snow-02.webp',
    '/assets/3d/snowman-01.webp', '/assets/3d/snowman-02.webp',
    '/assets/3d/christmastree-01.webp', '/assets/3d/christmastree-02.webp', '/assets/3d/christmastree-03.webp',
    '/assets/3d/ornament-01.webp', '/assets/3d/ornament-02.webp', '/assets/3d/ornament-03.webp', '/assets/3d/ornament-04.webp',
    '/assets/3d/santa.webp', '/assets/3d/santahat.webp', '/assets/3d/snowglobe.webp',
    '/assets/3d/tree-01.webp', '/assets/3d/tree-02.webp',
  ],
  winter: [
    '/assets/3d/snow-01.webp', '/assets/3d/snow-02.webp',
    '/assets/3d/snowman-01.webp', '/assets/3d/snowman-02.webp',
    '/assets/3d/christmastree-01.webp', '/assets/3d/christmastree-02.webp', '/assets/3d/christmastree-03.webp',
    '/assets/3d/snowglobe.webp', '/assets/3d/tree-01.webp', '/assets/3d/tree-02.webp',
  ],
  newyear: [
    '/assets/3d/luckybag-01_21825-26869.webp', '/assets/3d/luckybag-02_21825-26872.webp',
    '/assets/3d/luckybag-03_21825-26875.webp', '/assets/3d/luckybag-04.webp',
    '/assets/3d/luckybag-05.webp', '/assets/3d/luckybag-06.webp',
  ],
  chuseok: [
    '/assets/3d/songpyeon-01.webp', '/assets/3d/songpyeon-02.webp', '/assets/3d/songpyeon-03.webp', '/assets/3d/songpyeon-04.webp',
    '/assets/3d/mapleleaf-01.webp', '/assets/3d/mapleleaf-02.webp', '/assets/3d/mapleleaf-03.webp',
    '/assets/3d/ginkgoleaf-01.webp', '/assets/3d/ginkgoleaf-02.webp',
    '/assets/3d/fullmoon.webp',
  ],
};

/** 키워드 → 전면 메인 그래픽 이미지 풀 (시즌+테마 통합) */
export const THEME_MAIN_ASSETS: Record<string, string[]> = {
  // 시즌 — 블러 풀과 동일 에셋을 메인으로도 사용
  spring: [
    '/assets/3d/flower-01.webp', '/assets/3d/flower-02.webp', '/assets/3d/flower-03.webp', '/assets/3d/flower-04.webp',
    '/assets/3d/flower-05.webp', '/assets/3d/flower-06.webp', '/assets/3d/butterfly.webp',
    '/assets/3d/pot-01.webp', '/assets/3d/pot-02.webp', '/assets/3d/pot-03.webp',
    '/assets/3d/sunflower.webp', '/assets/3d/fourleafclover.webp',
  ],
  summer: [
    '/assets/3d/palmtree-01.webp', '/assets/3d/palmtree-02.webp',
    '/assets/3d/sunglasses-01.webp', '/assets/3d/sunglasses-02.webp',
    '/assets/3d/surfboard.webp', '/assets/3d/beachball.webp', '/assets/3d/watermelon.webp',
    '/assets/3d/parasol-01.webp', '/assets/3d/icecream-01.webp', '/assets/3d/icecream-02.webp',
  ],
  autumn: [
    '/assets/3d/mapleleaf-01.webp', '/assets/3d/mapleleaf-02.webp', '/assets/3d/mapleleaf-03.webp',
    '/assets/3d/ginkgoleaf-01.webp', '/assets/3d/ginkgoleaf-02.webp', '/assets/3d/ginkgoleaf-03.webp',
    '/assets/3d/acorn.webp', '/assets/3d/pumpkin.webp', '/assets/3d/pinecone.webp',
  ],
  winter: [
    '/assets/3d/snow-01.webp', '/assets/3d/snow-02.webp',
    '/assets/3d/snowman-01.webp', '/assets/3d/snowman-02.webp',
    '/assets/3d/tree-01.webp', '/assets/3d/tree-02.webp',
    '/assets/3d/snowglobe.webp', '/assets/3d/hotchoco.webp',
    '/assets/3d/puffer-01.webp', '/assets/3d/puffer-02.webp', '/assets/3d/puffer-03.webp',
  ],
  christmas: [
    '/assets/3d/christmastree-01.webp', '/assets/3d/christmastree-02.webp', '/assets/3d/christmastree-03.webp',
    '/assets/3d/snowman-01.webp', '/assets/3d/snowman-02.webp',
    '/assets/3d/ornament-01.webp', '/assets/3d/ornament-02.webp', '/assets/3d/ornament-03.webp',
    '/assets/3d/santa.webp', '/assets/3d/snowglobe.webp', '/assets/3d/giftbox-01_21825-27013.webp',
  ],
  benefit: [
    // 혜택 조합 에셋
    '/assets/3d/benefit-giftmoney1-1.webp', '/assets/3d/benefit-giftmoney1-2.webp',
    '/assets/3d/benefit-giftmoney1-3.webp', '/assets/3d/benefit-giftmoney1-4.webp',
    '/assets/3d/benefit-giftmoney2-1.webp', '/assets/3d/benefit-giftmoney2-2.webp',
    '/assets/3d/benefit-giftmoney2-3.webp', '/assets/3d/benefit-giftmoney2-4.webp',
    '/assets/3d/benefit-infinity-1.webp', '/assets/3d/benefit-infinity-2.webp',
    '/assets/3d/benefit-infinity-3.webp', '/assets/3d/benefit-infinity-4.webp',
    '/assets/3d/benefit-luckybag1-1.webp', '/assets/3d/benefit-luckybag1-2.webp',
    '/assets/3d/benefit-luckybag1-3.webp', '/assets/3d/benefit-luckybag1-4.webp',
    '/assets/3d/benefit-luckybag2-1.webp', '/assets/3d/benefit-luckybag2-2.webp',
    '/assets/3d/benefit-luckybag2-3.webp', '/assets/3d/benefit-luckybag2-4.webp',
  ],
  info: [
    // 동적 로딩 전용: "정보 제공"으로 시작하는 파일만 자동 노출
  ],
  growth: [
    // 동적 로딩 전용: "성장"으로 시작하는 파일만 자동 노출
  ],
  urgent: [
    // 동적 로딩 전용: "긴급"으로 시작하는 파일만 자동 노출
  ],
  hundred: [
    // 동적 로딩 전용: "100원"으로 시작하는 파일만 자동 노출
  ],

  // ── 키워드+시즌 조합 (시즌 강조 선택 시 우선 사용) ──
  // 파일명 패턴: "혜택 봄-1.png" 등 — 천민이 추가하면 여기에 등록
  // benefit_spring: [],
  // benefit_summer: [],
  // benefit_autumn: [],
  // benefit_winter: [],
  // growth_spring: [],
  // ...
};

/** 공통 에셋 (키워드 없을 때 or 추가 장식) */
export const COMMON_ASSETS: string[] = [
  '/assets/3d/shoppingbag-01.webp', '/assets/3d/shoppingbag-02.webp', '/assets/3d/shoppingbag-03.webp', '/assets/3d/shoppingbag-04.webp',
  '/assets/3d/shoppingcart-01.webp', '/assets/3d/shoppingcart-02.webp', '/assets/3d/shoppingcart-03.webp',
  '/assets/3d/basket-01.webp', '/assets/3d/basket-02.webp', '/assets/3d/basket-03.webp',
  '/assets/3d/basket-04.webp', '/assets/3d/basket-05.webp', '/assets/3d/basket-06.webp', '/assets/3d/basket-07.webp',
  '/assets/3d/box-01.webp', '/assets/3d/box-02.webp', '/assets/3d/box-03.webp', '/assets/3d/box-04.webp',
  '/assets/3d/box-05.webp', '/assets/3d/box-06.webp', '/assets/3d/box-07.webp', '/assets/3d/box-08.webp',
  '/assets/3d/box-09.webp', '/assets/3d/box-10.webp',
  '/assets/3d/truck-01.webp', '/assets/3d/truck-02.webp', '/assets/3d/truck-03.webp', '/assets/3d/truck-04.webp',
  '/assets/3d/truck-05.webp', '/assets/3d/truck-06.webp', '/assets/3d/truck-07.webp', '/assets/3d/truck-08.webp',
  '/assets/3d/truck-09.webp', '/assets/3d/truck-10.webp',
  '/assets/3d/hand-01.webp', '/assets/3d/hand-02.webp', '/assets/3d/hand-03.webp', '/assets/3d/hand-04.webp',
  '/assets/3d/hand-05.webp', '/assets/3d/hand-06.webp', '/assets/3d/hand-07.webp', '/assets/3d/hand-08.webp',
  '/assets/3d/hand-09.webp', '/assets/3d/hand-10.webp', '/assets/3d/hand-11.webp', '/assets/3d/hand-12.webp',
  '/assets/3d/hand-13.webp', '/assets/3d/hand-14.webp', '/assets/3d/hand-15.webp', '/assets/3d/hand-16.webp', '/assets/3d/hand-17.webp',
];

/* ───────────────────────── 배경 꾸밈 에셋 (돈/쿠폰 뭉치) ───────────────────────── */

/** Helper: pick random item from array */
export function pickRandom<T>(arr: T[]): T | null {
  if (arr.length === 0) return null;
  return arr[Math.floor(Math.random() * arr.length)];
}

/** 배경 꾸밈 전용 에셋 (메인 그래픽 풀에서 제외) */
const BG_DECORATION_ONLY_ASSETS = new Set<string>([]);

/** Helper: get asset pool for current keywords */
export function getBlurAssetsForKeywords(keywords: string[]): string[] {
  const seasonKw = keywords.find((kw) => SEASON_BLUR_ASSETS[kw]);
  if (seasonKw) return SEASON_BLUR_ASSETS[seasonKw];
  return COMMON_ASSETS;
}

export function getMainAssetsForKeywords(keywords: string[]): string[] {
  const themeKws = keywords.filter((kw) => THEME_MAIN_ASSETS[kw] && THEME_MAIN_ASSETS[kw].length > 0);
  let pool: string[];
  if (themeKws.length > 0) {
    pool = [];
    for (const kw of themeKws) pool.push(...THEME_MAIN_ASSETS[kw]);
  } else {
    pool = COMMON_ASSETS;
  }
  // 배경 꾸밈 전용 에셋 제외
  return pool.filter((url) => !BG_DECORATION_ONLY_ASSETS.has(url));
}

/** Get all assets from all pools (for "전체보기") */
export function getAllAssets(): string[] {
  const all = new Set<string>();
  Object.values(SEASON_BLUR_ASSETS).forEach((arr) => arr.forEach((a) => all.add(a)));
  Object.values(THEME_MAIN_ASSETS).forEach((arr) => arr.forEach((a) => all.add(a)));
  COMMON_ASSETS.forEach((a) => all.add(a));
  return Array.from(all);
}

/** 소구점/시즌/공통/기타 카테고리별 에셋 분류 */
export interface AssetCategory {
  id: string;
  label: string;
  assets: string[];
}

const ASSET_CATEGORY_LABELS: Record<string, string> = {
  benefit: '혜택', info: '정보 제공', growth: '성장', urgent: '긴급', hundred: '100원',
  common: '공통', spring: '봄', summer: '여름', autumn: '가을', winter: '겨울', christmas: '크리스마스',
  other: '기타',
};

export function getAssetCategories(dynamicAssets: Record<string, string[]>): AssetCategory[] {
  const assigned = new Set<string>();
  const categories: AssetCategory[] = [];

  // 소구점 키워드 + 키워드_시즌 조합 동적 에셋도 해당 키워드에 합침
  for (const kwId of ['benefit', 'info', 'growth', 'urgent']) {
    const staticPool = THEME_MAIN_ASSETS[kwId] || [];
    const dynPool = dynamicAssets[kwId] || [];
    // 키워드_시즌 조합 키 (benefit_christmas 등)도 포함
    const comboAssets: string[] = [];
    for (const key of Object.keys(dynamicAssets)) {
      if (key.startsWith(`${kwId}_`)) comboAssets.push(...dynamicAssets[key]);
    }
    const merged = Array.from(new Set([...staticPool, ...dynPool, ...comboAssets]));
    merged.forEach((a) => assigned.add(a));
    if (merged.length > 0) {
      categories.push({ id: kwId, label: ASSET_CATEGORY_LABELS[kwId] || kwId, assets: merged });
    }
  }

  // hundred (100원) — 독립 카테고리
  const hundredStatic = THEME_MAIN_ASSETS['hundred'] || [];
  const hundredDyn = dynamicAssets['hundred'] || [];
  const hundredCombo: string[] = [];
  for (const key of Object.keys(dynamicAssets)) {
    if (key.startsWith('hundred_')) hundredCombo.push(...dynamicAssets[key]);
  }
  const hundredAll = Array.from(new Set([...hundredStatic, ...hundredDyn, ...hundredCombo]));
  hundredAll.forEach((a) => assigned.add(a));
  if (hundredAll.length > 0) {
    categories.push({ id: 'hundred', label: '100원', assets: hundredAll });
  }

  // 소구점 키워드에 속한 에셋만 표시 (공통/시즌/기타 제외)

  return categories;
}

/* ───────────────────────── 서브 그래픽 카테고리 (파일명 접두사 기반) ───────────────────────── */

const SUB_CATEGORY_MAP: Record<string, string[]> = {
  '의류/패션': ['cardigan', 'leggings', 'sweatshirt', 'sleeveless', 'pants', 'tshirt', 'blouse', 'shoes', 'dress', 'innerwear', 'jacket', 'skirt', 'trenchcoat', 'hoodie', 'hanger', 'hat'],
  '뷰티/미용': ['curlingiron', 'guasha', 'hairdryer', 'massager', 'comb', 'brush', 'cosmetics', 'hairband'],
  '액세서리': ['bag', 'jewelry', 'watch', 'sunglasses', 'keyring', 'phonecase', 'headset', 'carrier'],
  '문구/가전': ['tv', 'fan', 'light', 'bulb', 'book', 'pencil', 'magnifier', 'folder', 'stamp', 'check'],
  '돈/쿠폰': ['10000won', '5000won', '1000won', '50000won', '100won', 'coin', 'bill', 'piggybank', 'mileage', 'point', 'coupon', 'saletag', 'discount'],
  '선물/이벤트': ['giftbox', 'box', 'randombox', 'shoppingbag', 'shoppingcart', 'basket', 'truck', 'gachamachine', 'gachacapsule', 'roulette', 'dice', 'ranking', 'medal', 'trophy', 'crown'],
  '긴급': ['digitalclock', 'alarmclock', 'stopwatch', 'hourglass', 'bomb', 'siren', 'lightning', 'bell', 'flame'],
  '음식/음료': ['drink', 'coffeecup', 'cup', 'tumbler', 'cake', 'donut', 'chocolate', 'pancake', 'snack', 'protein', 'apple', 'cherry', 'carrot', 'kettle'],
  '홍보/소통': ['megaphone', 'flag', 'whistle', 'hand', 'letter', 'postbox', 'posttok', 'paperplane'],
  '성장/목표': ['graphup', 'goal', 'arrow'],
  '장식/데코': ['star', 'heart', 'confetti'],
  '봄/여름': ['flower', 'butterfly', 'fourleafclover', 'sprout', 'sunflower', 'pot', 'surfboard', 'beachball', 'parasol', 'tube', 'flamingotube', 'goggles', 'sandcastle', 'watermelon', 'icecream', 'palmtree', 'umbrella', 'raincoat', 'duck'],
  '가을/겨울': ['mapleleaf', 'ginkgoleaf', 'acorn', 'pinecone', 'pumpkin', 'berry', 'squirrel', 'fullmoon', 'snow', 'snowman', 'snowglobe', 'hotchoco', 'puffer', 'christmastree', 'ornament', 'santa', 'santahat', 'candycane', 'gingercookie', 'ribbon'],
  '신년/명절': ['songpyeon', 'yakgwa', 'luckybag', 'balloon', 'firework'],
};

// 접두사 → 카테고리 역매핑 (빌드 타임에 한번만)
const PREFIX_TO_CAT: Record<string, string> = {};
for (const [cat, prefixes] of Object.entries(SUB_CATEGORY_MAP)) {
  for (const p of prefixes) PREFIX_TO_CAT[p] = cat;
}

function getAssetPrefix(url: string): string {
  const filename = url.split('/').pop()?.replace('.webp', '').replace('.png', '') || '';
  // "바지-01" → "바지", "혜택 선물과 돈1-1" → "혜택" (but those are in keyword categories)
  const match = filename.match(/^([가-힣A-Za-z]+)/);
  return match ? match[1] : filename;
}

export function getSubGraphicCategories(dynamicAssets: Record<string, string[]>): AssetCategory[] {
  const allStatic = getAllAssets();
  const allDynamic = Object.values(dynamicAssets).flat();
  const allAssets = Array.from(new Set([...allStatic, ...allDynamic]));

  const catMap: Record<string, string[]> = {};
  const assigned = new Set<string>();

  for (const url of allAssets) {
    const prefix = getAssetPrefix(url);
    const cat = PREFIX_TO_CAT[prefix];
    if (cat) {
      if (!catMap[cat]) catMap[cat] = [];
      catMap[cat].push(url);
      assigned.add(url);
    }
  }

  const categories: AssetCategory[] = [];
  const catOrder = Object.keys(SUB_CATEGORY_MAP);
  for (const catName of catOrder) {
    const assets = catMap[catName];
    if (assets && assets.length > 0) {
      categories.push({ id: catName, label: catName, assets });
    }
  }

  // 기타
  const others = allAssets.filter((a) => !assigned.has(a));
  if (others.length > 0) {
    categories.push({ id: 'other', label: '기타', assets: others });
  }

  return categories;
}
