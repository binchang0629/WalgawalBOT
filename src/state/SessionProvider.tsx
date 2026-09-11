import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { PersonaId, SessionStatus } from '../types'
import { DEMO_ACCOUNTS, PERSONAS } from '../data/personas'
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

  // 처음 들어오면 서아의 시작 상태, 즉 비로그인이다.
  return { personaId: 'A', sessionStatus: startStatusOf('A') }
}

/**
 * 퍼소나마다 시연을 시작하는 로그인 상태가 다르다.
 *
 *   서아(신규) : 비로그인으로 시작한다. 투표하려다 로그인 안내를 만나고, 가입하고 돌아오는 흐름이다.
 *   지훈(기존) : 이미 회원이라 로그인된 채로 시작한다. 가입 단계를 거치지 않는다.
 */
function startStatusOf(personaId: PersonaId): SessionStatus {
  return PERSONAS[personaId].kind === 'new' ? 'anonymous' : 'authenticated'
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

  /*
   * 계정 전환은 그 퍼소나의 시연 시작 지점으로 되돌린다.
   * 서아를 고르면 비로그인, 지훈을 고르면 로그인 상태다.
   * 서아로 돌아왔는데 앞선 시연에서 로그인한 상태가 남아 있으면 가입 흐름을 다시 못 보여준다.
   */
  const switchPersona = useCallback((personaId: PersonaId) => {
    setSession({ personaId, sessionStatus: startStatusOf(personaId) })
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
