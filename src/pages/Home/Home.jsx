import { useState } from 'react'
import './Home.css'
import perillaTable from '../../assets/home/perilla-table.png'

const recentCases = [
  { tag: '친구 · 금전', title: '친구 모임에서 항상\n계산은 제가 해요', meta: '💬 24', tone: 'blue' },
  { tag: '연인 · 약속', title: '이웃의 늦은 밤 세탁기\n소음, 참아야 할까요?', meta: '💬 12', tone: 'yellow' },
]

function SectionHeading({ title, description, action = '더보기' }) {
  return (
    <div className="section-heading">
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action && <button className="text-action">{action} <span>›</span></button>}
    </div>
  )
}

function Home() {
  const [choice, setChoice] = useState(null)

  return (
    <main className="home-screen">
      <header className="home-header">
        <div className="status-bar"><b>9:41</b><span className="island" /><span>▮▮▮ ᯤ ▰</span></div>
        <div className="app-bar">
          <strong>왈가왈<span>BOT</span></strong>
          <div className="header-actions" aria-label="상단 메뉴"><button aria-label="검색">⌕</button><button aria-label="알림">♧<i /></button></div>
        </div>
      </header>

      <section className="hero-section">
        <SectionHeading title="오늘 사건" action={null} />
        <article className="hero-case">
          <p className="deadline">투표 마감까지 <b>01 : 01</b></p>
          <div className="hero-copy">
            <h1>친구 <em>축의금 10만원</em><br />적당한가?</h1>
            <p>배심원 <b>1,245</b>명 참여중</p>
            <button className="primary-pill">투표하러 가기 <span>›</span></button>
          </div>
          <div className="hero-art" aria-hidden="true"><span className="bot-ear left" /><span className="bot-ear right" /><span className="bot-face">⌁</span><span className="bot-body">✦</span></div>
          <div className="context-tip"><span>▣</span><p>10년 지기 친구의 결혼식이긴 하지만<br /><b>최근 연락이 뜸했다면</b> 10만원은 적당할까요?</p></div>
        </article>
        <div className="ai-keypoint"><span className="mini-bot">●ᴗ●</span><p><b>관계의 깊이</b>와 <b>최근 교류</b>가<br />축의금 판단의 핵심이에요.</p></div>
      </section>

      <section className="recent-section section-pad">
        <SectionHeading title="최근 본 사건" action="전체보기" />
        <div className="recent-grid">
          {recentCases.map((item) => <article className={`recent-card ${item.tone}`} key={item.title}><span className="pin">●</span><small>{item.tag}</small><h3>{item.title.split('\n').map((line) => <span key={line}>{line}</span>)}</h3><p>{item.meta}</p></article>)}
        </div>
      </section>

      <section className="ad-banner"><div><small>판멍이가 바꿔놓은</small><b>소곤소곤 톡!</b></div><div className="ad-bots"><span>●ᴗ●</span><span>●ᴗ●</span></div><i>AD</i></section>

      <section className="balance-section section-pad">
        <SectionHeading title={<>밸런스 게임 <span className="refresh">↻</span></>} action="" />
        <p className="pager">1/4</p>
        <article className="balance-card">
          <h3><b>A.</b> 깻잎 논쟁, 당신의 선택은?</h3>
          <div className="balance-photo"><img src={perillaTable} alt="깻잎 반찬" /></div>
          <div className="choice-row">
            <button onClick={() => setChoice('okay')} className={choice === 'okay' ? 'selected okay' : 'okay'}>상관 없음</button>
            <button onClick={() => setChoice('no')} className={choice === 'no' ? 'selected no' : 'no'}>절대 안됨</button>
          </div>
          <p className="drag-copy">☝ 깻잎을 좌우로 밀어 선택!</p>
        </article>
      </section>

      <section className="close-section section-pad">
        <SectionHeading title="막상막하" description="한 표로 달라질 수 있는, 팽팽한 사건" action="자세히 보기" />
        <article className="close-card prominent">
          <div className="close-top"><span className="avatar">◕</span><div><small>반려견 개물림 사고</small><h3>견주 구속 합당한가?</h3></div><span className="comment-count">💬 76</span></div>
          <div className="poll"><div><small>구속 찬성</small><strong>52%</strong></div><span>VS</span><div><small>구속 반대</small><strong>48%</strong></div></div>
          <div className="poll-bar"><i style={{ width: '52%' }} /></div><p>총 4,252명 참여</p>
        </article>
        <article className="close-card mini-close"><div><span className="tag-red">공개 지적 긍정</span><h3>중고거래 사기, 플랫폼 책임은 어디까지인가?</h3><small>댓글 42개</small></div><div className="mini-poll"><b>58%</b><span /><b>42%</b></div></article>
        <button className="all-cases">로그인 하고 사건 투표하기</button>
      </section>

      <section className="story-section section-pad">
        <SectionHeading title="왈가왈후~" description="판정 이후, 이렇게 달라졌어요." />
        <article className="letter-card"><span className="new-label">NEW</span><div className="letter-paper"><p>“</p><h3>조언대로 이메일 증거 제출 후<br />공동 기여를 인정받았어요</h3><strong>제 아이디어를 가로챈<br />직속 사수와의 면담</strong><p>”</p></div><div className="envelope-front"><b>사건 상세보기 ›</b></div></article>
        <div className="story-scroll">
          {['직접 대화해보니 오해였고, 친구도 미안하다고 했어요. 서로 더 이해하게 됐습니다.', '작은 약속부터 다시 지키며 관계를 회복하고 있어요.'].map((text) => <article className="quote-card" key={text}><p>“</p><blockquote>{text}</blockquote><footer>친구에게 300만원<br />빌려주고 6개월째 미변제 <b>›</b></footer></article>)}
        </div>
      </section>

      <section className="ai-section section-pad">
        <SectionHeading title="AI 맞춤 추천" description="자주 참여했던 기록을 반영했어요." action="" />
        <article className="ai-recommend"><div className="recommend-bot">●ᴗ●</div><div><h3>내 고민과 닮은 사건이 있을까?</h3><p>관심사에 맞는 사건을<br /><b>AI챗봇 판멍이가 추천</b>해드려요.</p></div></article>
      </section>

      <nav className="bottom-nav" aria-label="주요 메뉴"><button className="active"><span>⌂</span>홈</button><button><span>♟</span>배심원 광장</button><button className="case-nav"><span>＋</span>사건 접수</button><button><span>▢</span>왈가왈후~</button><button><span>♙</span>MY</button></nav>
    </main>
  )
}

export default Home
