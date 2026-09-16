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
  // 로그인·회원가입 시안에는 챗봇 버튼이 없다. 하단 링크와도 겹친다.
  const isAuthenticating = pathname === PATHS.login
    || pathname === PATHS.signup
    || pathname === PATHS.signupComplete
    || pathname === PATHS.onboarding

  if (pathname === PATHS.chatbot || pathname === PATHS.myPlan || isAfterStoryWriting || isCaseSubmitting || isAuthenticating) {
    return null
  }

  /*
   * 하단 내비게이션이 있는 화면에서는 버튼을 내비 위로 올린다.
   * 빠뜨리면 버튼이 내비 위에 걸쳐 `MY` 같은 메뉴를 가린다. (`내가 쓴 후일담`에서 그랬다)
   */
  const sitsAboveNavigation = [
    PATHS.home,
    PATHS.plaza,
    PATHS.afterStory,
    PATHS.afterStoryMine,
    PATHS.afterStoryMineStories,
    PATHS.my,
  ].some((route) => route === pathname)
    // 공개 후일담 상세도 MainLayout의 하단 내비게이션을 사용한다.
    || /^\/afterstory\/[^/]+$/.test(pathname)
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
