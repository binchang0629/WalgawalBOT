import { Link, useLocation, useParams } from 'react-router-dom'
import { jihoonSimilarCase } from '../../data/common/jihoonSimilarCaseContent'
import { getPlazaCaseStory } from '../../data/common/plazaCaseStories'
import { PATHS, toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import AiSummary from './components/AiSummary'
import './CaseDetailPage.css'

function ClosedCaseDetailPage() {
  const { caseId } = useParams()
  const location = useLocation()
  const plazaStory = getPlazaCaseStory(caseId)
  const caseContent = plazaStory ?? jihoonSimilarCase
  const routeState = location.state as { fromPlaza?: boolean; returnTo?: string; homeCaseId?: string } | null
  const fromPlaza = routeState?.fromPlaza

  return (
    <main className="case-detail case-detail--closed">
      <CaseHeader title="지난 사건" backTo={routeState?.returnTo === PATHS.home ? PATHS.home : plazaStory ? PATHS.plaza : undefined} />

      <div className="case-detail__body">
        <section className="case-overview case-overview--closed" aria-labelledby="case-title">
          <div className="case-overview__category">
            <i aria-hidden="true" />
            {caseContent.category}
          </div>

          <div className="case-author">
            <span className="case-author__avatar">
              <img src={caseContent.author.avatarUrl} alt="" />
            </span>
            <div>
              <strong>{caseContent.author.nickname}</strong>
              <time>{caseContent.author.createdAt}</time>
            </div>
          </div>

          <h2 id="case-title" className="case-overview__title">{plazaStory?.title ?? jihoonSimilarCase.detailTitle}</h2>
          <p className="case-overview__meta">
            사건 번호 · #{caseContent.caseNumber.replace(/^#/, '')} · {caseContent.age} · 배심원{' '}
            {caseContent.participantCount.toLocaleString()}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story case-story--closed" aria-label="사건 내용">
          {caseContent.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <AiSummary items={caseContent.summary} />

        <Link className="closed-case-result-link" to={toCaseResult(caseContent.id)} state={{ fromPlaza, returnTo: routeState?.returnTo, homeCaseId: routeState?.homeCaseId }}>
          투표 결과보기
        </Link>
      </div>
    </main>
  )
}

export default ClosedCaseDetailPage
