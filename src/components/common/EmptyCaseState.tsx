import { Link } from 'react-router-dom'
import panmungEmptyCases from '../../assets/afterstory/panmung-empty-cases.png'
import { PATHS } from '../../routes/paths'
import './EmptyCaseState.css'

type EmptyCaseStateProps = {
  description: string
  titleId: string
  /** 제목과 버튼은 사건 접수 안내가 기본이다. 다른 화면은 그 화면에 맞는 값을 넘긴다. */
  title?: string
  actionLabel?: string
  actionTo?: string
}

function EmptyCaseState({
  description,
  titleId,
  title = '아직 접수한 사건이 없어요',
  actionLabel = '사건 접수하기',
  actionTo = PATHS.caseSubmit,
}: EmptyCaseStateProps) {
  return (
    <section className="empty-case-state" aria-labelledby={titleId}>
      <img src={panmungEmptyCases} alt="" width={168} height={168} />
      <h3 id={titleId}>{title}</h3>
      <p>{description}</p>
      <Link to={actionTo}>{actionLabel}</Link>
    </section>
  )
}

export default EmptyCaseState
