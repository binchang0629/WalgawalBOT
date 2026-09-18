import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
// import sofaBot from '../../assets/onboarding/figma/onboarding-sofa-bot.png'
import sofaBot from '../../assets/onboarding/figma/onboarding_newimg_sofa.png'
import onboardingWave from '../../assets/onboarding/figma/onboarding-wave.png'
import noteFactIcon from '../../assets/onboarding/figma/onboarding-note-fact.png'
import noteEmotionIcon from '../../assets/onboarding/figma/onboarding-note-emotion.png'
import notePrivateIcon from '../../assets/onboarding/figma/onboarding-note-private.png'
// import mapMascot from '../../assets/onboarding/figma/onboarding-map-mascot.png'
import letterMascot from '../../assets/onboarding/figma/onboarding_newimg_letter.png'
import backIcon from '../../assets/onboarding/figma/onboarding-back.svg'
import nextArrow from '../../assets/home/figma/btn-arrow.svg'
import onboardingVideo from '../../assets/videos/onboarding.mp4'
// import splashVideo from '../../assets/videos/splash.mp4'
import splashVideo from '../../assets/videos/splash_new.mp4'
import envelopeClosed from '../../assets/home/figma/envelope-closed.webp'
import envelopeBack from '../../assets/home/figma/envelope-back.webp'
import envelopeFront from '../../assets/home/figma/envelope-front.webp'
import letterPaper from '../../assets/home/figma/img2.png'
import './OnboardingPage.css'

type OnboardingStep = 0 | 1 | 2
type SlideDirection = 'forward' | 'backward'

/** 단계 사이 좌우 밀기 시간. CSS의 onboarding-slide-* 애니메이션 길이와 같다. */
const STEP_SLIDE_MS = 460
/** 마지막에 홈으로 들어갈 때 온보딩이 사라지는 시간. CSS의 onboarding-exit 길이와 같다. */
const EXIT_MS = 320

const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const STEP_COPY = [
  {
    title: <>일상 속 고민,<br /><em>판멍이</em>에게 털어놓으세요</>,
    description: 'AI 판멍이가 당신의 이야기를 먼저 들어드려요',
  },
  {
    title: <>배심원이 되어<br /><em className="is-blue">현명한 판결</em>을 내려요</>,
    description: '다른 사람의 고민을 읽고 당신의 생각을 남겨보세요',
  },
  {
    title: <>판결 <em>그 후의 이야기</em>도<br />함께 만나보세요</>,
    description: '판결 뒤, 관계가 어떻게 달라졌는지 함께 살펴보세요.',
  },
] as const

function PageIndicator({ step, onSelect }: { step: OnboardingStep; onSelect: (step: OnboardingStep) => void }) {
  return (
    <div className="onboarding-page__indicator" aria-label={`온보딩 ${step + 1} / 3`}>
      {STEP_COPY.map((_, index) => (
        <button
          aria-label={`${index + 1}번째 온보딩 보기`}
          aria-current={index === step ? 'step' : undefined}
          className={index === step ? 'is-active' : ''}
          key={index}
          onClick={() => onSelect(index as OnboardingStep)}
          type="button"
        />
      ))}
    </div>
  )
}

function FirstScene() {
  return (
    <div className="onboarding-page__scene onboarding-page__scene--first" aria-hidden="true">
      <img className="onboarding-page__wave" src={onboardingWave} alt="" />
      <div className="onboarding-note onboarding-note--fact"><strong className="onboarding-note__icon"><img src={noteFactIcon} alt="" /></strong><b>사실</b><i /><i /></div>
      <div className="onboarding-note onboarding-note--emotion"><strong className="onboarding-note__icon"><img src={noteEmotionIcon} alt="" /></strong><b>감정</b><i /><i /></div>
      <div className="onboarding-note onboarding-note--private"><strong className="onboarding-note__icon"><img src={notePrivateIcon} alt="" /></strong><b>나만 보기</b><i /><i /></div>
      <img className="onboarding-page__sofa-bot" src={sofaBot} alt="" />
    </div>
  )
}

function SecondScene() {
  return (
    <div className="onboarding-page__scene onboarding-page__scene--video" aria-hidden="true">
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        src={onboardingVideo}
        onLoadedMetadata={(event) => {
          event.currentTarget.playbackRate = 0.9
        }}
      />
    </div>
  )
}

function ThirdScene() {
  return (
    <div className="onboarding-page__scene onboarding-page__scene--third" aria-hidden="true">
      <div className="onboarding-page__envelope">
        <img className="onboarding-page__letter" src={letterPaper} alt="" />
        <img className="onboarding-page__envelope-back" src={envelopeBack} alt="" />
        <div className="onboarding-page__letter-copy">
          <span>“</span>
          <p>먼저 사과한 뒤,<br />서로의 의견을 묻게 됐어요.</p>
          <span>”</span>
          <b>조별 과제에서 친구를<br />공개적으로 지적한 사건</b>
        </div>
        <img className="onboarding-page__envelope-front" src={envelopeFront} alt="" />

        {/* 닫힌 봉투 */}
        <img
          className="onboarding-page__envelope-closed"
          src={envelopeClosed}
          alt=""
        />
      </div>

      <img className="onboarding-page__letter-mascot" src={letterMascot} alt="" />
    </div>
  )
}

