import { homeImages } from '../homeAssets'
import { adBanner } from '../../../data/common/homeContent'

/**
 * AdBox — 광고 자리. Figma `1402:7196`
 *
 * 실제 광고가 아니라 시안에 있는 자리 표시다. 링크를 걸지 않는다.
 * 제목의 Cafe24 Ssukssuk은 이 배너에만 쓰는 장식 폰트다. (PROJECT_SPEC.md §1-2)
 */
function AdBanner() {
  return (
    <aside className="ad-banner" aria-label="광고">
      <div className="ad-banner__copy">
        <p className="ad-banner__lead">{adBanner.lead}</p>
        <strong className="ad-banner__title">{adBanner.title}</strong>
      </div>
      <img className="ad-banner__art" src={homeImages.adShell} alt="" aria-hidden="true" />
      <span className="ad-banner__label">{adBanner.label}</span>
    </aside>
  )
}

export default AdBanner
