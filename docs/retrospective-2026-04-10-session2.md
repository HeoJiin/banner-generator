# 세션 2 회고 — 디자인 시스템 QA + 기능 추가 (2026-04-10)

## 작업 흐름 요약

이번 세션은 **디자인 시스템 일관성 확보** → **기능 추가** 순서로 진행됨.
사용자가 직접 화면을 보면서 하나씩 짚어가는 방식 (눈에 보이는 문제 → 즉시 수정 → 확인 반복).

---

## Phase 1: 디자인 시스템 QA (컴포넌트 일관성)

### 1-1. 인풋 스타일 통일

| 문제 | 원인 | 해결 |
|------|------|------|
| 세부설정 타이틀 인풋에 미색 텍스트 | 오버라이드 안 된 상태에서 `text-content-tertiary` 적용 | 시스템에 없으므로 제거 |
| 인풋 보더색 시스템과 불일치 | `border-border` 사용 vs 시스템 `border-input` | 조건 분기 자체를 제거, `border-border`로 FormField와 동일하게 |
| 오버라이드 시 미색 배경 | `bg-accent-bg/30` — 시스템에 없는 스타일 | 배경색 제거 |

**교훈**: 시스템 컴포넌트(FormField, TextInput)에 없는 스타일은 쓰지 않는다. 커스텀 인풋을 만들 때 반드시 시스템 컴포넌트의 클래스를 참조.

### 1-2. 버튼 시스템화

| 변경 | before | after |
|------|--------|-------|
| "메인 설정으로 복원" | 인라인 `<button>` + 커스텀 스타일 | `Button variant="ghost" size="sm"` |
| "제거" 버튼 (5곳) | 인라인 `<button>` + `text-negative` | `Button variant="ghost" size="sm"` |
| "메인으로 복원" (디테일) | 인라인 `<button>` | `Button variant="ghost" size="sm"` |
| 이미지 업로드 | `<label>` 직접 스타일링 | `Button variant="secondary"` + hidden input ref |
| 블러 배경 랜덤 변경 | `variant="secondary"` + "랜덤 변경" | `variant="accent"` + "다시 뽑기" (다른 다시뽑기와 통일) |

**교훈**: 클릭 가능한 요소는 전부 Button 컴포넌트를 사용해야 인터랙션(focus ring, active scale)이 일관됨. `<label>`로 만든 업로드 버튼은 `useRef` + hidden input 패턴으로 Button 컴포넌트 활용 가능.

### 1-3. 레이아웃 시프트 방지

| 문제 | 해결 |
|------|------|
| 복원 버튼 나타날 때 높이 변동 | 라벨 영역에 `h-7` 고정 |

### 1-4. Chip 시스템 통일

| 변경 | 내용 |
|------|------|
| Chip size | 전부 sm → **md**로 통일 (InputPanel + DetailSettingsPanel) |
| ChipGroup 적용 | 소구점 키워드, 시즌 강조가 `<div flex wrap>`이었음 → `ChipGroup` 컴포넌트로 교체 |
| 괄호 숫자 제거 | `혜택 (12)` → `혜택` (노이즈 제거) |
| ChipGroup 갭 | 가로: sm 6→4px, md 8→6px / 세로: 8→10px |

### 1-5. 에셋 선택 UI 정리

| 변경 | 내용 |
|------|------|
| 미리보기 보더 제거 | `border-2 border-accent-border` 삭제 (이미지 리스트 선택 보더는 유지) |
| 선택 보더 래디어스 불일치 | `border` + `ring-1` → `border-2` + `border-transparent`로 통일 (래디어스 일치) |
| 미리보기 영역 | `bg-fill-tertiary px-3 py-2 rounded-lg`로 박스 묶기 |
| 에셋 그리드 갭 | Accordion 내부 space-y 제거 → 미리보기/칩/그리드 사이 `mb-3` 수동 적용 |

### 1-6. 기타 컴포넌트 정리

| 컴포넌트 | 변경 |
|----------|------|
| Accordion | 타이틀 배경 `fill-secondary` → `fill-tertiary` |
| SegmentControl | sm/md 사이즈 추가, 래디어스 충돌 수정 (sm 인디케이터: 5px, md: 6px) |
| Toggle | sm on 위치 13px → 15px (좌우 패딩 = 상하 패딩 3px 통일) |
| TabBar | 호버 배경색(`bg-fill-secondary`) 제거 |
| Button | 좌우 패딩 한 단계 축소 (sm: px-2, md: px-3, lg: px-4) |
| 디테일 패널 헤더 | 하단 보더 추가 (`-mx-5 px-5`로 좌우 풀 확장) |
| 복제 카드 | 왼쪽 액센트 보더 + 하이라이트 ring 제거 |

### 1-7. 슬라이더 커스텀

| 변경 | 내용 |
|------|------|
| 트랙 | 회색 배경, 보더 없음 |
| 진행률 | CSS 변수 `--range-progress`로 액센트 채움 |
| 컨트롤(thumb) | 흰색 fill, 액센트 보더, 연한 그림자 |
| 투명도 영역 | `mt-[16px]`, 라벨 `mb-2` 제거 |

### 1-8. 드롭다운 개선

| 변경 | 내용 |
|------|------|
| 배경 꾸밈 드롭다운 | `appearance-none` + SVG 쉐브론 (Accordion 스타일 차용) + `pr-8` |

---

## Phase 2: 기능 추가

### 2-1. 전면 그래픽 에셋 이미지 업로드

