/**
 * 목업용 홈 인디케이터.
 *
 * Figma의 down_nav(402×100)는 하단 여백 16px를 비워 둔 채 홈 인디케이터 자리를 남겨 둔다.
 * 서비스의 하단 내비게이션과는 다른 요소이므로 목업이 그린다. (PROJECT_SPEC.md §2)
 * 앱의 BottomNavigation은 인디케이터 막대를 직접 그리지 않는다.
 */
function HomeIndicator() {
  return <div className="device-home-indicator" aria-hidden="true" />
}

export default HomeIndicator
