import useSession from '../../hooks/useSession'
import { PERSONAS, PERSONA_ORDER } from '../../data/personas'
import './PersonaSwitcher.css'

/**
 * 시연용 계정 전환 도구.
 *
 * 실제 서비스 UI와 구분되도록 기기 바깥 패널에 둔다.
 * 서비스의 가입 화면 안에 퍼소나 선택 항목을 넣지 않는다. (PROJECT_SPEC.md §4)
 *
 * 발표에서 윤서아 → 곽지훈으로 넘어갈 때 쓴다.
 * 퍼소나는 시나리오 선택 기준일 뿐 인증 수단이 아니다. (PROJECT_SPEC.md §7-5)
 */
function PersonaSwitcher() {
  const { personaId, sessionStatus, switchPersona, signIn, signOut } = useSession()

  if (sessionStatus === 'restoring') return null

  const isAuthenticated = sessionStatus === 'authenticated'

  return (
    <section className="persona-switcher" aria-label="시연 계정 전환">
      <p className="persona-switcher__caption">시연 계정</p>

      <div className="persona-switcher__list">
        {PERSONA_ORDER.map((id) => {
          const persona = PERSONAS[id]
          const isCurrent = id === personaId

          return (
            <button
              key={id}
              type="button"
              className={
                isCurrent
                  ? 'persona-switcher__item persona-switcher__item--current'
                  : 'persona-switcher__item'
              }
              onClick={() => switchPersona(id)}
              aria-pressed={isCurrent}
            >
              <span className="persona-switcher__name">{persona.name}</span>
              <span className="persona-switcher__kind">
                {persona.kind === 'new' ? '신규 사용자' : '기존 사용자'}
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
          onClick={signOut}
          aria-pressed={!isAuthenticated}
        >
          로그인 전
        </button>
        <button
          type="button"
          className={isAuthenticated ? 'persona-switcher__auth-item persona-switcher__auth-item--current' : 'persona-switcher__auth-item'}
          onClick={() => signIn(personaId)}
          aria-pressed={isAuthenticated}
        >
          로그인 후
        </button>
      </div>

      <p className="persona-switcher__status">
        {isAuthenticated
          ? `${PERSONAS[personaId].name} 계정으로 보는 중`
          : '아직 로그인하지 않은 상태'}
      </p>
    </section>
  )
}

export default PersonaSwitcher
