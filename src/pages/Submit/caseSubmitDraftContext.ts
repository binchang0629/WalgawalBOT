import { createContext } from 'react'
import type { Dispatch, SetStateAction } from 'react'
import type { CaseSummary, QuestionAnswers, Relationship, Visibility } from './types'
import type { PersonaId } from '../../types'

/**
 * 계정별 사건 접수 단계가 공유하는 화면 상태.
 * 각 단계가 독립적으로 방문·새로고침될 수 있는 라우트라서
 * 화면 로컬 state 대신 이 흐름 전용 Context에 둔다. (PROJECT_SPEC.md §7-8)
 *
 * 세션(로그인)·퍼소나처럼 앱 전역에서 쓰는 상태가 아니라
 * 사건 접수 화면 안에서만 쓰는 상태라 src/state/가 아니라 이 페이지 폴더에 둔다.
 */
export interface CaseSubmitDraftValue {
  personaId: PersonaId
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

  /** 접수 완료 경로에 직접 진입해 거짓 완료 화면이 나타나는 것을 막는다. */
  isSubmitted: boolean
  setIsSubmitted: Dispatch<SetStateAction<boolean>>
}

export const CaseSubmitDraftContext = createContext<CaseSubmitDraftValue | null>(null)
