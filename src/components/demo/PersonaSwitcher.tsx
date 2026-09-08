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
  const { personaId, sessionStatus, switchPersona } = useSession()

  if (sessionStatus === 'restoring') return null

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

      <p className="persona-switcher__status">
        {sessionStatus === 'authenticated'
          ? `${PERSONAS[personaId].name} 계정으로 보는 중`
          : '아직 로그인하지 않은 상태'}
      </p>
    </section>
  )
}

export default PersonaSwitcher
