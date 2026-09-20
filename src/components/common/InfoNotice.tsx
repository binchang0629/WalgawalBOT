import type { ReactNode } from 'react'
import infoIcon from '../../assets/my/account-info.svg'
import './InfoNotice.css'

interface InfoNoticeProps {
  children: ReactNode
  className?: string
}

/** 설정이나 상태 변경의 영향을 짧게 안내하는 공통 알림 카드. */
function InfoNotice({ children, className = '' }: InfoNoticeProps) {
  const classes = ['info-notice', className].filter(Boolean).join(' ')

  return (
    <aside className={classes}>
      <img src={infoIcon} alt="" aria-hidden="true" width={20} height={20} />
      <p>{children}</p>
    </aside>
  )
}

export default InfoNotice
