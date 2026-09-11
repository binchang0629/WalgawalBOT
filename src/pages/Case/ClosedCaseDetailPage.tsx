import { Link } from 'react-router-dom'
import { jihoonSimilarCase } from '../../data/common/jihoonSimilarCaseContent'
import { toCaseResult } from '../../routes/paths'
import CaseHeader from './components/CaseHeader'
import './CaseDetailPage.css'

function ClosedCaseDetailPage() {
  return (
    <main className="case-detail case-detail--closed">
      <CaseHeader title="지난 사건" />

      <div className="case-detail__body">
        <section className="case-overview case-overview--closed" aria-labelledby="case-title">
          <div className="case-overview__category">
            <i aria-hidden="true" />
            {jihoonSimilarCase.category}
          </div>

          <div className="case-author">
            <span className="case-author__avatar">
              <img src={jihoonSimilarCase.author.avatarUrl} alt="" />
            </span>
            <div>
              <strong>{jihoonSimilarCase.author.nickname}</strong>
              <time>{jihoonSimilarCase.author.createdAt}</time>
            </div>
          </div>

          <h2 id="case-title" className="case-overview__title">{jihoonSimilarCase.title}</h2>
          <p className="case-overview__meta">
            사건 번호 · #{jihoonSimilarCase.caseNumber} · {jihoonSimilarCase.age} · 배심원{' '}
            {jihoonSimilarCase.participantCount}명 참여
          </p>
        </section>

        <div className="case-detail__divider" />

        <section className="case-story case-story--closed" aria-label="사건 내용">
          {jihoonSimilarCase.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </section>

        <section className="ai-summary" aria-labelledby="ai-summary-title">
          <h2 id="ai-summary-title">AI 핵심요약</h2>
          <ol>
            {jihoonSimilarCase.summary.map((item, index) => (
              <li key={item.title}>
                <span>{index + 1}</span>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Link className="closed-case-result-link" to={toCaseResult(jihoonSimilarCase.id)}>
          투표 결과보기
        </Link>
      </div>
    </main>
  )
}

export default ClosedCaseDetailPage
