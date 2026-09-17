import type { ReactNode } from 'react'
import submittedCaseFolder from '../../assets/submit/submitted-case-folder.svg'
import './CaseFolderCard.css'

type CaseFolderCardProps = {
  children: ReactNode
  className?: string
  paperClassName?: string
}

function CaseFolderCard({ children, className = '', paperClassName = '' }: CaseFolderCardProps) {
  return (
    <div className={`case-folder-card ${className}`.trim()}>
      <img className="case-folder-card__art" src={submittedCaseFolder} alt="" aria-hidden="true" />
      <div className={`case-folder-card__paper ${paperClassName}`.trim()}>{children}</div>
    </div>
  )
}

export default CaseFolderCard
