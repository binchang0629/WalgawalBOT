import { useCallback, useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import bowlImage from '../../assets/auth/loginRewardBowl.webp'
import coinImage from '../../assets/auth/loginRewardCoin.webp'
import mascotBaseImage from '../../assets/auth/loginRewardMascotBase.webp'
import mascotArmImage from '../../assets/auth/loginRewardMascotArm.webp'
import mascotEarImage from '../../assets/auth/loginRewardMascotEar.webp'
import mascotHandImage from '../../assets/auth/loginRewardMascotHand.webp'
import closeIcon from '../../assets/auth/loginPopUpClose.svg'
import './LoginRewardPopUp.css'

/**
 * 출석 포인트 팝업. Figma 개발 페이지 `2187:24701` 섹션.
 *
 * 시안은 한 화면이 아니라 `loginRewardPopUp01`~`06` 여섯 장으로 나뉘어 있다.
 * 애니메이션의 중간 장면을 그린 것이라, 각 장의 좌표를 이어 한 흐름으로 재생한다.
 *
 *   01  판멍이가 팔을 들어 동전을 쥐고 있다. 그릇에는 지금 포인트.
 *   02  팔을 내리며 동전을 놓는다.
 *   03~04  동전이 그릇으로 떨어진다.
 *   05  동전이 그릇에 담기고 숫자가 `+10PT`로 바뀐다.
 *   06  숫자가 새 합계로 정리되고 안내 문구가 뜬다.
 *
 * 좌표·각도·크기는 시안의 `relativeTransform` 실측값을 그대로 옮겼다.
 * 그래서 CSS 값에 소수점이 남아 있다. 임의로 반올림하면 시안과 어긋난다.
 *
 * 로그인과 회원가입 모두 이 팝업을 쓴다. 다른 건 인사말과 시작 포인트뿐이다.
 * 회원가입은 이제 막 가입한 참이라 0PT에서 시작한다.
 */

export type LoginRewardKind = 'login' | 'signup'

/** 하루 출석으로 주는 포인트. 시안의 `+10PT`다. */
const REWARD_POINT = 10

interface Props {
  kind: LoginRewardKind
  /** 인사말에 쓸 이름. `윤서아`가 아니라 시안처럼 `서아`로 부른다. */
  name: string
  /** 적립 전 포인트. 회원가입은 0이다. */
  startPoint: number
  onClose: () => void
}

/** 애니메이션 단계. 숫자가 바뀌는 시점을 나누려고 둔다. */
type Stage = 'dropping' | 'gained' | 'settled'

function LoginRewardPopUp({ kind, name, startPoint, onClose }: Props) {
  // 움직임을 줄이는 설정이면 처음부터 마지막 장면으로 시작한다.
  // 첫 렌더의 초기값에서 정한다. effect 안에서 상태를 바꾸면 렌더가 연쇄로 일어난다.
  const [stage, setStage] = useState<Stage>(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'settled' : 'dropping'
  ))
  const popUpRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const portalRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null
    popUpRef.current?.focus()
    return () => openerRef.current?.focus?.()
  }, [])

  // 동전이 그릇에 닿는 순간과 숫자가 정리되는 순간. CSS 애니메이션 시간과 맞춰 둔다.
  useEffect(() => {
    if (stage === 'settled') return
    const toGained = window.setTimeout(() => setStage('gained'), 1200)
    const toSettled = window.setTimeout(() => setStage('settled'), 2100)
    return () => {
      window.clearTimeout(toGained)
      window.clearTimeout(toSettled)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
      }
    },
    [onClose],
  )

  if (!portalRoot) return null

  const greeting = kind === 'signup' ? '처음을 환영해요!' : '오늘도 어서오세요!'
  const totalPoint = startPoint + REWARD_POINT

  return createPortal(
    <div className="loginRewardOverlay" role="presentation" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        ref={popUpRef}
        className={`loginRewardPopUp loginRewardStage-${stage}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginRewardGreeting"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="loginRewardHeader">
          <button type="button" onClick={onClose} aria-label="닫기">
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
          <p className="loginRewardGreeting" id="loginRewardGreeting">
            <b>{name}님,</b> {greeting}
          </p>
        </div>

        {/* 포인트 그릇. 시안은 이미지 한 장 위에 숫자 판을 얹는다. */}
        <div className="loginRewardBowl">
          <div className="loginRewardBowlImage">
            <img src={bowlImage} alt="" aria-hidden="true" />
          </div>
          <p className="loginRewardBadge">
            <span className="loginRewardBadgeNumber">
              {stage === 'gained' ? `+${REWARD_POINT}` : stage === 'settled' ? totalPoint : startPoint}
            </span>
            <span className="loginRewardBadgeUnit">PT</span>
          </p>
        </div>

        {/*
          판멍이는 부위별로 나뉘어 있다. 팔이 따로 움직여야 해서다.
          겹치는 순서는 시안 그대로 — 귀 · 팔 · 몸통 · 동전 · 손.
        */}
        <div className="loginRewardMascot" aria-hidden="true">
          <span className="loginRewardEar"><img src={mascotEarImage} alt="" /></span>
          <span className="loginRewardArm"><img src={mascotArmImage} alt="" /></span>
          <span className="loginRewardBase"><img src={mascotBaseImage} alt="" /></span>
          <span className="loginRewardCoin"><img src={coinImage} alt="" /></span>
          <span className="loginRewardHand"><img src={mascotHandImage} alt="" /></span>
        </div>

        <div className="loginRewardFooter">
          <p className="loginRewardNotice">
            오늘의 <b>출석 포인트({REWARD_POINT}pt)</b>를 지급 했어요.
          </p>
        </div>
      </div>
    </div>,
    portalRoot,
  )
}

export default LoginRewardPopUp
