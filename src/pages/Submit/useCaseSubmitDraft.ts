import { useContext } from 'react'
import { CaseSubmitDraftContext } from './caseSubmitDraftContext'
import type { CaseSubmitDraftValue } from './caseSubmitDraftContext'

/** 사건 접수 흐름의 공유 상태를 읽는다. CaseSubmitFlow 밖에서 호출하면 오류를 던진다. */
function useCaseSubmitDraft(): CaseSubmitDraftValue {
  const value = useContext(CaseSubmitDraftContext)

  if (!value) {
    throw new Error('useCaseSubmitDraft은 CaseSubmitFlow 안에서만 쓸 수 있습니다.')
  }

  return value
}

export default useCaseSubmitDraft
