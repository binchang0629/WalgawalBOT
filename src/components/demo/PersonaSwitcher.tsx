import { useNavigate } from 'react-router-dom'
import type { PersonaId } from '../../types'
import useSession from '../../hooks/useSession'
import { PERSONAS, PERSONA_ORDER } from '../../data/personas'
import seoaProfileImage from '../../assets/my/account-seoa.png'
import jihunProfileImage from '../../assets/my/account-jihun.png'
import { PATHS } from '../../routes/paths'
import './PersonaSwitcher.css'

const PROFILE_IMAGES = {
  A: seoaProfileImage,
  B: jihunProfileImage,
} as const

/**
 * 시연용 계정 전환 도구.
 *
 * 실제 서비스 UI와 구분되도록 기기 바깥 패널에 둔다.
 * 서비스의 가입 화면 안에 퍼소나 선택 항목을 넣지 않는다. (PROJECT_SPEC.md §4)
 *
 * 발표에서 윤서아 → 곽지훈으로 넘어갈 때 쓴다.
 * 퍼소나는 시나리오 선택 기준일 뿐 인증 수단이 아니다. (PROJECT_SPEC.md §7-5)
 *
 * 계정을 고르면 그 시나리오의 첫 화면으로 바로 넘어간다.
 * 서아는 서비스를 처음 보는 신규 사용자라 온보딩부터, 지훈은 기존 사용자라 로그인 화면이다.
 * 고르기만 하고 화면이 그대로면 발표 중 한 번 더 눌러 찾아가야 했다. (PROJECT_SPEC.md §4)
 */
function PersonaSwitcher() {
  const navigate = useNavigate()
  const { personaId, sessionStatus, currentUser, switchPersona, signIn } = useSession()

  if (sessionStatus === 'restoring') return null

  const isAuthenticated = sessionStatus === 'authenticated'

  /** 고른 계정의 시연 시작 화면으로 보낸다. 서아 = 온보딩, 지훈 = 로그인. */
  const handlePersonaSelect = (id: PersonaId) => {
    if (id === 'A') {
      // 서아는 서비스를 처음 보는 신규 사용자다. 온보딩 → 회원가입 순서로 시연한다.
      switchPersona('A')
      navigate(PATHS.onboarding)
      return
    }
    // 지훈은 기존 사용자라 기본값이 로그인 상태다. 로그인 화면을 보여주려고 비로그인에서 시작한다.
    switchPersona('B', { startSignedOut: true })
    navigate(PATHS.login)
  }

  /**
   * 바깥 패널의 로그인 상태도 현재 고른 퍼소나에 묶는다.
   * 로그인 전으로 바꾸면서 항상 서아로 돌아가면 지훈 로그인 흐름이 끊기므로,
   * 같은 퍼소나를 유지한 채 해당 시작 화면으로 이동한다.
   */
  const handleAuthState = (authenticated: boolean) => {
    if (authenticated) {
      signIn(personaId)
      navigate(PATHS.home)
      return
    }

    switchPersona(personaId, { startSignedOut: true })
    navigate(personaId === 'A' ? PATHS.onboarding : PATHS.login)
  }

  return (
    <section className="persona-switcher" aria-label="시연 계정 전환">
      <p className="persona-switcher__caption">시연 계정</p>

      <div className="persona-switcher__list">
        {PERSONA_ORDER.map((id) => {
          const persona = PERSONAS[id]
          // 로그인 여부와 무관하게 현재 시연 흐름을 표시한다.
          // 그래야 `서아 · 로그인 전`처럼 두 상태가 함께 읽힌다.
          const isCurrent = !currentUser?.isCustomProfile && id === personaId

          return (
            <button
              key={id}
              type="button"
              className={`persona-switcher__item persona-switcher__item--${id}${
                isCurrent ? ' persona-switcher__item--current' : ''
              }`}
              onClick={() => handlePersonaSelect(id)}
              aria-pressed={isCurrent}
            >
              <img
                className="persona-switcher__avatar"
                src={PROFILE_IMAGES[id]}
                alt=""
                aria-hidden="true"
              />
              <span className="persona-switcher__copy">
                <span className="persona-switcher__name">{persona.name}</span>
                <span className="persona-switcher__kind">
                  {persona.kind === 'new' ? '신규 사용자' : '기존 사용자'}
                </span>
              </span>
            </button>
          )
        })}
      </div>

      {/*
        로그인 화면 시안이 나오기 전까지 두 상태를 오갈 수 있게 하는 시연용 스위치.
        실제 인증이 아니라 화면 상태만 바꾼다. 서비스 UI 안이 아니라 기기 바깥에 둔다.
      */}
      <p className="persona-switcher__caption persona-switcher__caption--auth">로그인 상태</p>

      <div className="persona-switcher__auth" role="group" aria-label="로그인 상태 전환">
        <button
          type="button"
          className={isAuthenticated ? 'persona-switcher__auth-item' : 'persona-switcher__auth-item persona-switcher__auth-item--current'}
          onClick={() => handleAuthState(false)}
          aria-pressed={!isAuthenticated}
        >
          로그인 전
        </button>
        <button
          type="button"
          className={isAuthenticated ? 'persona-switcher__auth-item persona-switcher__auth-item--current' : 'persona-switcher__auth-item'}
          onClick={() => handleAuthState(true)}
          aria-pressed={isAuthenticated}
        >
          로그인 후
        </button>
      </div>

      <p className="persona-switcher__status">
        {isAuthenticated
          ? currentUser?.isCustomProfile
            ? `${currentUser.name} 계정으로 보는 중`
            : `${PERSONAS[personaId].name} 계정으로 보는 중`
          : `${PERSONAS[personaId].name} · 로그인 전`}
      </p>

      <button
        type="button"
        className="persona-switcher__onboarding"
        onClick={() => navigate(PATHS.onboarding)}
      >
        온보딩 다시 보기
      </button>
    </section>
  )
}

export default PersonaSwitcher
