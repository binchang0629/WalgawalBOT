import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, homeImages } from '../homeAssets'
import { homeSectionTitles, todayCase } from '../../../data/common/homeContent'

/**
 * 01 Popular Case — 오늘의 사건. Figma `1402:7105`
 *
 * 카운트다운은 자리마다 한 칸씩 그린다. 지금은 정적인 값이며 실제로 줄지 않는다.
 * (서버·타이머가 없다 — PROJECT_SPEC.md §1-5)
 */
function PopularCaseSection() {
  return (
    <section className="popular-case">
      <SectionTitle title={homeSectionTitles.today.title} size="lg" />

      <div className="popular-case__body">
        <div className="popular-case__card">
          <p className="countdown">
            <span className="countdown__label">{todayCase.countdownLabel}</span>
            <span className="countdown__box">
              {todayCase.countdown.map((slot, index) =>
                slot === ':' ? (
                  <i className="countdown__colon" key={`colon-${index}`}>
                    :
                  </i>
                ) : (
                  <b className="countdown__digit" key={`digit-${index}`}>
                    {slot}
                  </b>
                ),
              )}
            </span>
          </p>

          <div className="popular-case__visual">
            <div className="popular-case__headline">
              <h1>
                {todayCase.titleParts.map((part, index) =>
                  part.accent ? (
                    <em key={index}>{part.text}</em>
                  ) : (
                    <span key={index}>{part.text}</span>
                  ),
                )}
                <br />
                {todayCase.titleSecondLine}
              </h1>
              <p className="popular-case__meta">
                배심원 <b>{todayCase.participantCount.toLocaleString()}</b>명 참여중
              </p>
            </div>

            <button type="button" className="popular-case__cta">
              {todayCase.ctaLabel}
              <img src={homeIcons.btnArrow} alt="" aria-hidden="true" />
            </button>
          </div>

          <div className="context-tip">
            <img src={homeIcons.tipIcon} alt="" aria-hidden="true" />
            <p>
              {todayCase.contextTip.lead}
              {todayCase.contextTip.leadTail}
              <br />
              <b>{todayCase.contextTip.highlight}</b>
              {todayCase.contextTip.tail}
            </p>
          </div>
        </div>

        <div className="ai-keypoint">
          <span className="ai-keypoint__mascot">
            <img src={homeImages.botFace} alt="" aria-hidden="true" />
            <i>{todayCase.aiKeyPoint.badge}</i>
          </span>
          <p>
            <b>{todayCase.aiKeyPoint.first}</b>
            {todayCase.aiKeyPoint.connector}
            <b>{todayCase.aiKeyPoint.second}</b>
            {todayCase.aiKeyPoint.tail}
            <br />
            {todayCase.aiKeyPoint.secondLine}
          </p>
        </div>
      </div>

      <img
        className="popular-case__judge"
        src={homeImages.judgeMascot}
        alt="법봉을 든 판멍이"
      />
    </section>
  )
}

export default PopularCaseSection
