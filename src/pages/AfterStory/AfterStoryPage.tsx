import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import useLoginGate from '../../hooks/useLoginGate'
import { PATHS } from '../../routes/paths'
import CaseSubmitProgress from '../Submit/components/CaseSubmitProgress'
import backIcon from '../../assets/my/back.svg'
import walangJoy from '../../assets/submit/figma/imgCharacterWalangJoy.svg'
import panMungyeeJudge from '../../assets/submit/panmung-judge-hq.png'
import { homeImages } from '../Home/homeAssets'
import scrollBackground from '../../assets/afterstory/figma/scroll-background.png'
import writePencil from '../../assets/afterstory/figma/write-pencil.png'
import readBook from '../../assets/afterstory/figma/read-book.png'
import walgadakFace from '../../assets/home/figma/close-call-mascot.svg'
import './AfterStoryPage.css'

const CONNECTED_CASE = {
  category: '친구 · 투표 종료',
  title: '조별 과제에서 친구를 공개적으로\n지적한 제가 너무 예민했던 걸까요?',
  storyTitle: '먼저 사과한 뒤,\n서로의 의견을 묻게 됐어요.',
  context: '조별 과제에서 친구를 공개적으로 지적한 사건',
} as const

/*
 * 발표 시연용 예시 후일담.
 * `내용 작성하기`를 누르면 본문 칸이 이 글로 한 번에 채워진다.
 * 무대에서 타이핑할 시간이 없어서 넣은 장치다.
 */
const DEMO_STORY = [
  ' 처음에는 제가 사과하면 모든 잘못을 인정하는 것처럼 느껴졌어요. 그런데 친구의 이야기를 차분히 듣고 보니, 저도 모르게 사람들 앞에서 친구를 곤란하게 했더라고요.',
  '',
  ' 그날 이후 먼저 연락해서 사과했고, 지금은 서로의 의견을 묻는 방식으로 조별 과제를 하고 있어요.',
].join('\n')

/**
 * `내 이야기 남기기` 화면에 올라오는 내 사건 목록. Figma 왈가왈후 시안 기준.
 * 실제 서버 데이터가 아니라 시연용 고정 데이터다.
 */
const MY_CLOSED_CASES = [
  {
    id: 'friend',
    category: '친구',
    tone: 'friend',
    titleLines: ['조별 과제에서 친구를 공개적으로 지적한', '제가 너무 예민했던 걸까요?'],
    opinionCount: 88,
    commentCount: 44,
  },
  {
    id: 'company',
    category: '직장',
    tone: 'company',
    titleLines: ['납품한 디자인을 사용하면서 잔금을 지급하지 않는', '의뢰인에게 어떻게 대응해야 할까요?'],
    opinionCount: 28,
    commentCount: 84,
  },
] as const

/**
 * 다른 사용자가 공개한 후일담. 이미 광장과 홈에 있는 시연 사건만 연결해,
 * 화면을 채우기 위해 새로운 갈등 사례를 만들어내지 않는다.
 */
const COMMUNITY_AFTER_STORIES = [
  {
    id: 'birthday-gift', category: '친구', tone: 'friend', updatedAt: '5분 전',
    title: '친한 친구의 생일 선물 때문에 생긴 오해', summary: '늦게라도 마음을 전하고 화해했어요.', reactions: 4,
  },
  {
    id: 'video-payment', category: '직장', tone: 'company', updatedAt: '12분 전',
    title: '카페 홍보영상 제작, 수정 범위와 잔금 갈등', summary: '최종본을 전달한 뒤 잔금도 무사히 받았어요.', reactions: 7,
  },
  {
    id: 'friend-loan', category: '친구', tone: 'friend', updatedAt: '19분 전',
    title: '친구에게 빌려준 300만 원, 6개월째 미변제', summary: '직접 대화한 뒤 서로 오해를 풀었어요.', reactions: 3,
  },
] as const
interface AfterStoryLocationState { content?: string }

