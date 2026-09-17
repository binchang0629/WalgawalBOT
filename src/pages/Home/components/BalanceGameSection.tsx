import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons } from '../homeAssets'
import CompactSwitchButton from './CompactSwitchButton'
import perillaLeaf from '../../../assets/home/figma/perilla-leaf.png'
import perillaChopsticks from '../../../assets/home/figma/perilla-chopsticks.png'
import perillaChopsticksFull from '../../../assets/home/figma/perilla-chopsticks-full.png'
import perillaPile from '../../../assets/home/figma/perilla-pile.png'
import perillaPileRed from '../../../assets/home/figma/perilla-pile-red.png'
import plateLeft from '../../../assets/home/figma/plate-left.png'
import plateRight from '../../../assets/home/figma/plate-right.png'
import mintScoop from '../../../assets/home/figma/mint-scoop.png'
import mintBowlRed from '../../../assets/home/figma/mint-bowl-red-transparent.png'
import mintBowlBlue from '../../../assets/home/figma/mint-bowl-blue.png'
import mintBowlFilled from '../../../assets/home/figma/mint-bowl-filled-blue.png'
import { balanceQuestions, mintBalanceQuestion, homeSectionTitles } from '../../../data/common/homeContent'

type BalanceChoice = 'left' | 'right'

const playableQuestions = [balanceQuestions[0], mintBalanceQuestion] as const

/** 두 문항이 드래그·버튼·다시하기 동작을 공유한다. 문항 전환 시 이전 타이머를 정리한다. */
function BalanceGameSection() {
  const [questionIndex, setQuestionIndex] = useState(0)
  return <BalanceRound key={playableQuestions[questionIndex].id} questionIndex={questionIndex}
    onNext={() => setQuestionIndex(index => (index + 1) % playableQuestions.length)} />
}

