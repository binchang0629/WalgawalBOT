import { Outlet } from 'react-router-dom'
import './DetailLayout.css'

/**
 * 사건 상세·접수·챗봇 등 단일 화면 흐름의 공통 틀. (PROJECT_SPEC.md §7-4)
 *
 * 하단 내비게이션을 두지 않는다. 뒤로가기·제목·완료 버튼 같은 화면 상단 구조는
 * Figma 시안마다 달라서(예: 사건 접수는 진행률 바를 포함한 자체 헤더를 가진다)
 * 이 레이아웃이 아니라 각 페이지가 직접 그린다.
 */
function DetailLayout() {
  return (
    <div className="detail-layout">
      <Outlet />
    </div>
  )
}

export default DetailLayout
