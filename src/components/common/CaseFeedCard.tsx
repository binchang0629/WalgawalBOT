import { Link } from 'react-router-dom'
import type { PlazaCase } from '../../data/common/plazaContent'
import { categoryDotColor } from '../../data/common/plazaContent'
import { toCaseDetail } from '../../routes/paths'
import useSession from '../../hooks/useSession'
import { readThreadComments } from '../../utils/plazaComments'
import VotingStatusBadge from './VotingStatusBadge'

import './CaseFeedCard.css'

interface CaseFeedCardProps {
  item: PlazaCase
  index: number
  onOpen?: (caseId: string) => void
  returnTo?: string
  fromPlaza?: boolean
}

/** 광장 전체 사건과 MY 배심 참여에서 함께 쓰는 사건 카드. */
function CaseFeedCard({ item, index, onOpen, returnTo, fromPlaza = false }: CaseFeedCardProps) {
  // 직접 단 댓글은 계정마다 따로 쌓인다. 그래서 지금 계정 기준으로 센다.
  const { personaId } = useSession()

  return (
    <li className="case-card" data-case-id={item.id} style={{ animationDelay: `${index * 90}ms` }}>
      <Link
        className="case-card__link"
        to={toCaseDetail(item.id)}
        state={{ fromPlaza, returnTo }}
        aria-label={`${item.title.replace('\n', ' ')} 사건 상세 보기`}
        onClick={(event) => {
          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          onOpen?.(item.id)
        }}
      >
        <div className="case-card__meta">
          <span className="case-card__category">
            <i style={{ background: categoryDotColor[item.category] }} aria-hidden="true" />
            <span style={{ color: categoryDotColor[item.category] }}>{item.tag}</span>
          </span>
          {item.status === 'voting' ? <VotingStatusBadge /> : (
            <span className={(item.verdictTone ?? (item.isVerdictAligned ? 'blue' : 'orange')) === 'blue'
              ? 'case-card__verdict is-blue' : 'case-card__verdict'}>
              AI와 배심원 의견 {item.isVerdictAligned ? '일치' : '불일치'}
            </span>
          )}
        </div>
        <h3 className="case-card__title">
          {item.title.split('\n').map((line) => <span key={line}>{line}</span>)}
        </h3>
        <p className="case-card__summary">{item.summary}</p>
        <div className="case-card__info">
          <span>조회수 {item.viewCount}</span>
          <span>댓글 {(item.commentCount ?? 0) + readThreadComments(personaId, item.id).length}</span>
        </div>
      </Link>
    </li>
  )
}

export default CaseFeedCard
