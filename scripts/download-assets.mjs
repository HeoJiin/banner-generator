#!/usr/bin/env node
/**
 * Figma 3D Asset 2.0 벌크 다운로드 스크립트
 * - Figma REST API로 node 이미지 URL 발급 (배치)
 * - 2x PNG로 다운로드
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const FIGMA_TOKEN = process.env.FIGMA_TOKEN || 'figd_n2VOw1G-uNdP8VEe6Ocai9R91crgH9Wz4QODUZfW';
const FILE_KEY = 'mtYI2bDlCkaoIJXLcQRz0E';
const SCALE = 2;
const FORMAT = 'png';
const OUT_DIR = path.resolve(__dirname, '../public/assets/3d');
const BATCH_SIZE = 15;
const CONCURRENT_DOWNLOADS = 5;
const RETRY_BATCH_SIZE = 5;

// All 781 asset instances extracted from Figma metadata
const ASSETS = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'assets-manifest.json'), 'utf-8'));

async function fetchImageUrls(nodeIds) {
  const ids = nodeIds.join(',');
  const url = `https://api.figma.com/v1/images/${FILE_KEY}?ids=${encodeURIComponent(ids)}&scale=${SCALE}&format=${FORMAT}`;
  const res = await fetch(url, {
    headers: { 'X-Figma-Token': FIGMA_TOKEN },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API error ${res.status}: ${text}`);
  }
  const data = await res.json();
  return data.images; // { "nodeId": "url", ... }
}

async function downloadImage(imageUrl, filePath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`Download failed: ${res.status} for ${filePath}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(filePath, buffer);
}

function sanitizeFilename(name) {
  return name.replace(/[\/\\:*?"<>|]/g, '_');
}

async function downloadBatch(items, urlMap) {
  const queue = [...items];
  const results = { success: 0, fail: 0, errors: [] };

  async function worker() {
    while (queue.length > 0) {
      const [nodeId, name, filename] = queue.shift();
      const imageUrl = urlMap[nodeId];
      if (!imageUrl) {
        results.fail++;
        results.errors.push(`No URL for ${name} (${nodeId})`);
        continue;
      }
      try {
        const filePath = path.join(OUT_DIR, `${filename}.png`);
        await downloadImage(imageUrl, filePath);
        results.success++;
      } catch (err) {
        results.fail++;
        results.errors.push(`${name}: ${err.message}`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENT_DOWNLOADS }, () => worker());
  await Promise.all(workers);
  return results;
}

async function main() {
  console.log(`\n🎯 Figma 3D Asset 2.0 다운로드 시작`);
  console.log(`   총 ${ASSETS.length}개 에셋 | ${SCALE}x ${FORMAT.toUpperCase()} | 배치 ${BATCH_SIZE}개씩\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Handle duplicate names by appending node ID suffix
  const nameCount = {};
  const items = ASSETS.map(([nodeId, name]) => {
    const sanitized = sanitizeFilename(name);
    nameCount[sanitized] = (nameCount[sanitized] || 0) + 1;
    const filename = nameCount[sanitized] > 1
      ? `${sanitized}_${nodeId.replace(':', '-')}`
      : sanitized;
    return [nodeId, name, filename];
  });

  // Fix: second pass to also suffix the FIRST occurrence of duplicates
  const dupNames = new Set(
    Object.entries(nameCount).filter(([, c]) => c > 1).map(([n]) => n)
  );
  const seenNames = {};
  for (const item of items) {
    const sanitized = sanitizeFilename(item[1]);
    if (dupNames.has(sanitized)) {
      seenNames[sanitized] = (seenNames[sanitized] || 0) + 1;
      item[2] = `${sanitized}_${item[0].replace(':', '-')}`;
    }
  }

  let totalSuccess = 0;
  let totalFail = 0;
  const allErrors = [];

  // Skip already downloaded
  const alreadyDone = new Set();
  for (const item of items) {
    const filePath = path.join(OUT_DIR, `${item[2]}.png`);
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 1000) {
      alreadyDone.add(item[0]);
      totalSuccess++;
    }
  }
  const remaining = items.filter(([nodeId]) => !alreadyDone.has(nodeId));
  if (alreadyDone.size > 0) {
    console.log(`  ⏭️  이미 다운로드된 ${alreadyDone.size}개 스킵\n`);
  }

  // Process in batches
  const batches = [];
  for (let i = 0; i < remaining.length; i += BATCH_SIZE) {
    batches.push(remaining.slice(i, i + BATCH_SIZE));
  }

  const failedItems = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const nodeIds = batch.map(([nodeId]) => nodeId);

    process.stdout.write(`  [${i + 1}/${batches.length}] URL 발급 중... `);

    try {
      const urlMap = await fetchImageUrls(nodeIds);
      process.stdout.write(`다운로드 중... `);

      const results = await downloadBatch(batch, urlMap);
      totalSuccess += results.success;
      totalFail += results.fail;
      allErrors.push(...results.errors);

      console.log(`✅ ${results.success}/${batch.length}`);
    } catch (err) {
      console.log(`❌ API 에러 — 재시도 큐에 추가`);
      failedItems.push(...batch);
    }

    // Rate limit
    if (i < batches.length - 1) {
      await new Promise((r) => setTimeout(r, 1000));
    }
  }

  // Retry failed items with smaller batch size
  if (failedItems.length > 0) {
    console.log(`\n🔄 ${failedItems.length}개 재시도 (배치 ${RETRY_BATCH_SIZE}개씩)\n`);
    const retryBatches = [];
    for (let i = 0; i < failedItems.length; i += RETRY_BATCH_SIZE) {
      retryBatches.push(failedItems.slice(i, i + RETRY_BATCH_SIZE));
    }

    for (let i = 0; i < retryBatches.length; i++) {
      const batch = retryBatches[i];
      const nodeIds = batch.map(([nodeId]) => nodeId);
      process.stdout.write(`  재시도 [${i + 1}/${retryBatches.length}] `);

      try {
        const urlMap = await fetchImageUrls(nodeIds);
        const results = await downloadBatch(batch, urlMap);
        totalSuccess += results.success;
        // Subtract from fail count since these were already counted
        allErrors.push(...results.errors);
        console.log(`✅ ${results.success}/${batch.length}`);
      } catch (err) {
        totalFail += batch.length;
        console.log(`❌ ${err.message}`);
      }

      await new Promise((r) => setTimeout(r, 2000));
    }
  }

  console.log(`\n📊 완료: ${totalSuccess} 성공 / ${totalFail} 실패 (총 ${ASSETS.length})`);
  if (allErrors.length > 0) {
    console.log(`\n⚠️  에러 목록:`);
    allErrors.forEach((e) => console.log(`   - ${e}`));
  }
  console.log(`\n📁 저장 위치: ${OUT_DIR}\n`);
}

main().catch(console.error);
