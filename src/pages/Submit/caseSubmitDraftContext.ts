import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { CaseSummary, QuestionAnswers, Relationship, Visibility } from './types'

/**
 * 사건 접수 1~4단계(지훈01~04)가 공유하는 화면 상태.
 * 각 단계가 독립적으로 방문·새로고침될 수 있는 라우트라서
 * 화면 로컬 state 대신 이 흐름 전용 Context에 둔다. (PROJECT_SPEC.md §7-8)
 *
 * 세션(로그인)·퍼소나처럼 앱 전역에서 쓰는 상태가 아니라
 * 사건 접수 화면 안에서만 쓰는 상태라 src/state/가 아니라 이 페이지 폴더에 둔다.
 */
export interface CaseSubmitDraftValue {
  relationship: Relationship | null
  setRelationship: Dispatch<SetStateAction<Relationship | null>>

  photoNames: string[]
  setPhotoNames: Dispatch<SetStateAction<string[]>>
  fileNames: string[]
  setFileNames: Dispatch<SetStateAction<string[]>>

  content: string
  setContent: Dispatch<SetStateAction<string>>

  answers: QuestionAnswers
  setAnswers: Dispatch<SetStateAction<QuestionAnswers>>

  summary: CaseSummary
  setSummary: Dispatch<SetStateAction<CaseSummary>>

  visibility: Visibility
  setVisibility: Dispatch<SetStateAction<Visibility>>

  /** 지훈04에서 접수를 마쳤는지. 지훈05를 직접 URL로 열었을 때 빈 상태로 보여주지 않기 위해 쓴다. */
  isSubmitted: boolean
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
}

export const CaseSubmitDraftContext = createContext<CaseSubmitDraftValue | null>(null)
