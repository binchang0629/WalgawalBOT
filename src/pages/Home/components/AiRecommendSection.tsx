import SectionTitle from '../../../components/common/SectionTitle'
import { optionalImages } from '../homeAssets'
import { aiRecommendation, homeSectionTitles } from '../../../data/common/homeContent'

/**
 * AI 맞춤 추천. Figma `1402:7405`
 *
 * 판멍이 일러스트(`chat-mascot.png`)가 아직 없어 자리 표시로 둔다.
 * 챗봇 화면이 미확정이라 카드에 링크를 걸지 않는다. (PROJECT_SPEC.md §9-6)
 */
function AiRecommendSection() {
  return (
    <section className="ai-section">
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={homeSectionTitles.aiRecommend.description}
      />

      <article className="ai-card">
        {optionalImages.chatMascot ? (
          <img className="ai-card__mascot" src={optionalImages.chatMascot} alt="판멍이" />
        ) : (
          <span className="ai-card__mascot ai-card__mascot--empty" aria-hidden="true" />
        )}
        <div className="ai-card__text">
          <h3>{aiRecommendation.title}</h3>
          <p>
            {aiRecommendation.lead}
            <br />
            <b>{aiRecommendation.highlight}</b>
            {aiRecommendation.tail}
          </p>
        </div>
      </article>
    </section>
  )
}

export default AiRecommendSection
