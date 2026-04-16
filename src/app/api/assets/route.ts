import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * 파일명 접두사 → keyword ID 매핑 (영어 파일명 기준)
 *
 * 그룹핑 규칙:
 * - "benefit-giftmoney1-1.webp" (키워드만) → benefit 그룹
 * - "benefit-christmas-1.webp" (키워드+시즌) → benefit_christmas 그룹만
 */

const KEYWORD_PREFIXES: Record<string, string> = {
  'benefit': 'benefit',
  'growth': 'growth',
  'urgent': 'urgent',
  '100won': 'hundred',
  'info': 'info',
};

const SEASON_TOKENS: Record<string, string> = {
  'spring': 'spring',
  'summer': 'summer',
  'autumn': 'autumn',
  'winter': 'winter',
  'christmas': 'christmas',
  'newyear': 'newyear',
  'chuseok': 'chuseok',
};

/**
 * GET /api/assets
 * public/assets/3d/ 스캔 → 파일명 접두사 매칭 → keyword별 + 조합별 그룹 반환
 */
export async function GET() {
  const dir = path.join(process.cwd(), 'public', 'assets', '3d');

  try {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.webp'));
    const groups: Record<string, string[]> = {};

    const addToGroup = (groupId: string, filePath: string) => {
      if (!groups[groupId]) groups[groupId] = [];
      groups[groupId].push(filePath);
    };

    for (const file of files) {
      const name = file.replace('.webp', '').toLowerCase();
      const filePath = `/assets/3d/${file}`;

      // 매칭된 키워드/시즌 수집
      const matchedKeywords: string[] = [];
      const matchedSeasons: string[] = [];

      for (const [prefix, kwId] of Object.entries(KEYWORD_PREFIXES)) {
        if (name.startsWith(prefix + '-') || name === prefix) {
          matchedKeywords.push(kwId);
        }
      }

      // 시즌: 파일명에 시즌 토큰이 포함되어 있는지 확인
      for (const [token, seasonId] of Object.entries(SEASON_TOKENS)) {
        if (name.includes('-' + token + '-') || name.includes('-' + token + '.') || name.endsWith('-' + token)) {
          matchedSeasons.push(seasonId);
        }
      }

      if (matchedKeywords.length > 0 && matchedSeasons.length > 0) {
        for (const kwId of matchedKeywords) {
          for (const seasonId of matchedSeasons) {
            addToGroup(`${kwId}_${seasonId}`, filePath);
          }
        }
      } else if (matchedKeywords.length > 0) {
        for (const kwId of matchedKeywords) {
          addToGroup(kwId, filePath);
        }
      } else if (matchedSeasons.length > 0) {
        for (const seasonId of matchedSeasons) {
          addToGroup(seasonId, filePath);
        }
      } else {
        addToGroup('uncategorized', filePath);
      }
    }

    return NextResponse.json({ groups });
  } catch {
    return NextResponse.json({ groups: {} });
  }
}
