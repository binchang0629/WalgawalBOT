import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CaseSubmitDraftContext } from './caseSubmitDraftContext'
import { SUBMIT_SCENARIOS } from './caseSubmitContent'
import useSession from '../../hooks/useSession'
import type { PersonaId } from '../../types'
import './SeoaSubmit.css'
import { INITIAL_ANSWERS } from './types'
import type { CaseSummary, QuestionAnswers, Relationship, Visibility } from './types'

/**
 * 서아01~04 / 지훈01~05의 각 접수 흐름이 공유하는 상태를 만든다.
 * 라우트 트리에서 이 컴포넌트 아래에 각 단계 페이지를 중첩해 Outlet으로 그린다.
 *
 * 서아는 사용자 지정 섹션 1446:10091(작성→요약→접수→완료)을 따른다.
 * 지훈 5단계는 아래의 기존 사용자 지정 예외를 유지한다.
 * Figma `1차 디자인 시안 > 컨펌 > 사건접수(박건영)` 섹션의 지훈01~05 프레임
 * (node 1446:9899~10071)을 사용자가 화면명으로 직접 지정해 구현을 요청했고,
 * 임의로 지어낸 화면이 아니라 그 프레임 그대로 옮긴 것이다.
 * `개발` 페이지로 확정 여부가 다시 정리되면 그 기준으로 다시 맞춘다. (SignupPage와 같은 성격의 예외)
 */
function CaseSubmitFlow() {
  const { personaId, sessionStatus } = useSession()
  // 전환/로그아웃 시 입력·첨부·공개 선택·완료 상태를 함께 비운다.
  return <CaseSubmitDraftProvider key={`${personaId}:${sessionStatus}`} personaId={personaId} />
}

function CaseSubmitDraftProvider({ personaId }: { personaId: PersonaId }) {
  const [returnHistoryIndex] = useState<number | null>(() => {
    const entryIndex = (window.history.state as { idx?: unknown } | null)?.idx
    return typeof entryIndex === 'number' && entryIndex > 0 ? entryIndex - 1 : null
  })
  /*
   * 관계는 아무것도 고르지 않은 상태에서 시작한다.
   * 예전에는 시안 값(서아 친구 / 지훈 직장)이 처음부터 눌려 있어,
   * 사용자가 고르지 않았는데 고른 것처럼 보였다.
   * 발표용 선택은 단계별 `예시 한번에 채우기` 버튼이 대신한다.
   */
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [photoNames, setPhotoNames] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [answers, setAnswers] = useState<QuestionAnswers>(INITIAL_ANSWERS)
  const [summary, setSummary] = useState<CaseSummary>(() => ({ ...SUBMIT_SCENARIOS[personaId].summary }))
  const [visibility, setVisibility] = useState<Visibility>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <CaseSubmitDraftContext.Provider
      value={{
        personaId,
        returnHistoryIndex,
        relationship,
        setRelationship,
        photoNames,
        setPhotoNames,
        fileNames,
        setFileNames,
        content,
        setContent,
        answers,
        setAnswers,
        summary,
        setSummary,
        visibility,
        setVisibility,
        isSubmitted,
        setIsSubmitted,
      }}
    >
      <Outlet />
    </CaseSubmitDraftContext.Provider>
  )
}

export default CaseSubmitFlow
