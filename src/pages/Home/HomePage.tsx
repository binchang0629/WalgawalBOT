import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import useSession from '../../hooks/useSession'
import { PATHS } from '../../routes/paths'
import {
  adBanner,
  afterStoryQuotes,
  aiRecommendation,
  balancePager,
  balanceQuestion,
  closeCallCase,
  closeCallMiniCase,
  featuredAfterStory,
  recentCases,
  todayCase,
} from '../../data/common/homeContent'
import './Home.css'

/**
 * 홈 화면. Figma `1차 디자인 시안 > 컨펌 > 김하은/홈수정` 기준.
 *
 * 시스템 상태바는 이 화면이 그리지 않는다. 기기 목업의 StatusBar가 담당한다. (PROJECT_SPEC.md §0-4)
 * 하단 내비게이션도 이 화면이 아니라 MainLayout이 담당한다. (PROJECT_SPEC.md §7-4)
 *
 * TODO: 아이콘·일러스트를 src/assets/home/figma/의 실제 에셋으로 교체한다.
 *       현재 문자 표시는 임시다. (PROJECT_CONTEXT.md 홈 잔여 항목)
 */

type BalanceChoice = 'left' | 'right' | null

interface SectionHeadingProps {
  title: ReactNode
  description?: string
  /** null이면 액션 버튼을 그리지 않는다. */
  action?: string | null
}

function SectionHeading({ title, description, action = '더보기' }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && (
        <button type="button" className="text-action">
          {action} <span>›</span>
        </button>
      )}
    </div>
  )
}

