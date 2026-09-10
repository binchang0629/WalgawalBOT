import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons } from '../homeAssets'
import perilla from '../../../assets/home/figma/perilla.png'
import perillaPile from '../../../assets/home/figma/perilla-pile.png'
import plateLeft from '../../../assets/home/figma/plate-left.png'
import plateRight from '../../../assets/home/figma/plate-right.png'
import { balanceQuestions, homeSectionTitles } from '../../../data/common/homeContent'

type BalanceChoice = 'left' | 'right'

/** Figma 1692:12930. 선택은 문항별 로컬 상태이며 새로고침하면 초기화된다. */
function BalanceGameSection() {
  const [choice, setChoice] = useState<BalanceChoice | null>(null)
  const [phase, setPhase] = useState<'idle' | 'placing' | 'expanding' | 'result'>('idle')
  const [hoverChoice, setHoverChoice] = useState<BalanceChoice | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const drag = useRef<{ id: number; x: number; y: number; scale: number; min: number; max: number } | null>(null)
  const question = balanceQuestions[0]

  // 재시작·화면 이탈 때 이전 애니메이션 타이머를 모두 정리한다.
  useEffect(() => {
    if (!choice) return
    // 놓은 접시 위치를 한 번 그린 뒤 같은 위치에서 결과로 확대한다.
    const expand = window.setTimeout(() => setPhase('expanding'), 80)
    const finish = window.setTimeout(() => setPhase('result'), 1030)
    return () => { window.clearTimeout(expand); window.clearTimeout(finish) }
  }, [choice])

  function handleChoose(value: BalanceChoice) {
    if (choice) return
    setDragOffset(0)
    setHoverChoice(null)
    setChoice(value)
    setPhase('placing')
  }

  function handleReset() {
    drag.current = null
    setDragOffset(0)
    setHoverChoice(null)
    setChoice(null)
    setPhase('idle')
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (choice || !event.isPrimary || event.button !== 0) return
    const board = event.currentTarget.parentElement!
    // PC 기기 목업의 transform 배율을 보정한다.
    const scale = board.getBoundingClientRect().width / board.offsetWidth
    const leaf = event.currentTarget.getBoundingClientRect()
    const leafCenter = leaf.left + leaf.width * 0.35
    const leftPlate = board.querySelector('.balance-board__side--left .balance-board__plate')!.getBoundingClientRect()
    const rightPlate = board.querySelector('.balance-board__side--right .balance-board__plate')!.getBoundingClientRect()
    // 고정 70px 제한 대신 실제 접시 중심까지 이동할 수 있는 거리를 계산한다.
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, scale,
      min: (leftPlate.left + leftPlate.width / 2 - leafCenter) / scale,
      max: (rightPlate.left + rightPlate.width / 2 - leafCenter) / scale }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.id !== event.pointerId) return
    const offset = Math.max(start.min, Math.min(start.max, (event.clientX - start.x) / start.scale))
    setDragOffset(offset)
    setHoverChoice(offset <= start.min * 0.55 ? 'left' : offset >= start.max * 0.55 ? 'right' : null)
  }

  function handlePointerEnd(event: PointerEvent<HTMLDivElement>) {
    const start = drag.current
    if (!start || start.id !== event.pointerId) return
    const dx = (event.clientX - start.x) / start.scale
    const dy = (event.clientY - start.y) / start.scale
    // 세로 스크롤·취소·짧은 탭은 선택으로 처리하지 않는다.
    const target = dx <= start.min * 0.55 ? 'left' : dx >= start.max * 0.55 ? 'right' : null
    if (event.type === 'pointerup' && target && Math.abs(dx) > Math.abs(dy)) {
      handleChoose(target)
    }
    setHoverChoice(null)
    drag.current = null
    setDragOffset(0)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <section className={'balance-section balance-section--' + phase + (choice ? ' balance-section--' + choice : '') + (hoverChoice ? ' balance-section--hover-' + hoverChoice : '')} aria-label="밸런스 게임">
      <SectionTitle title={homeSectionTitles.balance.title}
        titleSuffix={
          <button type="button" className="balance-section__refresh" aria-label="깻잎 게임 다시하기" onClick={handleReset}>
            <img src={homeIcons.refreshIcon} alt="" aria-hidden="true" />
          </button>
        }
        actionSlot={<p className="balance-section__pager" aria-live="polite"><b>1</b>/4</p>}
      />
      <p className="balance-question" id="balance-question"><b>{question.order}</b> {phase === 'result' ? <>깻잎 논쟁, 나의 선택은 <span className="balance-answer">{choice === 'left' ? question.leftLabel : question.rightLabel}.</span></> : question.title}</p>
      <div className="balance-board" role="group" aria-labelledby="balance-question">
        <div key={question.id} className="balance-board__draggable"
          style={choice ? undefined : { transform: 'translateX(' + dragOffset + 'px)' }}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}
          onLostPointerCapture={handlePointerEnd}>
          <img className="balance-board__subject" src={perilla} alt={question.scenario} draggable={false} />
        </div>
        <img className="balance-board__pile" src={perillaPile} alt="접시에 수북이 쌓인 깻잎" aria-hidden={phase !== 'result'} />
        {(['left', 'right'] as const).map(side => (
          <div key={side} className={'balance-board__side balance-board__side--' + side}>
            <img className="balance-board__plate" src={side === 'left' ? plateLeft : plateRight} alt="" aria-hidden="true" />
            <button type="button"
              className={'balance-choice balance-choice--' + side + (choice === side ? ' is-selected' : '')}
              disabled={!!choice && choice !== side} aria-pressed={choice === side} onClick={() => handleChoose(side)}>
              <img src={side === 'left' ? homeIcons.balloonTailLeft : homeIcons.balloonTailRight} alt="" aria-hidden="true" />
              {side === 'left' ? question.leftLabel : question.rightLabel}
            </button>
          </div>
        ))}
        <p className="balance-board__guide" role="status" aria-live="polite">
          <img src={homeIcons.dragHand} alt="" aria-hidden="true" />
          {choice ? (choice === 'left' ? question.leftLabel : question.rightLabel) + ' 선택!' : question.guide}
        </p>
      </div>
    </section>
  )
}

export default BalanceGameSection
