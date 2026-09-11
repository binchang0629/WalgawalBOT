import { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PATHS, toMyCaseResult } from '../../routes/paths'
import backIcon from '../../assets/my/back.svg'
import useSession from '../../hooks/useSession'
import { getMyCaseFilters, MY_CASES } from '../../data/personas/myCases'
import type { MyCase, MyCaseFilter } from '../../data/personas/myCases'
import './MyCases.css'

function MyCasesContent({ caseInfo }: { caseInfo: MyCase }) {
  const navigate = useNavigate()
  const [filter, setFilter] = useState<MyCaseFilter>('all')
  const showCase = filter === 'all' || filter === caseInfo.status
  const isPrivate = caseInfo.status === 'private'

  return (
    <main className="my-cases-page">
      <header className="my-sub-header">
        <button type="button" onClick={() => navigate(PATHS.my)} aria-label="마이페이지로 돌아가기">
          <img src={backIcon} alt="" />
        </button>
        <h1>내 사건</h1>
        <span aria-hidden="true" />
      </header>

      <div className="my-cases-page__content" role="region" aria-label="내 사건 목록" tabIndex={0}>
        <p className="my-cases-page__breadcrumb">MY <span aria-hidden="true">&gt;</span><span>나의 활동</span></p>
        <h2>내 사건</h2>

        <div className="my-case-filters" role="group" aria-label="사건 상태 필터">
          {getMyCaseFilters(caseInfo).map(({ value, label, enabled }) => (
            <button
              key={value}
              type="button"
              disabled={!enabled}
              aria-pressed={filter === value}
              className={filter === value ? 'is-active' : ''}
              onClick={() => setFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>

        {showCase ? (
          <article className={`my-case-card${isPrivate ? ' my-case-card--private' : ''}`}>
            <div className="my-case-card__badges">
              <span className="my-case-card__category"><i />{caseInfo.category}</span>
              <span className="my-case-card__status">{isPrivate ? '나만 보기' : '투표 완료'}</span>
            </div>
            <h3>{caseInfo.titleLines.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</h3>
            <dl>
              <div><dt>접수일</dt><dd>{caseInfo.receivedAt}</dd></div>
              <div><dt>사건번호</dt><dd>{caseInfo.id}</dd></div>
              <div><dt>공개 범위</dt><dd>{caseInfo.visibility}</dd></div>
              <div><dt>참여</dt><dd className={isPrivate ? 'is-private' : 'is-blue'}>{caseInfo.participation}</dd></div>
            </dl>
            {caseInfo.resultAvailable ? (
              <Link className="my-case-card__result" to={toMyCaseResult(caseInfo.id)}>결과 확인하기</Link>
            ) : (
              <button className="my-case-card__result" type="button" disabled title="이 사건의 결과 상세 화면은 준비 중입니다.">결과 확인하기</button>
            )}
          </article>
        ) : (
          <p className="my-cases-page__empty">해당 상태의 사건이 없습니다.</p>
        )}

        <aside className="my-cases-page__notice">
          💡 접수한 사건의 실시간 배심원 투표율 및 AI 종합 판결문은<br />
          <strong>결과 페이지</strong>에서 확인 가능합니다.
        </aside>
      </div>
    </main>
  )
}

function MyCasesPage() {
  const { personaId } = useSession()
  // 목록을 연 채 계정이 전환되어도 이전 계정의 필터를 남기지 않는다.
  return <MyCasesContent key={personaId} caseInfo={MY_CASES[personaId]} />
}

export default MyCasesPage
