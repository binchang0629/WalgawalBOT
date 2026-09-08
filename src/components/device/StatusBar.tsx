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
      <span className="device-status-bar__time">9:41</span>
      <span className="device-status-bar__island" />
      <span className="device-status-bar__indicators">
        <span className="device-status-bar__signal" />
        <span className="device-status-bar__wifi" />
        <span className="device-status-bar__battery" />
      </span>
    </div>
  )
}

export default StatusBar
