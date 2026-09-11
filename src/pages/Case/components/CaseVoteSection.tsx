import { Link } from 'react-router-dom'
import { weddingGiftCase } from '../../../data/common/caseDetailContent'
import type { WeddingGiftVoteId } from '../../../data/common/caseDetailContent'

type Choice = (typeof weddingGiftCase.choices)[number]

/**
 * 선택지 네 칸. 로그인 전에는 눌리지 않는다.
 * 두 상태가 같은 칸을 쓰기 때문에 여기만 공유하고, 그 아래는 상태별로 갈린다.
 */
function VoteChoices({
  choices,
  selectedVote,
  onSelect,
  disabled,
}: {
  choices: readonly Choice[]
  selectedVote: WeddingGiftVoteId | null
  onSelect?: (choiceId: WeddingGiftVoteId) => void
  disabled: boolean
}) {
  return (
    <div className="case-vote__grid">
      {choices.map((choice) => (
        <button
          key={choice.id}
          type="button"
          className={selectedVote === choice.id ? 'vote-choice is-selected' : 'vote-choice'}
          onClick={onSelect ? () => onSelect(choice.id) : undefined}
          disabled={disabled}
          aria-pressed={selectedVote === choice.id}
        >
          <span className={`vote-choice__artwork vote-choice__artwork--${choice.id}`}>
            <img src={choice.imageUrl} alt="" width={62} height={62} />
          </span>
          <span>{choice.label[0]}<br />{choice.label[1]}</span>
        </button>
      ))}
    </div>
  )
}

/**
 * 로그인 전 — 선택지는 보이되 흐려지고, 그 위에 로그인 안내가 덮인다.
 * 무엇을 고르게 되는지는 미리 보여주고, 참여만 막는다.
 */
export function CaseVoteLocked({ choices, loginPath }: { choices: readonly Choice[]; loginPath: string }) {
  return (
    <>
      <VoteChoices choices={choices} selectedVote={null} disabled />
      <div className="case-vote__login">
        <div>
          <p>로그인 후 투표할 수 있어요</p>
          <Link to={loginPath}>로그인하고 나도 투표하기</Link>
        </div>
      </div>
    </>
  )
}

/** 로그인 후 — 하나를 고르고 투표한다. 고르지 않고 누르면 안내가 뜬다. */
export function CaseVoteForm({
  choices,
  selectedVote,
  voteMessage,
  onSelect,
  onSubmit,
}: {
  choices: readonly Choice[]
  selectedVote: WeddingGiftVoteId | null
  voteMessage: string
  onSelect: (choiceId: WeddingGiftVoteId) => void
  onSubmit: () => void
}) {
  return (
    <>
      <VoteChoices choices={choices} selectedVote={selectedVote} onSelect={onSelect} disabled={false} />
      <button type="button" className="case-vote__submit" onClick={onSubmit}>
        투표하기
      </button>
      {voteMessage && (
        <p
          className={selectedVote ? 'case-vote__message is-success' : 'case-vote__message'}
          role="status"
        >
          {voteMessage}
        </p>
      )}
    </>
  )
}

/**
 * 당신의 판단은? — 로그인 전/후 두 상태를 가진다.
 *
 * 바깥 껍데기(제목·선택지 칸)는 공유하고 그 아래만 갈린다.
 * 로그인 안내가 선택지 위에 얹히는 구조라 두 상태가 같은 `.case-vote` 안에 있어야 한다.
 */
function CaseVoteSection({
  isAuthenticated,
  loginPath,
  selectedVote,
  voteMessage,
  onSelect,
  onSubmit,
}: {
  isAuthenticated: boolean
  loginPath: string
  selectedVote: WeddingGiftVoteId | null
  voteMessage: string
  onSelect: (choiceId: WeddingGiftVoteId) => void
  onSubmit: () => void
}) {
  const choices = weddingGiftCase.choices

  return (
    <section className="case-vote" aria-labelledby="case-vote-title">
      <div className="case-vote__heading">
        <h2 id="case-vote-title">당신의 판단은?</h2>
        <p>나의 판단은 익명으로 반영돼요.</p>
      </div>

      {isAuthenticated ? (
        <CaseVoteForm
          choices={choices}
          selectedVote={selectedVote}
          voteMessage={voteMessage}
          onSelect={onSelect}
          onSubmit={onSubmit}
        />
      ) : (
        <CaseVoteLocked choices={choices} loginPath={loginPath} />
      )}
    </section>
  )
}

export default CaseVoteSection
