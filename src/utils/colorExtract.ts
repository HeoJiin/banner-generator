/**
 * 이미지의 전체 밝기를 판단하고, 밝으면 가장 밝은 색, 어두우면 가장 어두운 색을 반환한다.
 * 배너 이미지형 배경/그라데이션 색상 자동 세팅에 사용.
 */
export function extractImageBaseColor(imageUrl: string): Promise<{ color: string; isBright: boolean }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 50;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // 1) 전체 평균 밝기 계산
      let totalBrightness = 0;
      let pixelCount = 0;

      // 2) 가장 밝은 색 / 어두운 색 추적
      let darkR = 255, darkG = 255, darkB = 255, lowestBr = 999;
      let lightR = 0, lightG = 0, lightB = 0, highestBr = -1;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue;

        const br = r * 0.299 + g * 0.587 + b * 0.114;
        totalBrightness += br;
        pixelCount++;

        // 어두운 색 (순수 블랙 제외)
        if (br < lowestBr && !(r < 5 && g < 5 && b < 5)) {
          lowestBr = br; darkR = r; darkG = g; darkB = b;
        }
        // 밝은 색 (순수 화이트 제외)
        if (br > highestBr && !(r > 250 && g > 250 && b > 250)) {
          highestBr = br; lightR = r; lightG = g; lightB = b;
        }
      }

      const avgBrightness = pixelCount > 0 ? totalBrightness / pixelCount : 128;
      const isBright = avgBrightness > 145;

      const toHex = (r: number, g: number, b: number) =>
        `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;

      if (isBright) {
        resolve({ color: highestBr >= 0 ? toHex(lightR, lightG, lightB) : '#f5f5f5', isBright: true });
      } else {
        resolve({ color: lowestBr < 999 ? toHex(darkR, darkG, darkB) : '#1a1a1a', isBright: false });
      }
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}

/**
 * 이미지에서 대표 6색 팔레트를 추출한다.
 * k-means 스타일 양자화 → 빈도순 정렬 → 밝기순 재정렬.
 */
export function extractPalette(imageUrl: string, count = 6): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 60;
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      // 15단위 양자화로 색상 버킷
      const buckets: Record<string, { r: number; g: number; b: number; count: number }> = {};
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];
        if (a < 128) continue;

        const qr = Math.round(r / 15) * 15;
        const qg = Math.round(g / 15) * 15;
        const qb = Math.round(b / 15) * 15;
        const key = `${qr},${qg},${qb}`;
        if (!buckets[key]) buckets[key] = { r: qr, g: qg, b: qb, count: 0 };
        buckets[key].count++;
      }

      // 빈도순 정렬
      const sorted = Object.values(buckets).sort((a, b) => b.count - a.count);

      // 충분히 다른 색만 선택 (유클리드 거리 > 40)
      const palette: { r: number; g: number; b: number }[] = [];
      for (const c of sorted) {
        if (palette.length >= count) break;
        const tooClose = palette.some(
          (p) => Math.sqrt((p.r - c.r) ** 2 + (p.g - c.g) ** 2 + (p.b - c.b) ** 2) < 40,
        );
        if (!tooClose) palette.push(c);
      }

      // 밝기순 정렬 (어두운→밝은)
      palette.sort((a, b) => {
        const brA = a.r * 0.299 + a.g * 0.587 + a.b * 0.114;
        const brB = b.r * 0.299 + b.g * 0.587 + b.b * 0.114;
        return brA - brB;
      });

      const toHex = (r: number, g: number, b: number) =>
        `#${Math.min(255, r).toString(16).padStart(2, '0')}${Math.min(255, g).toString(16).padStart(2, '0')}${Math.min(255, b).toString(16).padStart(2, '0')}`;

      resolve(palette.map((c) => toHex(c.r, c.g, c.b)));
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}

/**
 * 배경색에 맞는 텍스트 색상을 자동 생성한다.
 * 밝은 배경 → 같은 색조의 어두운 톤 (RGB 비율 유지, 밝기만 낮춤)
 * 어두운 배경 → 흰색.
 */
export function getContrastTextColor(bgHex: string): string {
  const c = bgHex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  if (brightness < 140) return '#FFFFFF';

  // 밝은 배경 → RGB 비율 유지하면서 어둡게 (hue 변하지 않음)
  const maxCh = Math.max(r, g, b);
  if (maxCh < 10) return '#1A1A1A';

  // 목표: 가장 큰 채널이 ~70이 되도록 스케일 (밝기 약 25~30%)
  const scale = 70 / maxCh;
  const dr = Math.round(r * scale);
  const dg = Math.round(g * scale);
  const db = Math.round(b * scale);

  const toHex = (v: number) => Math.min(255, Math.max(0, v)).toString(16).padStart(2, '0');
  return `#${toHex(dr)}${toHex(dg)}${toHex(db)}`;
}

/**
 * 이미지에서 가장 어두운(짙은) 색상을 추출한다.
 * 순수 블랙(0,0,0)은 제외하고, 약간의 색감이 있는 어두운 색을 찾는다.
 * CTA 버튼 배경색 자동 세팅에 사용.
 */
export function extractDarkestColor(imageUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const size = 50; // 50x50 샘플링
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas not supported'));

      ctx.drawImage(img, 0, 0, size, size);
      const data = ctx.getImageData(0, 0, size, size).data;

      let darkestR = 255;
      let darkestG = 255;
      let darkestB = 255;
      let lowestBrightness = 999;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const a = data[i + 3];

        // 투명 픽셀 스킵
        if (a < 128) continue;

        // 순수 블랙(0,0,0) 제외 — 약간의 색감이 있는 어두운 색을 찾아야 함
        if (r === 0 && g === 0 && b === 0) continue;
        // 거의 블랙(각 채널 5 미만)도 제외
        if (r < 5 && g < 5 && b < 5) continue;

        const brightness = r * 0.299 + g * 0.587 + b * 0.114;

        if (brightness < lowestBrightness) {
          lowestBrightness = brightness;
          darkestR = r;
          darkestG = g;
          darkestB = b;
        }
      }

      // 만약 유효한 어두운 색을 못 찾았으면 폴백
      if (lowestBrightness >= 999) {
        return resolve('#1a1a1a');
      }

      const hex = `#${darkestR.toString(16).padStart(2, '0')}${darkestG.toString(16).padStart(2, '0')}${darkestB.toString(16).padStart(2, '0')}`;
      resolve(hex);
    };
    img.onerror = () => reject(new Error('Image load failed'));
    img.src = imageUrl;
  });
}
