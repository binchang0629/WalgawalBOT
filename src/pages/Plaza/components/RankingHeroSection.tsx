import { useRef, useState } from 'react'
import useToast from '../../../hooks/useToast'
import {
  jurorRanking,
  rankingPanel,
  rankingTabs,
  voterRanking,
  voterRankingPanel,
} from '../../../data/common/plazaContent'
import rankingArrow from '../../../assets/plaza/ranking-arrow.svg'
import podiumBase from '../../../assets/plaza/ranking-podium-base.png'
import trophyHead1 from '../../../assets/plaza/ranking-trophy-head-1.png'
import trophyHead2 from '../../../assets/plaza/ranking-trophy-head-2.png'
import trophyHead3 from '../../../assets/plaza/ranking-trophy-head-3.png'
import heroMascot from '../../../assets/plaza/ranking-mascot.png'
import heroTrophy from '../../../assets/plaza/ranking-trophy.png'

/** 트로피만 원본 이미지로 사용하고 순위·이름·포인트는 실제 텍스트로 겹친다. */
const PODIUM_ORDER = [2, 1, 3] as const

/*
 * 트로피 머리(캐릭터)는 원본 시상대 그림(ranking-podium.png, 1536 × 1024)에서 받침 기둥이
 * 가장 가는 목 높이로 잘라 따로 올렸다. 시상대 쪽에는 받침과 목만 남아 있다(ranking-podium-base.png).
 * 아래 값은 원본 그림 기준 %라서 시상대가 어떤 크기로 그려져도 제자리에 겹친다.
 * pivotX는 목 중심의 가로 위치(머리 그림 기준 %)로, 출렁일 때 이 점을 붙잡고 움직인다.
 */
const TROPHY_HEADS = [
  { rank: 2, src: trophyHead2, left: 10.286, top: 20.508, width: 22.396, height: 29.492, pivotX: 48.5 },
  { rank: 1, src: trophyHead1, left: 37.63, top: 6.836, width: 23.177, height: 32.031, pivotX: 51.4 },
  { rank: 3, src: trophyHead3, left: 66.146, top: 26.172, width: 27.083, height: 22.656, pivotX: 49.8 },
] as const

/*
 * 누르면 목을 축으로 살짝 눌렸다가(준비) 위로 쭉 당겨지고, 푸딩처럼 점점 작게 출렁이며 돌아온다.
 * 가로·세로를 반대로 바꿔 부피가 유지되는 것처럼 보이게 한다.
 * 속도 곡선은 구간마다 건다. 애니메이션 전체에 걸면 시간 흐름이 뒤틀려 12%·32% 지점의
 * 눌림·늘어남이 거의 나오지 않는다.
 */
const JELLY_EASE = 'cubic-bezier(.45, 0, .55, 1)'
const TROPHY_JELLY_KEYFRAMES: Keyframe[] = [
  { transform: 'scale(1, 1)', easing: JELLY_EASE },
  { transform: 'scale(1.14, 0.84)', offset: 0.12, easing: JELLY_EASE },
  { transform: 'scale(0.84, 1.2)', offset: 0.32, easing: JELLY_EASE },
  { transform: 'scale(1.1, 0.9)', offset: 0.5, easing: JELLY_EASE },
  { transform: 'scale(0.95, 1.06)', offset: 0.66, easing: JELLY_EASE },
  { transform: 'scale(1.03, 0.97)', offset: 0.8, easing: JELLY_EASE },
  { transform: 'scale(0.99, 1.01)', offset: 0.9, easing: JELLY_EASE },
  { transform: 'scale(1, 1)' },
]
const TROPHY_JELLY_MS = 820

