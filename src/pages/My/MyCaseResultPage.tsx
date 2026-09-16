import { Fragment, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import { MY_CASES } from '../../data/personas/myCases'
import { SUBMIT_SCENARIOS } from '../Submit/caseSubmitContent'
import backIcon from '../../assets/my/back.svg'
import detectiveImage from '../../assets/my-case/panmung-curiosity.png'
import verdictDifferenceImage from '../../assets/my-case/verdict-difference.png'
import './MyCases.css'
import './MyPageTransitions.css'

const verdicts = [
  { label: '글쓴이 입장이 더 타당함', value: 46, highlight: true },
  { label: '상대방 입장이 더 타당함', value: 19 },
  { label: '양쪽 모두 일리 있음', value: 32 },
  { label: '양쪽 모두 타당하지 않음', value: 3 },
]

const seoaActionGuides = [
  '친구에게 개인적으로 대화를 요청해보세요.',
  '여러 사람 앞에서 말한 방식은 사과해보세요.',
  '자료 지연으로 느낀 부담과 서운함은 분명하게\n전달하세요.',
  '다음 과제부터 중간 확인일과 역할 기준을 친구와 \n함께 정해보세요.',
]

const jihoonActionGuides = [
  '계약서와 잔금 지급일, 최종 파일 전달 기록을 한곳에 모아두세요.',
  '작업물이 홈페이지와 SNS에 사용된 화면을 날짜와 함께 보관하세요.',
  '의뢰인에게 미지급 잔금 220만 원과 지급 예정일을 문서로 확인해달라고 요청하세요.',
  '추가 수정과 원본 파일 제공 범위는 기존 계약을 확인한 뒤 별도로 합의하세요.',
]

function useResultProgress(targetRef: RefObject<HTMLElement | null>, waitForScroll: boolean) {
  const [progress, setProgress] = useState(() => (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 1 : 0
  ))
  const hasAnimatedRef = useRef(false)

  useEffect(() => {
    const target = targetRef.current
    const scrollRoot = target?.closest<HTMLElement>('.my-case-result-page__content')
    if (!target || !scrollRoot || hasAnimatedRef.current) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      hasAnimatedRef.current = true
      return
    }

    let animationFrameId: number | null = null
    const startAnimation = () => {
      if (hasAnimatedRef.current) return
      hasAnimatedRef.current = true
      const duration = 1100
      let startedAt: number | null = null

      const animate = (timestamp: number) => {
        startedAt ??= timestamp
        const elapsed = Math.min((timestamp - startedAt) / duration, 1)
        setProgress(1 - Math.pow(1 - elapsed, 3))
        if (elapsed < 1) animationFrameId = window.requestAnimationFrame(animate)
      }

      animationFrameId = window.requestAnimationFrame(animate)
    }

    const checkPosition = () => {
      const rootRect = scrollRoot.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      if (targetRect.top <= rootRect.top + rootRect.height * 0.78 && targetRect.bottom > rootRect.top) {
        startAnimation()
      }
    }

    scrollRoot.addEventListener('scroll', checkPosition, { passive: true })
    if (!waitForScroll) checkPosition()

    return () => {
      scrollRoot.removeEventListener('scroll', checkPosition)
      if (animationFrameId !== null) window.cancelAnimationFrame(animationFrameId)
      // StrictMode의 effect 재실행 시 첫 실행에서 취소된 모션을 다시 시작할 수 있게 한다.
      hasAnimatedRef.current = false
    }
  }, [targetRef, waitForScroll])

  return progress
}

