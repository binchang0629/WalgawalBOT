import { useCallback, useEffect, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import type { LoginGateReason } from '../../state/loginGateContext'
import caseFilingImage from '../../assets/auth/loginPopUpCaseFiling.webp'
import myImage from '../../assets/auth/loginPopUpMy.webp'
import aiImage from '../../assets/auth/loginPopUpAi.webp'
import defaultImage from '../../assets/auth/loginPopUpDefault.webp'
import defaultKeyImage from '../../assets/auth/loginPopUpDefaultKey.webp'
import closeIcon from '../../assets/auth/loginPopUpClose.svg'
import './LoginPopUp.css'

/**
 * 비로그인 상태에서 로그인이 필요한 기능을 눌렀을 때 뜨는 안내 팝업.
 *
 * Figma 개발 페이지 기준 — 사건 접수 `2298:16848` · MY `2298:17535` ·
 * AI 맞춤 추천 `2298:17673` · 공통 `2298:17811`.
 * 네 시안은 캐릭터 이미지와 제목·설명만 다르고 팝업 껍데기는 같아서
 * 한 컴포넌트에 variant로 넣었다.
 *
 * 화면을 갈아끼우지 않고 보던 화면 위에 그대로 덮는다.
 * "로그인 안 해도 둘러볼 수 있다"는 제품 원칙(PROJECT_SPEC.md §0-6)을
 * 시각적으로도 유지하려는 것이다. 닫으면 있던 자리에 그대로 남는다.
 *
 * 기기 내부에서만 표시해야 하므로 `#app-overlay-root`에 portal로 붙인다.
 * 브라우저 전체를 덮으면 PC 목업 바깥까지 어두워진다. (PROJECT_SPEC.md §2)
 */

interface Variant {
  /** 팝업 위로 튀어나오는 캐릭터 이미지. 시안마다 다르다. */
  image: string
  title: string
  body: ReactNode
  /** 이유별 시안 치수를 담은 CSS 클래스. */
  className: string
}

const VARIANTS: Record<LoginGateReason, Variant> = {
  caseSubmit: {
    image: caseFilingImage,
    className: 'loginPopUpCaseSubmit',
    title: '사건 접수를 시작할까요?',
    body: (
      <>
        로그인을 하면 사건 작성부터
        <br />
        <b>AI판결</b>까지 이어서 할 수 있어요
      </>
    ),
  },
  my: {
    image: myImage,
    className: 'loginPopUpMy',
    title: '로그인이 필요해요',
    body: (
      <>
        MY페이지에서 프로필, 기록 등
        <br />
        여러가지 설정을 확인하고 수정 가능해요.
      </>
    ),
  },
  aiRecommend: {
    image: aiImage,
    className: 'loginPopUpAiRecommend',
    title: 'AI 맞춤 추천을 받아볼까요?',
    body: (
      <>
        로그인 하면 그동안 본 기록을
        <br />
        파악해서 사용자 맞춤 추천 사건을 나열해요.
      </>
    ),
  },
  default: {
    image: defaultImage,
    className: 'loginPopUpDefault',
    title: '로그인이 필요해요',
    body: '해당 기능을 이용하려면 로그인을 해주세요.',
  },
}

interface Props {
  reason: LoginGateReason
  onLogin: () => void
  onClose: () => void
}

function LoginPopUp({ reason, onLogin, onClose }: Props) {
  const variant = VARIANTS[reason]
  const popUpRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const portalRoot = document.getElementById('app-overlay-root')

  // 닫은 뒤 원래 누른 버튼으로 포커스를 돌려준다.
  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null
    popUpRef.current?.focus()
    return () => openerRef.current?.focus?.()
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

  return createPortal(
    <div
      className="loginPopUpOverlay"
      role="presentation"
      onClick={onClose}
      onKeyDown={handleKeyDown}
    >
      <div
        ref={popUpRef}
        className={`loginPopUp ${variant.className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="loginPopUpTitle"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        {/*
          캐릭터는 팝업 위쪽으로 튀어나온다. 흰 카드 안이 아니라 딤 위에 겹치는 자리라
          absolute로 빼고 translate로 올린다. 클릭은 통과시킨다.
        */}
        <div className="loginPopUpMascot" aria-hidden="true">
          <img src={variant.image} alt="" />
          {reason === 'default' && (
            <img className="loginPopUpMascotKey" src={defaultKeyImage} alt="" />
          )}
        </div>

        <div className="loginPopUpHandle" aria-hidden="true" />

        <div className="loginPopUpHeader">
          <button type="button" onClick={onClose} aria-label="닫기">
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <h2 className="loginPopUpTitle" id="loginPopUpTitle">
          {variant.title}
        </h2>
        <p className="loginPopUpBody">{variant.body}</p>

        <button type="button" className="loginPopUpPrimary" onClick={onLogin}>
          로그인하기
        </button>
        <button type="button" className="loginPopUpSecondary" onClick={onClose}>
          다음에 할게요
        </button>
      </div>
    </div>,
    portalRoot,
  )
}

export default LoginPopUp