/**
 * 한 단계의 문구와 장면. 단계를 넘길 때는 이전 패널과 새 패널을 잠시 함께 그려
 * 이전 것은 왼쪽으로 밀려나고 새 것은 오른쪽에서 들어오게 한다. (뒤로 가면 반대)
 */
function StepPanel({ step, motion }: { step: OnboardingStep; motion?: string }) {
  const copy = STEP_COPY[step]
  return (
    <div
      className={`onboarding-page__panel onboarding-page__panel--step-${step + 1}${motion ? ` ${motion}` : ''}`}
      aria-hidden={motion?.startsWith('is-leaving') ? true : undefined}
    >
      <div className="onboarding-page__copy">
        <h1>{copy.title}</h1>
        <p>{copy.description}</p>
      </div>
      {step === 0 && <FirstScene />}
      {step === 1 && <SecondScene />}
      {step === 2 && <ThirdScene />}
    </div>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [splashPhase, setSplashPhase] = useState<'playing' | 'leaving' | 'done'>('playing')
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const slideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [step, setStep] = useState<OnboardingStep>(0)
  /** 밀려나는 중인 이전 단계. 밀기가 끝나면 null로 돌아간다. */
  const [leaving, setLeaving] = useState<{ step: OnboardingStep; direction: SlideDirection } | null>(null)
  const [isExiting, setIsExiting] = useState(false)

  useEffect(() => () => {
    if (splashTimerRef.current) clearTimeout(splashTimerRef.current)
    if (slideTimerRef.current) clearTimeout(slideTimerRef.current)
    if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
  }, [])

  const finishSplash = () => {
    if (splashPhase !== 'playing') return
    setSplashPhase('leaving')
    const fadeDuration = prefersReducedMotion() ? 0 : 420
    splashTimerRef.current = setTimeout(() => setSplashPhase('done'), fadeDuration)
  }

  /*
   * 홈으로 들어갈 때는 온보딩을 살짝 앞으로 당기며 흐리게 지우고,
   * 홈은 AppViewport가 `appLaunch` 표시를 보고 살짝 작은 상태에서 커지며 나타나게 한다.
   * 앱 첫 화면으로 들어가는 흔한 전환(줌 + 페이드)이다.
   */
  const finishOnboarding = () => {
    if (isExiting) return
    if (prefersReducedMotion()) {
      navigate(PATHS.home)
      return
    }
    setIsExiting(true)
    exitTimerRef.current = setTimeout(() => navigate(PATHS.home, { state: { appLaunch: true } }), EXIT_MS)
  }

  /** 단계를 바꾼다. 밀기 도중에 들어온 입력은 무시해 화면이 겹쳐 꼬이지 않게 한다. */
  const goToStep = (next: OnboardingStep) => {
    if (next === step || leaving || isExiting) return
    if (prefersReducedMotion()) {
      setStep(next)
      return
    }
    setLeaving({ step, direction: next > step ? 'forward' : 'backward' })
    setStep(next)
    slideTimerRef.current = setTimeout(() => setLeaving(null), STEP_SLIDE_MS)
  }

  const moveBack = () => {
    if (step === 0) {
      navigate(PATHS.home)
      return
    }
    goToStep((step - 1) as OnboardingStep)
  }
  const moveNext = () => {
    if (step === 2) {
      finishOnboarding()
      return
    }
    goToStep((step + 1) as OnboardingStep)
  }

  return (
    <div className={'onboarding-intro' + (isExiting ? ' is-exiting' : '')}>
      {splashPhase === 'done' && (
        <main className="onboarding-page">
          <header className="onboarding-page__header">
            <button aria-label="이전 온보딩으로 돌아가기" onClick={moveBack} type="button"><img src={backIcon} alt="" /></button>
            <button className="onboarding-page__skip" onClick={finishOnboarding} type="button">SKIP</button>
          </header>

          <section className="onboarding-page__main">
            {/* 같은 key를 유지해야 밀려나는 패널이 새로 그려지지 않고(영상·애니메이션 재시작 없이) 그대로 빠져나간다. */}
            {leaving && <StepPanel key={`panel-${leaving.step}`} step={leaving.step} motion={`is-leaving-${leaving.direction}`} />}
            <StepPanel key={`panel-${step}`} step={step} motion={leaving ? `is-entering-${leaving.direction}` : undefined} />
          </section>

          <footer className="onboarding-page__footer">
            <PageIndicator step={step} onSelect={goToStep} />
            <button className="onboarding-page__next" onClick={moveNext} type="button" aria-label={step === 2 ? '홈으로 이동' : '다음 온보딩 보기'}>
              <img src={nextArrow} alt="" />
            </button>
          </footer>
        </main>
      )}
      {splashPhase !== 'done' && (
        <button
          className={'onboarding-splash' + (splashPhase === 'leaving' ? ' is-leaving' : '')}
          onClick={finishSplash}
          type="button"
          aria-label="스플래시 영상 건너뛰기"
        >
          <video autoPlay muted onEnded={finishSplash} onError={finishSplash} playsInline preload="auto" src={splashVideo} />
        </button>
      )}
    </div>
  )
}

export default OnboardingPage
