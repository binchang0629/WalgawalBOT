import { Link } from 'react-router-dom'
import useCountdown from '../../../hooks/useCountdown'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, homeImages } from '../homeAssets'
import { homeSectionTitles, todayCase } from '../../../data/common/homeContent'
import { toCaseDetail } from '../../../routes/paths'

/**
 * 01 Popular Case — 오늘의 사건. Figma `1402:7105`
 *
 * 카운트다운은 자리마다 한 칸씩 그리고 실제로 매초 줄어든다.
 * 서버가 없어 사건별 마감 일시를 받을 수 없으므로 화면을 연 시점부터 센다.
 * (`todayCase.countdownHours` — PROJECT_SPEC.md §1-5)
 */
function PopularCaseSection() {
  const countdown = useCountdown(todayCase.countdownHours)
  const pad = (value: number) => String(value).padStart(2, '0')
  // `02:41:07` 같은 문자열을 한 글자씩 쪼개 칸으로 그린다. `:`은 구분자 칸이 된다.
  const countdownSlots = `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`.split('')

  return (
    <section className="popular-case">
      <SectionTitle title={homeSectionTitles.today.title} size="lg" />

      <div className="popular-case__body">
        <div className="popular-case__card">
          {/*
            매초 바뀌는 숫자를 스크린리더가 계속 읽으면 방해가 된다.
            칸은 숨기고, 남은 시간은 aria-label 한 줄로만 알린다.
          */}
          <p
            className="countdown"
            role="timer"
            aria-label={`${todayCase.countdownLabel} ${countdown.hours}시간 ${countdown.minutes}분 ${countdown.seconds}초`}
          >
            <span className="countdown__label" aria-hidden="true">{todayCase.countdownLabel}</span>
            <span className="countdown__box" aria-hidden="true">
              {countdownSlots.map((slot, index) =>
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

            <Link className="popular-case__cta" to={toCaseDetail(todayCase.id)}>
              {todayCase.ctaLabel}
              <img src={homeIcons.btnArrow} alt="" aria-hidden="true" />
            </Link>
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
