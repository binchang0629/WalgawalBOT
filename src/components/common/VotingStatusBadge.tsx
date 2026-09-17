import './VotingStatusBadge.css'

/** 진행 중인 사건에 공통으로 쓰는 실시간 투표 표시. */
function VotingStatusBadge() {
  return (
    <span className="voting-status-badge">
      <i className="voting-status-badge__dot" aria-hidden="true" />
      투표 중
    </span>
  )
}

export default VotingStatusBadge
