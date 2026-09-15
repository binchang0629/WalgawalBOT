import banner from '../../../assets/home/figma/ad-panmung-school-banner-3x.webp'
import './AdBanner.css'

/** 개발 홈 최종 수정 > AdBox (1881:9599), 402 × 88.
 * 클릭하지 않는 광고 이미지. CookieRun 제목까지 포함한 Figma 원본 렌더다.
 *
 * 3배(1206 × 264)로 다시 만든 그림을 쓴다. 이전 402 × 88짜리는 딱 1배라서
 * 아이폰(3배 화면)에서 흐렸다. 배경은 원본 일러스트(2928 × 936)에서 Figma가
 * 쓰는 크롭 값 그대로 다시 잘랐고, 글자와 AD 배지는 새로 조판했다.
 * 이전 파일은 ad-panmung-school-banner.png로 남겨 두었다.
 *
 * 이전 광고는 ./archive/LegacyAdBanner.tsx에 별도로 보관한다. */
function AdBanner() {
  return (
    <aside className="school-ad-banner" aria-label="광고">
      <img src={banner} width={1206} height={264} alt="대화 조정 갈등 교육, 판멍 스쿨. 광고" />
    </aside>
  )
}

export default AdBanner
