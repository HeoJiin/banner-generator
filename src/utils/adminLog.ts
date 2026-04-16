import { toPng } from 'html-to-image';
import { BannerState, BANNER_TYPES, BannerInstance } from '@/types/banner';

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API_URL || 'http://localhost:3100';
const USER_NAME_KEY = 'banner-admin-user-name';

export function getSavedUserName(): string | null {
  try { return localStorage.getItem(USER_NAME_KEY); } catch { return null; }
}

export function saveUserName(name: string): void {
  try { localStorage.setItem(USER_NAME_KEY, name); } catch { /* noop */ }
}

/**
 * 배너 다운로드 시 관리자 API에 로그를 전송한다.
 * fire-and-forget — 실패해도 다운로드에 영향 없음.
 *
 * @param targetInstanceId 개별 다운로드 시 해당 인스턴스 ID. 생략하면 전체 enabled 인스턴스.
 */
export async function sendDownloadLog(
  state: BannerState,
  canvasRefs: Record<string, HTMLDivElement | null>,
  userName: string,
  targetInstanceId?: string,
): Promise<void> {
  try {
    const targets = targetInstanceId
      ? state.instances.filter((i) => i.id === targetInstanceId)
      : state.instances.filter((i) => i.enabled);

    const formData = new FormData();

    // 메타 정보
    formData.append('user_name', userName);
    formData.append('title', state.title);
    formData.append('subtitle', state.subtitle);
    formData.append('keywords', JSON.stringify(state.selectedKeywords));
    formData.append('season_accent', state.seasonAccent || '');
    formData.append('mode', state.mode);
    formData.append('background_color', state.backgroundColor);
    formData.append('instances_count', String(targets.length));
    formData.append('banner_types', JSON.stringify(Array.from(new Set(targets.map((i) => i.type)))));

    // state snapshot (이미지 데이터 제외)
    const snapshot = { ...state, activeSettingsPanel: null };
    if (snapshot.imageSettings) {
      snapshot.imageSettings = { ...snapshot.imageSettings, imageDataUrl: null };
    }
    formData.append('state_snapshot', JSON.stringify(snapshot));

    // 썸네일 캡처 (축소 버전)
    for (const inst of targets) {
      const el = canvasRefs[inst.id];
      const config = BANNER_TYPES.find((t) => t.type === inst.type);
      if (!el || !config) continue;

      try {
        const dataUrl = await toPng(el, {
          width: config.width,
          height: config.height,
          pixelRatio: 0.5,
          cacheBust: true,
          style: { transform: 'none' },
        });

        const res = await fetch(dataUrl);
        const blob = await res.blob();
        const fieldName = `thumbnail_${inst.type}_${inst.id}`;
        formData.append(fieldName, blob, `${inst.id}.png`);
        formData.append(`label_${fieldName}`, inst.label);
        formData.append(`width_${fieldName}`, String(config.width));
        formData.append(`height_${fieldName}`, String(config.height));
      } catch {
        // 개별 썸네일 캡처 실패 시 스킵
      }
    }

    await fetch(`${ADMIN_API}/api/logs`, {
      method: 'POST',
      body: formData,
    });
  } catch {
    // fire-and-forget — 로깅 실패는 무시
    console.warn('[AdminLog] Failed to send download log');
  }
}
