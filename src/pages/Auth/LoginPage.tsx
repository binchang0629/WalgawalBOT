import { useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import './LoginPage.css'

/**
 * 로그인 디자인이 확정되기 전 사용자 흐름을 연결하는 임시 화면.
 * 확정 시안이 나오면 이 파일의 UI만 교체하고 `from` 복귀 규칙은 유지한다.
 */
function LoginPage() {
  const { personaId, signIn } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  const handleDemoLogin = () => {
    signIn(personaId)
    navigate(from, { replace: true })
  }

  return (
    <main className="login-placeholder">
      <span className="login-placeholder__eyebrow">LOGIN</span>
      <h1>로그인 화면 준비 중</h1>
      <p>
        로그인 화면 디자인이 아직 확정되지 않아
        <br />
        지금은 시연용 버튼으로 다음 단계를 확인할 수 있어요.
      </p>
      <button type="button" onClick={handleDemoLogin}>데모 로그인하고 투표하기</button>
      <small>실제 로그인이나 서버 요청은 발생하지 않습니다.</small>
    </main>
  )
}

export default LoginPage
