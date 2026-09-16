const CASE_PARTICIPANT_COUNT_STORAGE_PREFIX = 'wgwb:case-participant-count:v1:'

function getStorageKey(caseId: string) {
  return `${CASE_PARTICIPANT_COUNT_STORAGE_PREFIX}${caseId}`
}

export function getRememberedCaseParticipantCount(caseId: string, fallback: number) {
  if (typeof window === 'undefined') return fallback

  const storedValue = window.sessionStorage.getItem(getStorageKey(caseId))
  if (storedValue === null) return fallback

  const participantCount = Number(storedValue)
  return Number.isSafeInteger(participantCount) && participantCount >= 0
    ? participantCount
    : fallback
}

export function rememberCaseParticipantCount(caseId: string, participantCount: number) {
  if (typeof window === 'undefined') return

  const normalizedCount = Math.max(0, Math.floor(participantCount))
  window.sessionStorage.setItem(getStorageKey(caseId), String(normalizedCount))
}