function RankingHeroSection() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<(typeof rankingTabs)[number]['key']>(rankingTabs[0].key)
  const currentPanel = activeTab === 'voter' ? voterRankingPanel : rankingPanel
  const currentRanking = activeTab === 'voter' ? voterRanking : jurorRanking
  const valueUnit = activeTab === 'voter' ? '표' : 'pt'
  const jellyRef = useRef<Partial<Record<number, Animation>>>({})

  /** 트로피 머리를 푸딩처럼 출렁이게 한다. 출렁이는 중에 또 누르면 처음부터 다시 출렁인다. */
  const handleTrophyPress = (rank: number, head: HTMLImageElement | null) => {
    if (!head || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    jellyRef.current[rank]?.cancel()
    jellyRef.current[rank] = head.animate(TROPHY_JELLY_KEYFRAMES, { duration: TROPHY_JELLY_MS })
  }

  return (
    <section className="ranking-hero" aria-labelledby="plaza-title">
      <div className="ranking-hero__heading">
        <h1 id="plaza-title" className="ranking-hero__title">배심원 광장</h1>
        <span className="ranking-hero__badge">이달의 랭킹</span>
      </div>
      <div className="ranking-hero__headline">
        <p>이달의</p>
        <p><em>명판관을</em> 찾아라!</p>
      </div>
      <div className="ranking-hero__art" aria-hidden="true">
        <img className="ranking-hero__mascot" src={heroMascot} alt="" />
        <img className="ranking-hero__trophy" src={heroTrophy} alt="" />
      </div>
      <div className="ranking-hero__content">
        <div className="ranking-tabs" role="group" aria-label="랭킹 기준">
          {rankingTabs.map((tab) => (
            <button key={tab.key} type="button" aria-pressed={activeTab === tab.key}
              className={activeTab === tab.key ? 'ranking-tabs__tab is-active' : 'ranking-tabs__tab'}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        {/* key로 탭 패널을 다시 만들어 최초 진입의 시상대·폭죽·반짝임을 그대로 재생한다. */}
        <div className="ranking-panel" key={activeTab}>
          <div className="ranking-panel__header">
            <h2 className="ranking-panel__title">{currentPanel.title}</h2>
            <p className="ranking-panel__description">{currentPanel.description}</p>
          </div>
          <div className="ranking-podium">
            {/* 시상대와 트로피 머리를 한 묶음으로 둬서 등장할 때 함께 튀어 오른다. */}
            <div className="ranking-podium__image">
              <img className="ranking-podium__base" src={podiumBase} alt="" />
              {TROPHY_HEADS.map((head) => (
                <button
                  key={head.rank}
                  type="button"
                  className={`ranking-podium__head ranking-podium__head--${head.rank}`}
                  style={{ left: `${head.left}%`, top: `${head.top}%`, width: `${head.width}%`, height: `${head.height}%` }}
                  aria-label={`${head.rank}위 트로피 흔들기`}
                  onClick={(event) => handleTrophyPress(head.rank, event.currentTarget.querySelector('img'))}
                >
                  <img src={head.src} alt="" style={{ transformOrigin: `${head.pivotX}% 100%` }} />
                </button>
              ))}
            </div>
            <ol className="ranking-list" aria-label="이달의 명판관 순위">
              {PODIUM_ORDER.map((rank) => {
                const juror = currentRanking.find((item) => item.rank === rank)
                if (!juror) return null
                return (
                  <li key={rank} value={rank} className={`ranking-item ranking-item--${rank}`}>
                    <span className="ranking-item__badge">{rank}위</span>
                    <div className="ranking-item__copy">
                      <p className="ranking-item__nickname">{juror.nickname}</p>
                      <p className="ranking-item__point">{juror.point.toLocaleString('ko-KR')}<span>{valueUnit}</span></p>
                    </div>
                  </li>
                )
              })}
            </ol>
            <div className="ranking-trophy-shines" aria-hidden="true">
              <i className="ranking-trophy-shine ranking-trophy-shine--2" />
              <i className="ranking-trophy-shine ranking-trophy-shine--1" />
              <i className="ranking-trophy-shine ranking-trophy-shine--3" />
            </div>
            <div className="ranking-confetti" aria-hidden="true">
              {Array.from({ length: 14 }, (_, index) => <i key={index} />)}
            </div>
          </div>
        </div>
      </div>
      <button type="button" className="ranking-hero__link" onClick={() => showToast('랭킹 전체보기는 준비 중이에요.')}>
        랭킹 전체 보기
        <img src={rankingArrow} alt="" width={14} height={14} />
      </button>
    </section>
  )
}

export default RankingHeroSection
