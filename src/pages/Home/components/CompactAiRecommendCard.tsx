import useLoginGate from '../../../hooks/useLoginGate'
import useSession from '../../../hooks/useSession'
import SectionTitle from '../../../components/common/SectionTitle'
import mascot from '../../../assets/home/figma/chat-mascot.png'
import { aiRecommendation, homeSectionTitles } from '../../../data/common/homeContent'

/**
 * 사용자 첨부 홈 최종 수정의 하단 소형 카드.
 *
 * 비로그인일 때는 AI 맞춤 추천의 진입점이 된다. 누르면 안내 팝업이 뜬다.
 * (Figma `2298:17673`) 로그인 상태에서는 위쪽 `AiRecommendSection`이 실제 추천을
 * 보여주므로 홈에서는 비로그인 사용자에게만 렌더한다.
 */
function CompactAiRecommendCard() {
  const { sessionStatus } = useSession()
  const { requireLogin } = useLoginGate()
  const isAuthenticated = sessionStatus === 'authenticated'

  const content = (
    <>
      <img className="ai-card__mascot" src={mascot} alt="판멍이" />
      <div className="ai-card__text">
        <h3>{aiRecommendation.title}</h3>
        <p>{aiRecommendation.lead}<br /><b>{aiRecommendation.highlight}</b>{aiRecommendation.tail}</p>
      </div>
    </>
  )

  return (
    <aside className="ai-section" aria-label="AI 추천 안내">
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={homeSectionTitles.aiRecommend.description}
      />
      {isAuthenticated ? (
        <div className="ai-card">{content}</div>
      ) : (
        <button
          type="button"
          className="ai-card ai-card--button"
          onClick={() => requireLogin('aiRecommend')}
        >
          {content}
        </button>
      )}
    </aside>
  )
}

export default CompactAiRecommendCard
