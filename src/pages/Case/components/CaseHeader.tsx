import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import backIcon from '../../../assets/case/back.svg'
import { PATHS } from '../../../routes/paths'
import { markPlazaReturnReady } from '../../../utils/plazaReturnState'
import './CaseHeader.css'

/**
 * 사건 상세 계열 화면에서 공통으로 쓰는 상단 헤더.
 *
 * `onBack`을 주면 뒤로 가기를 그쪽에 맡긴다.
 * MY에서 들어온 화면처럼 나가는 애니메이션을 재생한 뒤 이동해야 하는 경우에 쓴다.
 */
function CaseHeader({ title = '오늘의 사건', backTo, onBack }: { title?: string; backTo?: string; onBack?: () => void }) {
  const navigate = useNavigate()
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    headerRef.current?.closest('.main-layout__scroll')?.scrollTo({ top: 0 })
  }, [location.pathname])

  useEffect(() => {
    if (!(location.state as { fromPlaza?: boolean } | null)?.fromPlaza) return

    const handleBrowserBack = () => {
      if (window.location.pathname === PATHS.plaza) markPlazaReturnReady()
    }
    window.addEventListener('popstate', handleBrowserBack)
    return () => window.removeEventListener('popstate', handleBrowserBack)
  }, [location.state])

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    if (backTo) {
      if (backTo === PATHS.myJury && location.key !== 'default') {
        // MY 목록에서 연 사건은 기존 기록으로 돌아가야 다시 뒤로 갔을 때 상세가 반복되지 않는다.
        navigate(location.pathname.endsWith('/result') ? -2 : -1)
        return
      }
      if (backTo === PATHS.plaza && (location.state as { fromPlaza?: boolean } | null)?.fromPlaza) {
        markPlazaReturnReady()
      }
      const homeCaseId = (location.state as { homeCaseId?: string } | null)?.homeCaseId
      navigate(backTo, { state: backTo === PATHS.home ? { restoreHomeScroll: true, homeCaseId } : undefined })
      return
    }

    if (location.key !== 'default') {
      if ((location.state as { fromPlaza?: boolean } | null)?.fromPlaza) {
        markPlazaReturnReady()
      }
      navigate(-1)
      return
    }

    navigate(PATHS.plaza, { replace: true })
  }

  return (
    <header ref={headerRef} className="case-detail-header">
      <div className="case-detail-header__slot">
        <button
          type="button"
          className="case-detail-header__back"
          onClick={handleBack}
          aria-label="뒤로 가기"
        >
          <img src={backIcon} alt="" width={24} height={24} />
        </button>
      </div>
      <h1 className="case-detail-header__title">{title}</h1>
      <div className="case-detail-header__slot" aria-hidden="true" />
    </header>
  )
}

export default CaseHeader
