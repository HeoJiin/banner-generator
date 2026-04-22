/**
 * 세션 내 사용자 인터랙션을 카운팅한다.
 * 다운로드 시 adminLog에서 이 데이터를 함께 전송한다.
 */

const counters: Record<string, number> = {
  reroll_theme: 0,        // 소구점 랜덤 버튼
  reroll_season: 0,       // 시즌 랜덤 버튼
  reroll_highlight: 0,    // 하이라이트 색 다시 뽑기
  reroll_background: 0,   // 배경 랜덤 버튼
  detail_panel_open: 0,   // 세부 설정 패널 오픈
  duplicate: 0,           // 배너 복제
};

export function trackInteraction(key: keyof typeof counters): void {
  counters[key] = (counters[key] || 0) + 1;
}

export function getInteractionStats(): Record<string, number> {
  return { ...counters };
}

export function resetInteractionStats(): void {
  for (const key of Object.keys(counters)) {
    counters[key] = 0;
  }
}
