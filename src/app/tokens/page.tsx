'use client';

import React, { useState } from 'react';
import { Toggle, Label, TextInput, SegmentControl, SectionTitle, Accordion, ColorPicker, Chip, ChipGroup, IconButton, Button, TabBar, FormField, FormGroup, SectionBlock, showToast } from '@/components/ui';

/* ── Token values from tailwind.config.js (display only) ── */
const COLOR_GROUPS = [
  /* ═══ 1. Background ═══ */
  { label: '1. Layer — 레이아웃 배경', tokens: [
    { token: 'layer-base-top', value: '#F5F6F7', desc: '최상단 base — 프리뷰 영역 배경' },
    { token: 'layer-base', value: '#F0F1F3', desc: '중간 base — 페이지/body 배경' },
    { token: 'layer-base-alt', value: '#E8EAED', desc: '최하단 base — 가장 어두운 배경' },
    { token: 'layer-surface', value: '#FFFFFF', desc: '카드, 패널, 사이드바' },
    { token: 'layer-elevated', value: '#FFFFFF', desc: 'popover, modal (shadow로 구분)' },
    { token: 'layer-disabled', value: '#F5F6F7', desc: '비활성 카드' },
    { token: 'layer-dimmed', value: 'rgba(0,0,0,0.4)', desc: '오버레이 딤' },
  ]},

  /* ═══ 2. Fill ═══ */
  { label: '2. Fill — 박스/영역 채움 (배경보다 살짝 낮은 명도)', tokens: [
    { token: 'fill-primary', value: '#E8EAED', desc: '가장 강한 fill — 세그먼트, 토글 off' },
    { token: 'fill-secondary', value: '#F0F1F3', desc: '보조 fill — hover 배경' },
    { token: 'fill-tertiary', value: '#F5F6F7', desc: '약한 fill — 미세한 구분' },
    { token: 'fill-disabled', value: '#F5F6F7', desc: '비활성' },
    { token: 'fill-strong', value: '#D1D5DB', desc: '강한 fill — 프로그레스 트랙' },
    { token: 'fill-white', value: '#FFFFFF', desc: '토글 thumb, 반전' },
  ]},

  /* ═══ 3. Content (Text & Icon) ═══ */
  { label: '3. Content — Text & Icon', tokens: [
    { token: 'content-primary', value: '#111827', desc: '제목, 강조' },
    { token: 'content-secondary', value: '#374151', desc: '본문, 라벨' },
    { token: 'content-tertiary', value: '#6B7280', desc: '보조, placeholder (14px↑)' },
    { token: 'content-disabled', value: '#9CA3AF', desc: '비활성 (WCAG 예외)' },
    { token: 'content-inverse', value: '#FFFFFF', desc: '어두운 배경 위' },
  ]},

  /* ═══ 4. Accent — Primary (Indigo) ═══ */
  { label: '4. Accent — Primary (Indigo)', tokens: [
    { token: 'accent', value: '#4F46E5', desc: '액센트 컬러' },
    { token: 'accent-hover', value: '#4338CA', desc: 'hover/pressed' },
    { token: 'accent-content', value: '#4F46E5', desc: '텍스트 & 아이콘 — 링크, 강조' },
    { token: 'accent-border', value: '#4F46E5', desc: '선택 상태 border' },
    { token: 'accent-border-subtle', value: '#C7D2FE', desc: '선택 틴트 border' },
    { token: 'accent-bg', value: '#EEF2FF', desc: 'accent 배경 (subtle)' },
    { token: 'accent-focus', value: '#818CF8', desc: '포커스 링' },
    { token: 'accent-disabled', value: '#C7D2FE', desc: '비활성 accent' },
  ]},

  /* ═══ 5. State ═══ */
  { label: '5. State — Positive (Green)', tokens: [
    { token: 'positive', value: '#22C55E', desc: '아이콘, 인디케이터' },
    { token: 'positive-content', value: '#15803D', desc: '텍스트 (AA 충족)' },
    { token: 'positive-border', value: '#22C55E', desc: 'border' },
    { token: 'positive-bg', value: '#F0FDF4', desc: '배경 (subtle)' },
  ]},
  { label: '5. State — Negative (Red)', tokens: [
    { token: 'negative', value: '#EF4444', desc: '아이콘, 인디케이터' },
    { token: 'negative-content', value: '#DC2626', desc: '텍스트 (AA 충족)' },
    { token: 'negative-border', value: '#EF4444', desc: 'border' },
    { token: 'negative-bg', value: '#FEF2F2', desc: '배경 (subtle)' },
  ]},
  { label: '5. State — Warning (Amber)', tokens: [
    { token: 'warning', value: '#F59E0B', desc: '아이콘, 인디케이터' },
    { token: 'warning-content', value: '#B45309', desc: '텍스트 (AA 충족)' },
    { token: 'warning-border', value: '#F59E0B', desc: 'border' },
    { token: 'warning-bg', value: '#FFFBEB', desc: '배경 (subtle)' },
  ]},
  { label: '5. State — Info (Blue)', tokens: [
    { token: 'info', value: '#3B82F6', desc: '아이콘, 인디케이터' },
    { token: 'info-content', value: '#1D4ED8', desc: '텍스트 (AA 충족)' },
    { token: 'info-border', value: '#3B82F6', desc: 'border' },
    { token: 'info-bg', value: '#EFF6FF', desc: '배경 (subtle)' },
  ]},

  /* ═══ Utility — Border ═══ */
  { label: 'Utility — Border', tokens: [
    { token: 'border', value: '#E5E7EB', desc: '기본 구분선' },
    { token: 'border-secondary', value: '#F0F1F3', desc: '약한 구분' },
    { token: 'border-strong', value: '#D1D5DB', desc: '강한 구분' },
  ]},
];

