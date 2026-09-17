import type { PersonaId } from '../../types'
import { DEMO_ACCOUNTS } from '../../data/personas'

/**
 * 로그인·회원가입 시안에 적혀 있는 서아의 시연용 입력값.
 *
 * Figma `2264:13801`(로그인)과 `2187:24632`(회원가입)의 화면 값을 그대로 옮겼다.
 * 발표에서 타이핑 없이 넘어가려고 `서아 계정 로그인` 버튼이 이 값을 한 번에 채운다.
 *
 * `data/personas`의 `DEMO_ACCOUNTS`와 같은 서아 이메일을 사용한다.
 * 로그인·회원가입·MY·계정 전환에서 계정 정보가 일관되게 보이도록 한 값이다.
 *
 * 실제 백엔드가 없는 데모 값이며 비밀번호는 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */
export const AUTH_DEMO_ACCOUNT = {
  nickname: '윤서아',
  emailId: 'seoa1001',
  emailDomain: 'wgwb.com',
  password: 'seoa123#',
  birthYear: '2002',
  birthMonth: '10',
  birthDay: '01',
} as const

/** 로그인 입력창에 들어가는 전체 이메일. */
export const AUTH_DEMO_EMAIL = `${AUTH_DEMO_ACCOUNT.emailId}@${AUTH_DEMO_ACCOUNT.emailDomain}`

/** 회원가입 이메일 도메인 선택지. 시안의 드롭다운 목록이다. */
export const EMAIL_DOMAINS = [
  'wgwb.com',
  'naver.com',
  'gmail.com',
  'hanmail.net',
  'daum.net',
] as const

/**
 * 로그인 화면의 계정별 시연 입력값.
 *
 * 발표에서 지금 고른 퍼소나로 바로 로그인할 수 있게, 선택된 계정의 값을
 * `<이름> 계정 로그인` 버튼이 한 번에 채운다. (A 윤서아 / B 곽지훈)
 *
 * 이메일은 `data/personas`의 `DEMO_ACCOUNTS`를 그대로 쓴다.
 * 로그인·MY·계정 전환에서 같은 값이 보이게 하려는 것이다.
 * 비밀번호도 데모 표시용이며 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */
export interface AuthDemoLogin {
  /** 전체 이름. 예: 곽지훈 */
  name: string
  /** 시안처럼 성을 뗀 호칭. 예: 지훈 */
  shortName: string
  email: string
  password: string
}

/** `곽지훈` → `지훈`. 두 글자 이름은 그대로 둔다. */
const shortNameOf = (name: string) => (name.length > 2 ? name.slice(1) : name)

export const AUTH_DEMO_LOGINS: Record<PersonaId, AuthDemoLogin> = {
  A: {
    name: DEMO_ACCOUNTS.A.name,
    shortName: shortNameOf(DEMO_ACCOUNTS.A.name),
    email: AUTH_DEMO_EMAIL,
    password: AUTH_DEMO_ACCOUNT.password,
  },
  B: {
    name: DEMO_ACCOUNTS.B.name,
    shortName: shortNameOf(DEMO_ACCOUNTS.B.name),
    email: DEMO_ACCOUNTS.B.email,
    password: DEMO_ACCOUNTS.B.passwordPlaceholder,
  },
}

/** 입력한 이메일이 어느 시연 계정인지 찾는다. 없으면 null. */
export function findDemoPersonaByEmail(email: string): PersonaId | null {
  const target = email.trim().toLowerCase()
  const entries = Object.entries(AUTH_DEMO_LOGINS) as [PersonaId, AuthDemoLogin][]
  return entries.find(([, login]) => login.email.toLowerCase() === target)?.[0] ?? null
}
