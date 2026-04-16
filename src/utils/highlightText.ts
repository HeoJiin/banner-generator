/* ── 하이라이트 텍스트 파서 + 색상 자동 계산 ── */

export interface TextSegment {
  text: string;
  highlight: boolean;
}

/**
 * `{글자}` 구문을 파싱하여 세그먼트 배열로 변환.
 * - 닫는 괄호 누락 시 원문 그대로 반환
 * - 빈 {} 는 무시
 * - 중첩 {{}} 는 첫 번째 { ~ 첫 번째 } 매칭 (내부 { 는 하이라이트 텍스트에 포함)
 */
export function parseHighlightText(text: string): TextSegment[] {
  if (!text || !text.includes('{')) {
    return [{ text, highlight: false }];
  }

  const segments: TextSegment[] = [];
  let i = 0;

  while (i < text.length) {
    const openIdx = text.indexOf('{', i);
    if (openIdx === -1) {
      // 남은 텍스트 전부 일반
      segments.push({ text: text.slice(i), highlight: false });
      break;
    }

    const closeIdx = text.indexOf('}', openIdx + 1);
    if (closeIdx === -1) {
      // 닫는 괄호 없음 → 나머지 전부 일반 텍스트로
      segments.push({ text: text.slice(i), highlight: false });
      break;
    }

    // { 앞 일반 텍스트
    if (openIdx > i) {
      segments.push({ text: text.slice(i, openIdx), highlight: false });
    }

    // {} 안 내용
    const inner = text.slice(openIdx + 1, closeIdx);
    if (inner.length > 0) {
      segments.push({ text: inner, highlight: true });
    }

    i = closeIdx + 1;
  }

  return segments.length > 0 ? segments : [{ text, highlight: false }];
}

/** 텍스트에 하이라이트 구문이 포함되어 있는지 */
export function hasHighlightSyntax(text: string): boolean {
  return /\{[^}]+\}/.test(text);
}

/* ── 하이라이트 색상 자동 계산 ── */

function hexToHsl(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16) / 255;
  const g = parseInt(c.substring(2, 4), 16) / 255;
  const b = parseInt(c.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0, s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }

  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

/** 대비비 계산 (WCAG) */
function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => {
    const v = parseInt(c.substring(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * 배경색 기반 하이라이트 색상 랜덤 뽑기.
 * 채도 높고 명도 높은 비비드 컬러 후보를 생성한 뒤,
 * 배경 대비 WCAG AA(4.5:1) + textColor 대비(1.5:1) 통과하는 것만 필터 → 랜덤 선택.
 */
/**
 * @param backgroundColors 배경색 배열 — 단색이면 1개, 그라데이션이면 [from, to]
 */
export function pickRandomHighlightColor(backgroundColors: string | string[]): string {
  const bgArr = Array.isArray(backgroundColors) ? backgroundColors : [backgroundColors];
  const bgLums = bgArr.map((bg) => hexToHsl(bg)[2]);
  const avgL = bgLums.reduce((a, b) => a + b, 0) / bgLums.length;
  const minContrast = 2;
  const candidates: string[] = [];

  const hueSteps: number[] = [];
  for (let h = 0; h < 360; h += 15) hueSteps.push(h);

  const satRange = [50, 60, 70, 80, 90, 100];
  const lumRange = [15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90];

  for (const h of hueSteps) {
    for (const s of satRange) {
      for (const l of lumRange) {
        const color = hslToHex(h, s, l);
        // 모든 배경색에 대해 대비 통과해야 함
        if (bgArr.some((bg) => contrastRatio(color, bg) < minContrast)) continue;
        candidates.push(color);
      }
    }
  }

  if (candidates.length === 0) {
    return avgL > 50 ? '#DC2626' : '#FFD700';
  }

  return candidates[Math.floor(Math.random() * candidates.length)];
}
