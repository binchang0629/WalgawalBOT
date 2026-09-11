import { Link, useLocation } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import SpinningMascot from './SpinningMascot'
import './FloatingChatButton.css'

/**
 * 챗봇을 여는 공통 플로팅 버튼.
 * 작성·접수 흐름에서는 집중을 방해하지 않도록 표시하지 않는다.
 */
function FloatingChatButton() {
  const location = useLocation()
  const { pathname } = location
  const isAfterStoryWriting = pathname.startsWith('/afterstory/write/')
    || pathname === PATHS.afterStoryPreview
    || pathname === PATHS.afterStoryComplete
  const isCaseSubmitting = pathname === PATHS.caseSubmit || pathname.startsWith('/cases/new/')

  if (pathname === PATHS.chatbot || isAfterStoryWriting || isCaseSubmitting) return null

  const sitsAboveNavigation = [PATHS.home, PATHS.plaza, PATHS.afterStory, PATHS.my].some((route) => route === pathname)
    || /^\/cases\/[^/]+(?:\/result)?$/.test(pathname)

  return (
    <Link
      to={PATHS.chatbot}
      state={{ from: pathname }}
      className={`floating-chat-button${sitsAboveNavigation ? ' floating-chat-button--above-nav' : ''}`}
      aria-label="AI 판멍이에게 질문하기"
    >
      <SpinningMascot size={80} />
      <span>AI에게 질문하기</span>
    </Link>
  )
}

export default FloatingChatButton