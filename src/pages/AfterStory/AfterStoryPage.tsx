import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import type { FormEvent } from 'react'
import { PATHS } from '../../routes/paths'
import backIcon from '../../assets/my/back.svg'
import walangJoy from '../../assets/submit/figma/imgCharacterWalangJoy.svg'
import { homeImages } from '../Home/homeAssets'
import scrollBackground from '../../assets/afterstory/figma/scroll-background.png'
import writePencil from '../../assets/afterstory/figma/write-pencil.png'
import readBook from '../../assets/afterstory/figma/read-book.png'
import './AfterStoryPage.css'

const CONNECTED_CASE = {
  category: '친구 · 투표 종료',
  title: '조별 과제에서 친구를 공개적으로\n지적한 제가 너무 예민했던 걸까요?',
  storyTitle: '먼저 사과한 뒤,\n서로의 의견을 묻게 됐어요.',
  context: '조별 과제에서 친구를 공개적으로 지적한 사건',
} as const

interface AfterStoryLocationState { content?: string }

function AfterStoryHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header className="afterstory-header">
      <button type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기"><img src={backIcon} alt="" /></button>
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
  const navigate = useNavigate()

  return (
    <main className="afterstory-home">
      <AfterStoryHeader title="왈가왈후~" onBack={() => navigate(PATHS.home)} />
      <div className="afterstory-home__scroll" style={{ backgroundImage: `url(${scrollBackground})` }}>
        <section className="afterstory-hero">
          <p>왈가왈</p>
          <h2>그 이후의 이야기</h2>
          <span>투표가 끝난 뒤에도 이야기는 계속돼요</span>
        </section>

        <section className="afterstory-entry-cards" aria-label="후일담 둘러보기">
          <Link className="afterstory-entry-card afterstory-entry-card--write" to="/afterstory/write/friend">
            <img className="afterstory-entry-card__art" src={writePencil} alt="" />
            <strong>내 이야기<br />남기기</strong>
            <small>내 사건의 그 후를 기록해요</small>
          </Link>
          <a className="afterstory-entry-card afterstory-entry-card--read" href="#latest-story">
            <img className="afterstory-entry-card__art" src={readBook} alt="" />
            <strong>다른 이야기<br />읽어보기</strong>
            <small>다른 사람의 후일담을 읽어요</small>
          </a>
        </section>

        <section className="afterstory-latest" id="latest-story">
          <header><h2>방금 도착한 후일담</h2><a href="#latest-story">모두 보기 <span aria-hidden="true">›</span></a></header>
          <article className="afterstory-envelope">
            <img className="afterstory-envelope__back" src={homeImages.envelopeBack} alt="" />
            <img className="afterstory-envelope__paper" src={homeImages.letterPaper} alt="" />
            <div className="afterstory-envelope__paper-copy">
              <em>NEW</em>
              <blockquote>“<span>먼저 사과한 뒤,<br />서로의 의견을 묻게 됐어요.</span>”</blockquote>
              <p>조별 과제에서 친구를<br />공개적으로 지적한 사건</p>
            </div>
            <img className="afterstory-envelope__front" src={homeImages.envelopeFront} alt="" />
            <b className="afterstory-envelope__cta">사건 상세보기 +</b>
          </article>
        </section>

        <section className="afterstory-story-summary">
          <p>“먼저 사과한 뒤,<br />서로의 의견을 묻게 됐어요.”</p>
          <small>친구 · 조별 과제에서 친구를 공개적으로 지적한 사건<br />공감 73 · 댓글 18</small>
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

  return (
    <form className="afterstory-flow" onSubmit={handleSubmit}>
      <AfterStoryHeader title="후일담 작성" onBack={() => navigate(PATHS.afterStory)} />
      <div className="afterstory-flow__progress"><span>1 / 2</span><i /><i /></div>
      <div className="afterstory-flow__body">
        <CaseContextCard />
        <section className="afterstory-flow__intro"><h1>그날 이후, 어떻게 달라졌나요?</h1><p>어떤 행동을 했고, 무엇이 달라졌나요?<br />아직 해결되지 않은 이야기라도 괜찮아요.</p></section>
        <section className="afterstory-field">
          <label htmlFor="afterstory-content">후일담 내용 <b>*</b></label>
          <div><textarea id="afterstory-content" value={content} maxLength={1000} placeholder={'예) 요청 내용을 정리해 보낸 뒤,\n일주일 안에 잔금을 받았어요.\n\n내가 해 본 행동과 그 후의 변화를 적어주세요.'} onChange={(event) => setContent(event.target.value)} /><small>{content.length.toLocaleString()} / 1,000</small></div>
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
      <div className="afterstory-flow__progress"><span>2 / 2</span><i className="is-active" /><i className="is-active" /></div>
      <div className="afterstory-flow__body">
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
      <div className="afterstory-complete__body">
        <img src={homeImages.judgeMascot} alt="" />
        <h1>후일담 작성 완료!</h1>
        <p>이제 내 사건에서 내용을 다시 확인할 수 있어요.</p>
        <section><small>친구 · 내 후일담</small><h2>{CONNECTED_CASE.storyTitle.split('\n').map((line) => <span key={line}>{line}</span>)}</h2><p>{CONNECTED_CASE.context}</p></section>
        <em>공개 범위는 내 사건에서 변경할 수 있어요.</em>
      </div>
      <footer className="afterstory-flow__footer"><button type="button" onClick={() => navigate(PATHS.afterStory)}>후일담 홈으로</button><small>다른 사람들의 후일담도 둘러보세요.</small></footer>
    </main>
  )
}