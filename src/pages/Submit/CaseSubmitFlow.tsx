import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CaseSubmitDraftContext } from './caseSubmitDraftContext'
import { DEMO_SUMMARY } from './caseSubmitContent'
import { INITIAL_ANSWERS } from './types'
import type { CaseSummary, QuestionAnswers, Relationship, Visibility } from './types'

/**
 * 사건 접수 지훈01~05 5단계가 공유하는 상태를 여기서 한 번만 만든다.
 * 라우트 트리에서 이 컴포넌트 아래에 각 단계 페이지를 중첩해 Outlet으로 그린다.
 *
 * ⚠ 이 5단계는 아직 `개발` 페이지(§0-3)에 없어 §7-3 기준으로는 **디자인 미확정**이다.
 * Figma `1차 디자인 시안 > 컨펌 > 사건접수(박건영)` 섹션의 지훈01~05 프레임
 * (node 1446:9899~10071)을 사용자가 화면명으로 직접 지정해 구현을 요청했고,
 * 임의로 지어낸 화면이 아니라 그 프레임 그대로 옮긴 것이다.
 * `개발` 페이지로 확정 여부가 다시 정리되면 그 기준으로 다시 맞춘다. (SignupPage와 같은 성격의 예외)
 */
function CaseSubmitFlow() {
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [photoNames, setPhotoNames] = useState<string[]>([])
  const [fileNames, setFileNames] = useState<string[]>([])
  const [content, setContent] = useState('')
  const [answers, setAnswers] = useState<QuestionAnswers>(INITIAL_ANSWERS)
  const [summary, setSummary] = useState<CaseSummary>(DEMO_SUMMARY)
  const [visibility, setVisibility] = useState<Visibility>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  return (
    <CaseSubmitDraftContext.Provider
      value={{
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