function MyCaseResultPage() {
  const navigate = useNavigate()
  const { caseId } = useParams()
  const aiCardRef = useRef<HTMLElement>(null)
  const juryCardRef = useRef<HTMLElement>(null)
  const confidenceProgress = useResultProgress(aiCardRef, false)
  const juryProgress = useResultProgress(juryCardRef, true)

  // 이전 서아 공유 URL도 유지한다. 두 계정은 같은 결과 레이아웃을 사용한다.
  const isSeoa = caseId === MY_CASES.A.id || caseId === 'CASE-SEOA-01'
  const isJihoon = caseId === MY_CASES.B.id
  if (!isSeoa && !isJihoon) {
    return (
      <main className="my-case-result-page my-case-result-page--empty my-detail-slide-enter">
        <p>해당 사건 결과를 찾을 수 없습니다.</p>
        <button type="button" onClick={() => navigate(PATHS.myCases)}>내 사건으로 돌아가기</button>
      </main>
    )
  }

  const caseInfo = isSeoa ? MY_CASES.A : MY_CASES.B
  const actionGuides = isSeoa ? seoaActionGuides : jihoonActionGuides

  return (
    <main className="my-case-result-page my-detail-slide-enter">
      <header className="my-sub-header">
        <button type="button" onClick={() => navigate(PATHS.my)} aria-label="마이페이지로 이동">
          <img src={backIcon} alt="" />
        </button>
        <h1>결과 확인하기</h1>
        <span aria-hidden="true" />
      </header>

      <div className="my-case-result-page__content" role="region" aria-label="사건 결과 상세 내용" tabIndex={0}>
        <section className="my-result-summary">
          <span>{isSeoa ? '투표 완료' : 'AI 1심 완료'}</span>
          <h2>{caseInfo.titleLines.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</h2>
          <p>{caseInfo.id}{isSeoa ? ` · ${caseInfo.participation} 참여` : ' · 나만 보기'}</p>
        </section>

        <section ref={aiCardRef} className="ai-verdict-card">
          <img src={detectiveImage} alt="" />
          <h3>판멍이의 1심 판결</h3>
          <strong>{isSeoa ? <>판멍이는<br />친구의 손을 들어줬어요</> : SUBMIT_SCENARIOS.B.opinion.headline}</strong>
          <p>{isSeoa ? '기한을 지켜달라는 요구는 타당했지만, 사정을 확인하기 전에 단체방에서 공개적으로 지적한 방식은 관계에 부담을 줄 수 있다고 판단했어요.' : '최종 파일 전달 기록과 결과물 사용 내역, 계약서에 적힌 잔금 지급 조건을 함께 확인해야 해요. 추가 수정과 원본 파일 제공 범위도 기존 합의에 따라 살펴보세요.'}</p>
          {isSeoa ? <div><span>AI 판단 확신도</span><b>{Math.round(66 * confidenceProgress)}%</b></div> : <div><span>작성한 내용에 기반한 참고 의견이에요.</span></div>}
        </section>

        {isSeoa && <section ref={juryCardRef} className="jury-verdict-card">
          <h3>배심원 2심 결과</h3>
          <strong>글쓴이 입장이 더 타당함 <span>{Math.round(46 * juryProgress)}%</span></strong>
          <ul>
            {verdicts.map((item) => (
              <li key={item.label} className={item.highlight ? 'is-highlight' : ''}>
                <div><span>{item.label}</span><b>{Math.round(item.value * juryProgress)}%</b></div>
                <span className="jury-verdict-card__track"><i style={{ width: `${item.value * juryProgress}%` }} /></span>
              </li>
            ))}
          </ul>
          <button type="button" disabled>배심원 의견 댓글 보기</button>
        </section>}

        {isSeoa && <section className="verdict-difference">
          <span className="verdict-difference__character"><img src={verdictDifferenceImage} alt="" width={60} height={52} /></span>
          <div><strong>AI와 배심원의 판단이 엇갈렸어요</strong><p>AI는 친구의 입장을, <br></br>배심원은 내 입장을 더 타당하다고 판단했어요.</p></div>
        </section>}

        <section className="action-guide">
          <h3>다음 행동 가이드</h3>
          <ol>{actionGuides.map((guide, index) => <li key={guide}><span>{index + 1}</span><p>{guide}</p></li>)}</ol>
        </section>

        <section className="followup-card">
          <h3>사건을 해결했나요?</h3>
          <p>{isSeoa ? 'AI 판결과 배심원 의견을 참고해 실제로 어떻게 행동했는지 기록해보세요.' : 'AI 1심 의견을 참고해 다음 행동을 정리해보세요. 나만 보기 사건의 후일담 작성은 아직 지원하지 않아요.'}</p>
          <button type="button" disabled={isJihoon} onClick={() => navigate(PATHS.afterStoryMine)}>후일담 작성하기</button>
        </section>

        <p className="my-result-footer">{isSeoa ? '배심원 댓글과 공감 반응은 별도 화면에서 확인' : '나만 보기 사건은 배심원 투표와 댓글이 표시되지 않아요.'}</p>
      </div>
    </main>
  )
}

export default MyCaseResultPage
