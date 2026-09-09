import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { CaseSubmitDraftContext } from './caseSubmitDraftContext'
import { DEMO_SUMMARY } from './caseSubmitContent'
import { INITIAL_ANSWERS } from './types'
import type { CaseSummary, QuestionAnswers, Relationship, Visibility } from './types'

/**
 * 사건 접수 1~4단계(지훈01~04)가 공유하는 상태를 여기서 한 번만 만든다.
 * 라우트 트리에서 이 컴포넌트 아래에 각 단계 페이지를 중첩해 Outlet으로 그린다.
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
