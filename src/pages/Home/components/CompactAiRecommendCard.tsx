import mascot from '../../../assets/home/figma/chat-mascot.png'
import { aiRecommendation } from '../../../data/common/homeContent'

/** 사용자 첨부 홈 최종 수정의 하단 소형 카드. 시연 플로우 밖이므로 정적 표시만 한다. */
function CompactAiRecommendCard() {
  return (
    <aside className="ai-section" aria-label="AI 추천 안내">
      <div className="ai-card">
        <img className="ai-card__mascot" src={mascot} alt="판멍이" />
        <div className="ai-card__text">
          <h3>{aiRecommendation.title}</h3>
          <p>{aiRecommendation.lead}<br /><b>{aiRecommendation.highlight}</b>{aiRecommendation.tail}</p>
        </div>
      </div>
    </aside>
  )
}

export default CompactAiRecommendCard
