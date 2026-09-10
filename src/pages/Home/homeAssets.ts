/**
 * 홈 화면 에셋 모음.
 *
 * 기준 시안: Figma `개발 > 홈/로그인 전 > 홈 수정 후` (노드 `1402:7104`)
 *
 * 벡터는 Figma Plugin API `exportAsync`로 뽑아 `src/assets/home/figma/`에 저장했다.
 * 비트맵 중 일부는 조직 이그레스 정책이 `figma.com` 자산 URL을 막아 코드에서 내려받지 못한다.
 * 그 자리는 아래 `optionalBitmaps`가 폴더를 훑어 **있으면 쓰고 없으면 자리 표시로 둔다.**
 * (배심원 광장에서 쓴 방식과 같다 — PROJECT_CONTEXT.md 참고)
 */

/* ---------- 벡터 (모두 저장 완료) ---------- */
import btnArrow from '../../assets/home/figma/btn-arrow.svg'
import tipIcon from '../../assets/home/figma/tip-icon.svg'
import clockMini from '../../assets/home/figma/clock-mini.svg'
import pinBlue from '../../assets/home/figma/pin-blue.svg'
import pinOrange from '../../assets/home/figma/pin-orange.svg'
import refreshIcon from '../../assets/home/figma/refresh.svg'
import dragHand from '../../assets/home/figma/drag-hand.svg'
import balloonTailLeft from '../../assets/home/figma/balloon-tail-left.svg'
import balloonTailRight from '../../assets/home/figma/balloon-tail-right.svg'
import characterHead from '../../assets/home/figma/character-head.svg'
import fireIcon from '../../assets/home/figma/fire.svg'
import chevronsUp from '../../assets/home/figma/chevrons-up.svg'
import quoteGo from '../../assets/home/figma/quote-go.svg'
import chevronRight from '../../assets/icons/chevron-right.svg'

/* ---------- 비트맵 (이미 폴더에 있는 것) ---------- */
import judgeMascot from '../../assets/home/figma/img1Judge.png'
import botFace from '../../assets/home/figma/imgImg.png'
import adShell from '../../assets/home/figma/imgImage22.png'
import letterEnvelope from '../../assets/home/figma/img.png'
import letterPaper from '../../assets/home/figma/img2.png'

/*
 * 왈가왈후~ 편지봉투 세 겹. 사용자가 내보낸 이미지를 그대로 쓴다.
 * 라벤더였던 두 장은 `envelope-front`의 파랑에 맞춰 색을 통일했고,
 * 원본 PNG 합계 910KB가 WebP로 71KB가 됐다(육안 차이 없음).
 */
import envelopeBack from '../../assets/home/figma/envelope-back.webp'
import envelopeFront from '../../assets/home/figma/envelope-front.webp'
import envelopeClosed from '../../assets/home/figma/envelope-closed.webp'

export const homeIcons = {
  btnArrow,
  tipIcon,
  clockMini,
  pinBlue,
  pinOrange,
  refreshIcon,
  dragHand,
  balloonTailLeft,
  balloonTailRight,
  characterHead,
  fireIcon,
  chevronsUp,
  quoteGo,
  chevronRight,
} as const

export const homeImages = {
  envelopeBack,
  envelopeFront,
  envelopeClosed,
  judgeMascot,
  botFace,
  adShell,
  letterEnvelope,
  letterPaper,
} as const

/* ---------- 아직 없는 비트맵 ---------- */

/**
 * 아래 이름 그대로 `src/assets/home/figma/`에 넣으면 **코드를 고치지 않아도 바로 붙는다.**
 *
 * | 파일명                | Figma 노드     | 크기      | 쓰이는 곳            |
 * | --------------------- | -------------- | --------- | -------------------- |
 * | `plate-left.png`      | `1402:7217`    | 150 × 85  | 밸런스 게임 왼쪽 접시 |
 * | `plate-right.png`     | `1402:7216`    | 150 × 85  | 밸런스 게임 오른쪽 접시 |
 * | `perilla.png`         | `1402:7230`    | 127 × 133 | 밸런스 게임 깻잎      |
 * | `chat-mascot.png`     | `1473:8568`    | 79 × 67   | AI 맞춤 추천 판멍이   |
 */
const bitmapModules = import.meta.glob(
  '../../assets/home/figma/{plate-left,plate-right,perilla,chat-mascot}.png',
  { eager: true, query: '?url', import: 'default' },
) as Record<string, string>

function optional(fileName: string): string | null {
  const hit = Object.entries(bitmapModules).find(([path]) => path.endsWith(`/${fileName}`))
  return hit ? hit[1] : null
}

export const optionalImages = {
  plateLeft: optional('plate-left.png'),
  plateRight: optional('plate-right.png'),
  perilla: optional('perilla.png'),
  chatMascot: optional('chat-mascot.png'),
} as const
