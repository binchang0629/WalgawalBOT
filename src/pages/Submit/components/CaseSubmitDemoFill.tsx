import { PERSONAS } from '../../../data/personas'
import type { PersonaId } from '../../../types'

/**
 * 사건 접수 단계별 시연 자동 입력 버튼.
 *
 * 발표에서 관계 고르기·질문 답하기·공개 범위 선택을 매번 손으로 하면 흐름이 끊긴다.
 * 그래서 그 단계에 필요한 값을 한 번에 채우는 버튼을 단계마다 둔다.
 *
 * 자리는 화면 제목 바로 아래(`case-submit__intro`)로 통일했다.
 *   - 진행 표시줄·제목과 함께 스크롤 없이 바로 보인다.
 *   - 실제 서비스 입력 요소(관계 칩, 본문 칸, 다음 버튼) 사이에 끼어들지 않는다.
 *   - 본문 칸의 `내용 작성하기`와 같은 주황 계열이라 시연용 장치라는 게 한눈에 구분된다.
 *
 * 실제 서비스 기능이 아니라 발표용 장치이며, 채우는 값은 시안의 예시 문구다.
 * (PROJECT_SPEC.md §6 — 백엔드·AI 없이 고정 예시로 흐름만 보여준다)
 */

interface Props {
  personaId: PersonaId
  /** 계정 이름 대신 단계 이름을 보여줄 때 사용한다. */
  label?: string
  /** 이 단계의 예시 값이 채워져 있으면 취소 동작을 안내한다. */
  done: boolean
  onFill: () => void
}

/** `곽지훈` → `지훈`. 두 글자 이름은 그대로 둔다. */
const shortNameOf = (name: string) => (name.length > 2 ? name.slice(1) : name)

function CaseSubmitDemoFill({ personaId, label, done, onFill }: Props) {
  const name = label ?? shortNameOf(PERSONAS[personaId].name)

  return (
    <button
      type="button"
      className={`case-submit__autofill${done ? ' is-done' : ''}`}
      onClick={onFill}
      aria-pressed={done}
    >
      {done ? `${name} 예시 입력 취소` : `${name} 예시 한번에 채우기`}
    </button>
  )
}

export default CaseSubmitDemoFill
