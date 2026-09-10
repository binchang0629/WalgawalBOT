import { useId, useState } from 'react'
import type { FormEvent } from 'react'
import addIcon from '../../../assets/chatbot/figma/imgAddButton.svg'
import sendIcon from '../../../assets/chatbot/figma/imgSendArrow.svg'
import '../Chatbot.css'

interface ChatbotComposerProps {
  disabled: boolean
  onSend: (text: string) => void
}

/** 하단 입력창. Figma `MessageComposer` 기준. 첨부 버튼은 아직 준비 중이라 비활성으로 둔다. */
function ChatbotComposer({ disabled, onSend }: ChatbotComposerProps) {
  const [value, setValue] = useState('')
  const inputId = useId()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
  }

  return (
    <form className="chatbot-composer" onSubmit={handleSubmit}>
      <div className="chatbot-composer__row">
        <button
          type="button"
          className="chatbot-composer__add"
          disabled
          title="파일 첨부는 준비 중이에요"
          aria-label="파일 첨부"
        >
          <img src={addIcon} alt="" width={24} height={24} />
        </button>

        <div className="chatbot-composer__field">
          <label htmlFor={inputId} className="chatbot-composer__label">
            판멍이에게 물어보세요
          </label>
          <input
            id={inputId}
            type="text"
            className="chatbot-composer__input"
            placeholder="판멍이에게 물어보세요"
            value={value}
            disabled={disabled}
            onChange={(event) => setValue(event.target.value)}
          />
          <button type="submit" className="chatbot-composer__send" aria-label="전송">
            <img src={sendIcon} alt="" width={24} height={24} />
          </button>
        </div>
      </div>
    </form>
  )
}

export default ChatbotComposer
