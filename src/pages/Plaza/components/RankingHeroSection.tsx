import { useState } from 'react'
import { jurorRanking, rankingPanel, rankingTabs } from '../../../data/common/plazaContent'
import tailArrowRight from '../../../assets/icons/tail-arrow-right.svg'

/**
 * 이달의 명판관 랭킹 히어로.
 * Figma `RankingHeroSection` (1301:9117) 기준.
 *
 * 탭 전환 뒤의 화면은 시안에 없어서 선택 상태만 로컬로 표현한다.
 * 없는 화면을 만들어 채우지 않는다. (PROJECT_SPEC.md §1)
 *
 * TODO(에셋): 배경 이미지·판멍이·트로피·1~3위 마스코트는 아직 내보내지 않았다.
 *   `src/assets/plaza/`에 들어오면 각 placeholder를 <img>로 바꾼다.
 */

/** 시상대 배치 순서. 가운데가 1위다. */
const PODIUM_ORDER = [2, 1, 3] as const

function RankingHeroSection() {
  const [activeTab, setActiveTab] = useState<string>(rankingTabs[0].key)

  return (
    <section className="ranking-hero">
      <div className="ranking-hero__heading">
        <h2 className="ranking-hero__title">배심원 광장</h2>
        <span className="ranking-hero__badge">이달의 랭킹</span>
      </div>

      <div className="ranking-hero__headline">
        <p>이달의</p>
        <p>
          <em>명판관을</em> 찾아라!
        </p>
      </div>

      {/* TODO(에셋): hero-mascot.png · hero-trophy.png */}
      <div className="ranking-hero__art" aria-hidden="true" />

      <div className="ranking-hero__content">
        <div className="ranking-tabs" role="tablist" aria-label="랭킹 기준">
          {rankingTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.key}
              className={activeTab === tab.key ? 'ranking-tabs__tab is-active' : 'ranking-tabs__tab'}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="ranking-panel">
          <div className="ranking-panel__header">
            <p className="ranking-panel__title">{rankingPanel.title}</p>
            <p className="ranking-panel__description">{rankingPanel.description}</p>
          </div>

          <ol className="ranking-list">
            {PODIUM_ORDER.map((rank) => {
              const juror = jurorRanking.find((item) => item.rank === rank)
              if (!juror) return null

              return (
                <li key={rank} className={`ranking-item ranking-item--${rank}`}>
                  <span className="ranking-item__badge">{rank}위</span>
                  {/* TODO(에셋): rank-{n}.png */}
                  <span className="ranking-item__mascot" aria-hidden="true" />
                  <p className="ranking-item__nickname">{juror.nickname}</p>
                  <p className="ranking-item__point">{juror.point.toLocaleString()}pt</p>
                </li>
              )
            })}
          </ol>
        </div>
      </div>

      <button type="button" className="ranking-hero__link">
        랭킹 보러가기
        <span
          className="ranking-hero__link-icon"
          style={{ maskImage: `url(${tailArrowRight})`, WebkitMaskImage: `url(${tailArrowRight})` }}
          aria-hidden="true"
        />
      </button>
    </section>
  )
}

export default RankingHeroSection
