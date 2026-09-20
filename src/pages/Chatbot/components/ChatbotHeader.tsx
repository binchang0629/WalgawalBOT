import chevronRight from '../../../assets/icons/chevron-right.svg'
import botLogo from '../../../assets/chatbot/figma/imgBotLogo.png'
import '../Chatbot.css'

interface ChatbotHeaderProps {
  onBack: () => void
}

/**
 * 챗봇 화면 공용 헤더. Figma `ChatHeader`(node 1951:4156 등) 기준.
 *
 * 오른쪽에도 같은 크기의 아이콘 슬롯이 있지만 Figma에서 `opacity: 0`으로 숨겨져 있다 —
 * 제목을 가운데 두기 위한 자리맞춤용이라 실제로는 보이지 않는다.
 * 뒤로가기 아이콘은 이 화면 전용으로 새로 만들지 않고, 사건 접수 헤더와 같은
 * 확정 화살표 에셋(`chevron-right.svg`)을 좌우 반전해 재사용한다.
 */
function ChatbotHeader({ onBack }: ChatbotHeaderProps) {
  return (
    <header className="chatbot-header">
      <button type="button" className="chatbot-header__back" onClick={onBack} aria-label="뒤로 가기">
        <img src={chevronRight} alt="" className="chatbot-header__back-icon" width={8} height={13} />
      </button>

      <div className="chatbot-header__title">
        <img src={botLogo} alt="" className="chatbot-header__avatar" width={40} height={40} />
        <span className="chatbot-header__name">AI 판멍이</span>
      </div>

      <span className="chatbot-header__spacer" aria-hidden="true" />
    </header>
  )
}

export default ChatbotHeader