const TYPOGRAPHY = [
  { token: 'text-caption', size: '12px / 16px', desc: '칩, 뱃지, 메타' },
  { token: 'text-body', size: '13px / 18px', desc: '본문, 라벨' },
  { token: 'text-body-lg', size: '14px / 20px', desc: '입력, CTA' },
  { token: 'text-h3', size: '13px / 18px bold', desc: '섹션 제목' },
  { token: 'text-h2', size: '15px / 22px bold', desc: '모달/페이지 제목' },
  { token: 'text-h1', size: '18px / 26px bold', desc: '페이지 제목' },
  { token: 'text-display', size: '24px / 32px bold', desc: '히어로' },
];

const SPACING = [
  { tw: '0.5', value: '2px', semantic: '내부' },
  { tw: '1', value: '4px', semantic: '밀착' },
  { tw: '1.5', value: '6px', semantic: '촘촘' },
  { tw: '2', value: '8px', semantic: '좁음' },
  { tw: '3', value: '12px', semantic: '기본' },
  { tw: '4', value: '16px', semantic: '넓음' },
  { tw: '5', value: '20px', semantic: '섹션' },
  { tw: '6', value: '24px', semantic: '영역' },
  { tw: '8', value: '32px', semantic: '페이지' },
];

const RADII = [
  { token: 'rounded-sm', value: '4px', desc: '토글, 태그' },
  { token: 'rounded-md', value: '8px', desc: '버튼, 입력' },
  { token: 'rounded-lg', value: '12px', desc: '카드' },
  { token: 'rounded-xl', value: '16px', desc: '모달' },
  { token: 'rounded-full', value: '9999px', desc: '칩, 뱃지' },
];

