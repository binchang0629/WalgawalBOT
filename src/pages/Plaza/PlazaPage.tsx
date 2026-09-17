import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import RankingHeroSection from './components/RankingHeroSection'
import CaseFeedSection from './components/CaseFeedSection'
import TopBar from '../../components/common/TopBar'
import { clearPlazaReturnState, readPlazaReturnState } from '../../utils/plazaReturnState'
import './Plaza.css'

/**
 * 배심원 광장.
 * 사용자 지정 Figma 광장 (2101:21799) 기준.
 *
 * 페이지는 섹션을 조립하는 역할만 한다. (PROJECT_SPEC.md §7-2)
 * 시스템 상태바는 DeviceFrame, 하단바는 MainLayout이 담당한다.
 */
function PlazaPage() {
  const [searchParams] = useSearchParams()
  const pageRef = useRef<HTMLElement>(null)
  const [returnState] = useState(readPlazaReturnState)
  const isCaseOnly = searchParams.get('section') === 'cases'

  useEffect(() => {
    if (returnState) clearPlazaReturnState()
  }, [returnState])

  // 왈가왈후 CTA처럼 목록 전용으로 진입했을 땐, 직전 화면의 스크롤 위치를 이어받지 않는다.
  useEffect(() => {
    if (!isCaseOnly || returnState) return
    pageRef.current?.closest<HTMLElement>('.main-layout__scroll')?.scrollTo({ top: 0 })
  }, [isCaseOnly, returnState])

  return (
    <main className={isCaseOnly ? 'plaza-screen plaza-screen--case-only' : 'plaza-screen'} ref={pageRef}>
      <TopBar title="배심원 광장" />
      {!isCaseOnly && <RankingHeroSection />}
      <CaseFeedSection restoreState={returnState} />
    </main>
  )
}

export default PlazaPage
