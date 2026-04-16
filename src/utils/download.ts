import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { BannerType, BANNER_TYPES, BannerInstance } from '@/types/banner';

function getTimestamp(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  const time = now.toTimeString().slice(0, 8).replace(/:/g, '');
  return `${date}_${time}`;
}

function getFileNameForInstance(instance: BannerInstance, index: number): string {
  const config = BANNER_TYPES.find((t) => t.type === instance.type);
  if (!config) return `${instance.type}@2x.png`;
  const suffix = index > 0 ? `_${index + 1}` : '';
  return `${instance.type}${suffix}_${config.width * 2}x${config.height * 2}@2x.png`;
}

async function captureElement(element: HTMLElement, width: number, height: number): Promise<Blob> {
  const dataUrl = await toPng(element, {
    width,
    height,
    pixelRatio: 2,
    cacheBust: true,
    style: {
      transform: 'none',
    },
  });

  const res = await fetch(dataUrl);
  return res.blob();
}

/* ── Individual download ── */
export async function downloadBannerAsPng(
  element: HTMLElement,
  instanceId: string,
  width: number,
  height: number
): Promise<void> {
  const blob = await captureElement(element, width, height);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${instanceId}_${width * 2}x${height * 2}@2x.png`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/* ── ZIP download (all instances) ── */
export async function downloadAllAsZip(
  refs: Record<string, HTMLDivElement | null>,
  instances: BannerInstance[],
  onProgress?: (done: number, total: number) => void
): Promise<void> {
  const zip = new JSZip();
  const enabled = instances.filter((i) => i.enabled);

  // 같은 타입 내 순번 계산
  const typeCounters: Record<string, number> = {};
  let done = 0;

  for (const inst of enabled) {
    const el = refs[inst.id];
    const config = BANNER_TYPES.find((t) => t.type === inst.type);
    if (!el || !config) continue;

    const idx = typeCounters[inst.type] ?? 0;
    typeCounters[inst.type] = idx + 1;

    const blob = await captureElement(el, config.width, config.height);
    zip.file(getFileNameForInstance(inst, idx), blob);
    done++;
    onProgress?.(done, enabled.length);
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const link = document.createElement('a');
  link.download = `banners_${getTimestamp()}.zip`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}
