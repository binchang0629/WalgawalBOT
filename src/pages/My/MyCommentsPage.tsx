import { Link, useLocation } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import backIcon from '../../assets/my/back.svg'
import chevronIcon from '../../assets/my/chevron.svg'
import EmptyCaseState from '../../components/common/EmptyCaseState'
import DemoRelativeTime from '../../components/common/DemoRelativeTime'
import useSession from '../../hooks/useSession'
import useDetailSlide from '../../hooks/useDetailSlide'
import { readMyComments } from '../../utils/myComments'
import type { MyCommentRecord } from '../../utils/myComments'
import './MyCases.css'
import './MyComments.css'
import './MyPageTransitions.css'

function CommentCard({ record }: { record: MyCommentRecord }) {
  return (
    <li>
      {/*
        카드 전체가 링크다. 내가 어디에 단 댓글인지 확인하려면 결국 그 사건으로 가게 되므로,
        제목만 누르게 두지 않고 카드를 통째로 누를 수 있게 한다.
      */}
      <Link
        className="my-comment-card"
        to={record.href}
        state={{ from: PATHS.myComments }}
      >
        <span className="my-comment-card__case">
          <span>{record.caseTitle}</span>
          <img src={chevronIcon} alt="" aria-hidden="true" />
        </span>
        <p className="my-comment-card__body">{record.body}</p>
        <span className="my-comment-card__time"><DemoRelativeTime timestamp={record.createdAt} /></span>
      </Link>
    </li>
  )
}

function MyCommentsContent({ records }: { records: MyCommentRecord[] }) {
  const location = useLocation()

  const skipEnter =
    (location.state as { skipDetailSlideEnter?: boolean } | null)?.skipDetailSlideEnter === true

  const slide = useDetailSlide(!skipEnter)

  return (
    <main className={`my-cases-page ${slide.className}`}>
      <header className="my-sub-header">
        <button type="button" onClick={() => slide.leave(PATHS.my)} aria-label="마이페이지로 돌아가기">
          <img src={backIcon} alt="" />
        </button>
        <h1>내가 쓴 댓글</h1>
        <span aria-hidden="true" />
      </header>

      <div
        className={`my-cases-page__content${records.length === 0 ? ' my-cases-page__content--empty' : ''}`}
        role="region"
        aria-label="내가 쓴 댓글 목록"
        tabIndex={0}
      >
        <p className="my-cases-page__breadcrumb">MY <span aria-hidden="true">&gt;</span><span>나의 활동</span></p>
        <h2>내가 쓴 댓글</h2>

        {records.length === 0 ? (
          <EmptyCaseState
            titleId="my-comments-empty-title"
            title="아직 쓴 댓글이 없어요"
            description="사건이나 후일담에 댓글을 남기면 여기에 모여요."
            actionLabel="사건 보러 가기"
            actionTo={PATHS.plaza}
          />
        ) : (
          <>
            <p className="my-comments-page__count">모두 {records.length}개</p>
            <ul className="my-comments-page__list">
              {records.map((record) => <CommentCard key={record.id} record={record} />)}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}

/**
 * MY > 나의 활동 > 내가 쓴 댓글.
 *
 * 로그인한 계정으로 실제 등록한 댓글만 보여준다. 기록은 계정별로 나뉘어 있어서
 * 계정을 바꾸면 그 계정이 쓴 댓글만 나온다. 그래서 personaId로 다시 마운트한다.
 */
function MyCommentsPage() {
  const { personaId } = useSession()
  return <MyCommentsContent key={personaId} records={readMyComments(personaId)} />
}

export default MyCommentsPage
