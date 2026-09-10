import { useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons } from '../homeAssets'
import mascot from '../../../assets/home/figma/close-call-mascot.svg'
import { closeCallCases, homeSectionTitles } from '../../../data/common/homeContent'

interface CloseCallSectionProps {
  /** 비로그인일 때 가입으로 보내는 링크, 로그인일 때 투표 버튼 */
  cta: ReactNode
}

/** 최신 Figma 개발 시안의 게이지형 막상막하. 바꿔보기는 두 사건을 실제로 교환한다. */
function CloseCallSection({ cta }: CloseCallSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentCase = closeCallCases[currentIndex]
  const nextCase = closeCallCases[(currentIndex + 1) % closeCallCases.length]
  const gap = Math.abs(currentCase.leftPercent - currentCase.rightPercent)
  // 6%p 이내의 막상막하는 게이지도 정중앙으로 표현한다. 수치는 양쪽에 그대로 둔다.
  const gaugeLeftPercent = gap <= 6 ? 50 : currentCase.leftPercent
  const gaugeStyle = {
    '--close-left-angle': String((gaugeLeftPercent / 100) * 180) + 'deg',
    '--close-needle-angle': String((gaugeLeftPercent - 50) * 1.8) + 'deg',
  } as CSSProperties

  function handleSwap() {
    setCurrentIndex((index) => (index + 1) % closeCallCases.length)
  }

  return (
    <section className="close-section">
      <SectionTitle
        title={homeSectionTitles.closeCall.title}
        description={homeSectionTitles.closeCall.description}
        action={homeSectionTitles.closeCall.action}
      />

      <article className="close-card" aria-live="polite">
        <h3 className="close-card__title">
          {currentCase.titleLines.map((line) => <span key={line}>{line}<br /></span>)}
        </h3>
        <div className="close-card__gauge" style={gaugeStyle}>
          <div className="close-card__arc" aria-hidden="true">
            <span className="close-card__needle" />
            <img className="close-card__mascot" src={mascot} alt="" />
          </div>
          <div className="close-card__choice close-card__choice--left">
            <p>{currentCase.leftLabel}</p>
            <strong>{currentCase.leftPercent}<i>%</i></strong>
          </div>
          <div className="close-card__choice close-card__choice--right">
            <p>{currentCase.rightLabel}</p>
            <strong>{currentCase.rightPercent}<i>%</i></strong>
          </div>
          <p className="close-card__gap">단 <b>{gap}%</b> 차이</p>
        </div>
      </article>

      <article className="swap-card" aria-live="polite">
        <div className="swap-card__head">
          <span className="swap-card__tag"><img src={homeIcons.fireIcon} alt="" aria-hidden="true" />치열한 공방 중</span>
          <button type="button" className="swap-card__change" onClick={handleSwap} aria-label="위아래 사건 바꿔보기">
            바꿔보기 <img src={homeIcons.chevronsUp} alt="" aria-hidden="true" />
          </button>
        </div>
        <p className="swap-card__title">{nextCase.titleLines.join(' ')}</p>
        <div className="swap-card__bar"><i style={{ width: String(nextCase.leftPercent) + '%' }} /></div>
        <div className="swap-card__result">
          <span className="swap-card__side swap-card__side--blue"><b>{nextCase.leftPercent}%</b>{nextCase.leftLabel}</span>
          <span className="swap-card__side swap-card__side--red"><b>{nextCase.rightPercent}%</b>{nextCase.rightLabel}</span>
        </div>
      </article>
      {cta}
    </section>
  )
}

export default CloseCallSection
