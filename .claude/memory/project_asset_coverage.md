---
name: 배너 생성기 에셋 커버리지 현황
description: 소구점 키워드별/시즌 조합별 메인 그래픽 에셋 부족 영역 분석 (2026-04-10 기준)
type: project
---

## 메인 그래픽 에셋 현황 (동적 로딩 포함, 2026-04-10 기준)

### 소구점 키워드별
- benefit(혜택): 44개 ✅ — giftmoney, infinity, luckybag, money, moneygun, truck
- urgent(긴급): 26개 ✅ — bomb, fireclock, lightning, reward
- info(정보): 16개 ⚠️ — magnifier, magnifier-avatar, pencil 3종류만
- hundred(100원): 8개 ⚠️ — 100won 변형만
- growth(성장): 7개 ❌ — 가장 부족, 거의 하나의 종류

### 키워드 × 시즌 조합
- benefit_christmas(9), benefit_newyear(4)만 어느 정도 있음
- 나머지 조합은 대부분 0~1개. 봄/여름/겨울/추석 조합은 전멸

**Why:** 배너 다양성이 키워드/시즌 조합별 에셋 풀에 직접 의존함
**How to apply:** 에셋 추가 작업 시 growth > hundred > info 순으로 우선 보강, 시즌 조합은 christmas/newyear 외 확장 필요