function Section({ id, title, desc, children }: { id: string; title: string; desc: string; children: React.ReactNode }) {
  return (
    <section id={id} className="bg-layer-surface border border-border rounded-lg p-8 mb-6">
      <h2 className="text-h1 font-bold text-content-primary mb-1">{title}</h2>
      <p className="text-body text-content-tertiary mb-6">{desc}</p>
      {children}
    </section>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return <h3 className="text-caption font-bold text-content-tertiary uppercase tracking-wider mt-6 mb-3 first:mt-0">{children}</h3>;
}

function Row({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div className="flex items-center gap-3 mb-3 flex-wrap">
      {label && <span className="text-caption text-content-tertiary min-w-[100px]">{label}</span>}
      {children}
    </div>
  );
}

export default function TokensPage() {
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [sbToggle1, setSbToggle1] = useState(true);
  const [sbToggle2, setSbToggle2] = useState(false);
  const [seg, setSeg] = useState<string>('a');
  const [chipSel, setChipSel] = useState('benefit');
  const [tab, setTab] = useState('basic');
  const [color, setColor] = useState('#4F46E5');
  const [inputVal, setInputVal] = useState('입력값 예시');

  return (
    <div className="flex min-h-screen bg-fill-secondary">
      {/* Sidebar */}
      <nav className="w-[200px] bg-foreground p-6 fixed top-0 left-0 bottom-0 overflow-y-auto">
        <h1 className="text-body-lg font-bold mb-6 text-content-inverse">Design System</h1>
        {['buttons', 'chip', 'toggle', 'inputs', 'segment', 'tab-bar', 'section-block', 'accordion', 'color-picker', 'icon-button', 'toast', 'colors', 'typography', 'spacing', 'radius'].map((id) => (
          <a key={id} href={`#${id}`} className="block py-1.5 px-3 text-body text-content-inverse/60 hover:text-content-inverse rounded-sm mb-0.5 transition-colors">
            {id}
          </a>
        ))}
      </nav>

      {/* Content */}
      <main className="ml-[200px] p-8 flex-1">
        <h1 className="text-display font-bold text-content-primary mb-2">배너 생성기 디자인 시스템</h1>
        <p className="text-body text-content-tertiary mb-8">실제 ui/ 컴포넌트를 렌더링합니다. 토큰 변경 시 자동 반영.</p>

        {/* ═══ Buttons ═══ */}
        <Section id="buttons" title="Button" desc="ui/Button.tsx — variant: primary, secondary, ghost, accent / size: sm, md, lg">
          <SubHeading>Primary</SubHeading>
          <Row>
            <Button variant="primary" size="lg">전체 다운로드</Button>
            <Button variant="primary" size="md">저장</Button>
            <Button variant="primary" size="sm">작은 버튼</Button>
            <Button variant="primary" size="md" disabled>비활성</Button>
          </Row>
          <SubHeading>Secondary</SubHeading>
          <Row>
            <Button variant="secondary" size="lg">불러오기</Button>
            <Button variant="secondary" size="md">취소</Button>
          </Row>
          <SubHeading>Ghost</SubHeading>
          <Row>
            <Button variant="ghost" size="md">키워드 해제</Button>
            <Button variant="ghost" size="sm">시즌 해제</Button>
          </Row>
          <SubHeading>Accent</SubHeading>
          <Row>
            <Button variant="accent" size="sm">🎲 소구점 다시 뽑기</Button>
            <Button variant="accent" size="sm">🎲 시즌 배경 다시 뽑기</Button>
          </Row>
        </Section>

        {/* ═══ Chip ═══ */}
        <Section id="chip" title="Chip + ChipGroup" desc="ui/Chip.tsx + ui/ChipGroup.tsx — size: sm (gap 6px), md (gap 8px)">
          <SubHeading>Medium — ChipGroup (gap 8px)</SubHeading>
          <ChipGroup>
            {['혜택', '정보 제공', '성장', '긴급', '100원'].map((label) => (
              <Chip key={label} selected={chipSel === label} onClick={() => setChipSel(label)}>{label}</Chip>
            ))}
          </ChipGroup>
          <SubHeading>Small — ChipGroup size="sm" (gap 6px)</SubHeading>
          <ChipGroup size="sm">
            {['의류', '뷰티', '액세서리', '음식', '돈/쿠폰', '선물', '기타'].map((label) => (
              <Chip key={label} size="sm" selected={label === '의류'} onClick={() => {}}>{label} (12)</Chip>
            ))}
          </ChipGroup>
          <SubHeading>줄바꿈 테스트 (md)</SubHeading>
          <div className="max-w-[280px] border border-border/50 rounded-md p-3">
            <ChipGroup>
              {['봄', '여름', '가을', '겨울', '크리스마스', '신년', '추석'].map((label) => (
                <Chip key={label} selected={label === '가을'} onClick={() => {}}>{label}</Chip>
              ))}
            </ChipGroup>
          </div>
        </Section>

        {/* ═══ Toggle ═══ */}
        <Section id="toggle" title="Toggle" desc="ui/Toggle.tsx — size: sm, md / role=switch, aria-checked">
          <SubHeading>Medium (기본)</SubHeading>
          <Row>
            <Toggle checked={toggle1} onChange={setToggle1} />
            <span className="text-caption text-content-tertiary">{toggle1 ? 'ON' : 'OFF'}</span>
          </Row>
          <SubHeading>Small</SubHeading>
          <Row>
            <Toggle size="sm" checked={toggle2} onChange={setToggle2} />
            <span className="text-caption text-content-tertiary">{toggle2 ? 'ON' : 'OFF'}</span>
          </Row>
        </Section>

        {/* ═══ Inputs ═══ */}
        <Section id="inputs" title="FormField + FormGroup" desc="ui/FormField.tsx + ui/FormGroup.tsx — 타이틀+인풋 템플릿">
          <SubHeading>FormField 단독</SubHeading>
          <div className="max-w-[320px]">
            <FormField label="타이틀" value={inputVal} onChange={setInputVal} placeholder="타이틀을 입력하세요" defaultValue="타이틀을 입력하세요" multiline />
          </div>
          <SubHeading>FormGroup — 두 개 나란히 (gap 12px)</SubHeading>
          <div className="max-w-[320px]">
            <FormGroup>
              <FormField label="타이틀" value={inputVal} onChange={setInputVal} placeholder="타이틀을 입력하세요" multiline />
              <FormField label="서브타이틀" value="최대 70% 할인" onChange={() => {}} placeholder="서브타이틀을 입력하세요" multiline />
            </FormGroup>
          </div>
          <SubHeading>FormField — 단일 input</SubHeading>
          <div className="max-w-[320px]">
            <FormField label="CTA 텍스트" value="자세히 보기" onChange={() => {}} placeholder="버튼 텍스트" />
          </div>
          <SubHeading>기존 TextInput (sm, 세부설정용)</SubHeading>
          <div className="max-w-[320px]">
            <TextInput label="라벨" value={inputVal} onChange={setInputVal} placeholder="텍스트를 입력하세요" />
          </div>
          <SubHeading>Label 단독</SubHeading>
          <Label>독립 라벨</Label>
        </Section>

        {/* ═══ Segment ═══ */}
        <Section id="segment" title="SegmentControl" desc="ui/SegmentControl.tsx — 탭/모드 전환">
          <SubHeading>2단</SubHeading>
          <SegmentControl label="모드" options={[{ value: 'a', label: '그래픽형' }, { value: 'b', label: '이미지형' }]} value={seg} onChange={setSeg} />
          <SubHeading>4단</SubHeading>
          <SegmentControl label="배치" options={[{ value: 'a', label: '양쪽' }, { value: 'b', label: '좌' }, { value: 'c', label: '우' }, { value: 'd', label: '없음' }]} value={seg} onChange={setSeg} />
        </Section>

        {/* ═══ TabBar ═══ */}
        <Section id="tab-bar" title="TabBar" desc="ui/TabBar.tsx — 섹션 탭 전환, sliding underline indicator">
          <SubHeading>2탭</SubHeading>
          <div className="max-w-[320px] border border-border rounded-md overflow-hidden">
            <TabBar tabs={[{ value: 'basic', label: '기본 설정' }, { value: 'detail', label: '세부 설정' }]} value={tab} onChange={setTab} />
            <div className="p-4 text-caption text-content-tertiary">
              {tab === 'basic' ? '기본 설정 영역' : '세부 설정 영역'}
            </div>
          </div>
          <SubHeading>3탭</SubHeading>
          <div className="max-w-[400px] border border-border rounded-md overflow-hidden">
            <TabBar tabs={[{ value: 'basic', label: '텍스트' }, { value: 'detail', label: '배경' }, { value: 'graphic', label: '그래픽' }]} value={tab} onChange={setTab} />
          </div>
        </Section>

        {/* ═══ Accordion ═══ */}
        <Section id="accordion" title="Accordion" desc="ui/Accordion.tsx">
          <div className="max-w-[320px]">
            <Accordion label="서브 그래픽 에셋" defaultOpen>
              <p className="text-caption text-content-tertiary">아코디언 내부 콘텐츠</p>
            </Accordion>
          </div>
        </Section>

        {/* ═══ ColorPicker ═══ */}
        <Section id="color-picker" title="ColorPicker" desc="ui/ColorPicker.tsx — compact / full mode">
          <SubHeading>Full</SubHeading>
          <div className="max-w-[320px]">
            <ColorPicker label="배경 색상" value={color} onChange={setColor} />
          </div>
          <SubHeading>Compact</SubHeading>
          <ColorPicker label="" value={color} onChange={setColor} compact />
        </Section>

        {/* ═══ IconButton ═══ */}
        <Section id="icon-button" title="IconButton" desc="ui/IconButton.tsx — variant: default, destructive, active">
          <Row>
            <IconButton aria-label="복제" title="default">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            </IconButton>
            <IconButton variant="destructive" aria-label="삭제" title="destructive">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </IconButton>
            <IconButton variant="active" aria-label="설정" title="active">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </IconButton>
            <IconButton disabled aria-label="비활성" title="disabled">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            </IconButton>
          </Row>
        </Section>

        {/* ═══ Toast ═══ */}
        <Section id="toast" title="Toast" desc="ui/Toast.tsx — type: info, error, undo">
          <Row>
            <Button variant="ghost" size="sm" onClick={() => showToast({ text: '다운로드 완료', type: 'info', duration: 2000 })}>Info Toast</Button>
            <Button variant="ghost" size="sm" onClick={() => showToast({ text: '다운로드 실패', type: 'error', duration: 2000 })}>Error Toast</Button>
            <Button variant="ghost" size="sm" onClick={() => showToast({ text: '삭제됨', type: 'undo', onUndo: () => {}, duration: 3000 })}>Undo Toast</Button>
          </Row>
        </Section>

        {/* ═══ SectionBlock ═══ */}
        <Section id="section-block" title="SectionBlock" desc="ui/SectionBlock.tsx — 패널 내 섹션 템플릿. 구분선 + 타이틀 + 액션/토글 + 설명 + children(gap)">
          <SubHeading>기본형 (first)</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="텍스트">
              <FormField label="타이틀" value="봄 신상 입고!" onChange={() => {}} multiline />
              <FormField label="서브타이틀" value="최대 70% 할인" onChange={() => {}} multiline />
            </SectionBlock>
          </div>

          <SubHeading>타이틀 + 설명 + 콘텐츠</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="소구점 키워드" desc="선택하면 배경/그래픽이 자동 세팅됩니다" action={<Button variant="ghost" size="sm">키워드 해제</Button>}>
              <ChipGroup>
                <Chip selected>혜택</Chip>
                <Chip>정보 제공</Chip>
                <Chip>성장</Chip>
                <Chip>긴급</Chip>
              </ChipGroup>
            </SectionBlock>
          </div>

          <SubHeading>토글 모드 (ON)</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="긴급 뱃지" toggle checked={sbToggle1} onToggle={setSbToggle1}>
              <div className="text-caption text-content-tertiary">뱃지 에디터 콘텐츠 영역</div>
            </SectionBlock>
          </div>

          <SubHeading>토글 모드 (OFF)</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="블러 배경" toggle checked={sbToggle2} onToggle={setSbToggle2}>
              <div className="text-caption text-content-tertiary">이 내용은 토글 OFF일 때 안 보임</div>
            </SectionBlock>
          </div>

          <SubHeading>토글 + 액션 동시</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="배경 꾸밈" toggle checked={sbToggle1} onToggle={setSbToggle1} action={<Button variant="ghost" size="sm">🎲 랜덤</Button>}>
              <div className="text-caption text-content-tertiary">배경 꾸밈 선택기 영역</div>
            </SectionBlock>
          </div>

          <SubHeading>구분선 있는 연속 섹션</SubHeading>
          <div className="max-w-[320px] bg-layer-surface border border-border rounded-lg p-5">
            <SectionBlock first title="텍스트">
              <FormField label="타이틀" value="봄 신상 입고!" onChange={() => {}} multiline />
              <FormField label="서브타이틀" value="최대 70% 할인" onChange={() => {}} multiline />
            </SectionBlock>
            <SectionBlock title="소구점 키워드" desc="선택하면 배경/그래픽이 자동 세팅됩니다">
              <ChipGroup>
                <Chip selected>혜택</Chip>
                <Chip>성장</Chip>
              </ChipGroup>
            </SectionBlock>
            <SectionBlock title="긴급 뱃지" toggle checked={sbToggle1} onToggle={setSbToggle1}>
              <div className="text-caption text-content-tertiary">뱃지 설정</div>
            </SectionBlock>
          </div>
        </Section>

        {/* ═══ Color Tokens ═══ */}
        <Section id="colors" title="Color Tokens" desc="Semantic Color System — Surface / Text / BG / Border / Fill / Icon">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label}>
              <SubHeading>{group.label}</SubHeading>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {group.tokens.map((c) => {
                  const isLight = ['#FFFFFF', '#F5F6F7', '#F0F1F3', '#EEF2FF', '#F0FDF4', '#FEF2F2', '#FFFBEB', '#EFF6FF', '#C7D2FE'].includes(c.value);
                  const isContent = group.label.includes('Content');
                  return (
                    <div key={c.token} className="flex items-center gap-3 py-2">
                      <div
                        className="w-8 h-8 rounded-sm border border-border flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: isContent ? (isLight ? '#111827' : '#FFFFFF') : c.value }}
                      >
                        {isContent && (
                          <span className="text-caption font-bold" style={{ color: c.value }}>A</span>
                        )}
                      </div>
                      <div>
                        <div className="text-caption font-semibold font-mono">{c.token}</div>
                        <div className="text-caption text-content-tertiary">{c.value} — {c.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Section>

        {/* ═══ Typography ═══ */}
        <Section id="typography" title="Typography" desc="tailwind.config.js — 최소 12px">
          <SubHeading>토큰 스케일</SubHeading>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Token</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Size</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Preview</th>
              </tr>
            </thead>
            <tbody>
              {TYPOGRAPHY.map((t) => (
                <tr key={t.token} className="border-b border-border/50">
                  <td className="py-3 text-caption font-mono font-medium">{t.token}</td>
                  <td className="py-3 text-caption text-content-tertiary">{t.size}</td>
                  <td className="py-3">
                    <span className={t.token.replace('text-', 'text-') + (t.token.includes('h') || t.token.includes('display') ? ' font-bold' : '')}>
                      {t.desc}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <SubHeading>텍스트 용도 맵 — 어디서 어떤 토큰을 쓰는가</SubHeading>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">토큰</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Weight</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Color</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">UI 위치</th>
                <th className="text-left text-caption font-semibold text-content-tertiary py-2">Preview</th>
              </tr>
            </thead>
            <tbody>
              {/* h1 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-h1</td>
                <td className="py-3 text-caption text-content-tertiary">bold</td>
                <td className="py-3 text-caption text-content-tertiary">foreground</td>
                <td className="py-3 text-caption text-content-tertiary">TopBar 페이지 타이틀</td>
                <td className="py-3"><span className="text-h1 font-bold text-content-primary">배너 생성기</span></td>
              </tr>
              {/* h2 — 섹션 제목 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-h2</td>
                <td className="py-3 text-caption text-content-tertiary">bold</td>
                <td className="py-3 text-caption text-content-tertiary">foreground</td>
                <td className="py-3 text-caption text-content-tertiary">섹션 제목 (텍스트, 소구점, 배경, 블러, 배경꾸밈, 그래픽, 긴급뱃지)</td>
                <td className="py-3"><span className="text-h2 font-bold text-content-primary">소구점 키워드</span></td>
              </tr>
              {/* h2 — 모달 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-h2</td>
                <td className="py-3 text-caption text-content-tertiary">bold</td>
                <td className="py-3 text-caption text-content-tertiary">popover-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">모달 헤더</td>
                <td className="py-3"><span className="text-h2 font-bold text-content-primary">저장 / 불러오기</span></td>
              </tr>
              {/* body-lg — CTA */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body-lg</td>
                <td className="py-3 text-caption text-content-tertiary">semibold</td>
                <td className="py-3 text-caption text-content-tertiary">primary-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">Primary CTA 버튼</td>
                <td className="py-3"><span className="text-body-lg font-semibold text-primary bg-accent text-content-inverse px-3 py-1 rounded-md">전체 다운로드</span></td>
              </tr>
              {/* body-lg — 입력 필드 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body-lg</td>
                <td className="py-3 text-caption text-content-tertiary">regular</td>
                <td className="py-3 text-caption text-content-tertiary">foreground</td>
                <td className="py-3 text-caption text-content-tertiary">타이틀/서브타이틀 입력 필드 값</td>
                <td className="py-3"><span className="text-body-lg text-content-primary">봄 신상 입고!</span></td>
              </tr>
              {/* body — 입력 라벨 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body</td>
                <td className="py-3 text-caption text-content-tertiary">semibold</td>
                <td className="py-3 text-caption text-content-tertiary">secondary-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">입력 필드 라벨 (타이틀, 서브타이틀, 배경색상, 투명도)</td>
                <td className="py-3"><span className="text-body font-semibold text-content-secondary">타이틀</span></td>
              </tr>
              {/* body — TabBar */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body</td>
                <td className="py-3 text-caption text-content-tertiary">semibold</td>
                <td className="py-3 text-caption text-content-tertiary">accent-foreground / muted-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">TabBar 탭 (기본설정, 세부설정)</td>
                <td className="py-3"><span className="text-body font-semibold text-accent-content">기본 설정</span> <span className="text-body font-semibold text-content-tertiary ml-2">세부 설정</span></td>
              </tr>
              {/* body — 본문 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body</td>
                <td className="py-3 text-caption text-content-tertiary">medium</td>
                <td className="py-3 text-caption text-content-tertiary">foreground</td>
                <td className="py-3 text-caption text-content-tertiary">모달 목록 이름, Toast 메시지</td>
                <td className="py-3"><span className="text-body font-medium text-content-primary">봄 시즌 배너 v2</span></td>
              </tr>
              {/* body — 안내 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body</td>
                <td className="py-3 text-caption text-content-tertiary">regular</td>
                <td className="py-3 text-caption text-content-tertiary">muted-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">안내 문구, 모달 설명, empty state</td>
                <td className="py-3"><span className="text-body text-content-tertiary">선택하면 배경/그래픽이 자동 세팅됩니다</span></td>
              </tr>
              {/* body — 배너 카드 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-body</td>
                <td className="py-3 text-caption text-content-tertiary">bold</td>
                <td className="py-3 text-caption text-content-tertiary">foreground</td>
                <td className="py-3 text-caption text-content-tertiary">배너 카드 라벨</td>
                <td className="py-3"><span className="text-body font-bold text-content-primary">상단 롤링 배너</span></td>
              </tr>
              {/* caption — Label */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-caption</td>
                <td className="py-3 text-caption text-content-tertiary">semibold</td>
                <td className="py-3 text-caption text-content-tertiary">muted-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">Label 컴포넌트 (세부설정 라벨, 방향, 세부색상, 투명도)</td>
                <td className="py-3"><span className="text-caption font-semibold text-content-tertiary">세부 색상</span></td>
              </tr>
              {/* caption — Chip */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-caption</td>
                <td className="py-3 text-caption text-content-tertiary">medium</td>
                <td className="py-3 text-caption text-content-tertiary">primary-fg / secondary-fg</td>
                <td className="py-3 text-caption text-content-tertiary">Chip, SegmentControl 탭, 아코디언 헤더</td>
                <td className="py-3"><Chip selected>혜택</Chip> <span className="ml-1"><Chip>성장</Chip></span></td>
              </tr>
              {/* caption — 메타 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-caption</td>
                <td className="py-3 text-caption text-content-tertiary">regular</td>
                <td className="py-3 text-caption text-content-tertiary">muted-foreground</td>
                <td className="py-3 text-caption text-content-tertiary">배너 사이즈 (1330x128), 저장 날짜, 에셋 파일명, 안내 문구</td>
                <td className="py-3"><span className="text-caption text-content-tertiary font-mono">1330x128</span> <span className="text-caption text-content-tertiary ml-2">04/10 15:30</span></td>
              </tr>
              {/* caption — 액션 텍스트 */}
              <tr className="border-b border-border/50">
                <td className="py-3 text-caption font-mono font-medium">text-caption</td>
                <td className="py-3 text-caption text-content-tertiary">medium</td>
                <td className="py-3 text-caption text-content-tertiary">destructive / accent-fg</td>
                <td className="py-3 text-caption text-content-tertiary">제거 버튼, 복원 버튼, 더보기, ColorPicker HEX</td>
                <td className="py-3"><span className="text-caption text-negative">제거</span> <span className="text-caption text-accent-content ml-2">전체보기 (24개)</span></td>
              </tr>
            </tbody>
          </table>
        </Section>

        {/* ═══ Spacing ═══ */}
        <Section id="spacing" title="Spacing" desc="Tailwind 4px 그리드 — 이 9단계만 사용. 그 외 스페이싱 값 사용 금지.">
          <div className="space-y-3">
            {SPACING.map((s) => (
              <div key={s.tw} className="flex items-center gap-4">
                <span className="text-caption font-mono font-bold w-8 text-right">{s.tw}</span>
                <span className="text-caption font-mono text-content-tertiary w-10">{s.value}</span>
                <div className="bg-primary-200 rounded-sm flex-shrink-0" style={{ width: `${parseInt(s.value) * 3}px`, height: '16px' }} />
                <span className="text-caption text-content-primary">{s.semantic}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ═══ Radius ═══ */}
        <Section id="radius" title="Border Radius" desc="tailwind.config.js">
          <div className="flex gap-4 flex-wrap">
            {RADII.map((r) => (
              <div key={r.token} className="text-center">
                <div className="w-20 h-20 bg-accent flex items-center justify-center text-content-inverse text-caption font-bold" style={{ borderRadius: r.value }}>
                  {r.token.replace('rounded-', '')}
                </div>
                <div className="text-caption font-mono mt-2">{r.value}</div>
                <div className="text-caption text-content-tertiary">{r.desc}</div>
              </div>
            ))}
          </div>
        </Section>

      </main>
    </div>
  );
}
