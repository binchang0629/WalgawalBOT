import { Link } from 'react-router-dom'
import SectionTitle from '../../../components/common/SectionTitle'
import { optionalImages } from '../homeAssets'
import { aiRecommendation, homeSectionTitles } from '../../../data/common/homeContent'
import { PATHS } from '../../../routes/paths'

/**
 * AI 맞춤 추천. Figma `1402:7405`
 *
 * 챗봇 화면이 Figma `개발` 페이지에 올라와(node 1951:4051~4539) 구현됐으므로
 * 카드를 눌러 챗봇으로 들어갈 수 있게 연결한다. (PROJECT_SPEC.md §9-6 해결)
 */
function AiRecommendSection() {
  return (
    <section className="ai-section">
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={homeSectionTitles.aiRecommend.description}
      />

      <Link to={PATHS.chatbot} className="ai-card">
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
      </Link>
    </section>
  )
}

export default AiRecommendSection
