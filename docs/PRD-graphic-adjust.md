# PRD: 메인 그래픽 미세 조정 (팝업 / 콘텐츠)

> 작성일: 2026-04-22
> 상태: Draft — PO / FE 리뷰 필요

---

## 1. 배경 및 목적

현재 그래픽 모드의 메인 3D 에셋은 크기와 위치가 고정되어 있다.
- 팝업 배너: 320×320 컨테이너, 중앙 고정
- 콘텐츠 배너: 500×500 컨테이너, 우측 고정

사용자가 에셋의 크기와 위치를 **미세하게** 조정할 수 있도록 하여, 텍스트와의 균형이나 배너 완성도를 높인다.

---

## 2. 대상 배너

| 배너 | 크기 | 대상 여부 | 사유 |
|------|------|-----------|------|
| 이미지 팝업 | 520×520 | **O** | 메인 그래픽 크고 눈에 띔 |
| 콘텐츠 팝업 | 1000×600 | **O** | 메인 그래픽 크고 눈에 띔 |
| 상단 롤링 | 1330×128 | X | 띠배너, 조정 여지 적음 |
| BM | 665×146 | X | 소형 배너, 조정 여지 적음 |

---

## 3. 조정 파라미터

| 속성 | 범위 | 기본값 | 단위 | 설명 |
|------|------|--------|------|------|
| **크기 (scale)** | 0.85 ~ 1.0 | 1.0 | 배율 | 최대 15% 축소만 허용. 확대 없음 |
| **좌우 이동 (offsetX)** | -20 ~ +20 | 0 | px | 좌우 미세 이동 |
| **상하 이동 (offsetY)** | -20 ~ +20 | 0 | px | 상하 미세 이동 |

### 범위 설정 근거
- **크기**: 에셋이 원본보다 커지면 픽셀 깨짐 → 축소만 허용. 85%까지면 시각적으로 충분한 변화.
- **위치**: ±20px이면 텍스트-그래픽 간격 미세 조정에 충분. 과도한 이동은 레이아웃 깨짐 유발.

---

## 4. UI 설계

### 4.1 위치
- **세부 설정 패널** (`DetailSettingsPanel`) 내
- 팝업 또는 콘텐츠 인스턴스를 선택했을 때만 노출
- 그래픽 모드일 때만 노출 (이미지 모드에는 기존 ImageOverride 사용)

### 4.2 레이아웃

```
┌─ 메인 그래픽 조정 ──────────────────┐
│                                      │
│  크기    [━━━━━━━━━━━━━━━━●] 100%   │
│          85% ──────────── 100%       │
│                                      │
│  좌우    [━━━━━━━●━━━━━━━━]  0px    │
│          -20 ──────────── +20        │
│                                      │
│  상하    [━━━━━━━●━━━━━━━━]  0px    │
│          -20 ──────────── +20        │
│                                      │
│            [ 기본값으로 초기화 ]       │
└──────────────────────────────────────┘
```

### 4.3 인터랙션
- 슬라이더 드래그 → 실시간 미리보기 반영
- 슬라이더 값 라벨 우측 표시 (크기: %, 위치: px)
- **기본값 스냅**: 기본값(1.0, 0, 0) 근처 ±2 범위에서 자동 스냅
- **초기화 버튼**: 3개 값 모두 기본값으로 일괄 복원
- **Undo/Redo(⌘Z/⌘⇧Z)**: 기존 히스토리 시스템으로 단계별 되돌리기 지원

### 4.4 노출 조건
| 조건 | 노출 |
|------|------|
| 그래픽 모드 + 팝업/콘텐츠 인스턴스 | O |
| 이미지 모드 | X (기존 ImageOverride 사용) |
| 롤링/BM 인스턴스 | X |
| mainGraphicUrl 없음 (그래픽 미선택) | 슬라이더 비활성화(disabled) |

---

## 5. 데이터 모델

### 5.1 새 타입

```typescript
interface GraphicAdjust {
  scale: number;    // 0.85 ~ 1.0, default 1.0
  offsetX: number;  // -20 ~ +20, default 0
  offsetY: number;  // -20 ~ +20, default 0
}

const DEFAULT_GRAPHIC_ADJUST: GraphicAdjust = {
  scale: 1.0,
  offsetX: 0,
  offsetY: 0,
};
```

### 5.2 Settings 확장

```typescript
// PopupBannerSettings에 추가
graphicAdjust: GraphicAdjust;

// ContentBannerSettings에 추가
graphicAdjust: GraphicAdjust;
```

> RollingBannerSettings, BmBannerSettings에는 추가하지 않음.

---

## 6. 렌더링 적용

### PopupBanner.tsx

메인 그래픽 `<img>` 컨테이너에 transform 적용:

```css
transform: translate(-50%, -50%)
           scale(var(--graphic-scale))
           translate(var(--graphic-offsetX), var(--graphic-offsetY));
```

### ContentBanner.tsx

동일 패턴 적용.

### 적용 순서
1. 기존 위치 계산 (translate, top/left 등)
2. `graphicAdjust.scale` 적용
3. `graphicAdjust.offsetX/Y` 적용

---

## 7. 동작 규칙

### 7.1 Reroll (다시 뽑기)
- 에셋만 변경, **graphicAdjust 값은 유지**
- 사용자가 조정한 크기/위치를 보존

### 7.2 인스턴스 복제
- `graphicAdjust` 값 딥카피

### 7.3 저장/불러오기
- `graphicAdjust` 포함하여 저장
- 불러오기 시 값 없으면 `DEFAULT_GRAPHIC_ADJUST` 폴백

### 7.4 초기화
- **초기화 버튼 클릭** → `DEFAULT_GRAPHIC_ADJUST`로 복원
- **Undo(⌘Z)** → 히스토리 기반 단계별 되돌리기

---

## 8. 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 그래픽 미선택 상태 | 슬라이더 disabled, 값 유지 |
| 기존 저장본에 graphicAdjust 없음 | DEFAULT_GRAPHIC_ADJUST 폴백 |
| scale 0.85에서 offsetX ±20 조합 | 그래픽이 컨테이너 밖으로 나갈 수 있음 → overflow hidden으로 클리핑 |
| 텍스트 줄 수 변경으로 그래픽 위치 변동 (팝업) | graphicAdjust는 기존 동적 위치에 추가 적용되므로 자연스럽게 따라감 |

---

## 9. 리뷰 요청

### PO 확인 사항
- [ ] 조정 범위 (85%~100%, ±20px)가 사용자 니즈에 적절한가?
- [ ] 팝업/콘텐츠만 대상으로 하는 것이 맞는가?
- [ ] 확대(scale > 1.0) 불필요한가?

### FE 확인 사항
- [ ] `transform` 적용이 기존 동적 위치 계산(textOffset 등)과 충돌 없는가?
- [ ] 기존 `ImageOverride`와 `GraphicAdjust`의 역할 분리가 명확한가?
- [ ] 슬라이더 실시간 반영 시 성능 이슈 없는가?
- [ ] overflow hidden 클리핑이 PNG 출력(html-to-image)에 영향 없는가?
