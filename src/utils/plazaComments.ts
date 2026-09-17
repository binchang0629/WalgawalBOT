import type { ThreadComment } from '../components/common/CommentThread'

const storageKey = (caseId: string) => `plaza-comments:${caseId}`

export function readPlazaComments(caseId: string): ThreadComment[] {
  try {
    const value = window.sessionStorage.getItem(storageKey(caseId))
    const parsed: unknown = value ? JSON.parse(value) : []
    return Array.isArray(parsed) ? parsed as ThreadComment[] : []
  } catch {
    return []
  }
}

export function savePlazaComments(caseId: string, comments: ThreadComment[]) {
  try {
    window.sessionStorage.setItem(storageKey(caseId), JSON.stringify(comments))
  } catch {
    // Private browsing can reject storage; comments still work until leaving the page.
  }
}
