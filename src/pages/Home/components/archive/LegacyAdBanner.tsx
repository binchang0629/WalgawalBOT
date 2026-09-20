import shell from '../../../../assets/home/archive/ad-shell-original.png'
import './LegacyAdBanner.css'

/** 2026-09-11 교체 전 도라에몽쉘 광고 보관본. import 후 렌더하면 다시 사용할 수 있다. */
function LegacyAdBanner() {
  return (
    <aside className="legacy-ad-banner" aria-label="광고">
      <div className="legacy-ad-banner__copy">
        <p className="legacy-ad-banner__lead">둘이서 나누는 행복,</p>
        <strong className="legacy-ad-banner__title">도라에몽쉘</strong>
      </div>
      <img className="legacy-ad-banner__art" src={shell} alt="" aria-hidden="true" />
      <span className="legacy-ad-banner__label">AD</span>
    </aside>
  )
}

export default LegacyAdBanner
