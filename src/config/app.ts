/**
 * 서비스·기기·시연 설정을 한곳에 모은다.
 * 배경, 기기 크기, 브레이크포인트를 바꿀 때는 이 파일만 고친다. (PROJECT_SPEC.md §2, §3)
 */

export const SERVICE = {
  name: '왈가왈BOT',
  tagline: '갈등을 안전하게 정리하고, 다음 행동을 함께 찾는 곳',
} as const

/**
 * Figma 기준 아트보드. 이 크기는 PC 목업 내부에서만 쓴다.
 * 모바일에서는 실제 화면 크기를 따른다. (PROJECT_SPEC.md §3)
 */
export const DEVICE = {
  name: 'iPhone 17',
  width: 402,
  height: 874,
  /** Figma top_nav 상단 62px은 시스템 상태바다. 앱이 아니라 목업이 그린다. */
  statusBarHeight: 62,
  /** Figma down_nav(402×100)에는 홈 인디케이터가 포함되어 있다. */
  bottomNavHeight: 100,
} as const

/**
 * 기기 목업 바깥 치수.
 *
 * 화면(402 × 874) 바깥에 두 겹이 있다.
 *   - 안쪽 검은 베젤: 3px × 2 = 6px
 *   - 바깥 금속 프레임: 12px × 2 = 24px
 * 둘을 더한 30px을 반드시 포함해야 한다.
 * 빠뜨리면 화면이 베젤을 밀고 나가 한쪽 테두리만 얇아 보인다.
 *
 * 축소 비율을 계산하고 레이아웃 자리를 잡을 때 쓴다. (PROJECT_SPEC.md §2)
 */
const FRAME_PADDING = 12
const BEZEL_PADDING = 3

export const DEVICE_FRAME = {
  width: DEVICE.width + (FRAME_PADDING + BEZEL_PADDING) * 2,
  height: DEVICE.height + (FRAME_PADDING + BEZEL_PADDING) * 2,
  /** .showcase__stage의 위아래 여백 합 */
  stageVerticalPadding: 96,
  /** 이보다 더 줄이지는 않는다. 너무 작아지면 읽을 수 없다. */
  minScale: 0.5,
} as const

/** 이 너비 이상이면 PC 쇼케이스, 미만이면 목업 없는 앱 화면. */
export const DESKTOP_BREAKPOINT = 1024

/**
 * PC 배경. 실제 배경 이미지는 아직 제공되지 않았다. (PROJECT_SPEC.md §9-8)
 * 이미지를 받으면 backgroundImage에 경로를 넣는다.
 */
export const SHOWCASE_BACKGROUND = {
  backgroundImage: null as string | null,
  gradient: 'linear-gradient(160deg, #eaf6ff 0%, #d8eaff 45%, #f9fafd 100%)',
  overlayOpacity: 0,
} as const

/**
 * 데모 모드.
 *
 * 퍼소나는 A(윤서아, 신규 가입) · B(곽지훈, 기존 사용자) 두 개로 확정됐다.
 * 다만 A의 시작점인 온보딩·가입 화면 시안이 아직 없어 시연 진입 화면을 켜지 않는다.
 * 가입 화면이 확정되면(PROJECT_SPEC.md §9-2) true로 바꾸고 /demo 라우트를 연결한다.
 */
export const DEMO = {
  enabled: false,
  storagePrefix: 'walgawalbot:demo:v1',
} as const