/**
 * 왈가왈후 공통 헤더.
 *
 * `onBack`을 주면 왼쪽에 뒤로가기가 붙고, 안 주면 빈 칸이 들어간다.
 * 왈가왈후 홈은 하단 내비게이션으로 오가는 첫 화면이라 MY·광장처럼 뒤로가기를 두지 않는다.
 * 양옆 칸 너비가 같아서 버튼이 있든 없든 제목은 정중앙에 선다.
 */
function AfterStoryHeader({ title, onBack }: { title: string; onBack?: () => void }) {
  return (
    <header className="afterstory-header">
      {onBack ? (
        <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기"><img src={backIcon} alt="" /></button>
      ) : (
        <span aria-hidden="true" />
      )}
      <h1>{title}</h1>
      <span aria-hidden="true" />
    </header>
  )
}

function CaseContextCard() {
  return (
    <section className="afterstory-case-context">
      <p>{CONNECTED_CASE.category}</p>
      <h2>{CONNECTED_CASE.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h2>
    </section>
  )
}

export function AfterStoryHomePage() {
  const { requireLogin } = useLoginGate()

  return (
    <main className="afterstory-home">
      <AfterStoryHeader title="왈가왈후~" />
      <div className="afterstory-home__scroll" style={{ backgroundImage: `url(${scrollBackground})` }}>
        <section className="afterstory-hero">
          <p>왈가왈</p>
          <h2>그 이후의 이야기</h2>
          <span>투표가 끝난 뒤에도 이야기는 계속돼요</span>
        </section>

        <section className="afterstory-entry-cards" aria-label="후일담 둘러보기">
          {/*
            내 사건을 다루는 화면이라 로그인이 필요하다.
            비로그인이면 이동을 막고 보던 화면 위에 안내 팝업만 띄운다.
            라우트로 막지 않는 이유는 LoginGateProvider 주석 참고.
          */}
          <Link
            className="afterstory-entry-card afterstory-entry-card--write"
            to={PATHS.afterStoryMine}
            onClick={(event) => {
              if (!requireLogin('default', PATHS.afterStoryMine)) {
                event.preventDefault()
              }
            }}
          >
            <img className="afterstory-entry-card__art" src={writePencil} alt="" />
            <strong>내 이야기<br />남기기</strong>
            <small>내 사건의 그 후를 기록해요</small>
          </Link>
          <Link
            className="afterstory-entry-card afterstory-entry-card--read"
            to={PATHS.afterStoryMineStories}
            onClick={(event) => {
              if (!requireLogin('default', PATHS.afterStoryMineStories)) {
                event.preventDefault()
              }
            }}
          >
            <img className="afterstory-entry-card__art" src={readBook} alt="" />
            <strong>내가 쓴 후일담<br />보러가기</strong>
            <small>내가 남긴 이야기만 모아봐요</small>
          </Link>
        </section>

        <section className="afterstory-community afterstory-community--board" id="community-stories" aria-labelledby="community-story-title">
          <header className="afterstory-community__header">
            <div>
              <p>판결 이후</p>
              <h2 id="community-story-title">방금 도착한 후일담</h2>
            </div>
          </header>
          <p className="afterstory-community__intro">방금 작성된 이야기를 확인해보세요.</p>

          <div className="afterstory-community__list">
            {COMMUNITY_AFTER_STORIES.map((story) => (
              <article className={'afterstory-community-card afterstory-community-card--' + story.tone} key={story.id}>
                <span className="afterstory-community-card__tape" aria-hidden="true" />
                <header>
                  <span className="afterstory-community-card__category">{story.category}</span>
                  <span>{story.updatedAt} · 공감 {story.reactions}</span>
                </header>
                <h3 title={story.title}>{story.title}</h3>
                <p className="afterstory-community-card__outcome">{story.summary}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

/** 내가 직접 게시한 후일담만 모아 보는 목록 화면. */
export function MyPublishedAfterStoryPage() {
  const navigate = useNavigate()

  return (
    <main className="afterstory-home afterstory-my-stories">
      <AfterStoryHeader title="내가 쓴 후일담" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-home__scroll" style={{ backgroundImage: `url(${scrollBackground})` }}>
        <section className="afterstory-my-stories__intro">
          <h2>내가 쓴 후일담</h2>
          <p>사건이 끝난 뒤 내가 남긴 이야기를 모아봐요.</p>
        </section>

        <section className="afterstory-my-stories__list" aria-label="내가 쓴 후일담 목록">
          <p className="afterstory-my-stories__count">작성한 후일담 <b>1</b>개</p>
          <article className="afterstory-my-stories__item">
            <span className="afterstory-my-stories__tape" aria-hidden="true" />
            <header><span>친구 · 내 후일담</span><time>방금 전</time></header>
            <h3>{CONNECTED_CASE.context}</h3>
            <p>{CONNECTED_CASE.storyTitle.replace('\n', ' ')}</p>
            <small>공개 범위 · 전체 공개</small>
          </article>
        </section>

        <Link className="afterstory-my-stories__write" to={PATHS.afterStoryMine}>
          다른 사건의 후일담 남기기 <span aria-hidden="true">›</span>
        </Link>
      </div>
    </main>
  )
}
/**
 * 내 이야기 남기기 — 판결이 끝난 내 사건을 골라 후일담 작성으로 들어가는 화면.
 * 왈가왈후 홈의 `내 이야기 남기기` 카드가 여기로 들어온다.
 */
export function MyAfterStoryPage() {
  const navigate = useNavigate()
  const closedCount = MY_CLOSED_CASES.length

  return (
    <main className="afterstory-home afterstory-mine">
      <AfterStoryHeader title="왈가왈후~" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-home__scroll" style={{ backgroundImage: `url(${scrollBackground})` }}>
        <section className="afterstory-mine__intro">
          <h2>내 이야기 남기기</h2>
          <p>판결 이후, 어떤 변화가 있었나요?</p>
        </section>

        <aside className="afterstory-mine__notice">
          <img src={walgadakFace} alt="" />
          <p>판결이 끝난 사건 <b>{closedCount}건</b>이 있어요.<br />당신의 다음 이야기를 써볼까요?</p>
        </aside>

        <section className="afterstory-mine__list">
          <header>
            <h3>내가 올린 사건</h3>
            <span>{closedCount}건</span>
          </header>

          {MY_CLOSED_CASES.map((item) => (
            <article className="afterstory-mine__card" key={item.id}>
              <div className="afterstory-mine__tags">
                <em className={'afterstory-mine__category afterstory-mine__category--' + item.tone}>{item.category}</em>
                <span className="afterstory-mine__badge">판결 완료</span>
              </div>
              <h4>{item.titleLines.join(' ')}</h4>
              <p>사건의 결말을 확인한 뒤, 그 이후의 변화와<br />당신의 선택을 들려주세요.</p>
              <small>의견 {item.opinionCount} · 댓글 {item.commentCount}</small>
              <button type="button" onClick={() => navigate('/afterstory/write/' + item.id)}>후일담 작성하기</button>
            </article>
          ))}
        </section>
      </div>
    </main>
  )
}

export function WriteAfterStoryPage() {
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const canPreview = content.trim().length > 0

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canPreview) return
    navigate(PATHS.afterStoryPreview, { state: { content } satisfies AfterStoryLocationState })
  }

  /* 예시 본문을 채우고 커서를 글 끝에 둔다. 발표 중 바로 이어서 고칠 수 있게. */
  function handleDemoFill() {
    setContent(DEMO_STORY)
    window.requestAnimationFrame(() => {
      const field = document.getElementById('afterstory-content')
      if (field instanceof HTMLTextAreaElement) {
        field.focus()
        field.setSelectionRange(DEMO_STORY.length, DEMO_STORY.length)
        field.scrollTop = 0
      }
    })
  }

  return (
    <form className="afterstory-flow" onSubmit={handleSubmit}>
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate(PATHS.afterStoryMine)} />
      <div className="afterstory-flow__body afterstory-flow__body--with-progress">
        <CaseSubmitProgress step={1} totalSteps={2} label="후일담 작성" />
        <CaseContextCard />
        <section className="afterstory-flow__intro"><h1>그날 이후, 어떻게 달라졌나요?</h1><p>어떤 행동을 했고, 무엇이 달라졌나요?<br />아직 해결되지 않은 이야기라도 괜찮아요.</p></section>
        <section className="afterstory-field">
          <div className="afterstory-field__head">
            <label htmlFor="afterstory-content">후일담 내용 <b>*</b></label>
            {/* 발표 시연용. 누르면 예시 후일담이 본문 칸에 바로 들어간다. */}
            <button type="button" className="afterstory-field__demo" onClick={handleDemoFill}>내용 작성하기</button>
          </div>
          <div className="afterstory-field__box"><textarea id="afterstory-content" value={content} maxLength={1000} placeholder={'예) 요청 내용을 정리해 보낸 뒤,\n일주일 안에 잔금을 받았어요.\n\n내가 해 본 행동과 그 후의 변화를 적어주세요.'} onChange={(event) => setContent(event.target.value)} /><small>{content.length.toLocaleString()} / 1,000</small></div>
        </section>
        <aside className="afterstory-privacy"><img src={walangJoy} alt="" />이름·연락처 같은 개인정보는 빼주세요.</aside>
      </div>
      <footer className="afterstory-flow__footer"><button type="submit" disabled={!canPreview}>미리보기</button><small>게시 전, 내용과 개인정보를 다시 확인해요.</small></footer>
    </form>
  )
}

export function PreviewAfterStoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const content = (location.state as AfterStoryLocationState | null)?.content ?? ''

  return (
    <main className="afterstory-flow">
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate('/afterstory/write/friend')} />
      <div className="afterstory-flow__body afterstory-flow__body--with-progress">
        <CaseSubmitProgress step={2} totalSteps={2} label="게시 확인" />
        <section className="afterstory-preview-intro"><h1>이 이야기로 게시할까요?</h1><p>게시될 내용과 연결된 사건을 확인해주세요.</p></section>
        <CaseContextCard />
        <section className="afterstory-preview-content"><h2>내가 남길 후일담</h2><p>{content || '작성한 후일담이 여기에 표시됩니다.'}</p></section>
        <aside className="afterstory-publish-notice"><img src={homeImages.botFace} alt="" />게시하면 다른 사용자에게 공개돼요.<br />이름·연락처 등 개인정보를 다시 확인해주세요.</aside>
      </div>
      <footer className="afterstory-flow__footer"><button type="button" onClick={() => navigate(PATHS.afterStoryComplete, { state: { content } satisfies AfterStoryLocationState })}>후일담 게시하기</button><small>게시 후에도 MY에서 공개 범위를 바꿀 수 있어요.</small></footer>
    </main>
  )
}

export function CompleteAfterStoryPage() {
  const navigate = useNavigate()
  return (
    <main className="afterstory-flow afterstory-complete">
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-complete__spacer" aria-hidden="true" />
      <div className="afterstory-complete__body">
        <div className="afterstory-complete__art-stage">
          <span className="afterstory-complete__check" aria-hidden="true">✓</span>
          <img src={panMungyeeJudge} alt="판사 옷을 입은 판멍이 캐릭터" />
        </div>
        <div className="afterstory-complete__message">
          <h1>후일담 작성 완료!</h1>
          <p>이제 내 사건에서 내용을 다시 확인할 수 있어요.</p>
        </div>
        <section><small>친구 · 내 후일담</small><h2>{CONNECTED_CASE.storyTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{CONNECTED_CASE.context}</p></section>
        <em>공개 범위는 내 사건에서 변경할 수 있어요.</em>
      </div>
      <footer className="afterstory-flow__footer afterstory-complete__footer"><button type="button" onClick={() => navigate(PATHS.home)}>홈으로</button><small>홈에서 다른 사건도 둘러보세요.</small></footer>
    </main>
  )
}
