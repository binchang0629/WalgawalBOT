import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { DEMO_ACCOUNTS } from '../../data/personas'
import { PATHS } from '../../routes/paths'
import './SignupPage.css'

/**
 * 회원가입 (데모).
 *
 * ⚠ 이 화면은 Figma 컨펌 시안이 없다. 팀 결정으로 발표 시연을 위해 추가한 화면이며,
 *   확정 스타일가이드 토큰만 사용해 만들었다. (PROJECT_SPEC.md §9-2)
 *
 * 시연 흐름: 윤서아가 홈 → 오늘 사건 → 사건 상세에서
 *   `로그인하고 나도 투표하기`를 누른 시점에 이 화면으로 들어온다.
 *
 * 입력값은 윤서아의 더미 정보가 흐리게 채워져 있고 직접 수정할 수 없다.
 * `더미텍스트 입력` 버튼을 누르면 값이 확정되어 다음으로 넘어갈 수 있다.
 *
 * 실제 백엔드가 없는 데모 동작이다.
 * 비밀번호는 화면 표시에만 쓰고 어디에도 저장하지 않는다. (PROJECT_SPEC.md §6)
 */

const account = DEMO_ACCOUNTS.A

const FIELDS = [
  { key: 'email', label: '이메일', value: account.email, type: 'text' },
  { key: 'password', label: '비밀번호', value: account.passwordPlaceholder, type: 'password' },
  { key: 'nickname', label: '닉네임', value: account.nickname, type: 'text' },
] as const

function SignupPage() {
  const [isFilled, setIsFilled] = useState(false)
  const { signIn } = useSession()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  /**
   * 가입 후 돌아갈 곳. 사건 상세에서 들어왔다면 그 화면으로 되돌린다.
   * 앱 내부 경로만 허용한다. 외부 URL은 받지 않는다. (PROJECT_SPEC.md §7-5)
   */
  const rawFrom = searchParams.get('from')
  const from = rawFrom && rawFrom.startsWith('/') && !rawFrom.startsWith('//') ? rawFrom : PATHS.home

  const handleSubmit = () => {
    if (!isFilled) return
    signIn('A')
    navigate(from, { replace: true })
  }

  return (
    <main className="signup">
      <h1 className="signup__title">
        왈가왈BOT에
        <br />
        오신 걸 환영해요
      </h1>
      <p className="signup__lead">
        사건에 의견을 남기려면 계정이 필요해요.
        <br />
        발표 시연용 계정으로 빠르게 시작할 수 있어요.
      </p>

      <div className="signup__form">
        {FIELDS.map((field) => (
          <label className="signup__field" key={field.key}>
            <span className="signup__label">{field.label}</span>
            <input
              className={isFilled ? 'signup__input' : 'signup__input signup__input--dim'}
              type={field.type}
              value={field.value}
              readOnly
              tabIndex={-1}
              aria-readonly="true"
            />
          </label>
        ))}
      </div>

      <p className="signup__notice">
        실제 가입이 아닌 <b>데모 동작</b>이에요. 입력값은 저장되지 않아요.
      </p>

      <div className="signup__actions">
        <button
          type="button"
          className="signup__dummy"
          onClick={() => setIsFilled(true)}
          disabled={isFilled}
        >
          {isFilled ? '입력 완료' : '더미텍스트 입력'}
        </button>
        <button
          type="button"
          className="signup__submit"
          onClick={handleSubmit}
          disabled={!isFilled}
        >
          가입하고 투표하기
        </button>
      </div>
    </main>
  )
}

export default SignupPage
