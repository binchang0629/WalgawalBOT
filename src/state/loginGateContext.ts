import { createContext } from 'react'

/**
 * 로그인 유도 팝업을 띄운 이유. 시안이 이유마다 다른 캐릭터와 문구를 쓴다.
 *
 *   caseSubmit   사건 접수  (Figma `2298:16848`)
 *   my           MY 페이지  (Figma `2298:17535`)
 *   aiRecommend  AI 맞춤 추천 (Figma `2298:17673`)
 *   default      그 외 로그인이 필요한 동작 (Figma `2298:17811`)
 */
export type LoginGateReason = 'caseSubmit' | 'my' | 'aiRecommend' | 'default'

export interface LoginGateValue {
  /**
   * 로그인이 필요한 동작을 시도할 때 부른다.
   *
   * 로그인 상태면 `true`를 돌려주고 아무것도 하지 않는다. 호출한 쪽이 그대로 진행하면 된다.
   * 비로그인이면 보던 화면 위에 안내 팝업을 띄우고 `false`를 돌려준다.
   *
   * `destination`은 로그인을 마친 뒤 돌아갈 앱 내부 경로다.
   * 검증된 내부 경로만 받는다. 외부 URL은 넘기지 않는다. (PROJECT_SPEC.md §7-5)
   */
  requireLogin: (reason: LoginGateReason, destination?: string) => boolean
}

export const LoginGateContext = createContext<LoginGateValue | null>(null)
