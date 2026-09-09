import type { ReactNode } from 'react'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons } from '../homeAssets'
import {
  closeCallCase,
  closeCallMiniCase,
  homeSectionTitles,
} from '../../../data/common/homeContent'

/**
 * 막상막하 · Close call. Figma `1402:7235`
 *
 * 아래 CTA는 시연 흐름의 가입 진입점이다. 문구는 시안 그대로
 * `로그인 하고 나도 투표하기`이고, 로그인 상태에 따라 다른 요소를 그린다.
 * (PROJECT_SPEC.md §4-A)
 */
interface CloseCallSectionProps {
  /** 비로그인일 때 가입으로 보내는 링크, 로그인일 때 투표 버튼 */
  cta: ReactNode
}

function CloseCallSection({ cta }: CloseCallSectionProps) {
  return (
    <section className="close-section">
      <SectionTitle
        title={homeSectionTitles.closeCall.title}
        description={homeSectionTitles.closeCall.description}
        action={homeSectionTitles.closeCall.action}
      />

      <article className="close-card">
        <div className="close-card__head">
          <img src={homeIcons.characterHead} alt="" aria-hidden="true" />
          <h3>
            {closeCallCase.titleLines.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </h3>
        </div>

        <div className="close-card__poll">
          <div className="close-card__choice">
            <p>{closeCallCase.leftLabel}</p>
            <strong className="close-card__percent close-card__percent--blue">
              {closeCallCase.leftPercent}
              <i>%</i>
            </strong>
          </div>
          <span className="close-card__vs">VS</span>
          <div className="close-card__choice">
            <p>{closeCallCase.rightLabel}</p>
            <strong className="close-card__percent close-card__percent--red">
              {closeCallCase.rightPercent}
              <i>%</i>
            </strong>
          </div>
        </div>

        <div className="close-card__bar">
          <i style={{ width: `${closeCallCase.leftPercent}%` }} />
        </div>
        <p className="close-card__gap">{closeCallCase.gapText}</p>
      </article>

      <article className="swap-card">
        <div className="swap-card__head">
          <span className="swap-card__tag">
            <img src={homeIcons.fireIcon} alt="" aria-hidden="true" />
            {closeCallMiniCase.tag}
          </span>
          <button type="button" className="swap-card__change">
            {closeCallMiniCase.changeLabel}
            <img src={homeIcons.chevronsUp} alt="" aria-hidden="true" />
          </button>
        </div>

        <p className="swap-card__title">{closeCallMiniCase.title}</p>

        <div className="swap-card__bar">
          <i style={{ width: `${closeCallMiniCase.leftPercent}%` }} />
        </div>

        <div className="swap-card__result">
          <span className="swap-card__side swap-card__side--blue">
            <b>{closeCallMiniCase.leftPercent}%</b>
            {closeCallMiniCase.leftLabel}
          </span>
          <span className="swap-card__side swap-card__side--red">
            <b>{closeCallMiniCase.rightPercent}%</b>
            {closeCallMiniCase.rightLabel}
          </span>
        </div>
      </article>

      {cta}
    </section>
  )
}

export default CloseCallSection
