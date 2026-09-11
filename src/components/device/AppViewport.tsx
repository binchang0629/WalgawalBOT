import type { ReactNode } from 'react'
import FloatingChatButton from '../common/FloatingChatButton'
import ClickSpark from '../common/ClickSpark'
import './AppViewport.css'

interface AppViewportProps {
  children: ReactNode
}

/**
 * 앱의 화면 경계.
 *
 * PC에서는 기기 목업 안쪽, 모바일에서는 실제 화면 전체가 이 영역이다.
 * 모달·바텀시트·토스트는 브라우저 전체가 아니라 이 안에서 표시한다. (PROJECT_SPEC.md §2, §7-4)
 * 스크롤은 이 안의 콘텐츠 컨테이너가 담당한다. window를 스크롤하지 않는다.
 */
function AppViewport({ children }: AppViewportProps) {
  return (
    <div className="app-viewport" id="app-viewport">
      <ClickSpark>{children}</ClickSpark>
      <FloatingChatButton />
      {/* 모달·바텀시트 portal 대상. 스크롤 콘텐츠 바깥이면서 기기 내부에 있다. */}
      <div id="app-overlay-root" />
    </div>
  )
}

export default AppViewport
