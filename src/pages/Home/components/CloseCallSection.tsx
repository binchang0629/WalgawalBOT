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

/*
 * Figma 개발 > `수정?` 프레임(1949:3366)을 Plugin API로 직접 읽은 값.
 * 카드는 354×304, 게이지 상자는 카드 기준 (22.5,83)에 309×191.
 * 아래 좌표는 모두 그 게이지 상자 안쪽 기준이다.
 *
 * 눈금은 원이 아니라 **타원**이다. 시안의 벡터는 가로 82, 세로 89.27짜리
 * 반타원이고, 선 두께 18에 끝은 둥글다. 원으로 그리면 가로가 좁거나
 * 세로가 눌려서 어느 쪽이든 시안과 어긋난다.
 *
 * 중심은 세 개가 조금씩 다르다. 시안이 그렇게 그려져 있어서 그대로 옮겼다.
 *   눈금 타원 중심 (154, 115.4) / 축 덮개 중심 (154, 108.87) / 바늘 회전축 (154, 111)
 */
const ARC_CENTER_X = 154
const ARC_CENTER_Y = 115.4
const ARC_RADIUS_X = 82
const ARC_RADIUS_Y = 89.27
const NEEDLE_PIVOT_Y = 111

/** 각도 0도는 오른쪽 끝, 180도는 왼쪽 끝. 화면 y축은 아래로 자라서 부호를 뒤집는다. */
function arcPoint(angle: number) {
  const radian = (angle * Math.PI) / 180
  return {
    x: ARC_CENTER_X + ARC_RADIUS_X * Math.cos(radian),
    y: ARC_CENTER_Y - ARC_RADIUS_Y * Math.sin(radian),
  }
}

function arcPath(fromAngle: number, toAngle: number) {
  const start = arcPoint(fromAngle)
  const end = arcPoint(toAngle)
  const largeArc = Math.abs(fromAngle - toAngle) > 180 ? 1 : 0
  const round = (value: number) => String(Math.round(value * 100) / 100)
  return (
    'M ' + round(start.x) + ' ' + round(start.y) +
    ' A ' + String(ARC_RADIUS_X) + ' ' + String(ARC_RADIUS_Y) + ' 0 ' + String(largeArc) + ' 1 ' +
    round(end.x) + ' ' + round(end.y)
  )
}

/*
 * 바늘이 겨누는 지점은 계산상 경계보다 조금 더 왼쪽이다.
 *
 * 둥근 끝(ROUND cap)은 선이 끝난 자리에서 반쪽 원만큼 더 튀어나온다. 그래서
 * 위에 그린 빨강 뚜껑이 파랑 쪽으로 넘어오고, 눈에 보이는 색 경계가 계산상
 * 경계보다 왼쪽에 생긴다. 시안의 바늘도 그 '보이는 경계'를 겨누고 있다.
 *
 * 기준이 되는 값은 뚜껑 반지름 9px이 만드는 6.29도(= 9 / 82 라디안)다.
 * 딱 이만큼이 '보이는 색 경계의 한가운데'라 파랑에도 빨강에도 안 치우친다.
 *
 * 실제로 쓰는 5도는 거기서 눈으로 맞춰 오른쪽으로 조금 당긴 값이다
 * (48/52에서 왼쪽 8.3도, 끝이 약 3px 오른쪽). 팀에서 보고 정했다.
 * 시안 바늘은 반대로 7.72도(왼쪽 10.95도) 자리인데, 그 역시 손으로 놓은 값이다.
 * 어느 쪽이든 비율이 바뀌면 같은 규칙으로 따라간다.
 */
const NEEDLE_AIM_OFFSET = 5

/** 회전축에서 경계 지점을 바라보는 각도. 타원이라 단순 비례로는 안 맞는다. */
function needleAngle(splitAngle: number) {
  const point = arcPoint(splitAngle)
  const radian = Math.atan2(point.x - ARC_CENTER_X, NEEDLE_PIVOT_Y - point.y)
  return Math.round(((radian * 180) / Math.PI) * 100) / 100
}

/** 최신 Figma 개발 시안의 게이지형 막상막하. 바꿔보기는 두 사건을 실제로 교환한다. */
function CloseCallSection({ cta }: CloseCallSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentCase = closeCallCases[currentIndex]
  const nextCase = closeCallCases[(currentIndex + 1) % closeCallCases.length]
  const gap = Math.abs(currentCase.leftPercent - currentCase.rightPercent)
  /*
   * 게이지는 실제 비율을 그대로 그린다.
   * 반원 180도를 100%로 보고, 파랑이 왼쪽부터 leftPercent만큼 차지한다.
   * 바늘은 화면에서 색이 갈려 보이는 자리(계산상 경계 + 시안에서 잰 몫)에 서고,
   * 그 자리를 중심으로 조금씩 흔들린다.
   */
  const splitAngle = 180 - currentCase.leftPercent * 1.8
  const gaugeStyle = {
    '--close-needle-angle': String(needleAngle(splitAngle + NEEDLE_AIM_OFFSET)) + 'deg',
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
          {/* 눈금은 둥근 끝을 살려야 해서 conic-gradient 대신 선(stroke) 두 개로 그린다. */}
          <svg className="close-card__arc" viewBox="0 0 309 191" aria-hidden="true" focusable="false">
            <path className="close-card__arc-left" d={arcPath(180, splitAngle)} />
            <path className="close-card__arc-right" d={arcPath(splitAngle, 0)} />
          </svg>
          {/* 겉은 실제 비율 각도, 속 <i>는 계속 흔들리는 몫. 둘을 나눠야 서로 안 엉킨다. */}
          <span className="close-card__needle" aria-hidden="true"><i /></span>
          <span className="close-card__knob" aria-hidden="true" />
          <img className="close-card__mascot" src={mascot} alt="" />
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
