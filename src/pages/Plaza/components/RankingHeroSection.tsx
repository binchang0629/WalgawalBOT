import { useState } from 'react'
import useToast from '../../../hooks/useToast'
import {
  jurorRanking,
  rankingPanel,
  rankingTabs,
  voterRanking,
  voterRankingPanel,
} from '../../../data/common/plazaContent'
import rankingArrow from '../../../assets/plaza/ranking-arrow.svg'
import podium from '../../../assets/plaza/ranking-podium.png'
import heroMascot from '../../../assets/plaza/ranking-mascot.png'
import heroTrophy from '../../../assets/plaza/ranking-trophy.png'

/** 트로피만 원본 이미지로 사용하고 순위·이름·포인트는 실제 텍스트로 겹친다. */
const PODIUM_ORDER = [2, 1, 3] as const

function RankingHeroSection() {
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<(typeof rankingTabs)[number]['key']>(rankingTabs[0].key)
  const currentPanel = activeTab === 'voter' ? voterRankingPanel : rankingPanel
  const currentRanking = activeTab === 'voter' ? voterRanking : jurorRanking
  const valueUnit = activeTab === 'voter' ? '표' : 'pt'

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
            <img className="ranking-podium__image" src={podium} alt="" />
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
