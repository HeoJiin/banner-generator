import { toPng } from 'html-to-image';
import { BannerState, BANNER_TYPES, BannerInstance } from '@/types/banner';
import { getInteractionStats, resetInteractionStats } from './interactionTracker';

const ADMIN_API = process.env.NEXT_PUBLIC_ADMIN_API_URL;
const USER_NAME_KEY = 'banner-admin-user-name';

export function getSavedUserName(): string | null {
  try { return localStorage.getItem(USER_NAME_KEY); } catch { return null; }
}

export function saveUserName(name: string): void {
  try { localStorage.setItem(USER_NAME_KEY, name); } catch { /* noop */ }
}

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',');
  const mime = header.match(/:(.*?);/)?.[1] || 'image/png';
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: mime });
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
  if (!ADMIN_API) {
    console.debug('[AdminLog] ADMIN_API not set, skipping');
    return;
  }

  const targets = targetInstanceId
    ? state.instances.filter((i) => i.id === targetInstanceId)
    : state.instances.filter((i) => i.enabled);

  const formData = new FormData();

  try {
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

    // state snapshot — 대형 DataURL 필드 제거
    try {
      const snapshot: Record<string, unknown> = {
        ...state,
        activeSettingsPanel: null,
        mainGraphicUrl: typeof state.mainGraphicUrl === 'string' && state.mainGraphicUrl.startsWith('data:') ? null : state.mainGraphicUrl,
        mainGraphicUrl2: null,
        blurBgUrl: null,
        bgDecorationUrl: null,
      };
      if (state.imageSettings) {
        snapshot.imageSettings = { ...state.imageSettings, imageDataUrl: null, graphicAssetUrl: null };
      }
      formData.append('state_snapshot', JSON.stringify(snapshot));
    } catch {
      formData.append('state_snapshot', '{}');
    }

    // 인터랙션 통계
    formData.append('interaction_stats', JSON.stringify(getInteractionStats()));

    // 세부 설정 분석
    const detailStats = analyzeDetailSettings(state, targets);
    formData.append('detail_settings', JSON.stringify(detailStats));

    // 전송 후 카운터 리셋
    resetInteractionStats();
  } catch (e) {
    console.warn('[AdminLog] Failed to build metadata:', e);
  }

  // 썸네일 캡처 — 실패해도 메타 로그는 전송
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

      const blob = dataUrlToBlob(dataUrl);
      const fieldName = `thumbnail_${inst.type}_${inst.id}`;
      formData.append(fieldName, blob, `${inst.id}.png`);
      formData.append(`label_${fieldName}`, inst.label);
      formData.append(`width_${fieldName}`, String(config.width));
      formData.append(`height_${fieldName}`, String(config.height));
    } catch {
      // 개별 썸네일 캡처 실패 시 스킵
    }
  }

  // 로그 전송 — 썸네일 유무와 관계없이 반드시 실행
  try {
    console.debug('[AdminLog] Sending log to', ADMIN_API);
    await fetch(`${ADMIN_API}/api/logs`, {
      method: 'POST',
      body: formData,
    });
    console.debug('[AdminLog] Log sent successfully');
  } catch (e) {
    console.warn('[AdminLog] Failed to send log:', e);
  }
}

/** 세부 설정 사용 현황 분석 */
function analyzeDetailSettings(state: BannerState, targets: BannerInstance[]) {
  const result: Record<string, unknown> = {
    has_title_override: false,
    has_subtitle_override: false,
    has_bg_color_override: false,
    has_graphic_override: false,
    sub_text_positions: [] as string[],
    object_placements: [] as string[],
    cta_text: null as string | null,
    cta_color: null as string | null,
    notice_enabled: false,
    notice_text: null as string | null,
    duplicated_count: targets.filter((i) => !i.isOriginal).length,
  };

  for (const inst of targets) {
    const s = inst.settings as unknown as Record<string, unknown>;
    if (s.titleOverride) result.has_title_override = true;
    if (s.subtitleOverride) result.has_subtitle_override = true;
    if (s.backgroundColorOverride) result.has_bg_color_override = true;
    if (s.mainGraphicOverride) result.has_graphic_override = true;
    if (s.subTextPosition) (result.sub_text_positions as string[]).push(s.subTextPosition as string);
    if (s.objectPlacement) (result.object_placements as string[]).push(s.objectPlacement as string);
    // Popup-specific
    if (inst.type === 'popup') {
      if (s.ctaText) result.cta_text = s.ctaText as string;
      if (s.ctaColor) result.cta_color = s.ctaColor as string;
      if (s.noticeEnabled) {
        result.notice_enabled = true;
        result.notice_text = (s.notice as string) || null;
      }
    }
  }

  return result;
}
