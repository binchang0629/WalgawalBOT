import { useState } from 'react'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons, optionalImages } from '../homeAssets'
import { balancePager, balanceQuestion, homeSectionTitles } from '../../../data/common/homeContent'

/**
 * 03 Daily Balance — 밸런스 게임. Figma `1402:7202`
 *
 * 선택은 화면 로컬 상태이며 저장되지 않는다. (PROJECT_SPEC.md §1-5, §6)
 * 시안의 "좌우로 밀어 선택"은 드래그 인터랙션이지만, 동작 후 화면이 시안에 없어
 * 지금은 접시를 눌러 고르는 것까지만 만든다.
 */
type BalanceChoice = 'left' | 'right' | null

function BalanceGameSection() {
  const [choice, setChoice] = useState<BalanceChoice>(null)

  return (
    <section className="balance-section">
      <SectionTitle
        title={homeSectionTitles.balance.title}
        titleSuffix={
          <button type="button" className="balance-section__refresh" aria-label="다른 문항 보기">
            <img src={homeIcons.refreshIcon} alt="" aria-hidden="true" />
          </button>
        }
        actionSlot={
          <p className="balance-section__pager">
            <b>{balancePager.current}</b>/{balancePager.total}
          </p>
        }
      />

      <p className="balance-question">
        <b>{balanceQuestion.order}</b> {balanceQuestion.title}
      </p>

      <div className="balance-board">
        {optionalImages.perilla ? (
          <img className="balance-board__subject" src={optionalImages.perilla} alt="깻잎" />
        ) : (
          <span className="balance-board__subject balance-board__subject--empty" aria-hidden="true" />
        )}

        <div className="balance-board__side balance-board__side--left">
          {optionalImages.plateLeft ? (
            <img className="balance-board__plate" src={optionalImages.plateLeft} alt="" aria-hidden="true" />
          ) : (
            <span className="balance-board__plate balance-board__plate--empty balance-board__plate--blue" aria-hidden="true" />
          )}
          <button
            type="button"
            className={`balance-choice balance-choice--left${choice === 'left' ? ' is-selected' : ''}`}
            aria-pressed={choice === 'left'}
            onClick={() => setChoice('left')}
          >
            <img src={homeIcons.balloonTailLeft} alt="" aria-hidden="true" />
            {balanceQuestion.leftLabel}
          </button>
        </div>

        <div className="balance-board__side balance-board__side--right">
          {optionalImages.plateRight ? (
            <img className="balance-board__plate" src={optionalImages.plateRight} alt="" aria-hidden="true" />
          ) : (
            <span className="balance-board__plate balance-board__plate--empty balance-board__plate--red" aria-hidden="true" />
          )}
          <button
            type="button"
            className={`balance-choice balance-choice--right${choice === 'right' ? ' is-selected' : ''}`}
            aria-pressed={choice === 'right'}
            onClick={() => setChoice('right')}
          >
            <img src={homeIcons.balloonTailRight} alt="" aria-hidden="true" />
            {balanceQuestion.rightLabel}
          </button>
        </div>

        <p className="balance-board__guide">
          <img src={homeIcons.dragHand} alt="" aria-hidden="true" />
          {balanceQuestion.guide}
        </p>
      </div>
    </section>
  )
}

export default BalanceGameSection
