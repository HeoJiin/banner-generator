---
name: 배너 생성기 프로젝트
description: 카카오스타일 파트너센터 배너 생성기 웹 툴 — 비디자이너가 직접 배너 제작 가능
type: project
---

## 프로젝트 개요
- 경로: `~/workspaces/banner-generator/`
- 스택: Next.js 14 + TypeScript + Tailwind CSS
- PNG 출력: html-to-image
- ZIP: JSZip
- 폰트: Pretendard CDN
- GitHub: `HeoJiin/kakaostyle` (비공개)

## 현재 상태 (2026-04-10 세션 완료)

### 완료된 기능
- 그래픽형/이미지형 모드 탭
- **소구점 키워드**: 혜택, 정보 제공, 성장, 긴급, 100원 (5개)
- **시즌 강조**: 봄, 여름, 가을, 겨울, 크리스마스, 신년, 추석
- **동적 에셋 로딩** — 영어 파일명 접두사 기반 자동 매핑 + uncategorized 그룹
- 배경: 컬러/그라데이션 (2색) + 방향 회전 + **텍스트 자동 대비**
- 배경 꾸밈: 겨울(2), 꽃(3), 컨페티(4), 나무, 모래성, 튜브, 파도, **낙엽, 단풍, 열매**, 화살표
- **배너 인스턴스 복제/삭제** — 같은 타입 문구 베리에이션 가능
- **배너별 오버라이드** — 타이틀/서브타이틀/메인그래픽 (메인 설정 상속 + 개별 수정)
- **다시 뽑기 분리** — 소구점 키워드 (에셋+배경) / 시즌 배경 (배경만)
- **메인 그래픽 카테고리 선택** — 소구점 5개 카테고리 (혜택/정보/성장/긴급/100원)
- **서브 그래픽 15개 카테고리** — 의류, 뷰티, 액세서리, 문구/가전, 돈/쿠폰, 선물/이벤트, 긴급, 음식/음료, 홍보/소통, 성장/목표, 장식/데코, 봄/여름, 가을/겨울, 신년/명절, 기타
- 이미지형: 롤링/BM **세로 중앙 정렬** (objectFit cover + objectPosition center)
- 컨텐츠 팝업 텍스트 영역 확장 (right: 78px)
- 저장/불러오기, 긴급 뱃지, 2x PNG + ZIP (인스턴스별)

### 에셋 파일명 영문화 (2026-04-09 완료)
- 3D 에셋 879개 + 배경 90개 한글→영어 일괄 전환
- 제로패딩 규칙: confetti-01, winter-02, flower-03 등
- 피그마 프레임명 동기화 완료 (섹션 + 자식 프레임)
- API 토큰 매핑 영어 접두사 기반으로 변경
- rename-assets.py 스크립트 + rename-map.json 보존

### 2026-04-10 작업
- 추석 시즌에 가을 배경 꾸밈 추가
- 시즌 강조 선택 해제 버튼 추가
- 여름 배경 꾸밈 카테고리 추가
- 소구점 키워드 배경 공유 팔레트화 (긴급 제외) — 67종
- designer 에이전트 리뉴얼 (사용자 마인드셋/7원칙 기반)
- 전체 디자인 QA 실행 (6 스코프, 49건) → P0/P1 전부 완료, P2/P3 대부분 완료
- **디자인 시스템 구축**:
  - UI 컴포넌트 시스템화 (`components/ui/`): Button, Chip, ChipGroup, IconButton, Toggle, SegmentControl, TabBar, Accordion, FormField, FormGroup, SectionTitle, SectionBlock, Label, TextInput, ColorPicker, Toast
  - 토큰 시스템 (tailwind.config.js): Text, Color, Spacing, Radius
  - **시맨틱 컬러 토큰 5카테고리**: Layer(배경), Fill(채움), Content(텍스트&아이콘), Accent(인디고), State(긍정/부정/경고/정보)
  - 레거시 토큰 → 시맨틱 토큰 마이그레이션 완료 (114건)
  - 인터랙션 애니메이션: SegmentControl sliding indicator, TabBar sliding underline, Accordion height 애니메이션, Button/Chip/Toggle/IconButton press 피드백, Toast fade-out
  - `/tokens` 라우트 — 실제 컴포넌트 렌더링 + 토큰 시각화 (자동 반영)
  - 카드 shadow, 배경 계층 정리 (layer-base-top/base/base-alt/surface/elevated)

### 2026-04-13 세션 2 (커밋 6ffa5ea)
- **Undo/Redo** (히스토리 50, ⌘Z/⌘⇧Z, ref 기반 race 방지)
- **세부 패널 발견성 개선** — hover 오버레이 CTA + 캔버스 클릭
- **이미지 영역 조절 재설계** — 4 variant 통일, transform scale + objectPosition, 스냅 슬라이더
- **이미지 맞춤 토글** (cover/contain) + 그라데이션 영역(spread) 슬라이더
- **개별 오버라이드 null 타입화** — 빈 문자열 유지 가능
- **긴급 뱃지 이미지형에도 노출** + 개별 숨기기 조건부
- **시즌 컬러 확장** — 각 시즌 25종 (기존 12종)
- **winter3/winter4 배경 꾸밈** 추가 (winter4 = 크리스마스 전용)
- **PRD-v5.md + BRD.md** 성과 문서 작성 (PO 에이전트)
- **dev:host 스크립트** (외부 PC 접근)
- QA 3개 에이전트 병렬 → P0 1건 + P1/P2 11건 수정

### 남은 액션 아이템
1. 하위 호환 토큰 @deprecated 표시 + 장기 제거
2. 전면 그래픽 에셋 미리보기 영역 mb 조정 (마지막 작업 중단됨)
3. QA 나머지 항목: 배경 꾸밈 <select> → 세그먼트 (#12), indigo 남용 정리 (#18)
4. 세부 패널 진입점 3중 병존 정리 방향 결정 (톱니/캔버스/오버레이)
5. 저장본 마이그레이션 토스트 안내
6. 긴 타이틀 오버플로 방지 (권장 글자수)
7. Notion MCP 연결 (Integration 토큰 필요)
8. 배포

## 핵심 구조
- 동적 에셋: 영어 파일명 접두사 기반 자동 매핑 (benefit-, urgent-, info-, growth-, 100won-)
- 시즌 강조 시: 조합 에셋 75% + 범용 25% 혼합
- 배너 인스턴스: `instances[]` 배열, `buildStateForInstance`로 템플릿 무변경 렌더링
- 서브 그래픽: `SUB_CATEGORY_MAP`으로 영어 접두사→15개 카테고리 분류

## PRD
- `/banner-generator/docs/PRD.md` — v4.0
