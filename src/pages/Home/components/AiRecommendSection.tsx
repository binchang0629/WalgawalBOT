import { Link } from 'react-router-dom'
import SectionTitle from '../../../components/common/SectionTitle'
import VotingStatusBadge from '../../../components/common/VotingStatusBadge'
import useSession from '../../../hooks/useSession'
import mascot from '../../../assets/home/figma/chat-mascot.png'
import { personalizedRecommendation, homeSectionTitles } from '../../../data/common/homeContent'
import { getRecommendationCase } from '../../../data/common/plazaCaseStories'
import { PATHS, toCaseDetail } from '../../../routes/paths'
import './AiRecommendSection.css'

/** 개발 > 홈/로그인 후 > Section (1473:8571). 실제 추천 API가 아닌 시안용 데이터. */
function AiRecommendSection() {
  const { personaId, currentUser } = useSession()
  const recommendation = personalizedRecommendation[personaId]

  return (
    <section className="ai-recommendation" aria-label={homeSectionTitles.aiRecommend.title}>
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={homeSectionTitles.aiRecommend.description}
      />
      <div className="ai-recommendation__intro">
        <div className="ai-recommendation__summary">
          <p>
            {currentUser?.isCustomProfile ? currentUser.name : recommendation.displayName}님에게 맞는<br />
            <strong>{recommendation.topic} </strong>
            <em>{recommendation.total}건</em>을 찾았어요!
          </p>
        </div>
        <span className="ai-recommendation__mascot-stage">
          <img className="ai-recommendation__mascot" src={mascot} alt="판멍이" />
        </span>
      </div>
      <div className="ai-recommendation__card">
        <ul className="ai-recommendation__list">
          {recommendation.cases.map((item) => {
            const linkedCase = getRecommendationCase(item.plazaCaseId)
            const agrees = linkedCase?.isVerdictAligned ?? ('agrees' in item && item.agrees)
            const isVoting = linkedCase?.status === 'voting'
            const caseContent = (
              <article className="ai-recommendation__case">
                <div className="ai-recommendation__meta">
                  <span className={`ai-recommendation__category ai-recommendation__category--${item.categoryKey}`}>
                    {item.category}
                  </span>
                  {isVoting ? <VotingStatusBadge /> : (
                    <span className={`ai-recommendation__agreement${agrees ? ' is-agreed' : ''}`}>
                      AI와 배심원 의견 {agrees ? '일치' : '불일치'}
                    </span>
                  )}
                </div>
                <h4>{item.title}</h4>
                <p className="ai-recommendation__details">
                  {!isVoting && <span>투표 완료</span>}
                  {linkedCase?.commentCount !== undefined && <span>댓글 {linkedCase.commentCount}개</span>}
                </p>
              </article>
            )

            return (
              <li key={item.id} className="ai-recommendation__item">
                <Link
                  className="ai-recommendation__case-link"
                  to={toCaseDetail(item.plazaCaseId)}
                  state={{ returnTo: PATHS.home, homeCaseId: item.plazaCaseId }}
                  data-home-case-id={item.plazaCaseId}
                  aria-label={`${item.title.replace('\n', ' ')} 상세 보기`}
                >
                  {caseContent}
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

export default AiRecommendSection
