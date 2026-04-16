/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard', 'sans-serif'],
      },

      /* ── Text Tokens (최소 12px) ── */
      fontSize: {
        'caption':    ['12px', { lineHeight: '16px', letterSpacing: '0' }],          // 칩, 뱃지, 메타, 보조 텍스트
        'field-label':['13px', { lineHeight: '18px', letterSpacing: '0' }],          // 필드 라벨 (입력/컨트롤 위)
        'body':       ['13px', { lineHeight: '18px', letterSpacing: '0' }],          // 본문, 설명
        'body-lg':    ['14px', { lineHeight: '20px', letterSpacing: '0' }],          // 입력 필드 본문, CTA 버튼
        'h3':         ['14px', { lineHeight: '20px', letterSpacing: '0' }],          // 섹션 제목 (bold로 구분)
        'h2':         ['15px', { lineHeight: '22px', letterSpacing: '-0.01em' }],    // 모달 제목, 서브 페이지 제목
        'h1':         ['18px', { lineHeight: '26px', letterSpacing: '-0.02em' }],    // 페이지 제목
        'display':    ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],    // 히어로 (예비)
      },

      /* ══════════════════════════════════════
       * Color Tokens — Semantic Color System
       *
       * Base Palette
       *   gray-900: #111827   gray-700: #374151   gray-500: #6B7280
       *   gray-400: #9CA3AF   gray-300: #D1D5DB   gray-200: #E5E7EB
       *   gray-100: #F0F1F3   gray-75:  #F5F6F7   white:    #FFFFFF
       *   indigo:   #4F46E5   indigo-700: #4338CA  indigo-200: #C7D2FE  indigo-50: #EEF2FF
       *   red:      #EF4444   green: #22C55E  amber: #F59E0B  blue: #3B82F6
       * ══════════════════════════════════════ */
      colors: {

        /* ═══ 1. BG Layer — 레이아웃 배경 ═══ */
        layer: {
          'base-top':         '#F5F6F7',              // 최상단 base — 프리뷰 영역 배경
          base:               '#F0F1F3',              // 중간 base — 페이지/body 배경
          'base-alt':         '#E8EAED',              // 최하단 base — 가장 어두운 배경
          surface:            '#FFFFFF',              // 카드, 패널, 사이드바
          elevated:           '#FFFFFF',              // popover, modal, dropdown (shadow로 구분)
          disabled:           '#F5F6F7',              // 비활성 카드
          dimmed:             'rgba(0,0,0,0.4)',      // 오버레이 딤
        },

        /* ═══ 2. Fill — 박스/영역 채움 (배경보다 살짝 낮은 명도) ═══ */
        fill: {
          primary:            '#E8EAED',              // 가장 강한 fill — 세그먼트 배경, 토글 off
          secondary:          '#F0F1F3',              // 보조 fill — hover 배경
          tertiary:           '#F5F6F7',              // 약한 fill — 미세한 구분
          disabled:           '#F5F6F7',              // 비활성
          strong:             '#D1D5DB',              // 강한 fill — 프로그레스 트랙
          white:              '#FFFFFF',              // 토글 thumb, 반전
        },

        /* ═══ 3. Content — Text & Icon ═══ */
        content: {
          primary:            '#111827',              // 제목, 강조
          secondary:          '#374151',              // 본문, 라벨
          tertiary:           '#6B7280',              // 보조, placeholder
          disabled:           '#9CA3AF',              // 비활성
          inverse:            '#FFFFFF',              // 어두운 배경 위
        },

        /* ═══ 4. Accent — Primary 브랜드 컬러 (Indigo) ═══ */
        accent: {
          DEFAULT:            '#4F46E5',              // 액센트 컬러
          hover:              '#4338CA',              // hover/pressed
          content:            '#4F46E5',              // 텍스트 — 링크, 강조
          border:             '#4F46E5',              // 선택 상태 border
          'border-subtle':    '#C7D2FE',              // 선택 틴트 border
          bg:                 '#EEF2FF',              // accent 배경 (subtle)
          focus:              '#818CF8',              // 포커스 링
          disabled:           '#C7D2FE',              // 비활성 accent
        },

        /* ═══ 5. State — 상태 컬러 ═══ */
        /* Positive (Green) */
        positive: {
          DEFAULT:            '#22C55E',              // 아이콘, 인디케이터
          content:            '#15803D',              // 텍스트 (배경 위 AA 충족)
          border:             '#22C55E',              // border
          bg:                 '#F0FDF4',              // 배경 (subtle)
        },
        /* Negative (Red) */
        negative: {
          DEFAULT:            '#EF4444',              // 아이콘, 인디케이터
          content:            '#DC2626',              // 텍스트 (배경 위 AA 충족)
          border:             '#EF4444',              // border
          bg:                 '#FEF2F2',              // 배경 (subtle)
        },
        /* Warning (Amber) */
        warning: {
          DEFAULT:            '#F59E0B',              // 아이콘, 인디케이터
          content:            '#B45309',              // 텍스트 (배경 위 AA 충족)
          border:             '#F59E0B',              // border
          bg:                 '#FFFBEB',              // 배경 (subtle)
        },
        /* Info (Blue) */
        info: {
          DEFAULT:            '#3B82F6',              // 아이콘, 인디케이터
          content:            '#1D4ED8',              // 텍스트 (배경 위 AA 충족)
          border:             '#3B82F6',              // border
          bg:                 '#EFF6FF',              // 배경 (subtle)
        },

        /* ═══ Utility ═══ */
        border: {
          DEFAULT:            '#E5E7EB',              // 기본 구분선
          secondary:          '#F0F1F3',              // 약한 구분
          strong:             '#D1D5DB',              // 강한 구분
        },

        /* ═══ 하위 호환 (기존 코드에서 사용 중) ═══ */
        foreground:           '#111827',
        primary: {
          DEFAULT:            '#4F46E5',
          foreground:         '#FFFFFF',
          50:  '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          700: '#4338CA',
        },
        secondary: {
          DEFAULT:            '#E8EAED',
          foreground:         '#374151',
        },
        muted: {
          DEFAULT:            '#F0F1F3',
          foreground:         '#6B7280',
        },
        destructive: {
          DEFAULT:            '#EF4444',
          foreground:         '#FFFFFF',
        },
        card: {
          DEFAULT:            '#FFFFFF',
          foreground:         '#111827',
        },
        popover: {
          DEFAULT:            '#FFFFFF',
          foreground:         '#111827',
        },
        input:                '#E5E7EB',
        ring:                 '#818CF8',
        success: {
          DEFAULT:            '#22C55E',
          foreground:         '#FFFFFF',
        },
      },

      /*
       * ── Spacing ──
       * Tailwind 기본 4px 그리드 사용 (spacing 확장 불필요)
       *
       * 시맨틱 가이드:
       *   gap-2  (8px)   — 그룹 내 요소 간격 (칩↔칩, 라벨↔입력)
       *   gap-4  (16px)  — 그룹 간 간격 (섹션 내 블록)
       *   gap-6  (24px)  — 섹션 간 간격 (카드↔카드)
       *   gap-12 (48px)  — 영역 간 간격
       *   p-4    (16px)  — 카드 내부 패딩
       *   p-5    (20px)  — 패널 내부 패딩
       */

      /* ── Border Radius Tokens ── */
      borderRadius: {
        'sm':   '4px',      // 작은 요소 (토글, 태그 내부)
        'md':   '8px',      // 버튼, 입력 필드
        'lg':   '12px',     // 카드
        'xl':   '16px',     // 모달
        'full': '9999px',   // 칩, 뱃지 (pill)
      },

      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 200ms ease-out',
      },
    },
  },
  plugins: [],
};
