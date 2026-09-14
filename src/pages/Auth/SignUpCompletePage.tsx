import { useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import { requestLoginReward } from '../../state/loginRewardSignal'
import mascot from '../../assets/auth/signUpCompleteMascot.webp'
import './SignUpCompletePage.css'

/**
 * 가입 완료 환영 화면. Figma `2187:24600`.
 *
 * 시안에는 상단 헤더가 없다. 되돌아갈 곳이 없는 마무리 화면이라
 * AuthLayout이 아니라 ShowcaseLayout 아래에 바로 둔다.
 *
 * `왈가왈BOT 시작하기`를 누르면 가입 전에 가려던 화면으로 간다.
 */
function SignUpCompletePage() {
  const { currentUser } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  /** 앱 내부 경로만 허용한다. (PROJECT_SPEC.md §7-5) */
  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  // 가입 직후라 이름이 있다. 복원 중이면 시안 문구의 기본값을 쓴다.
  const name = currentUser?.name.replace(/^윤/, '') ?? '서아'

  return (
    <main className="signUpComplete">
      <div className="signUpCompleteArt">
        <span className="signUpCompleteCircle" aria-hidden="true" />
        <img className="signUpCompleteMascot" src={mascot} alt="" aria-hidden="true" />
      </div>

      <p className="signUpCompleteTitle">{name}님, 가입을 환영해요!</p>
      <p className="signUpCompleteLead">
        자유롭게 글을 쓰거나,
        <br />
        배심원으로서 참여해보세요
      </p>

      <div className="signUpCompleteFooter">
        <button
          type="button"
          className="signUpCompleteStart"
          onClick={() => {
            // 가입은 처음이라 0PT에서 시작하는 팝업이 뜬다.
            requestLoginReward('signup')
            navigate(from, { replace: true })
          }}
        >
          왈가왈BOT 시작하기
        </button>
      </div>
    </main>
  )
}

export default SignUpCompletePage