function BalanceRound({ questionIndex, onNext }: { questionIndex: number; onNext: () => void }) {
  const [choice, setChoice] = useState<BalanceChoice | null>(null)
  const [phase, setPhase] = useState<'idle' | 'placing' | 'expanding' | 'result'>('idle')
  const [hoverChoice, setHoverChoice] = useState<BalanceChoice | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const drag = useRef<{ id: number; x: number; y: number; scale: number; min: number; max: number } | null>(null)
  const question = playableQuestions[questionIndex]
  const isMint = question.id === 'balance-mint'
  const leftBowl = isMint ? mintBowlBlue : plateLeft
  const rightBowl = isMint ? mintBowlRed : plateRight
  const gameName = isMint ? '민트초코' : '깻잎'
  const expandedBubble = phase === 'result'

  // 재시작·화면 이탈 때 이전 애니메이션 타이머를 모두 정리한다.
  useEffect(() => {
    if (!choice || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
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
    setPhase(window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'result' : 'placing')
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
    // 손을 뗀 세로 위치와 무관하게, 좌우 기준선을 넘겼는지만으로 선택한다.
    const target = dx <= start.min * 0.55 ? 'left' : dx >= start.max * 0.55 ? 'right' : null
    if (event.type === 'pointerup' && target) {
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
    <section className={'balance-section balance-section--' + phase + (isMint ? ' balance-section--mint' : '') + (choice ? ' balance-section--' + choice : '') + (hoverChoice ? ' balance-section--hover-' + hoverChoice : '')} aria-label="밸런스 게임">
      <SectionTitle title={homeSectionTitles.balance.title}
        actionSlot={
          <CompactSwitchButton
            current={questionIndex + 1}
            total={playableQuestions.length}
            label="다른 게임"
            ariaLabel={'다른 밸런스 게임으로 전환: ' + (isMint ? '깻잎' : '민트초코')}
            onClick={onNext}
          />
        }
      />
      <p className="balance-question" id="balance-question"><b>{question.order}</b> {phase === 'result' ? <>{isMint ? '민트초코' : '깻잎 논쟁'}, 나의 선택은 <span className="balance-answer">{choice === 'left' ? question.leftLabel : question.rightLabel}.</span></> : question.title}</p>
      <div className="balance-board" role="group" aria-labelledby="balance-question">
        <div key={question.id} className="balance-board__draggable"
          style={choice ? undefined : { transform: 'translateX(' + dragOffset + 'px)' }}
          onPointerDown={handlePointerDown} onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd} onPointerCancel={handlePointerEnd}
          onLostPointerCapture={handlePointerEnd}>
          {isMint ? (
            <img className="balance-board__subject" src={mintScoop} alt={question.scenario} draggable={false} />
          ) : (
            /*
             * 깻잎은 젓가락과 잎을 따로 겹쳐 놓는다. 겹쳐 두면 평소에는 한 장처럼 보이고,
             * `절대 안됨`을 골랐을 때만 잎을 떨어뜨릴 수 있다. (아래 perilla-drop)
             */
            <span className="balance-board__subject balance-board__subject--perilla">
              <img className="balance-board__leaf" src={perillaLeaf} alt={question.scenario} draggable={false} />
              {/*
                젓가락은 두 장이다. 깻잎을 집고 있는 동안은 끝이 잎에 가린 원래 그림을 쓰고,
                잎을 놓은 뒤에는 가려져 있던 끝까지 살린 그림으로 바꾼다.
                두 장을 함께 두는 이유는 바꾸는 순간 이미지가 늦게 떠서 깜빡이지 않게 하려는 것이다.
              */}
              <img className="balance-board__chopsticks" src={perillaChopsticks} alt="" aria-hidden="true" draggable={false} />
              <img className="balance-board__chopsticks balance-board__chopsticks--full" src={perillaChopsticksFull} alt="" aria-hidden="true" draggable={false} />
            </span>
          )}
        </div>
        {/*
          깻잎 더미 그림에는 접시가 함께 그려져 있다. 그래서 고른 쪽 접시 색에 맞춰
          두 장을 바꿔 쓴다. 상관 없음이면 파란 접시, 절대 안됨이면 빨간 접시다.
          더미는 결과 단계에서야 보이므로 고른 직후 바꿔도 깜빡이지 않는다.
        */}
        {(!isMint || choice !== 'right') && <img className="balance-board__pile"
          src={isMint ? mintBowlFilled : choice === 'right' ? perillaPileRed : perillaPile}
          alt={isMint
            ? '파란색 그릇에 가득 담긴 민트초코 아이스크림'
            : (choice === 'right' ? '빨간 접시에 수북이 쌓인 깻잎' : '파란 접시에 수북이 쌓인 깻잎')}
          aria-hidden={phase !== 'result'} />}
        {(['left', 'right'] as const).map(side => (
          <div key={side} className={'balance-board__side balance-board__side--' + side}>
            <img className="balance-board__plate" src={side === 'left' ? leftBowl : rightBowl} alt="" aria-hidden="true" />
            <button type="button" className={'balance-board__plate-target balance-board__plate-target--' + side}
              aria-label={`${side === 'left' ? question.leftLabel : question.rightLabel} 접시 선택`}
              disabled={!!choice} onClick={() => handleChoose(side)} />
            <button type="button"
              className={'balance-choice balance-choice--' + side + (choice === side ? ' is-selected' : '')}
              disabled={!!choice && choice !== side} aria-pressed={choice === side} onClick={() => handleChoose(side)}>
              <svg className="balance-choice__outline" viewBox={expandedBubble && choice === side ? '0 0 180 64' : '0 0 140 64'} preserveAspectRatio="none" aria-hidden="true" focusable="false">
                <path d={expandedBubble && choice === side
                  ? 'M23 18.5H80L85 1.5L100 18.5H157A22.5 22.5 0 0 1 179.5 41A22.5 22.5 0 0 1 157 63.5H23A22.5 22.5 0 0 1 .5 41A22.5 22.5 0 0 1 23 18.5Z'
                  : 'M23 18.5H60L65 1.5L80 18.5H117A22.5 22.5 0 0 1 139.5 41A22.5 22.5 0 0 1 117 63.5H23A22.5 22.5 0 0 1 .5 41A22.5 22.5 0 0 1 23 18.5Z'} vectorEffect="non-scaling-stroke" />
              </svg>
              <span className="balance-choice__label">{side === 'left' ? question.leftLabel : question.rightLabel}</span>
              {phase === 'result' && choice === side && (
                <span className="balance-choice__percent" aria-label={`이 선택을 고른 비율 ${side === 'left' ? question.leftPercent : question.rightPercent}%`}>
                  {side === 'left' ? question.leftPercent : question.rightPercent}%
                </span>
              )}
            </button>
          </div>
        ))}
        {phase === 'result' && (
          <button type="button" className="balance-section__refresh" aria-label={gameName + ' 게임 다시 하기'} onClick={handleReset}>
            <img src={homeIcons.refreshIcon} alt="" aria-hidden="true" />
          </button>
        )}
        <p className="balance-board__guide" role="status" aria-live="polite">
          <img src={homeIcons.dragHand} alt="" aria-hidden="true" />
          {choice ? (choice === 'left' ? question.leftLabel : question.rightLabel) + ' 선택!' : question.guide}
        </p>
      </div>
    </section>
  )
}

export default BalanceGameSection
