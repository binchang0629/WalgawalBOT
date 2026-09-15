import { ALWAYS_DISABLED_OPTION_IDS } from '../chatbotScript'
import type { ChatOption } from '../chatbotScript'
import '../Chatbot.css'

interface ChatOptionButtonsProps {
  options: ChatOption[]
  /** 이전 대화 기록에 남은 선택지는 화면에 그대로 보이지만 다시 누를 수는 없다. */
  interactive: boolean
  /** 이 선택지 묶음에서 사용자가 실제로 고른 것. 고른 직후 짧게 오렌지색으로 표시된다. */
  selectedOptionId?: string
  onSelect: (option: ChatOption) => void
}

/**
 * 챗봇 질문에 대한 선택지 UI.
 *
 * 챗봇 말풍선에 붙어 있지 않고, 대화창 중앙에 놓이는 독립된 선택 영역이다.
 * 모든 선택지는 같은 너비로 세로로 쌓이며, 문구 길이에 따라 높이만 늘어난다.
 *
 * 기본 상태는 흰 배경이고, 사용자가 고른 선택지만 오렌지색(`--orange-700`)으로 바뀐다.
 * 고르고 나면(`ChatbotPage`가 잠깐의 표시 시간 뒤) 이 그룹 전체가 사라지고
 * 고른 문구가 일반 사용자 메시지로 대화 기록에 남는다 — 그래서 과거 턴에서는
 * 이 컴포넌트가 아예 렌더링되지 않는다(`optionsHidden`).
 */
function ChatOptionButtons({ options, interactive, selectedOptionId, onSelect }: ChatOptionButtonsProps) {
  return (
    <div className="chatbot-select-group">
      {options.map((option) => {
        const isAlwaysDisabled = ALWAYS_DISABLED_OPTION_IDS.has(option.id)
        const classNames = ['chatbot-select-option']
        if (option.id === selectedOptionId) classNames.push('chatbot-select-option--active')
        if (isAlwaysDisabled) classNames.push('chatbot-select-option--disabled')

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
      })}
    </div>
  )
}

export default ChatOptionButtons
