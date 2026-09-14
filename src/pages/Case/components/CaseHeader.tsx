import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import backIcon from '../../../assets/case/back.svg'
import { PATHS } from '../../../routes/paths'
import './CaseHeader.css'

/** 사건 상세 계열 화면에서 공통으로 쓰는 상단 헤더. */
function CaseHeader({ title = '오늘의 사건' }: { title?: string }) {
  const navigate = useNavigate()
  const location = useLocation()
  const headerRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    headerRef.current?.closest('.main-layout__scroll')?.scrollTo({ top: 0 })
  }, [location.pathname])

  const handleBack = () => {
    if (location.key !== 'default') {
      navigate(-1)
      return
    }

    navigate(PATHS.plaza, { replace: true })
  }

  return (
    <header ref={headerRef} className="case-detail-header">
      <div className="case-detail-header__slot">
        <button type="button" className="case-detail-header__back" onClick={handleBack} aria-label="뒤로 가기">
          <img src={backIcon} alt="" width={24} height={24} />
        </button>
      </div>
      <h1 className="case-detail-header__title">{title}</h1>
      <div className="case-detail-header__slot" aria-hidden="true" />
    </header>
  )
}

export default CaseHeader
