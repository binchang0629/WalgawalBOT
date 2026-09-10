import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PersonaId, SessionStatus } from '../types'
import { DEMO_ACCOUNTS } from '../data/personas'
import { DEMO } from '../config/app'
import { SessionContext } from './sessionContext'
import type { SessionUser } from './sessionContext'

/**
 * 시연 세션 상태를 한곳에서 관리한다.
 *
 * 저장·복원 로직은 이 파일 안에만 둔다.
 * 컴포넌트가 localStorage를 직접 읽고 쓰지 않는다. (PROJECT_SPEC.md §7-8)
 * 저장소를 못 쓰거나 값이 깨져 있어도 서아의 기본 데모 세션으로 시작한다.
 *
 * 복원은 첫 렌더의 초기값에서 동기로 끝낸다.
 * effect 안에서 setState를 부르면 렌더가 연쇄로 일어나므로 그렇게 하지 않는다.
 * effect는 반대 방향, 즉 상태를 저장소에 반영하는 용도로만 쓴다.
 */

const STORAGE_KEY = `${DEMO.storagePrefix}:session`

interface StoredSession {
  personaId: PersonaId
  isAuthenticated: boolean
}

interface SessionState {
  personaId: PersonaId
  sessionStatus: SessionStatus
}

function readStored(): StoredSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return null

    const value = parsed as Partial<StoredSession>
    if (value.personaId !== 'A' && value.personaId !== 'B') return null

    return {
      personaId: value.personaId,
      isAuthenticated: value.isAuthenticated === true,
    }
  } catch {
    // 저장소를 못 쓰거나 값이 깨진 경우. 안전한 초기 상태로 넘어간다.
    return null
  }
}

function writeStored(value: StoredSession) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
  } catch {
    // 저장에 실패해도 화면 동작은 계속된다.
  }
}

/** 첫 렌더에서 저장된 값을 그대로 읽어 초기 상태로 쓴다. */
function createInitialState(): SessionState {
  const stored = readStored()

  if (stored) {
    return {
      personaId: stored.personaId,
      sessionStatus: stored.isAuthenticated ? 'authenticated' : 'anonymous',
    }
  }

  // 발표 기본 진입은 서아 로그인. 저장된 전환/명시적 로그아웃은 위에서 그대로 복원한다.
  return { personaId: 'A', sessionStatus: 'authenticated' }
}

function toUser(personaId: PersonaId): SessionUser {
  const account = DEMO_ACCOUNTS[personaId]
  return {
    personaId,
    name: account.name,
    email: account.email,
    nickname: account.nickname,
    anonymousAvatarUrl: account.anonymousAvatarUrl,
  }
}

function SessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SessionState>(createInitialState)

  // 상태를 외부 시스템(localStorage)에 반영한다. effect의 본래 용도다.
  useEffect(() => {
    writeStored({
      personaId: session.personaId,
      isAuthenticated: session.sessionStatus === 'authenticated',
    })
  }, [session])

  const signIn = useCallback((personaId: PersonaId) => {
    setSession({ personaId, sessionStatus: 'authenticated' })
  }, [])

  const signOut = useCallback(() => {
    setSession((current) => ({ ...current, sessionStatus: 'anonymous' }))
  }, [])

  // 계정 전환은 로그인 상태를 유지한 채 사람만 바꾼다.
  const switchPersona = useCallback((personaId: PersonaId) => {
    setSession({ personaId, sessionStatus: 'authenticated' })
  }, [])

  const value = useMemo(
    () => ({
      personaId: session.personaId,
      sessionStatus: session.sessionStatus,
      currentUser:
        session.sessionStatus === 'authenticated' ? toUser(session.personaId) : null,
      signIn,
      signOut,
      switchPersona,
    }),
    [session, signIn, signOut, switchPersona],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export default SessionProvider
