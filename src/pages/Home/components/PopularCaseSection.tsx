import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'
import { Link } from 'react-router-dom'
import useCountdown from '../../../hooks/useCountdown'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, homeImages } from '../homeAssets'
import { homeSectionTitles, todayCase } from '../../../data/common/homeContent'
import { PATHS, toCaseDetail } from '../../../routes/paths'
import {
  getRememberedCaseParticipantCount,
  rememberCaseParticipantCount,
} from '../../../utils/caseParticipantCount'

const PARTICIPANT_UPDATE_MIN_DELAY = 1000
const PARTICIPANT_UPDATE_MAX_DELAY = 2600
const PARTICIPANT_TARGET_COUNT = 1420
const PARTICIPANT_INCREMENTS = [2, 3, 4, 4, 5, 6, 7, 8] as const

function getRandomParticipantDelay() {
  return PARTICIPANT_UPDATE_MIN_DELAY
    + Math.random() * (PARTICIPANT_UPDATE_MAX_DELAY - PARTICIPANT_UPDATE_MIN_DELAY)
}

function getRandomParticipantIncrement() {
  return PARTICIPANT_INCREMENTS[Math.floor(Math.random() * PARTICIPANT_INCREMENTS.length)]
}

function getInitialParticipantCount() {
  const rememberedCount = getRememberedCaseParticipantCount(
    todayCase.id,
    todayCase.participantCount,
  )

  // 데모가 상한에 도달한 뒤 홈에 다시 들어오면 실시간 집계 모션을 다시 볼 수 있게 한다.
  return rememberedCount >= PARTICIPANT_TARGET_COUNT
    ? todayCase.participantCount
    : rememberedCount
}

function getRollingDigitSequence(previousDigit: string, currentDigit: string) {
  const start = Number(previousDigit)
  const end = Number(currentDigit)

  if (!Number.isInteger(start) || !Number.isInteger(end) || start === end) return [currentDigit]

  const steps = ((end - start + 10) % 10) || 10
  return Array.from({ length: steps + 1 }, (_, index) => String((start + index) % 10))
}

/**
 * 01 Popular Case — 오늘의 사건. Figma `1402:7105`
 *
 * 카운트다운은 자리마다 한 칸씩 그리고 실제로 매초 줄어든다.
 * 서버가 없어 사건별 마감 일시를 받을 수 없으므로 화면을 연 시점부터 센다.
 * 남은 시간은 사건 상세·결과 화면과 같은 값을 쓴다.
 * (`todayCase.deadline` → `weddingGiftCase.deadline` — PROJECT_SPEC.md §1-5)
 */
function PopularCaseSection() {
  const countdown = useCountdown(todayCase.deadline, todayCase.id)
  const [{ current: participantCount, previous: previousParticipantCount }, setParticipantCount] = useState<{
    current: number
    previous: number
  }>(() => {
    const rememberedCount = getInitialParticipantCount()

    return {
      current: rememberedCount,
      previous: rememberedCount,
    }
  })
  const pad = (value: number) => String(value).padStart(2, '0')
  // `02:41:07` 같은 문자열을 한 글자씩 쪼개 칸으로 그린다. `:`은 구분자 칸이 된다.
  const countdownSlots = `${pad(countdown.hours)}:${pad(countdown.minutes)}:${pad(countdown.seconds)}`.split('')

  useEffect(() => {
    let timerId: number | null = null
    let currentCount = getInitialParticipantCount()

    const scheduleNextUpdate = () => {
      if (document.hidden || currentCount >= PARTICIPANT_TARGET_COUNT) return

      timerId = window.setTimeout(() => {
        const previous = currentCount
        currentCount = Math.min(
          currentCount + getRandomParticipantIncrement(),
          PARTICIPANT_TARGET_COUNT,
        )
        setParticipantCount({ current: currentCount, previous })
        scheduleNextUpdate()
      }, getRandomParticipantDelay())
    }

    const handleVisibilityChange = () => {
      if (timerId !== null) window.clearTimeout(timerId)
      timerId = null
      scheduleNextUpdate()
    }

    scheduleNextUpdate()
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      if (timerId !== null) window.clearTimeout(timerId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const participantCharacters = participantCount.toLocaleString().split('')
  const previousParticipantCharacters = previousParticipantCount.toLocaleString().split('')

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
              <p className="popular-case__meta" aria-label={`배심원 ${participantCount.toLocaleString()}명 참여 중`}>
                배심원{' '}
                <b className="participant-count" aria-hidden="true">
                  {participantCharacters.map((character, index) => {
                    if (character === ',') {
                      return <span className="participant-count__comma" key={`comma-${index}`}>,</span>
                    }

                    const previousCharacter = previousParticipantCharacters[index] ?? character
                    const rollingDigits = getRollingDigitSequence(previousCharacter, character)
                    const rollSteps = rollingDigits.length - 1
                    const isChanging = rollSteps > 0
                    const rollStyle = {
                      '--participant-roll-steps': rollSteps,
                      '--participant-roll-duration': `${Math.min(980, 420 + rollSteps * 70)}ms`,
                    } as CSSProperties

                    return (
                      <span
                        className={`participant-count__digit${isChanging ? ' is-changing' : ''}`}
                        key={`${participantCount}-${index}`}
                      >
                        <span className="participant-count__track" style={rollStyle}>
                          {rollingDigits.map((digit, digitIndex) => (
                            <span key={`${digit}-${digitIndex}`}>{digit}</span>
                          ))}
                        </span>
                      </span>
                    )
                  })}
                </b>
                명 참여중
              </p>
            </div>

            <Link
              className="popular-case__cta"
              to={toCaseDetail(todayCase.id)}
              state={{ entryMotion: 'slide-forward', returnTo: PATHS.home }}
              onClick={() => rememberCaseParticipantCount(todayCase.id, participantCount)}
            >
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
