import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { requestLoginReward } from '../../state/loginRewardSignal'
import { AUTH_DEMO_ACCOUNT, AUTH_DEMO_EMAIL } from './authDemoAccount'
import eyeOnIcon from '../../assets/auth/loginEyeOn.svg'
import eyeOffIcon from '../../assets/auth/loginEyeOff.svg'
import googleIcon from '../../assets/auth/loginSocialGoogle.png'
import naverIcon from '../../assets/auth/loginSocialNaver.svg'
import kakaoIcon from '../../assets/auth/loginSocialKakao.svg'
import './LoginPage.css'

/**
 * 로그인. Figma `2187:24325`(빈 상태) · `2264:13801`(입력됨) · `2264:13898`(비밀번호 보임).
 *
 * 시안 메모대로 `서아 계정 로그인`을 누르면 이메일과 비밀번호가 한 번에 채워진다.
 * 발표에서 타이핑하지 않고 넘어가기 위한 장치이며, 누른 뒤에는 문구가
 * `서아 계정 로그인 중`으로 바뀐다. 직접 입력도 그대로 된다.
 *
 * SNS 로그인 세 개는 시안에 모양만 있고 연결할 곳이 없다.
 * 카카오는 시안에 `비활성화`로 표시돼 있어 셋 다 비활성으로 둔다. → PROJECT_SPEC.md §9
 *
 * 실제 백엔드가 없는 데모 동작이다.
 * 비밀번호는 화면 표시에만 쓰고 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */

const SOCIALS = [
  { key: 'google', label: '구글로 로그인', icon: googleIcon },
  { key: 'naver', label: '네이버로 로그인', icon: naverIcon },
  { key: 'kakao', label: '카카오로 로그인', icon: kakaoIcon },
] as const

function LoginPage() {
  const { personaId, signIn } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isDemoFilled, setIsDemoFilled] = useState(false)

  /**
   * 로그인 후 돌아갈 곳. 로그인 유도 팝업이 `from`으로 넘겨준다.
   * 앱 내부 경로만 허용한다. 외부 URL은 받지 않는다. (PROJECT_SPEC.md §7-5)
   */
  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  const canSubmit = email.trim() !== '' && password !== ''

  const handleDemoFill = () => {
    setEmail(AUTH_DEMO_EMAIL)
    setPassword(AUTH_DEMO_ACCOUNT.password)
    setIsDemoFilled(true)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return
    signIn(personaId)
    // 도착한 화면 위에 출석 포인트 팝업이 뜬다.
    requestLoginReward('login')
    navigate(from, { replace: true })
  }

  return (
    <main className="login">
      <div className="login__brand">
        {/* 시안의 로고 자리. 실제 로고 에셋이 아직 없어 시안의 회색 상자를 그대로 둔다. */}
        <div className="login__logo" aria-hidden="true">logo</div>
        <p className="login__service">왈가왈BOT</p>
        <p className="login__tagline">AI와 유저가 심판해주는 고민 판결 커뮤니티</p>
      </div>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__fields">
          <button
            type="button"
            className={isDemoFilled ? 'login__demoFill login__demoFillOn' : 'login__demoFill'}
            onClick={handleDemoFill}
          >
            {isDemoFilled ? '서아 계정 로그인 중' : '서아 계정 로그인'}
          </button>

          <label className="login__field">
            <span className="login__srOnly">아이디 (이메일)</span>
            <input
              className="login__input"
              type="email"
              autoComplete="username"
              placeholder="아이디 (이메일)"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className="login__field login__fieldPassword">
            <span className="login__srOnly">비밀번호</span>
            <input
              className="login__input"
              type={isPasswordVisible ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="비밀번호"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              className="login__eye"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              aria-label={isPasswordVisible ? '비밀번호 가리기' : '비밀번호 보기'}
              aria-pressed={isPasswordVisible}
            >
              <img src={isPasswordVisible ? eyeOnIcon : eyeOffIcon} alt="" aria-hidden="true" />
            </button>
          </label>
        </div>

        <button type="submit" className="login__submit" disabled={!canSubmit}>
          로그인하기
        </button>
      </form>

      <div className="login__social">
        <p className="login__socialTitle"><span>SNS 로그인</span></p>
        <ul className="login__socialList">
          {SOCIALS.map((social) => (
            <li key={social.key}>
              <button
                type="button"
                className={`login__socialButton login__socialButton${social.key.charAt(0).toUpperCase()}${social.key.slice(1)}`}
                disabled
                aria-label={social.label}
                title="시안 확정 후 연결됩니다"
              >
                <img src={social.icon} alt="" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="login__links">
        <Link
          className="login__signupLink"
          to={`${PATHS.signup}?from=${encodeURIComponent(from)}`}
        >
          이메일로 회원가입
        </Link>
        <span className="login__linkDivider" aria-hidden="true" />
        {/* 찾기 화면은 시안이 없어 연결하지 않는다. → PROJECT_SPEC.md §9 */}
        <span className="login__findLink">아이디 / 비밀번호 찾기</span>
      </p>
    </main>
  )
}

export default LoginPage
