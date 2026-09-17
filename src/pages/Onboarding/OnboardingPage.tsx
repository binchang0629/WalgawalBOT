import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import sofaBot from '../../assets/onboarding/figma/onboarding-sofa-bot.png'
import onboardingWave from '../../assets/onboarding/figma/onboarding-wave.png'
import noteFactIcon from '../../assets/onboarding/figma/onboarding-note-fact.png'
import noteEmotionIcon from '../../assets/onboarding/figma/onboarding-note-emotion.png'
import notePrivateIcon from '../../assets/onboarding/figma/onboarding-note-private.png'
import mapMascot from '../../assets/onboarding/figma/onboarding-map-mascot.png'
import backIcon from '../../assets/onboarding/figma/onboarding-back.svg'
import nextArrow from '../../assets/home/figma/btn-arrow.svg'
import onboardingVideo from '../../assets/videos/onboarding.mp4'
import splashVideo from '../../assets/videos/splash.mp4'
import envelopeBack from '../../assets/home/figma/envelope-back.webp'
import envelopeFront from '../../assets/home/figma/envelope-front.webp'
import letterPaper from '../../assets/home/figma/img2.png'
import './OnboardingPage.css'

type OnboardingStep = 0 | 1 | 2

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
    description: 'AI 판멍이가 당신의 이야기를 먼저 들어드려요',
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
      <video autoPlay loop muted playsInline preload="auto" src={onboardingVideo} />
    </div>
  )
}

function ThirdScene() {
  return (
    <div className="onboarding-page__scene onboarding-page__scene--third" aria-hidden="true">
      <div className="onboarding-page__envelope">
        <img className="onboarding-page__letter" src={letterPaper} alt="" />
        <img className="onboarding-page__envelope-back" src={envelopeBack} alt="" />
        <div className="onboarding-page__letter-copy"><span>“</span><p>먼저 사과한 뒤,<br />서로의 의견을 묻게 됐어요.</p><span>”</span><b>조별 과제에서 친구를<br />공개적으로 지적한 사건</b></div>
        <img className="onboarding-page__envelope-front" src={envelopeFront} alt="" />
      </div>
      <img className="onboarding-page__map-mascot" src={mapMascot} alt="" />
    </div>
  )
}

function OnboardingPage() {
  const navigate = useNavigate()
  const [splashPhase, setSplashPhase] = useState<'playing' | 'leaving' | 'done'>('playing')
  const splashTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [step, setStep] = useState<OnboardingStep>(0)

  useEffect(() => () => {
    if (splashTimerRef.current) clearTimeout(splashTimerRef.current)
  }, [])

  const finishSplash = () => {
    if (splashPhase !== 'playing') return
    setSplashPhase('leaving')
    const fadeDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 420
    splashTimerRef.current = setTimeout(() => setSplashPhase('done'), fadeDuration)
  }

  const finishOnboarding = () => navigate(PATHS.home)
  const moveBack = () => {
    if (step === 0) {
      navigate(PATHS.home)
      return
    }
    setStep((current) => (current - 1) as OnboardingStep)
  }
  const moveNext = () => {
    if (step === 2) {
      finishOnboarding()
      return
    }
    setStep((current) => (current + 1) as OnboardingStep)
  }

  const copy = STEP_COPY[step]

  return (
    <div className="onboarding-intro">
      {splashPhase !== 'playing' && (
        <main className={'onboarding-page onboarding-page--step-' + (step + 1)}>
          <header className="onboarding-page__header">
            <button aria-label="이전 온보딩으로 돌아가기" onClick={moveBack} type="button"><img src={backIcon} alt="" /></button>
            <button className="onboarding-page__skip" onClick={finishOnboarding} type="button">SKIP</button>
          </header>

          <section className="onboarding-page__main">
            <div className="onboarding-page__copy">
              <h1>{copy.title}</h1>
              <p>{copy.description}</p>
            </div>
            {step === 0 && <FirstScene />}
            {step === 1 && <SecondScene />}
            {step === 2 && <ThirdScene />}
          </section>

          <footer className="onboarding-page__footer">
            <PageIndicator step={step} onSelect={setStep} />
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
