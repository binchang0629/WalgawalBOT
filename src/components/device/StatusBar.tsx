/**
 * 목업용 시스템 상태바.
 *
 * Figma 홈 시안의 top_nav(402×128)는 상단 62px 시스템 상태바 + 하단 66px 서비스 헤더다.
 * 이 62px은 iOS가 그리는 영역이므로 앱이 아니라 기기 목업이 담당한다. (PROJECT_SPEC.md §0-4, §2)
 * 모바일에서는 실제 기기가 그리므로 렌더링하지 않는다.
 */
function StatusBar() {
  return (
    <div className="device-status-bar" aria-hidden="true">
      <time className="device-status-bar__time">9:41</time>
      <span className="device-status-bar__island" />
      <span className="device-status-bar__indicators">
        <svg className="device-status-bar__signal" viewBox="0 0 18 14" focusable="false">
          <rect x="0" y="9" width="3.5" height="5" rx="1.75" />
          <rect x="4.83" y="6" width="3.5" height="8" rx="1.75" />
          <rect x="9.67" y="3" width="3.5" height="11" rx="1.75" />
          <rect x="14.5" y="0" width="3.5" height="14" rx="1.75" />
        </svg>
        <svg className="device-status-bar__wifi" viewBox="0 0 24 18" fill="none" focusable="false">
          <path d="M1.8 5.2C7.4-.1 16.6-.1 22.2 5.2" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
          <path d="M5.7 9.1C9.1 6 14.9 6 18.3 9.1" stroke="currentColor" strokeWidth="3.1" strokeLinecap="round" />
          <circle cx="12" cy="13.8" r="1.8" fill="currentColor" />
        </svg>
        <svg className="device-status-bar__battery" viewBox="0 0 31 15" focusable="false">
          <rect x="0" y="0" width="27" height="15" rx="4" fill="currentColor" />
          <path d="M29 4.6C30.3 5.2 31 6.3 31 7.5C31 8.7 30.3 9.8 29 10.4V4.6Z" fill="currentColor" />
        </svg>
      </span>
    </div>
  )
}

export default StatusBar
