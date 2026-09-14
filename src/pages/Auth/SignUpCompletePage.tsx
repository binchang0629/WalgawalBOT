import { useNavigate } from 'react-router-dom'
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
 * `왈가왈BOT 시작하기`를 누르면 항상 홈으로 간다.
 */
function SignUpCompletePage() {
  const { currentUser } = useSession()
  const navigate = useNavigate()

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
            // 홈과 하단 내비를 먼저 고정한 뒤 팝업만 아래에서 올라오게 한다.
            if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
            navigate(PATHS.home, { replace: true })
            window.requestAnimationFrame(() => {
              window.requestAnimationFrame(() => requestLoginReward('signup'))
            })
          }}
        >
          왈가왈BOT 시작하기
        </button>
      </div>
    </main>
  )
}

export default SignUpCompletePage
