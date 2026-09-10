import { useEffect, useRef, useState } from 'react'
import useDragScroll from '../../../hooks/useDragScroll'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, homeImages } from '../homeAssets'
import {
  afterStoryQuotes,
  featuredAfterStory,
  homeSectionTitles,
} from '../../../data/common/homeContent'

/**
 * 05 After Story — 왈가왈후~. Figma `1402:7357`
 *
 * 편지는 다섯 겹이다: 편지 → 봉투_뒤(열린) → 편지지 → 봉투_앞 → 봉투_닫힘.
 *
 * 닫혔을 때는 맨 위의 닫힌 봉투만 보이고 편지지는 그 뒤로 내려가 있다.
 * 누르면 닫힌 봉투가 사라지며 열린 봉투로 바뀌고, 편지지가 올라오며 글이 보인다.
 * 봉투 세 장의 겹치는 위치는 이미지의 밑변 폭을 맞춰 계산했다(Home.css 참고).
 */
function AfterStorySection() {
  const [letterState, setLetterState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed')
  const transitionTimer = useRef<number | null>(null)
  // 후일담 카드 줄은 마우스로도 끌어서 넘길 수 있어야 한다.
  const storyScroll = useDragScroll<HTMLDivElement>()
  const isLetterOpen = letterState === 'opening' || letterState === 'open'
  const isAnimating = letterState === 'opening' || letterState === 'closing'

  useEffect(() => () => {
    if (transitionTimer.current !== null) window.clearTimeout(transitionTimer.current)
  }, [])

  function handleLetterToggle() {
    if (isAnimating) return
    if (letterState === 'closed') {
      setLetterState('opening')
      transitionTimer.current = window.setTimeout(() => setLetterState('open'), 960)
      return
    }

    setLetterState('closing')
    transitionTimer.current = window.setTimeout(() => setLetterState('closed'), 680)
  }

  return (
    <section className="story-section">
      <SectionTitle
        title={homeSectionTitles.afterStory.title}
        description={homeSectionTitles.afterStory.description}
        action={homeSectionTitles.afterStory.action}
      />

      <article className={'letter letter--' + letterState + (isLetterOpen ? ' is-open' : '')}>
        <img className="letter__back" src={homeImages.envelopeBack} alt="" aria-hidden="true" />

        <img className="letter__paper" src={homeImages.letterPaper} alt="" aria-hidden="true" />

        <div className="letter__content" id="featured-after-story">
          {featuredAfterStory.isNew && <span className="letter__new">NEW</span>}
          <blockquote className="letter__quote">
            <span className="letter__mark">“</span>
            {featuredAfterStory.quoteLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
            <span className="letter__mark letter__mark--close">”</span>
          </blockquote>
          <p className="letter__case">
            {featuredAfterStory.caseTitleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </p>
        </div>

        <img className="letter__front" src={homeImages.envelopeFront} alt="" aria-hidden="true" />
        <img className="letter__closed" src={homeImages.envelopeClosed} alt="" aria-hidden="true" />

        <b className="letter__cta">
          {letterState === 'open' || letterState === 'closing' ? featuredAfterStory.envelopeCta : '편지 열어보기'}
        </b>

        {/*
          봉투 전체가 누르는 영역이다. 보이는 글자는 `letter__cta`가 이미 맡고 있어서
          버튼 자체의 이름은 화면에서 숨기고 스크린리더에만 읽힌다.
        */}
        <button
          type="button"
          className="letter__toggle"
          aria-expanded={isLetterOpen}
          aria-controls="featured-after-story"
          disabled={isAnimating}
          onClick={handleLetterToggle}
        >
          <span>{letterState === 'open' || letterState === 'closing' ? '후일담 편지 접기' : '후일담 편지 열어보기'}</span>
        </button>
      </article>

      <div className="story-scroll" ref={storyScroll.ref} onDragStart={storyScroll.onDragStart}>
        {afterStoryQuotes.map((story) => (
          <article className="quote-card" key={story.id}>
            <div className="quote-card__body">
              <span className="quote-card__mark">“</span>
              <p>
                {story.bodyLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <span className="quote-card__mark quote-card__mark--close">”</span>
            </div>
            <footer className="quote-card__foot">
              <p>
                {story.caseTitleLines.map((line) => (
                  <span key={line}>
                    {line}
                    <br />
                  </span>
                ))}
              </p>
              <img src={homeIcons.quoteGo} alt="" aria-hidden="true" />
            </footer>
          </article>
        ))}
      </div>
    </section>
  )
}

export default AfterStorySection
