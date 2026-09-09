import { useState } from 'react'
import { jurorRanking, rankingPanel, rankingTabs } from '../../../data/common/plazaContent'
import tailArrowRight from '../../../assets/icons/tail-arrow-right.svg'
import rank1Mascot from '../../../assets/plaza/rank-1.png'
import rank2Mascot from '../../../assets/plaza/rank-2.png'
import rank3Mascot from '../../../assets/plaza/rank-3.png'
import heroMascot from '../../../assets/plaza/hero-mascot.png'
import heroTrophy from '../../../assets/plaza/hero-trophy.png'

/**
 * 이달의 명판관 랭킹 히어로.
 * Figma `RankingHeroSection` (1301:9117) 기준.
 *
 * 탭 전환 뒤의 화면은 시안에 없어서 선택 상태만 로컬로 표현한다.
 * 없는 화면을 만들어 채우지 않는다. (PROJECT_SPEC.md §1)
 *
 * 마스코트 세 개는 모두 배경 없는 PNG다.
 * 처음 내보낸 SVG에는 시상대 카드와 같은 색의 원형 배경이 함께 들어가 있어
 * 캐릭터가 그만큼 작아 보였다. 시안에는 그 원이 없다.
 * 히어로는 시안의 `캐릭터 > hero`가 판멍이와 트로피 두 장을 겹쳐 놓은 구성이라
 * 합친 이미지 대신 두 장을 그대로 두고 CSS로 겹친다. 위치 조정이 쉬워진다.
 * 배경은 Plaza.css에서 `.ranking-hero`에 깔린다.
 */

/** 시상대 배치 순서. 가운데가 1위다. */
const PODIUM_ORDER = [2, 1, 3] as const

const RANK_MASCOT: Record<number, string> = {
  1: rank1Mascot,
  2: rank2Mascot,
  3: rank3Mascot,
}

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

      {/* 판멍이 뒤, 트로피 앞. 시안의 hero 프레임(160×110) 배치를 그대로 옮겼다. */}
      <div className="ranking-hero__art" aria-hidden="true">
        <img className="ranking-hero__mascot" src={heroMascot} alt="" />
        <img className="ranking-hero__trophy" src={heroTrophy} alt="" />
      </div>

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
                  {/*
                    시안은 마스코트 상자(82×66, 1위만 82×78) 안에 캐릭터를 작게 앉힌다.
                    상자를 그대로 두고 캐릭터만 순위별 크기로 넣는다.
                  */}
                  <span className="ranking-item__mascot-wrap">
                    <img className="ranking-item__mascot" src={RANK_MASCOT[rank]} alt="" />
                  </span>
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
