import SectionTitle from '../../../components/common/SectionTitle'
import useSession from '../../../hooks/useSession'
import mascot from '../../../assets/home/figma/chat-mascot.png'
import { personalizedRecommendation, homeSectionTitles } from '../../../data/common/homeContent'
import './AiRecommendSection.css'

/** 개발 > 홈/로그인 후 > Section (1473:8571). 실제 추천 API가 아닌 시안용 데이터. */
function AiRecommendSection() {
  const { personaId } = useSession()
  const recommendation = personalizedRecommendation

  return (
    <section className="ai-recommendation" aria-label={homeSectionTitles.aiRecommend.title}>
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={homeSectionTitles.aiRecommend.description}
      />
      <div className="ai-recommendation__card">
        <div className="ai-recommendation__intro">
          <img className="ai-recommendation__mascot" src={mascot} alt="판멍이" />
          <div className="ai-recommendation__copy">
            <h3>{recommendation.title}</h3>
            <p>{recommendation.lead}<br /><b>{recommendation.highlight}</b>{recommendation.tail}</p>
          </div>
        </div>
        <p className="ai-recommendation__summary">
          {recommendation.displayNames[personaId]}님 맞춤{' '}
          <strong>{recommendation.topic} </strong>
          <span>{recommendation.total}건</span>을 추천해요.
        </p>
        <ul className="ai-recommendation__list">
          {recommendation.cases.map((item) => (
            <li key={item.id} className="ai-recommendation__item">
              <article className="ai-recommendation__case">
                <div className="ai-recommendation__meta">
                  <span className={`ai-recommendation__category ai-recommendation__category--${item.categoryKey}`}>
                    {item.category}
                  </span>
                  <span className={`ai-recommendation__agreement${item.agrees ? ' is-agreed' : ''}`}>
                    AI와 배심원 의견 {item.agrees ? '일치' : '불일치'}
                  </span>
                </div>
                <h4>{item.title}</h4>
              </article>
            </li>
          ))}
        </ul>
        {/* 추천 전체 목록·각 사건 상세 목적지는 미정. 다른 사건으로 임의 연결하지 않는다. */}
        <button type="button" className="ai-recommendation__more" disabled title="추천 사건 전체 목록은 준비 중입니다">
          관련 사건 더보기+
        </button>
      </div>
    </section>
  )
}

export default AiRecommendSection
