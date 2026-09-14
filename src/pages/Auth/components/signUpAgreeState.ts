/**
 * 회원가입 동의 항목의 상태.
 *
 * 시트 컴포넌트와 회원가입 화면이 함께 쓰므로 별도 파일로 둔다.
 * (컴포넌트 파일이 컴포넌트 외의 값을 내보내면 Fast Refresh가 동작하지 않는다)
 */
export interface AgreeState {
  /** 왈가왈BOT 약관 동의 (필수) */
  terms: boolean
  /** 개인정보수집 및 이용에 대한 안내 (필수) */
  privacy: boolean
  /** 이벤트/마케팅 수신 동의 (선택) */
  marketing: boolean
  /** 통합 알림 수신 동의 (선택) */
  notification: boolean
}

export const EMPTY_AGREE: AgreeState = {
  terms: false,
  privacy: false,
  marketing: false,
  notification: false,
}
