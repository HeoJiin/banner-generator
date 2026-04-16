import { BannerState } from '@/types/banner';

const STORAGE_KEY = 'banner-saved-configs';

export interface SavedConfig {
  id: string;
  name: string;
  timestamp: number;
  state: BannerState;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

function formatDateTime(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const h = String(now.getHours()).padStart(2, '0');
  const min = String(now.getMinutes()).padStart(2, '0');
  return `${y}-${m}-${d} ${h}:${min}`;
}

export function getSavedConfigs(): SavedConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as SavedConfig[];
  } catch {
    return [];
  }
}

export function saveConfig(state: BannerState, customName?: string): SavedConfig {
  const configs = getSavedConfigs();
  const config: SavedConfig = {
    id: generateId(),
    name: customName || formatDateTime(),
    timestamp: Date.now(),
    state: { ...state, activeSettingsPanel: null },
  };
  configs.unshift(config);
  // 최대 30개 유지
  if (configs.length > 30) configs.length = 30;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
  } catch (e) {
    // 용량 초과 시 가장 오래된 항목 제거 후 재시도
    if (configs.length > 1) {
      configs.pop();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
      } catch {
        alert('저장 공간이 부족합니다. 기존 저장본을 삭제한 후 다시 시도해주세요.');
        throw e;
      }
    } else {
      alert('저장 공간이 부족합니다. 이미지 크기를 줄이거나 브라우저 저장 공간을 확보해주세요.');
      throw e;
    }
  }
  return config;
}

export function deleteConfig(id: string): void {
  const configs = getSavedConfigs().filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(configs));
}
