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

/*
 * 시트를 열었을 때의 초기 상태.
 * 필수 두 항목은 시안(2264:13125)에서 이미 켜진 채로 그려져 있다.
 * 빠뜨리면 진행이 막히는 항목이라 미리 켜 두고, 선택 두 개만 사용자가 고른다.
 */
export const DEFAULT_AGREE: AgreeState = {
  terms: true,
  privacy: true,
  marketing: false,
  notification: false,
}