function HomePage() {
  // 밸런스 게임 선택은 화면 로컬 상태다. 서버에 저장되지 않는다. (PROJECT_SPEC.md §1-5)
  const [balanceChoice, setBalanceChoice] = useState<BalanceChoice>(null)
  const { sessionStatus } = useSession()
  const isAuthenticated = sessionStatus === 'authenticated'

  return (
    <main className="home-screen">
      {/*
        서비스 앱 헤더 (Figma top_nav 하단 66px).
        TODO: 두 번째 화면 컨펌 시 TopBar 공통 컴포넌트로 올린다. (PROJECT_SPEC.md §7-2)
      */}
      <header className="home-header">
        <div className="app-bar">
          <strong>
            왈가왈<span>BOT</span>
          </strong>
          <div className="header-actions" aria-label="상단 메뉴">
            <button type="button" aria-label="검색">
              ⌕
            </button>
            <button type="button" aria-label="알림">
              ♧
              <i />
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section">
        <SectionHeading title="오늘 사건" action={null} />
        <article className="hero-case">
          <p className="deadline">
            투표 마감까지 <b>{todayCase.deadline}</b>
          </p>
          <div className="hero-copy">
            <h1>
              친구 <em>축의금 10만원</em>
              <br />
              적당한가?
            </h1>
            <p>
              배심원 <b>{todayCase.participantCount.toLocaleString()}</b>명 참여중
            </p>
            <button type="button" className="primary-pill">
              투표하러 가기 <span>›</span>
            </button>
          </div>
          <div className="hero-art" aria-hidden="true">
            <span className="bot-ear left" />
            <span className="bot-ear right" />
            <span className="bot-face">⌁</span>
            <span className="bot-body">✦</span>
          </div>
          <div className="context-tip">
            <span>▣</span>
            <p>
              {todayCase.contextTip.lead}
              <br />
              <b>{todayCase.contextTip.highlight}</b> {todayCase.contextTip.tail}
            </p>
          </div>
        </article>
        <div className="ai-keypoint">
          <span className="mini-bot">●ᴗ●</span>
          <p>
            <b>{todayCase.aiKeyPoint.first}</b>와 <b>{todayCase.aiKeyPoint.second}</b>가
            <br />
            {todayCase.aiKeyPoint.tail}
          </p>
        </div>
      </section>

      <section className="recent-section section-pad">
        <SectionHeading title="최근 본 사건" action="전체보기" />
        <div className="recent-grid">
          {recentCases.map((item) => (
            <article className={`recent-card ${item.tone}`} key={item.id}>
              <span className="pin">●</span>
              <small>{item.tag}</small>
              <h3>
                {item.title.split('\n').map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
              <p>💬 {item.commentCount}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-banner">
        <div>
          <small>{adBanner.lead}</small>
          <b>{adBanner.title}</b>
        </div>
        <div className="ad-bots">
          <span>●ᴗ●</span>
          <span>●ᴗ●</span>
        </div>
        <i>{adBanner.label}</i>
      </section>

      <section className="balance-section section-pad">
        <SectionHeading
          title={
            <>
              밸런스 게임 <span className="refresh">↻</span>
            </>
          }
          action={null}
        />
        <p className="pager">
          {balancePager.current}/{balancePager.total}
        </p>
        <article className="balance-card">
          <h3>
            <b>A.</b> {balanceQuestion.title}
          </h3>
          <div className="balance-photo">
            <img src={balanceQuestion.imageUrl} alt="깻잎 반찬" />
          </div>
          <div className="choice-row">
            <button
              type="button"
              onClick={() => setBalanceChoice('left')}
              className={balanceChoice === 'left' ? 'selected okay' : 'okay'}
              aria-pressed={balanceChoice === 'left'}
            >
              {balanceQuestion.leftLabel}
            </button>
            <button
              type="button"
              onClick={() => setBalanceChoice('right')}
              className={balanceChoice === 'right' ? 'selected no' : 'no'}
              aria-pressed={balanceChoice === 'right'}
            >
              {balanceQuestion.rightLabel}
            </button>
          </div>
          <p className="drag-copy">☝ 깻잎을 좌우로 밀어 선택!</p>
        </article>
      </section>

      <section className="close-section section-pad">
        <SectionHeading
          title="막상막하"
          description="한 표로 달라질 수 있는, 팽팽한 사건"
          action="자세히 보기"
        />
        <article className="close-card prominent">
          <div className="close-top">
            <span className="avatar">◕</span>
            <div>
              <small>{closeCallCase.lead}</small>
              <h3>{closeCallCase.title}</h3>
            </div>
            <span className="comment-count">💬 {closeCallCase.commentCount}</span>
          </div>
          <div className="poll">
            <div>
              <small>{closeCallCase.poll.leftLabel}</small>
              <strong>{closeCallCase.poll.leftPercent}%</strong>
            </div>
            <span>VS</span>
            <div>
              <small>{closeCallCase.poll.rightLabel}</small>
              <strong>{closeCallCase.poll.rightPercent}%</strong>
            </div>
          </div>
          <div className="poll-bar">
            <i style={{ width: `${closeCallCase.poll.leftPercent}%` }} />
          </div>
          <p>총 {closeCallCase.poll.totalCount.toLocaleString()}명 참여</p>
        </article>
        <article className="close-card mini-close">
          <div>
            <span className="tag-red">{closeCallMiniCase.tag}</span>
            <h3>{closeCallMiniCase.title}</h3>
            <small>댓글 {closeCallMiniCase.commentCount}개</small>
          </div>
          <div className="mini-poll">
            <b>{closeCallMiniCase.leftPercent}%</b>
            <span />
            <b>{closeCallMiniCase.rightPercent}%</b>
          </div>
        </article>
        {/*
          시연 흐름상 가입 진입점은 원래 사건 상세의 `로그인하고 나도 투표하기`다.
          사건 상세 시안이 확정되기 전까지는 이 버튼을 임시 진입점으로 쓴다.
          (PROJECT_SPEC.md §7-3, §9-3)
        */}
        {isAuthenticated ? (
          <button type="button" className="all-cases" disabled title="사건 목록 시안 확정 후 연결됩니다">
            사건 투표하러 가기
          </button>
        ) : (
          <Link className="all-cases" to={`${PATHS.signup}?from=${PATHS.home}`}>
            로그인 하고 사건 투표하기
          </Link>
        )}
      </section>

      <section className="story-section section-pad">
        <SectionHeading title="왈가왈후~" description="판정 이후, 이렇게 달라졌어요." />
        <article className="letter-card">
          {featuredAfterStory.isNew && <span className="new-label">NEW</span>}
          <div className="letter-paper">
            <p>“</p>
            <h3>
              {featuredAfterStory.quote.split('\n').map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <strong>
              {featuredAfterStory.caseTitle.split('\n').map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </strong>
            <p>”</p>
          </div>
          <div className="envelope-front">
            <b>사건 상세보기 ›</b>
          </div>
        </article>
        <div className="story-scroll">
          {afterStoryQuotes.map((story) => (
            <article className="quote-card" key={story.id}>
              <p>“</p>
              <blockquote>{story.body}</blockquote>
              <footer>
                {story.caseTitle.split('\n').map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
                <b>›</b>
              </footer>
            </article>
          ))}
        </div>
      </section>

      <section className="ai-section section-pad">
        <SectionHeading
          title="AI 맞춤 추천"
          description="자주 참여했던 기록을 반영했어요."
          action={null}
        />
        <article className="ai-recommend">
          <div className="recommend-bot">●ᴗ●</div>
          <div>
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
    </main>
  )
}

export default HomePage
