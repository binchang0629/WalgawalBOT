import { Link } from 'react-router-dom'
import panmungEmptyCases from '../../assets/afterstory/panmung-empty-cases.png'
import { PATHS } from '../../routes/paths'
import './EmptyCaseState.css'

type EmptyCaseStateProps = {
  description: string
  titleId: string
}

function EmptyCaseState({ description, titleId }: EmptyCaseStateProps) {
  return (
    <section className="empty-case-state" aria-labelledby={titleId}>
      <img src={panmungEmptyCases} alt="" width={168} height={168} />
      <h3 id={titleId}>아직 접수한 사건이 없어요</h3>
      <p>{description}</p>
      <Link to={PATHS.caseSubmit}>사건 접수하기</Link>
    </section>
  )
}

export default EmptyCaseState
