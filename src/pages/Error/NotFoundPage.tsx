import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import './NotFoundPage.css'

/**
 * 잘못된 URL 전용 화면.
 * 없는 사건 ID나 접근할 수 없는 비공개 사건과는 구분해서 처리한다. (PROJECT_SPEC.md §7-3)
 * 모든 오류를 홈으로 보내서 숨기지 않는다.
 */
function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="not-found__code">404</p>
      <h1 className="not-found__title">페이지를 찾을 수 없어요</h1>
      <p className="not-found__body">
        주소가 바뀌었거나 잘못 입력된 것 같아요.
        <br />
        홈에서 다시 찾아보시겠어요?
      </p>
      <Link className="not-found__action" to={PATHS.home}>
        홈으로 가기
      </Link>
    </main>
  )
}

export default NotFoundPage
