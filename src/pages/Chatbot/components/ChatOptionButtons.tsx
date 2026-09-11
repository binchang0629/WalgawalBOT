import { ALWAYS_DISABLED_OPTION_IDS } from '../chatbotScript'
import type { ChatOption } from '../chatbotScript'
import '../Chatbot.css'

interface ChatOptionButtonsProps {
  options: ChatOption[]
  layout?: 'actions' | 'chips'
  /** 이전 대화 기록에 남은 선택지는 화면에 그대로 보이지만 다시 누를 수는 없다. */
  interactive: boolean
  /** 이 선택지 묶음에서 사용자가 실제로 고른 것. 고른 뒤에도 active 색으로 남는다. */
  selectedOptionId?: string
  onSelect: (option: ChatOption) => void
}

/**
 * 챗봇 답변에 붙는 선택지.
 *
 * `actions` = 고정폭 2버튼을 가로로 배치(Figma "최근 접수한 사건" 카드).
 * `chips`   = 폭을 꽉 채운 버튼을 세로로 쌓는다(그 외 모든 추천 질문).
 *
 * 모든 선택지는 default(흰 배경)로 시작하고, 누르는 순간(`:active`)과
 * 실제로 고른 선택지(`--active` modifier, `selectedOptionId`)만 색이 바뀐다.
 * 지나간 턴의 선택지도 시각적으로는 그대로 남겨 대화 기록의 모양을 유지하되,
 * 최신 턴이 아니면 클릭을 막아 뒤로 돌아가 다시 답하는 것처럼 보이지 않게 한다.
 */
function ChatOptionButtons({
  options,
  layout = 'chips',
  interactive,
  selectedOptionId,
  onSelect,
}: ChatOptionButtonsProps) {
  const baseClass = layout === 'actions' ? 'chatbot-action' : 'chatbot-option'

  const buttons = options.map((option) => {
    const isAlwaysDisabled = ALWAYS_DISABLED_OPTION_IDS.has(option.id)
    const classNames = [baseClass]
    if (option.id === selectedOptionId) classNames.push(`${baseClass}--active`)
    if (isAlwaysDisabled) classNames.push(`${baseClass}--disabled`)

    return (
      <button
        key={option.id}
        type="button"
        className={classNames.join(' ')}
        disabled={!interactive || isAlwaysDisabled}
        onClick={() => onSelect(option)}
      >
        {option.label}
      </button>
    )
  })

  if (layout === 'actions') {
    return <div className="chatbot-action-row">{buttons}</div>
  }

  return <div className="chatbot-option-list">{buttons}</div>
}

export default ChatOptionButtons
