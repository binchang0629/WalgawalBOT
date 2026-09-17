import { useLayoutEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { weddingGiftCase } from '../../data/common/caseDetailContent'
import { plazaCases } from '../../data/common/plazaContent'
import type { PlazaCase } from '../../data/common/plazaContent'
import { recommendationOnlyCases } from '../../data/common/plazaCaseStories'
import { JIHUN_JURY_CASE_IDS } from '../../data/personas/juryHistory'
import CaseFeedCard from '../../components/common/CaseFeedCard'
import EmptyCaseState from '../../components/common/EmptyCaseState'
import Pagination from '../../components/common/Pagination'
import useDetailSlide from '../../hooks/useDetailSlide'
import useSession from '../../hooks/useSession'
import backIcon from '../../assets/my/back.svg'
import { PATHS } from '../../routes/paths'
import './MyCases.css'
import './MyJuryPage.css'
import './MyPageTransitions.css'

type JuryFilter = 'all' | 'voting' | 'closed'
const RETURN_KEY = 'wgwb:my-jury:return'
const CASES_PER_PAGE = 5

const weddingGiftCard: PlazaCase = {
  id: weddingGiftCase.id,
  category: weddingGiftCase.category,
  tag: weddingGiftCase.category,
  title: weddingGiftCase.title,
  summary: '오래 알고 지낸 친구의 결혼식에 축의금 10만 원을 냈어요.',
  viewCount: 1254,
  commentCount: 44,
  isVerdictAligned: true,
  status: 'voting',
}

function readReturnState(): { filter: JuryFilter; page: number; scrollTop: number } | null {
  try {
    const raw = window.sessionStorage.getItem(RETURN_KEY)
    if (!raw) return null
    window.sessionStorage.removeItem(RETURN_KEY)
    const value = JSON.parse(raw) as { filter?: JuryFilter; page?: number; scrollTop?: number }
    return value.filter === 'all' || value.filter === 'voting' || value.filter === 'closed'
      ? {
        filter: value.filter,
        page: typeof value.page === 'number' && Number.isInteger(value.page) && value.page > 0 ? value.page : 1,
        scrollTop: Math.max(0, value.scrollTop ?? 0),
      }
      : null
  } catch {
    return null
  }
}

function MyJuryPage() {
  const { personaId, sessionStatus, votedCaseIds } = useSession()
  const slide = useDetailSlide()
  const contentRef = useRef<HTMLDivElement>(null)
  const [returnState] = useState(readReturnState)
  const [filter, setFilter] = useState<JuryFilter>(returnState?.filter ?? 'all')
  const [currentPage, setCurrentPage] = useState(returnState?.page ?? 1)

  const caseIds = personaId === 'B'
    ? [...votedCaseIds.filter((id) => !JIHUN_JURY_CASE_IDS.includes(id)).reverse(), ...JIHUN_JURY_CASE_IDS]
    : [...votedCaseIds].reverse()
  const cases = caseIds.map((id) =>
    plazaCases.find((item) => item.id === id)
    ?? recommendationOnlyCases.find((item) => item.id === id)
    ?? (id === weddingGiftCase.id ? weddingGiftCard : null),
  ).filter((item): item is PlazaCase => item !== null)
  const votingCount = cases.filter((item) => item.status === 'voting').length
  const closedCount = cases.length - votingCount
  const filteredCases = filter === 'all' ? cases : cases.filter((item) => item.status === filter)
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE))
  const safePage = Math.min(currentPage, totalPages)
  const pageCases = filteredCases.slice((safePage - 1) * CASES_PER_PAGE, safePage * CASES_PER_PAGE)

  useLayoutEffect(() => {
    if (returnState && contentRef.current) contentRef.current.scrollTop = returnState.scrollTop
  }, [returnState])

  const rememberPosition = () => {
    try {
      window.sessionStorage.setItem(RETURN_KEY, JSON.stringify({ filter, page: safePage, scrollTop: contentRef.current?.scrollTop ?? 0 }))
    } catch {
      // 저장소를 사용할 수 없어도 사건 상세로 이동할 수 있다.
    }
  }

  const handlePageChange = (nextPage: number) => {
    if (nextPage === safePage) return
    setCurrentPage(nextPage)
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const slideClassName = returnState && slide.className === 'my-detail-slide-enter' ? '' : slide.className

  if (sessionStatus !== 'authenticated') return <Navigate to={PATHS.my} replace />

  return (
    <main className={`my-cases-page my-jury-page${returnState ? ' my-jury-page--restored' : ''}${slideClassName ? ` ${slideClassName}` : ''}`}>
      <header className="my-sub-header">
        <button type="button" onClick={() => slide.leave(PATHS.my)} aria-label="마이페이지로 돌아가기">
          <img src={backIcon} alt="" />
        </button>
        <h1>배심 참여</h1>
        <span aria-hidden="true" />
      </header>

      <div ref={contentRef} className={`my-cases-page__content${cases.length === 0 ? ' my-cases-page__content--empty' : ''}`}
        role="region" aria-label="배심 참여 사건 목록" tabIndex={0}>
        <p className="my-cases-page__breadcrumb">MY <span aria-hidden="true">&gt;</span><span>나의 활동</span></p>
        <h2>내가 참여한 사건</h2>
        {cases.length === 0 ? (
          <EmptyCaseState titleId="my-jury-empty-title" description="배심원 투표에 참여한 사건이 여기에 모여요." actionLabel="사건 보러 가기" actionTo={PATHS.plaza} />
        ) : (
          <>
            <p className="my-jury-page__count">배심 참여 {cases.length}건</p>
            <div className="my-case-filters" role="group" aria-label="사건 진행 상태 필터">
              {([
                ['all', `전체 ${cases.length}`],
                ['voting', `2심 진행 중 ${votingCount}`],
                ['closed', `판결 완료 ${closedCount}`],
              ] as const).map(([value, label]) => (
                <button key={value} type="button" className={filter === value ? 'is-active' : ''}
                  aria-pressed={filter === value} onClick={() => { setFilter(value); setCurrentPage(1); contentRef.current?.scrollTo({ top: 0 }) }}>
                  {label}
                </button>
              ))}
            </div>
            <ul className="case-list">
              {pageCases.map((item, index) => (
                <CaseFeedCard key={item.id} item={item} index={index} returnTo={PATHS.myJury} onOpen={rememberPosition} />
              ))}
            </ul>
            <div className="my-jury-page__pagination">
              <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={handlePageChange} ariaLabel="배심 참여 사건 목록 페이지" />
            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default MyJuryPage
