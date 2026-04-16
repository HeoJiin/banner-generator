/* ── 배너 설정 공유 URL 유틸리티 ──
 * BannerState → gzip → base64url → URL 해시
 * 백엔드 불필요, 클라이언트 전용
 */

import { BannerState, DEFAULT_STATE } from '@/types/banner';

const SHARE_VERSION = 1;

/** base64url 인코딩 (RFC 4648) */
function toBase64Url(bytes: Uint8Array): string {
  const binStr = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binStr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** base64url 디코딩 */
function fromBase64Url(str: string): Uint8Array {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (str.length % 4)) % 4);
  const binStr = atob(padded);
  return Uint8Array.from(binStr, (c) => c.charCodeAt(0));
}

/** gzip 압축 (CompressionStream API) */
async function gzipCompress(data: string): Promise<Uint8Array> {
  const stream = new Blob([data]).stream().pipeThrough(new CompressionStream('gzip'));
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return result;
}

/** gzip 압축 해제 */
async function gzipDecompress(data: Uint8Array): Promise<string> {
  const stream = new Blob([data as unknown as BlobPart]).stream().pipeThrough(new DecompressionStream('gzip'));
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  const total = chunks.reduce((a, c) => a + c.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }
  return new TextDecoder().decode(result);
}

/** 공유용 직렬화 — base64 이미지 데이터 제외, default값과 동일한 필드 생략 */
function serializeForShare(state: BannerState): Record<string, unknown> {
  const clone: Record<string, unknown> = { ...state };

  // base64 이미지 데이터 제외
  if (state.imageSettings) {
    clone.imageSettings = {
      ...state.imageSettings,
      imageDataUrl: null,
      imagePalette: [],
      imageBaseColor: '#000000',
      graphicAssetUrl: null,
    };
  }

  // UI 상태 제외
  delete clone.activeSettingsPanel;

  return clone;
}

/** 공유 URL 생성 → 클립보드 복사 */
export async function generateShareUrl(state: BannerState): Promise<{ url: string; isImageMode: boolean }> {
  const payload = serializeForShare(state);
  const json = JSON.stringify(payload);
  const compressed = await gzipCompress(json);
  const encoded = toBase64Url(compressed);
  const hash = `v${SHARE_VERSION}.${encoded}`;
  const url = `${window.location.origin}${window.location.pathname}#${hash}`;

  return { url, isImageMode: state.mode === 'image' };
}

/** URL 해시에서 BannerState 복원 */
export async function parseShareUrl(hash: string): Promise<BannerState | null> {
  if (!hash || !hash.startsWith('v')) return null;

  try {
    const dotIdx = hash.indexOf('.');
    if (dotIdx === -1) return null;

    const version = parseInt(hash.substring(1, dotIdx), 10);
    if (isNaN(version)) return null;

    const encoded = hash.substring(dotIdx + 1);
    const compressed = fromBase64Url(encoded);
    const json = await gzipDecompress(compressed);
    const parsed = JSON.parse(json);

    // DEFAULT_STATE로 누락 필드 보정
    const restored: BannerState = {
      ...DEFAULT_STATE,
      ...parsed,
      activeSettingsPanel: null,
      imageSettings: {
        ...DEFAULT_STATE.imageSettings,
        ...(parsed.imageSettings || {}),
      },
      rolling: { ...DEFAULT_STATE.rolling, ...(parsed.rolling || {}) },
      bm: { ...DEFAULT_STATE.bm, ...(parsed.bm || {}) },
      popup: { ...DEFAULT_STATE.popup, ...(parsed.popup || {}) },
      content: { ...DEFAULT_STATE.content, ...(parsed.content || {}) },
    };

    // instances 보정
    if (!restored.instances || !Array.isArray(restored.instances)) {
      restored.instances = DEFAULT_STATE.instances;
    }

    return restored;
  } catch {
    return null;
  }
}

/** 클립보드에 텍스트 복사 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
