import type { CSSProperties } from 'react'

import './SpinningMascot.css'

/**
 * 판멍이 머리가 제자리에서 360도 회전하는 아이콘.
 *
 * 3D(GLB)를 런타임에 돌리지 않고 미리 구운 스프라이트 시트를 CSS로 넘긴다.
 * 원본 `AIchat360.glb`가 136.9MB(정점 594만)라 56px 아이콘에 싣기에는 너무 크고,
 * three.js를 넣으면 공용 번들에 런타임 의존성이 생긴다. (PROJECT_SPEC.md §7-11)
 * 시트는 15열 × 12행 = 180프레임이며 12초에 한 바퀴(15fps)로 GLB의
 * `Horizontal_360_12s` 회전 속도를 그대로 따른다.
 *
 * 크기는 `size`(px)로만 바꾼다. 시트 격자 수는 이미지와 묶여 있으므로 CSS 상수로 둔다.
 *
 * span이 아니라 i로 그린다. FloatingChatButton의 `.floating-chat-button span`이
 * 스크린리더 전용 숨김 규칙이라 span으로 두면 아이콘까지 1px로 잘린다.
 */
type SpinningMascotProps = {
  /** 아이콘 한 변의 길이(px). 부모 슬롯의 정중앙에 놓인다. */
  size?: number
}

function SpinningMascot({ size = 48 }: SpinningMascotProps) {
  return (
    <i
      className="spinning-mascot"
      style={{ '--mascot-size': `${size}px` } as CSSProperties}
      aria-hidden="true"
    />
  )
}

export default SpinningMascot
