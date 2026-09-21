import { Link } from 'react-router-dom'
import SectionTitle from '../../../components/common/SectionTitle'
import VotingStatusBadge from '../../../components/common/VotingStatusBadge'
import useSession from '../../../hooks/useSession'
import mascot from '../../../assets/home/figma/chat-mascot.png'
import { personalizedRecommendation, homeSectionTitles, recommendationCopy } from '../../../data/common/homeContent'
import { getPopularVotingCases, getRecommendationCase } from '../../../data/common/plazaCaseStories'
import { PATHS, toCaseDetail } from '../../../routes/paths'
import { readThreadComments } from '../../../utils/plazaComments'
import './AiRecommendSection.css'

/** 개발 > 홈/로그인 후 > Section (1473:8571). 실제 추천 API가 아닌 시안용 데이터. */
function AiRecommendSection() {
  const { personaId, currentUser, votedCaseIds, activityStats } = useSession()
  const recommendation = personalizedRecommendation[personaId]
  /*
   * 퍼소나가 아니라 활동 건수가 추천의 근거를 정한다. MY와 같은 `activityStats`를 보므로
   * "기록을 반영했다"고 말하는데 MY는 0건인 상황이 생기지 않는다.
   *
   * 기록이 있으면 계정별 관심 분야 목록에서 뽑고, 없으면 진행 사건 전체를 조회수 순으로 가져온다.
   * 개인화할 근거가 없는데 개인화 목록에서 뽑으면 말과 실제가 어긋난다.
   */
  const hasActivity = activityStats.juryParticipations + activityStats.submittedCases > 0
  const copy = hasActivity ? recommendationCopy.history : recommendationCopy.coldStart
  const topic = hasActivity ? recommendation.topic : recommendationCopy.coldStart.topic
  const candidates = hasActivity
    ? recommendation.caseIds.map((caseId) => getRecommendationCase(caseId))
    : getPopularVotingCases()
  const cases = candidates
    .filter((item) => item?.status === 'voting' && !votedCaseIds.includes(item.id))
    .slice(0, 3)

  return (
    <section className="ai-recommendation" aria-label={homeSectionTitles.aiRecommend.title}>
      <SectionTitle
        title={homeSectionTitles.aiRecommend.title}
        description={copy.description}
      />
      <div className="ai-recommendation__intro">
        <div className="ai-recommendation__summary">
          <p>
            {currentUser?.isCustomProfile ? currentUser.name : recommendation.displayName}{copy.lead}<br />
            <strong>{topic} </strong>
            <em>{cases.length}건</em>{copy.tail}
          </p>
        </div>
        <span className="ai-recommendation__mascot-stage">
          <img className="ai-recommendation__mascot" src={mascot} alt="판멍이" />
        </span>
      </div>
      <div className="ai-recommendation__card">
        <ul className="ai-recommendation__list">
          {cases.map((item) => {
            if (!item) return null
            const categoryKey = item.category === '학업' ? 'study'
              : item.category === '직장' ? 'work'
                : item.category === '가족' ? 'family'
                  : item.category === '연인' ? 'romance' : 'friend'
            const caseContent = (
              <article className="ai-recommendation__case">
                <div className="ai-recommendation__meta">
                  <span className={`ai-recommendation__category ai-recommendation__category--${categoryKey}`}>
                    {item.tag}
                  </span>
                  <VotingStatusBadge />
                </div>
                <h4>{item.title}</h4>
                {/* 광장 사건 카드(CaseFeedCard)와 같은 표기. 지금 계정이 직접 단 댓글도 광장처럼 함께 센다. */}
                <p className="ai-recommendation__details">
                  <span>조회수 {item.viewCount}</span>
                  <span>댓글 {(item.commentCount ?? 0) + readThreadComments(personaId, item.id).length}</span>
                </p>
              </article>
            )

            return (
              <li key={item.id} className="ai-recommendation__item">
                <Link
                  className="ai-recommendation__case-link"
                  to={toCaseDetail(item.id)}
                  state={{ returnTo: PATHS.home, homeCaseId: item.id, entryMotion: 'slide-forward' }}
                  data-home-case-id={item.id}
                  aria-label={`${item.title.replace('\n', ' ')} 투표하러 가기`}
                >
                  {caseContent}
                </Link>
              </li>
            )
          })}
        </ul>
        {cases.length === 0 && <p className="ai-recommendation__empty">추천한 진행 사건에 모두 참여했어요.</p>}
      </div>
    </section>
  )
}

export default AiRecommendSection
