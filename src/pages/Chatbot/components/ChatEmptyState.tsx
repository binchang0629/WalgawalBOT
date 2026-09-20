import botLogo from '../../../assets/chatbot/figma/imgBotLogo.png'
import { ENABLED_INITIAL_OPTION_ID } from '../chatbotScript'
import type { ChatOption } from '../chatbotScript'
import '../Chatbot.css'

interface ChatEmptyStateProps {
  options: ChatOption[]
  onSelect: (option: ChatOption) => void
  disabled: boolean
}

/** 대화가 시작되기 전의 첫 화면. Figma `Chatbot / Initial`(node 1951:4252) 기준. */
function ChatEmptyState({ options, onSelect, disabled }: ChatEmptyStateProps) {
  return (
    <div className="chatbot-empty">
      <div className="chatbot-empty__hero">
        <div className="chatbot-empty__avatar">
          <img src={botLogo} alt="" width={68} height={68} />
        </div>
        <div className="chatbot-empty__text">
          <h1 className="chatbot-empty__title">판멍이가 도와드릴게요!</h1>
          <p className="chatbot-empty__subtitle">
            궁금한 내용을 직접 입력하거나,
            <br />
            아래에서 골라보세요.
          </p>
        </div>
      </div>

      <div className="chatbot-empty__options">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="chatbot-chip"
            disabled={disabled || option.id !== ENABLED_INITIAL_OPTION_ID}
            onClick={() => onSelect(option)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default ChatEmptyState
