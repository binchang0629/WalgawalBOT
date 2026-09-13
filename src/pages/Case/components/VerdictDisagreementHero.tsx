import { useEffect, useId, useRef, useState } from 'react'
import background from '../../../assets/case/disagreement/stage-background.png'
import panmung from '../../../assets/case/disagreement/panmung-raised-hand.png'
import author from '../../../assets/case/disagreement/author.svg'
import opponent from '../../../assets/case/disagreement/opponent.svg'
import aiArrow from '../../../assets/case/disagreement/ai-arrow.svg'
import refreshIcon from '../../../assets/case/disagreement/refresh.svg'
import './VerdictDisagreementHero.css'

// 사용자 제공 HTML과 동일한 투표지 경로.
const curve = (i: number) => `M ${340 + i % 4 * 16} -35 C ${320 + i % 3 * 10} 60, ${198 + i % 5 * 9} 124, ${242 + i % 4 * 8} 249`

/** 종결 사건의 AI=글쓴이 / 배심원=상대방 비교 장면. 수치는 결과 데이터에서 받는다. */
export default function VerdictDisagreementHero({ juryPercent }: { juryPercent: number }) {
  const headingId = useId()
  const root = useRef<HTMLElement>(null)
  const [run, setRun] = useState(0)
  const [reduced, setReduced] = useState(true)
  const replay = useRef<() => void>(() => {})

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)')
    let disposed = false
    let ready = false
    let visible = false
    let started = false
    const start = () => {
      if (disposed || !ready || !visible || media.matches) return
      setRun(value => value + 1)

    }
    replay.current = start
    const sync = () => {
      setReduced(media.matches)

    }
    sync()
    media.addEventListener('change', sync)
    const tryStart = () => {
      if (ready && visible && !started) { started = true; start() }
    }
    Promise.all([background, panmung, author, opponent, aiArrow].map(src => new Promise<void>(resolve => {
      const img = new Image()
      img.onload = () => resolve()
      img.onerror = () => resolve()
      img.src = src
    }))).then(() => { if (!disposed) { ready = true; tryStart() } })
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { visible = true; tryStart(); observer.disconnect() }
    }, { threshold: 0.25 })
    if (root.current) observer.observe(root.current)
    return () => {
      disposed = true
      observer.disconnect()
      media.removeEventListener('change', sync)
    }
  }, [juryPercent])
  return (
    <section ref={root} className="disagreement-hero" aria-labelledby={headingId}>
      <h2 id={headingId}>판단이<span>엇갈렸어요</span></h2>
      <div key={run} className={`disagreement-hero__stage${run && !reduced ? ' is-playing' : ''}`} aria-hidden="true">
        <img className="disagreement-hero__background" src={background} alt="" />
      <svg className="disagreement-hero__flow" viewBox="0 0 354 402" fill="none">
        <defs><g id={`${headingId}-paper`}><rect x="-5" y="-8" width="10" height="16" rx="2" fill="#FFBC6D" /><path d="M-2 -3h4M-2 0h4M-2 3h4" stroke="#EE8D2D" strokeWidth="1.4" strokeLinecap="round" /></g></defs>
        <path d="M362 -30C335 73 235 127 262 255" stroke="#FFE5C5" strokeWidth="2" />
        <path d="M336 -20C337 82 219 135 248 255" stroke="#FFD09A" strokeDasharray="2 9" strokeWidth="1.2" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i + .5) / 12;
          const x = Math.pow(1-t,3)*362+3*Math.pow(1-t,2)*t*335+3*(1-t)*t*t*235+t*t*t*262;
          const y = Math.pow(1-t,3)*-30+3*Math.pow(1-t,2)*t*73+3*(1-t)*t*t*127+t*t*t*255;
          return <use key={i} href={`#${headingId}-paper`} transform={`translate(${x} ${y}) rotate(${i*27-20})`} opacity=".3" />;
        })}
        {run > 0 && !reduced && Array.from({ length: 22 }, (_, i) => <g key={i} opacity="0">
          <animateMotion path={curve(i)} begin={`${.45 + i*.045}s`} dur="1.45s" fill="freeze" rotate="auto" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.83;1" begin={`${.45 + i*.045}s`} dur="1.45s" fill="freeze" />
          <use href={`#${headingId}-paper`} transform={`rotate(${i*21})`} />
        </g>)}
      </svg>
        <div className="disagreement-hero__glow" />
        <img className="disagreement-hero__panmung" src={panmung} alt="" />
        <img className="disagreement-hero__author" src={author} alt="" />
        <img className="disagreement-hero__opponent" src={opponent} alt="" />
        <p className="disagreement-hero__ai">AI는<br />글쓴이 편이에요!</p>
        <img className="disagreement-hero__arrow" src={aiArrow} alt="" />
        <p className="disagreement-hero__jury">배심원은<br />상대편을<br />선택했어요!</p>
        <div className="disagreement-hero__percent">
          <strong>{juryPercent}<small>%</small></strong>
          <span>배심원 최다 선택</span>
        </div>
      </div>
      <div className="disagreement-hero__footer">
      <p className="disagreement-hero__legend">
        <span>판멍이는 글쓴이</span><i aria-hidden="true">|</i><span>배심원은 상대방</span>
      </p>
      <button className="disagreement-hero__replay" type="button" onClick={() => replay.current()} disabled={reduced || !run} aria-label="판단 비교 애니메이션 다시 보기" title="다시 보기"><img src={refreshIcon} alt="" /></button>
      </div>
      <p className="disagreement-hero__sr">AI는 글쓴이를, 배심원은 상대방을 선택했어요. 배심원 최다 선택 비율은 {juryPercent}%예요.</p>
    </section>
  )
}