**구현**:
- `CategorizedAssetGrid`에 `Button variant="secondary"` + hidden `<input type="file">` 추가
- 업로드한 이미지를 dataURL로 변환 → `onSelect`로 전달
- 카테고리 탭 위에 배치, 구분선으로 "내 이미지" vs "프리셋 에셋" 영역 분리
- DetailSettingsPanel의 메인/서브 그래픽에도 동일 패턴 적용

**디자인 QA 피드백 반영**:
- 버튼 사이즈 통일 (`px-4 text-body`)
- 업로드/카테고리 영역 구분선 추가
- 미리보기 mb 통일 (`mb-3`)

### 2-2. CTA 색상 자동 추출 개선

**before**: `extractDominantColor` → 단일 dominant color → 그대로 CTA에 적용

**after**:
1. `extractPalette`로 6색 추출
2. 채도 30% 이상 + 명도 25~85% 필터 (vivid만)
3. vivid 팔레트 + 화이트 + 블랙 풀에서 **랜덤** 선택
4. `adjustCtaColorForBackground`로 배경 밝기에 따라 조정:
   - 밝은 배경 → 짙은 CTA (명도 ~35%)
   - 어두운 배경 → 밝은 CTA (명도 ~65%, 최대 230 cap)
5. CTA 텍스트 색상: `getCtaTextColor` — 짙은 버튼 → 화이트, 밝은 버튼 → 블랙

---

## 의사결정 기록

| 결정 | 이유 |
|------|------|
| 인풋 조건부 스타일 제거 | 시스템에 없는 스타일은 쓰지 않는다 |
| ring → border-2 전환 | ring은 border 바깥에 그려져 래디어스 불일치 |
| Accordion 내부 space-y 제거 | 영역별 갭이 다를 때 일괄 space-y는 부적절 |
| Chip size 전부 md | 패널 폭에서 sm은 너무 작음, 통일 우선 |
| 업로드 `<label>` → Button | 시스템 인터랙션(focus, press) 일관성 |
| CTA 팔레트 랜덤 | 매번 같은 색 나오면 재미없음, 다시뽑기 UX |

---

## 실수 & 오답노트

### 1. `border-border`를 템플릿 리터럴 안에 문자열 아닌 JS로 넣음
```
// ❌ ReferenceError: border is not defined
className={`... ${border-border}`}

// ✅ 조건 분기 불필요하면 일반 문자열로
className="... border-border"
```
**원인**: 삼항 연산자를 제거하면서 `${}` 안에 남겨둠
**교훈**: 조건 분기 제거 시 템플릿 리터럴도 같이 정리

### 2. `appearance-none`으로 드롭다운 화살표 사라짐
```
// ❌ 화살표 안 보임
className="... appearance-none"

// ✅ appearance-none + 커스텀 SVG 화살표
<div className="relative">
  <select className="... appearance-none" />
  <svg className="absolute right-3 top-1/2 ..." />
</div>
```
**교훈**: `appearance-none` 쓸 때는 반드시 대체 UI 같이 넣기

### 3. `mt-4`가 12px로 보인다는 피드백
Tailwind `mt-4` = 16px인데 사용자가 12px이라고 함. `mt-[16px]`로 명시했으나, 이후 토큰 단계를 쓰는 게 맞다는 결론.
**교훈**: 임의값(`mt-[16px]`) 대신 토큰 단계(`mt-4`) 사용

### 4. 제거 버튼 하나 빠뜨림
5곳 중 4곳만 Ghost Button으로 변경, 1곳(CategorizedAssetGrid 내부) 누락.
**교훈**: `replace_all` 불가능할 때 Grep으로 전수 확인 후 작업

### 5. SegmentControl 래디어스 반복 수정
sm 인디케이터: `rounded-sm`(2px) → `rounded`(4px) → `rounded-md`(6px) → `rounded-[5px]`
md 인디케이터: `rounded`(4px) → `rounded-md`(6px) → `rounded-lg`(8px) → `rounded-md`(6px) → `rounded`(4px)
**교훈**: 래디어스는 수학적으로 계산 (컨테이너 - 패딩 = 내부)하되, 최종적으로는 사용자 눈이 정답. 표로 정리해서 보여주면 의사결정이 빠름.

---

## 작업 스타일 패턴

### 사용자의 작업 방식
1. **눈으로 보고 짚는다** — 화면에서 이상한 점 발견 → 즉시 수정 요청
2. **시스템 기준으로 판단한다** — "시스템이랑 다른데?", "인풋 시스템에 없는거니까 쓰지마"
3. **한 번에 하나씩** — 큰 작업 단위가 아니라 세밀한 디테일을 연속으로 수정
4. **확인 후 다음으로 넘어간다** — 매 수정마다 화면 확인
5. **모르는 건 바로 물어본다** — "mt는 뭐고 mb는 뭐야", "오버라이드가 뭐야"
6. **디자인 → 기능 순서** — 디자인 QA 먼저 끝내고 기능 추가로 전환

### 효율적이었던 것
- 문제 발견 → 즉시 수정 → 확인 루프가 빨랐음
- 디자이너 에이전트를 활용해 UI 리뷰 받은 것
- 시스템 컴포넌트 기준으로 일관되게 판단한 것

### 개선할 점
- 여러 곳에 같은 패턴이 있을 때 한 번에 전수 변경하면 누락 줄일 수 있음
- 래디어스 같은 수치 작업은 표를 먼저 보여주고 결정하면 왕복 줄어듦
