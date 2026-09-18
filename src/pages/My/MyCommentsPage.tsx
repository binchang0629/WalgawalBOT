import { Link } from 'react-router-dom'
import { PATHS } from '../../routes/paths'
import backIcon from '../../assets/my/back.svg'
import dislikeIcon from '../../assets/case/result/dislike.svg'
import likeIcon from '../../assets/case/result/like.svg'
import EmptyCaseState from '../../components/common/EmptyCaseState'
import DemoRelativeTime from '../../components/common/DemoRelativeTime'
import useSession from '../../hooks/useSession'
import useDetailSlide from '../../hooks/useDetailSlide'
import { commentReactionCounts, readMyComments } from '../../utils/myComments'
import type { MyCommentRecord } from '../../utils/myComments'
import './MyCases.css'
import './MyComments.css'
import './MyPageTransitions.css'

function CommentCard({ record }: { record: MyCommentRecord }) {
  /*
   * 공감/반대 수는 그 댓글이 달린 화면과 같은 값을 쓴다.
   * 지훈처럼 미리 심어 둔 댓글은 정해진 수를, 직접 쓴 댓글은 id에서 계산한 수를 쓴다.
   * 내가 누른 공감/반대(+1)도 댓글 화면과 똑같이 얹는다.
   */
  const { likes, dislikes } = commentReactionCounts(record)
  /*
   * 사건에 단 댓글인지 후일담에 단 댓글인지.
   * 돌아갈 주소로 가른다 — 후일담 상세는 `/afterstory/:storyId` 하나뿐이다.
   * (`caseId`는 화면마다 붙이는 방식이 달라서 주소가 더 확실하다)
   */
  const isAfterStory = record.href.startsWith(`${PATHS.afterStory}/`)

  return (
    <li>
      {/*
        줄 전체가 링크다. 내가 어디에 단 댓글인지 확인하려면 결국 그 글로 가게 되므로,
        제목만 누르게 두지 않고 통째로 누를 수 있게 한다.
        `focusCommentId`를 함께 넘기면 도착한 화면이 글 맨 위가 아니라
        내 댓글이 있는 자리까지 스크롤한다. 댓글이 몇 페이지 뒤에 있어도 그 페이지로 넘어간다.
        `isAfterStory`는 위에서 이미 구했다.
      */}
      <Link
        className="my-comment-row"
        to={record.href}
        /*
         * 돌아올 곳도 같이 넘긴다. 안 넘기면 도착한 화면이 기본값(배심원 광장 · 왈가왈후)으로
         * 돌아가서, 목록을 보다 들어왔는데 엉뚱한 데로 나가게 된다.
         * 사건은 `returnTo`, 후일담은 `from`으로 받는다.
         */
        state={isAfterStory
          ? { from: PATHS.myComments, focusCommentId: record.id }
          : { returnTo: PATHS.myComments, focusCommentId: record.id }}
      >
        {/* 내가 쓴 말이 주인공이라 맨 위에 가장 크게 둔다. */}
        <p className="my-comment-row__body">{record.body}</p>

        {/* 어디에 쓴 댓글인지. 긴 제목은 남는 폭만큼만 쓰고 `...`으로 잘린다. */}
        <p className="my-comment-row__where">
          <span className={`my-comment-row__kind${isAfterStory ? ' is-story' : ''}`}>
            {isAfterStory ? '후일담' : '사건'}
          </span>
          <span className="my-comment-row__title">{record.caseTitle}</span>
        </p>

        <p className="my-comment-row__meta">
          <span>
            <img src={likeIcon} alt="" aria-hidden="true" />
            공감 {likes + (record.reaction === 'like' ? 1 : 0)}
          </span>
          <span>
            <img src={dislikeIcon} alt="" aria-hidden="true" />
            반대 {dislikes + (record.reaction === 'dislike' ? 1 : 0)}
          </span>
          <i aria-hidden="true" />
          <span><DemoRelativeTime timestamp={record.createdAt} /></span>
        </p>
      </Link>
    </li>
  )
}

function MyCommentsContent({ records }: { records: MyCommentRecord[] }) {
  // 마이페이지에서 오른쪽 → 왼쪽으로 들어오고, 돌아갈 때 왼쪽 → 오른쪽으로 빠진다.
  const slide = useDetailSlide()

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
