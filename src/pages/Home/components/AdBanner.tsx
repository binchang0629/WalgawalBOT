import banner from '../../../assets/home/figma/ad-panmung-school-banner.png'
import './AdBanner.css'

/** 개발 홈 최종 수정 > AdBox (1881:9599), 402 × 88.
 * 클릭하지 않는 광고 이미지. CookieRun 제목까지 포함한 Figma 원본 렌더다.
 * 이전 광고는 ./archive/LegacyAdBanner.tsx에 별도로 보관한다. */
function AdBanner() {
  return (
    <aside className="school-ad-banner" aria-label="광고">
      <img src={banner} width={402} height={88} alt="대화 조정 갈등 교육, 판멍 스쿨. 광고" />
    </aside>
  )
}

export default AdBanner
