import SectionTitle from '../../../components/common/SectionTitle'
import { homeIcons } from '../homeAssets'
import { homeSectionTitles, recentCases } from '../../../data/common/homeContent'

/**
 * 최근 본 사건 — 메모지 두 장. Figma `1465:8017`
 *
 * 압정은 카드 위에 겹쳐 꽂힌 모양이라 카드 안이 아니라 카드 래퍼에 절대 위치로 둔다.
 */
const pinByTone = {
  blue: homeIcons.pinBlue,
  yellow: homeIcons.pinOrange,
} as const

function RecentCasesSection() {
  return (
    <section className="recent-section">
      <SectionTitle
        title={homeSectionTitles.recent.title}
        action={homeSectionTitles.recent.action}
        actionArrow={false}
      />

      <div className="recent-section__grid">
        {recentCases.map((item) => (
          <article className={`paper-card paper-card--${item.tone}`} key={item.id}>
            <img className="paper-card__pin" src={pinByTone[item.tone]} alt="" aria-hidden="true" />
            <span className="paper-card__tag">{item.tag}</span>
            <h3>
              {item.title.split('\n').map((line, index) => (
                <span key={index}>
                  {line}
                  <br />
                </span>
              ))}
            </h3>
            <p className="paper-card__summary">{item.summary}</p>
            <p className="paper-card__viewed">
              <img src={homeIcons.clockMini} alt="" aria-hidden="true" />
              {item.viewedAt}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentCasesSection
