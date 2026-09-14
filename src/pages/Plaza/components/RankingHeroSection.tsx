import { useState } from 'react'
import { jurorRanking, rankingPanel, rankingTabs } from '../../../data/common/plazaContent'
import rankingArrow from '../../../assets/plaza/ranking-arrow.svg'
import podium from '../../../assets/plaza/ranking-podium.png'
import heroMascot from '../../../assets/plaza/ranking-mascot.png'
import heroTrophy from '../../../assets/plaza/ranking-trophy.png'

/** 트로피만 원본 이미지로 사용하고 순위·이름·포인트는 실제 텍스트로 겹친다. */
const PODIUM_ORDER = [2, 1, 3] as const

function RankingHeroSection() {
  const [activeTab, setActiveTab] = useState<string>(rankingTabs[0].key)

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
        {/* 탭별 데이터 시안은 미제공이므로 기존 선택 상태 동작을 유지한다. */}
        <div className="ranking-tabs" role="group" aria-label="랭킹 기준">
          {rankingTabs.map((tab) => (
            <button key={tab.key} type="button" aria-pressed={activeTab === tab.key}
              className={activeTab === tab.key ? 'ranking-tabs__tab is-active' : 'ranking-tabs__tab'}
              onClick={() => setActiveTab(tab.key)}>
              {tab.label}
            </button>
          ))}
        </div>
        <div className="ranking-panel">
          <div className="ranking-panel__header">
            <h2 className="ranking-panel__title">{rankingPanel.title}</h2>
            <p className="ranking-panel__description">{rankingPanel.description}</p>
          </div>
          <div className="ranking-podium">
            <img className="ranking-podium__image" src={podium} alt="" />
            <ol className="ranking-list" aria-label="이달의 명판관 순위">
              {PODIUM_ORDER.map((rank) => {
                const juror = jurorRanking.find((item) => item.rank === rank)
                if (!juror) return null
                return (
                  <li key={rank} value={rank} className={`ranking-item ranking-item--${rank}`}>
                    <span className="ranking-item__badge">{rank}위</span>
                    <div className="ranking-item__copy">
                      <p className="ranking-item__nickname">{juror.nickname}</p>
                      <p className="ranking-item__point">{juror.point}<span>pt</span></p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </div>
        </div>
      </div>
      <button type="button" className="ranking-hero__link" aria-disabled="true" title="전체 랭킹은 준비 중이에요">
        랭킹 전체 보기
        <img src={rankingArrow} alt="" width={14} height={14} />
      </button>
    </section>
  )
}

export default RankingHeroSection
