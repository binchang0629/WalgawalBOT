import SectionTitle from '../../../components/common/SectionTitle'
import DemoRelativeTime from '../../../components/common/DemoRelativeTime'
import useToast from '../../../hooks/useToast'
import { homeIcons } from '../homeAssets'
import { homeSectionTitles, recentCases } from '../../../data/common/homeContent'
import { categoryDotColor } from '../../../data/common/plazaContent'

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
  const { showToast } = useToast()

  return (
    <section className="recent-section">
      <SectionTitle
        title={homeSectionTitles.recent.title}
      />

      <div className="recent-section__grid">
        {recentCases.map((item) => (
          <article className={`paper-card paper-card--${item.tone}`} key={item.id}>
            <img className="paper-card__pin" src={pinByTone[item.tone]} alt="" aria-hidden="true" />
            {/* 광장 사건 카드와 같은 분야 표기: 색 점 + 분야 색 글자 */}
            <span className="paper-card__tag" style={{ color: categoryDotColor[item.category] }}>{item.tag}</span>
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
              <DemoRelativeTime label={item.viewedAt} />
            </p>
            {/* 상세로 이어지는 화면이 아직 없어, 막상막하 카드처럼 카드 전체를 누르면 안내만 띄운다. */}
            <button
              type="button"
              className="paper-card__action"
              onClick={() => showToast('최근 본 사건 상세는 준비 중이에요.')}
              aria-label={`${item.title.replace('\n', ' ')} 상세 준비 중 안내`}
            />
          </article>
        ))}
      </div>
    </section>
  )
}

export default RecentCasesSection
