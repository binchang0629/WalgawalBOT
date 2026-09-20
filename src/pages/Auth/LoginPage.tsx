import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { requestLoginReward } from '../../state/loginRewardSignal'
import { AUTH_DEMO_LOGINS, findDemoPersonaByEmail } from './authDemoAccount'
import eyeOnIcon from '../../assets/auth/loginEyeOn.svg'
import eyeOffIcon from '../../assets/auth/loginEyeOff.svg'
import googleIcon from '../../assets/auth/loginSocialGoogle.png'
import naverIcon from '../../assets/auth/loginSocialNaver.svg'
import kakaoIcon from '../../assets/auth/loginSocialKakao.svg'
import wgwbLogo from '../../assets/brand/wgwb-logo.svg'
import './LoginPage.css'

/**
 * 로그인. Figma `2187:24325`(빈 상태) · `2264:13801`(입력됨) · `2264:13898`(비밀번호 보임).
 *
 * 시안 메모대로 `<이름> 계정 로그인`을 누르면 이메일과 비밀번호가 한 번에 채워진다.
 * 발표에서 타이핑하지 않고 넘어가기 위한 장치이며, 누른 뒤에는 문구가
 * `<이름> 계정 로그인 중`으로 바뀐다. 직접 입력도 그대로 된다.
 *
 * 채우는 값은 기존 사용자 곽지훈의 계정이다. 윤서아는 신규 가입 시나리오라
 * 회원가입으로 들어오고, 로그인 화면을 쓰는 쪽은 지훈이기 때문이다.
 * 이메일을 직접 친 경우에도 그 이메일의 계정으로 로그인한다. (PROJECT_SPEC.md §4)
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

  // 로그인 화면은 기존 사용자 곽지훈의 시연 계정으로 고정한다.
  // 윤서아는 신규 가입 시나리오라 회원가입으로 들어오고, 이 화면을 쓰는 쪽은 지훈이다.
  // 퍼소나 선택과 무관하게 같은 값이 보여야 발표 중 계정이 섞이지 않는다. (PROJECT_SPEC.md §4)
  const demoLogin = AUTH_DEMO_LOGINS.B
  // 별도 상태로 두면 퍼소나를 바꿔도 `로그인 중` 문구가 남는다. 입력값에서 바로 읽는다.
  const isDemoFilled = email === demoLogin.email && password === demoLogin.password

  /** 회원가입으로 이동할 때만 안전한 앱 내부 진입 경로를 이어준다. */
  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  const canSubmit = email.trim() !== '' && password !== ''

  const handleDemoFill = () => {
    setEmail(demoLogin.email)
    setPassword(demoLogin.password)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!canSubmit) return

    // 모바일 키보드·포커스가 남아 있으면 도착 화면의 하단 내비가 밀려 보일 수 있다.
    // 먼저 포커스를 해제하고 목적지 화면을 한 프레임 완성한 뒤 보상 팝업을 띄운다.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
    // 시연 계정 이메일을 직접 친 경우 그 계정으로 들어간다.
    // 그래야 로그인 직후 인사 팝업이 `지훈님`처럼 실제 입력한 계정 이름으로 뜬다.
    signIn(findDemoPersonaByEmail(email) ?? personaId)
    navigate(PATHS.home, { replace: true })
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => requestLoginReward('login'))
    })
  }

  return (
    <main className="login">
      <div className="login__brand">
        <img className="login__logo" src="/favicon/favicon.svg" width="62" height="62" alt="" />
        <img className="login__service" src={wgwbLogo} width="134" height="23" alt="왈가왈BOT" />
        <p className="login__tagline">AI와 유저가 심판해주는 고민 판결 커뮤니티</p>
      </div>

      <form className="login__form" onSubmit={handleSubmit}>
        <div className="login__fields">
          <button
            type="button"
            className={isDemoFilled ? 'login__demoFill login__demoFillOn' : 'login__demoFill'}
            onClick={handleDemoFill}
          >
            {isDemoFilled ? `${demoLogin.shortName} 계정 로그인 중` : `${demoLogin.shortName} 계정 로그인`}
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
