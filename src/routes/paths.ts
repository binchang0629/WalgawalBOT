/**
 * 앱 내부 경로를 한곳에서 관리한다.
 * 문자열 URL을 화면 코드에 직접 적지 않는다. (PROJECT_SPEC.md §7-3)
 */

export const PATHS = {
  root: '/',
  demo: '/demo',
  /** 로그인 시안 확정 전 임시 연결 화면. */
  login: '/login',
  /** 회원가입 (데모). 컨펌 시안 없이 팀 결정으로 추가한 화면이다. (PROJECT_SPEC.md §9-2) */
  signup: '/signup',
  home: '/home',
  plaza: '/plaza',
  caseDetail: '/cases/:caseId',
  caseResult: '/cases/:caseId/result',
  /** 사건 접수 1~4단계. 흐름은 지훈01~05(사건 작성 → 추가 질문 → 요약 확인 → AI 참고 의견·접수 → 접수 완료) 기준. */
  caseSubmit: '/cases/new',
  caseSubmitQuestions: '/cases/new/questions',
  caseSubmitSummary: '/cases/new/summary',
  caseSubmitOpinion: '/cases/new/opinion',
  caseSubmitComplete: '/cases/new/complete',
  afterStory: '/afterstory',
  afterStoryDetail: '/afterstory/:storyId',
  my: '/my',
  notFound: '*',
} as const

/** 동적 경로 생성 함수. useParams로 읽는 값과 짝을 이룬다. */
export const toCaseDetail = (caseId: string) => `/cases/${caseId}`
export const toCaseResult = (caseId: string) => `/cases/${caseId}/result`
export const toAfterStoryDetail = (storyId: string) => `/afterstory/${storyId}`

/**
 * 상세 화면에 외부에서 바로 들어온 경우 돌아갈 기본 경로.
 * history.length만 보고 앱 내부 이전 화면이 있다고 가정하지 않는다. (PROJECT_SPEC.md §7-7)
 */
export const BACK_FALLBACK: Record<string, string> = {
  cases: PATHS.plaza,
  afterstory: PATHS.afterStory,
}
