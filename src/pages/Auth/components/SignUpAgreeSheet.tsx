import { useCallback, useEffect, useRef, useState } from 'react'
import type { Dispatch, KeyboardEvent, SetStateAction } from 'react'
import { createPortal } from 'react-dom'
import closeIcon from '../../../assets/auth/loginPopUpClose.svg'
import infoIcon from '../../../assets/auth/signUpInfo.svg'
import type { AgreeState } from './signUpAgreeState'
import './SignUpAgreeSheet.css'

/**
 * 회원가입 동의 시트. Figma `2264:13125`(접힘) · `2264:13294`(약관 펼침).
 *
 * 시안에 펼친 모습이 있는 건 첫 항목(왈가왈BOT 약관)뿐이다.
 * 나머지 셋은 화살표만 있고 펼친 화면이 없어 열리지 않게 뒀다. → PROJECT_SPEC.md §9
 *
 * 필수 두 항목에 모두 동의해야 `회원 가입 완료하기`가 켜진다.
 */

/** 시안 `2264:13294`의 약관 본문. */
const TERMS_BODY = [
  '사연 작성, AI 분석, 배심원 참여, 판단 비교 및 다음 행동 안내를 이용할 수 있습니다.',
  'AI 분석과 배심원의 의견은 참고 정보이며, 사실이나 법적 책임을 확정하는 판단이 아닙니다.',
  '다른 사람의 개인정보 공개, 비방, 혐오 표현 및 부정한 투표는 금지됩니다.',
  '운영정책 위반 시 게시물이 제한되거나 서비스 이용이 제한될 수 있습니다.',
  '회원탈퇴와 게시물 삭제는 정해진 절차에 따라 요청할 수 있습니다.',
]

interface Row {
  key: keyof AgreeState
  required: boolean
  label: string
  /** 시안에 펼친 모습이 있는 항목만 열린다. */
  expandable: boolean
}

const ROWS: Row[] = [
  { key: 'terms', required: true, label: '왈가왈BOT 약관 동의', expandable: true },
  { key: 'privacy', required: true, label: '개인정보수집 및 이용에 대한 안내', expandable: false },
  { key: 'marketing', required: false, label: '이벤트/마케팅 수신 동의', expandable: false },
  { key: 'notification', required: false, label: '통합 알림 수신 동의', expandable: false },
]

/**
 * 시트를 어떻게 열었는지. 제목 문구만 달라진다.
 *   agree   동의 줄을 눌러 스스로 열어 본 경우
 *   submit  동의를 거치지 않고 가입 완료를 눌러, 확인차 뜬 경우
 */
export type AgreeOpenReason = 'agree' | 'submit'

const TITLE: Record<AgreeOpenReason, string> = {
  agree: '동의가 필요해요',
  submit: '동의하고 회원가입 할게요',
}

interface Props {
  value: AgreeState
  openReason: AgreeOpenReason
  /* 여러 항목을 빠르게 연달아 누르면 이전 값을 덮어쓰므로 갱신 함수로 받는다. */
  onChange: Dispatch<SetStateAction<AgreeState>>
  onClose: () => void
  onSubmit: () => void
}

function SignUpAgreeSheet({ value, openReason, onChange, onClose, onSubmit }: Props) {
  const [expanded, setExpanded] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const portalRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement | null
    sheetRef.current?.focus()
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

  // 필수 두 항목이 모두 켜져야 가입을 마칠 수 있다.
  const canSubmit = value.terms && value.privacy

  if (!portalRoot) return null

  return createPortal(
    <div className="signUpAgreeOverlay" role="presentation" onClick={onClose} onKeyDown={handleKeyDown}>
      <div
        ref={sheetRef}
        className="signUpAgreeSheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="signUpAgreeTitle"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="signUpAgreeHandle" aria-hidden="true" />

        <div className="signUpAgreeHeader">
          <h2 id="signUpAgreeTitle">{TITLE[openReason]}</h2>
          <button type="button" onClick={onClose} aria-label="닫기">
            <img src={closeIcon} alt="" aria-hidden="true" />
          </button>
        </div>

        <ul className="signUpAgreeList">
          {ROWS.map((row) => (
            <li key={row.key}>
              <div className="signUpAgreeRow">
                <label className="signUpAgreeLabel">
                  <input
                    type="checkbox"
                    checked={value[row.key]}
                    onChange={(event) => {
                      const { checked } = event.target
                      onChange((prev) => ({ ...prev, [row.key]: checked }))
                    }}
                  />
                  <span className="signUpAgreeRadio" aria-hidden="true" />
                  <span className="signUpAgreeText">
                    {/* 필수 표시는 빈 칸이어도 자리를 지켜, 네 줄의 글자 시작점을 맞춘다. */}
                    <b className="signUpAgreeRequired" aria-hidden={!row.required}>
                      {row.required ? "*" : ""}
                    </b>
                    {row.label}
                    {!row.required && <em className="signUpAgreeOptional">(선택)</em>}
                  </span>
                </label>

                <button
                  type="button"
                  className="signUpAgreeToggle"
                  onClick={() => setExpanded((open) => !open)}
                  disabled={!row.expandable}
                  aria-expanded={row.expandable ? expanded : undefined}
                  aria-label={`${row.label} 내용 ${expanded ? '접기' : '펼치기'}`}
                  title={row.expandable ? undefined : '시안 확정 후 연결됩니다'}
                >
                  {/*
                    파일에 박힌 색을 CSS가 바꿀 수 있게 img가 아니라 mask로 얹는다.
                    비활성 항목은 스타일가이드의 gray 400(#D5D2D6)으로 흐리게 둔다.
                  */}
                  <span
                    className={
                      row.expandable && expanded
                        ? 'signUpAgreeChevron signUpAgreeChevronOpen'
                        : 'signUpAgreeChevron'
                    }
                    aria-hidden="true"
                  />
                </button>
              </div>

              {row.expandable && expanded && (
                <div className="signUpAgreeBody">
                  <p className="signUpAgreeBodyLead">
                    왈가왈봇의 회원가입 및 서비스 이용에 관한 약관입니다.
                  </p>
                  <ul>
                    {TERMS_BODY.map((line) => (
                      <li key={line}>{line}</li>
                    ))}
                  </ul>
                  {/* 전문 화면은 시안이 없어 연결하지 않는다. → PROJECT_SPEC.md §9 */}
                  <p className="signUpAgreeBodyMore">[이용약관 전문 보기]</p>
                </div>
              )}
            </li>
          ))}
        </ul>

        <p className="signUpAgreeNotice">
          <img src={infoIcon} alt="" aria-hidden="true" />
          프로필-설정에서 선택 동의 설정을 수정 가능해요.
        </p>

        <button type="button" className="signUpAgreeSubmit" onClick={onSubmit} disabled={!canSubmit}>
          회원 가입 완료하기
        </button>
      </div>
    </div>,
    portalRoot,
  )
}

export default SignUpAgreeSheet
