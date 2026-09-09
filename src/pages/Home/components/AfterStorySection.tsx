import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, homeImages, optionalImages } from '../homeAssets'
import {
  afterStoryQuotes,
  featuredAfterStory,
  homeSectionTitles,
} from '../../../data/common/homeContent'

/**
 * 05 After Story — 왈가왈후~. Figma `1402:7357`
 *
 * 편지는 네 겹이다: 편지(뒤) → 편지봉투_뒤 → 편지지 → 편지봉투_앞.
 *
 * `envelope-back.png`·`envelope-front.png`이 아직 없다. 두 겹을 대충 흉내 내면
 * 글자와 겹쳐 오히려 읽기 어려워지므로, 없을 때는 봉투 없이 편지지만 보여준다(`letter--flat`).
 * 파일이 들어오면 `homeAssets.ts`가 자동으로 바꿔 끼우고 봉투가 다시 덮인다.
 */
function AfterStorySection() {
  const hasEnvelope = Boolean(optionalImages.envelopeBack && optionalImages.envelopeFront)

  return (
    <section className="story-section">
      <SectionTitle
        title={homeSectionTitles.afterStory.title}
        description={homeSectionTitles.afterStory.description}
        action={homeSectionTitles.afterStory.action}
      />

      <article className={`letter${hasEnvelope ? '' : ' letter--flat'}`}>
        {hasEnvelope && (
          <>
            <img className="letter__mail" src={homeImages.letterEnvelope} alt="" aria-hidden="true" />
            <img className="letter__back" src={optionalImages.envelopeBack ?? ''} alt="" aria-hidden="true" />
          </>
        )}

        <img className="letter__paper" src={homeImages.letterPaper} alt="" aria-hidden="true" />

        <div className="letter__content">
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

        {hasEnvelope && (
          <img className="letter__front" src={optionalImages.envelopeFront ?? ''} alt="" aria-hidden="true" />
        )}

        <b className="letter__cta">{featuredAfterStory.envelopeCta}</b>
      </article>

      <div className="story-scroll">
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
