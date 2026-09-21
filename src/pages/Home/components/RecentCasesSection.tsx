import { useState } from 'react'
import { Link } from 'react-router-dom'
import SectionTitle from '../../../components/common/SectionTitle'
import DemoRelativeTime from '../../../components/common/DemoRelativeTime'
import useSession from '../../../hooks/useSession'
import { homeIcons } from '../homeAssets'
import { homeSectionTitles } from '../../../data/common/homeContent'
import { getRecentCaseCard } from '../../../data/common/plazaCaseStories'
import { categoryDotColor } from '../../../data/common/plazaContent'
import { PATHS, toCaseDetail } from '../../../routes/paths'
import { readRecentCaseViews } from '../../../utils/recentViewedCases'

/**
 * 최근 본 사건 — 메모지 두 장. Figma `1465:8017`
 *
 * 압정은 카드 위에 겹쳐 꽂힌 모양이라 카드 안이 아니라 카드 래퍼에 절대 위치로 둔다.
 *
 * 시안용 두 건을 코드에 박아 두던 것을 실제 열람 기록으로 바꿨다. 사건 상세를 연 순서대로
 * 최신 두 건이 올라오고, 한 번도 연 적이 없으면 섹션을 그리지 않는다. 가입 직후 서아가 그 경우다.
 *
 * 저장소 읽기는 `useState`의 첫 계산으로 한 번만 한다. 렌더 도중 읽으면 순수하지 않고,
 * 홈은 사건에 들어갔다 오면 다시 마운트돼 그때 새로 읽힌다.
 * 계정 전환은 마운트가 유지되므로 부모(`HomePage`)가 `key={personaId}`로 새로 만들어 준다.
 */
/**
 * 시안이 메모지 두 장이라 최신 두 건만 보여준다. 기록은 더 쌓여도 화면은 늘 두 장까지다.
 * 자리마다 압정 색이 정해져 있다 — 왼쪽 파랑, 오른쪽 노랑. 어떤 사건이 오든 자리로 정한다.
 */
const TONE_BY_SLOT = ['blue', 'yellow'] as const
const MAX_CARDS = TONE_BY_SLOT.length

function RecentCasesSection() {
  const { personaId } = useSession()
  const [views] = useState(() => readRecentCaseViews(personaId))

  const cards = views
    .map((view) => {
      const card = getRecentCaseCard(view.id)
      return card ? { ...card, viewedAt: view.at } : null
    })
    .filter((card) => card !== null)
    .slice(0, MAX_CARDS)

  // 아직 아무 사건도 열지 않았으면 섹션을 통째로 숨긴다.
  if (cards.length === 0) return null

  return (
    <section className="recent-section">
      <SectionTitle
        title={homeSectionTitles.recent.title}
      />

      <div className="recent-section__grid">
        {cards.map((item, index) => {
          const tone = TONE_BY_SLOT[index]
          return (
            <article className={`paper-card paper-card--${tone}`} key={item.id}>
              <img className="paper-card__pin" src={tone === 'blue' ? homeIcons.pinBlue : homeIcons.pinOrange} alt="" aria-hidden="true" />
              {/* 광장 사건 카드와 같은 분야 표기: 색 점 + 분야 색 글자 */}
              <span className="paper-card__tag" style={{ color: categoryDotColor[item.category] }}>{item.tag}</span>
              {/*
                시안은 두 줄로 손으로 끊어 둔 제목이었지만, 이제는 어떤 사건이든 올 수 있어
                원래의 줄바꿈을 지우고 카드 폭에 맞춰 흘린다. 두 줄을 넘는 만큼은 CSS가 말줄임으로 끊는다.
              */}
              <h3>{item.title.replace('\n', ' ')}</h3>
              <p className="paper-card__summary">{item.summary}</p>
              <p className="paper-card__viewed">
                <img src={homeIcons.clockMini} alt="" aria-hidden="true" />
                <DemoRelativeTime timestamp={item.viewedAt} />
              </p>
              {/* 실제로 열어 본 사건이라 상세가 반드시 있다. 카드 전체가 그 사건으로 간다. */}
              <Link
                className="paper-card__action"
                to={toCaseDetail(item.id)}
                state={{ returnTo: PATHS.home, homeCaseId: item.id, entryMotion: 'slide-forward' }}
                aria-label={`${item.title.replace('\n', ' ')} 사건 다시 보기`}
              />
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default RecentCasesSection
