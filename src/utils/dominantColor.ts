function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '');
  return [parseInt(c.substring(0, 2), 16), parseInt(c.substring(2, 4), 16), parseInt(c.substring(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getLuminance(r: number, g: number, b: number): number {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * 배경 밝기에 따라 CTA 색상을 조정한다.
 * - 밝은 배경 → 짙은 CTA (명도 25~40% 범위로 다크닝)
 * - 어두운 배경 → 밝은 CTA (명도 55~70% 범위, 고명도 지양)
 */
export function adjustCtaColorForBackground(ctaColor: string, bgColor: string): string {
  const [r, g, b] = hexToRgb(ctaColor);
  const bgLum = getLuminance(...hexToRgb(bgColor));
  const ctaLum = getLuminance(r, g, b);

  if (bgLum > 0.55) {
    // 밝은 배경 → CTA를 짙게
    if (ctaLum > 0.4) {
      const scale = 0.35 / Math.max(ctaLum, 0.01);
      return rgbToHex(
        Math.round(Math.min(255, r * scale)),
        Math.round(Math.min(255, g * scale)),
        Math.round(Math.min(255, b * scale)),
      );
    }
  } else {
    // 어두운 배경 → CTA를 밝게 (but 고명도 지양, 최대 70%)
    if (ctaLum < 0.55) {
      const target = 0.65;
      const scale = target / Math.max(ctaLum, 0.01);
      return rgbToHex(
        Math.round(Math.min(230, r * scale)),
        Math.round(Math.min(230, g * scale)),
        Math.round(Math.min(230, b * scale)),
      );
    }
  }
  return ctaColor;
}

/** CTA 버튼 색상에 맞는 텍스트 색상 반환 */
export function getCtaTextColor(ctaColor: string): string {
  const [r, g, b] = hexToRgb(ctaColor);
  return getLuminance(r, g, b) > 0.55 ? '#000000' : '#FFFFFF';
}

/**
 * 이미지 URL/dataURL에서 dominant color를 추출한다.
 * canvas로 축소 샘플링 후 가장 빈도 높은 색상 반환.
 */
export function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 40; // 40x40 샘플링
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // 색상 빈도 카운트 (5단위로 양자화)
      const buckets: Record<string, number> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // 투명/거의 흰색/거의 검정 스킵
        if (a < 128) continue;
        if (r > 240 && g > 240 && b > 240) continue;
        if (r < 15 && g < 15 && b < 15) continue;

        const qr = Math.round(r / 5) * 5;
        const qg = Math.round(g / 5) * 5;
        const qb = Math.round(b / 5) * 5;
        const key = `${qr},${qg},${qb}`;
        buckets[key] = (buckets[key] || 0) + 1;
      }

      // 가장 빈도 높은 색상
      let maxKey = '';
      let maxCount = 0;
      for (const [key, count] of Object.entries(buckets)) {
        if (count > maxCount) {
          maxCount = count;
          maxKey = key;
        }
      }

      if (!maxKey) return resolve('#000000');

      const [r, g, b] = maxKey.split(',').map(Number);
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      resolve(hex);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}
