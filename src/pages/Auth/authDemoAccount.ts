/**
 * 로그인·회원가입 시안에 적혀 있는 서아의 시연용 입력값.
 *
 * Figma `2264:13801`(로그인)과 `2187:24632`(회원가입)의 화면 값을 그대로 옮겼다.
 * 발표에서 타이핑 없이 넘어가려고 `서아 계정 로그인` 버튼이 이 값을 한 번에 채운다.
 *
 * `data/personas`의 `DEMO_ACCOUNTS`와는 이메일이 다르다.
 * 그쪽은 MY·계정 전환 등 다른 담당자 화면이 쓰고 있어 건드리지 않았다.
 * 어느 쪽으로 통일할지는 팀 확인이 필요하다. → PROJECT_SPEC.md §9
 *
 * 실제 백엔드가 없는 데모 값이며 비밀번호는 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */
export const AUTH_DEMO_ACCOUNT = {
  nickname: '서아',
  emailId: 'seoa1001',
  emailDomain: 'walgawalbot.com',
  password: 'seoa123#',
  birthYear: '2002',
  birthMonth: '10',
  birthDay: '01',
} as const

/** 로그인 입력창에 들어가는 전체 이메일. */
export const AUTH_DEMO_EMAIL = `${AUTH_DEMO_ACCOUNT.emailId}@${AUTH_DEMO_ACCOUNT.emailDomain}`

/** 회원가입 이메일 도메인 선택지. 시안의 드롭다운 목록이다. */
export const EMAIL_DOMAINS = [
  'walgawalbot.com',
  'naver.com',
  'gmail.com',
  'hanmail.net',
  'daum.net',
] as const
