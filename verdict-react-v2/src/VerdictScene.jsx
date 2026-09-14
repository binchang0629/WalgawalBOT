import React, { useEffect, useId, useRef, useState } from 'react';
import dog from './assets/panmung-raised-hand.png';
import background from './assets/stage-background.png';
import author from './assets/wallang-author.svg';
import opponent from './assets/walgadak-opponent.svg';
import './VerdictScene.css';

const ASSETS = [dog, background, author, opponent];
const curve = (i) => `M ${340 + i % 4 * 16} -35 C ${320 + i % 3 * 10} 60, ${198 + i % 5 * 9} 124, ${242 + i % 4 * 8} 249`;

export default function VerdictScene({ juryPercent, aiReason = '', still = false }) {
  const id = useId();
  const ref = useRef(null);
  const [ready, setReady] = useState(false);
  const [seen, setSeen] = useState(false);
  const [reduce, setReduce] = useState(true);
  const [run, setRun] = useState(0);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduce(media.matches); update();
    media.addEventListener('change', update);
    let active = true;
    Promise.all(ASSETS.map(src => new Promise(resolve => {
      const image = new Image(); image.onload = resolve; image.onerror = resolve; image.src = src;
    }))).then(() => { if (active) setReady(true); });
    return () => { active = false; media.removeEventListener('change', update); };
  }, []);
  useEffect(() => {
    if (!('IntersectionObserver' in window)) { setSeen(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); observer.disconnect(); }
    }, { threshold: .25 });
    observer.observe(ref.current); return () => observer.disconnect();
  }, []);
  const motion = ready && seen && !reduce && !still;
  const percent = Number.isFinite(juryPercent) && juryPercent >= 0 && juryPercent <= 100 ? juryPercent : null;
  return <section ref={ref} className="vs" aria-labelledby={`${id}-heading`}>
    <p className="vs-status">사건 종결</p>
    <h1 id={`${id}-heading`}>판단이<br /><span>엇갈렸어요</span></h1>
    <div key={`${run}-${motion}`} className={`vs-scene ${motion ? 'vs-motion' : 'vs-still'}`} aria-hidden="true">
      <img className="vs-background" src={background} alt="" />
      <svg className="vs-flow" viewBox="0 0 354 402" fill="none">
        <defs><g id={`${id}-paper`}><rect x="-5" y="-8" width="10" height="16" rx="2" fill="#FFBC6D" /><path d="M-2 -3h4M-2 0h4M-2 3h4" stroke="#EE8D2D" strokeWidth="1.4" strokeLinecap="round" /></g></defs>
        <path d="M362 -30C335 73 235 127 262 255" stroke="#FFE5C5" strokeWidth="2" />
        <path d="M336 -20C337 82 219 135 248 255" stroke="#FFD09A" strokeDasharray="2 9" strokeWidth="1.2" />
        {Array.from({ length: 12 }, (_, i) => {
          const t = (i + .5) / 12;
          const x = Math.pow(1-t,3)*362+3*Math.pow(1-t,2)*t*335+3*(1-t)*t*t*235+t*t*t*262;
          const y = Math.pow(1-t,3)*-30+3*Math.pow(1-t,2)*t*73+3*(1-t)*t*t*127+t*t*t*255;
          return <use key={i} href={`#${id}-paper`} transform={`translate(${x} ${y}) rotate(${i*27-20})`} opacity=".3" />;
        })}
        {motion && Array.from({ length: 22 }, (_, i) => <g key={i} opacity="0">
          <animateMotion path={curve(i)} begin={`${.45 + i*.045}s`} dur="1.45s" fill="freeze" rotate="auto" />
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;.1;.83;1" begin={`${.45 + i*.045}s`} dur="1.45s" fill="freeze" />
          <use href={`#${id}-paper`} transform={`rotate(${i*21})`} />
        </g>)}
      </svg>
      <div className="vs-ai-note">AI는<br /><strong>글쓴이 편이에요!</strong><svg viewBox="0 0 40 30"><path d="M4 2Q4 20 29 26"/><path d="m23 20 6 6-8 0"/></svg></div>
      <img className="vs-dog" src={dog} alt="" />
      <img className="vs-author" src={author} alt="" />
      <div className="vs-jury-note">배심원은<br /><strong>상대방을<br />선택했어요!</strong></div>
      <div className="vs-jury-glow" />
      <img className="vs-opponent" src={opponent} alt="" />
      {percent !== null && <div className="vs-percent"><b>{percent}<small>%</small></b><span>배심원 최다 선택</span></div>}
      <div className="vs-podium-label"><span>AI는 글쓴이</span><i /> <span>배심원은 상대방</span></div>
    </div>
    <p className="vs-sr">AI 판멍이는 글쓴이의 손을 들어줬고, 배심원은 상대방을 선택했어요.{percent !== null ? ` 배심원 상대방 지지 비율은 ${percent}%예요.` : ''}</p>
    <div className="vs-footer"><p><span>1심 · AI</span><span>2심 · 배심원</span></p><button type="button" onClick={() => setRun(n => n+1)} disabled={!ready || reduce || still} aria-label="판단 비교 애니메이션 다시 보기"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 7v5h-5M20 12a8 8 0 1 0-2 5"/></svg><span>다시 보기</span></button></div>
    {aiReason && <details className="vs-reason"><summary>판단 근거 보기<span aria-hidden="true">⌄</span></summary><h2>판멍이가 주목한 점</h2><p>{aiReason}</p><h2>배심원의 선택</h2><p>배심원 최다 선택은 상대방이었어요. 투표 비율만으로 선택 이유를 단정하지 않아요.</p></details>}
  </section>;
}
