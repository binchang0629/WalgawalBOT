import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * 댓글 한 건의 DOM id.
 *
 * 댓글 목록이 화면마다 따로 있어서(공용 CommentThread, 사건 결과, 종결 사건 결과)
 * 자리를 찾는 규칙은 여기 한곳에 둔다.
 */
export const commentAnchorId = (commentId: string) => `comment-${commentId}`

/**
 * MY > 내가 쓴 댓글에서 눌러 들어왔을 때, 글 맨 위가 아니라 그 댓글 자리로 옮겨 준다.
 *
 * 댓글은 5개씩 끊어 보여 주므로 내 댓글이 몇 페이지 뒤에 있을 수 있다.
 * 그래서 스크롤 전에 그 댓글이 들어 있는 페이지로 먼저 넘긴다.
 *
 * 돌아온 값은 잠깐 배경을 밝힐 댓글의 id다. 목록에 댓글이 여러 개라
 * 화면만 옮겨 주면 어느 것이 내 댓글인지 알기 어렵다.
 *
 * @param commentIds 정렬까지 끝난 전체 댓글 id. 페이지를 계산하려면 순서가 화면과 같아야 한다.
 * @param perPage    한 페이지에 보여 주는 개수.
 * @param goToPage   그 페이지로 넘기는 함수.
 */
export default function useFocusComment(
  commentIds: string[],
  perPage: number,
  goToPage: (page: number) => void,
): string | null {
  const location = useLocation()
  const focusCommentId = (location.state as { focusCommentId?: string } | null)?.focusCommentId ?? null
  const [focusedId, setFocusedId] = useState<string | null>(null)

  useEffect(() => {
    if (!focusCommentId) return
    const index = commentIds.indexOf(focusCommentId)
    // 지워졌거나 아직 없는 댓글이면 아무것도 하지 않는다. 글 맨 위에 그대로 머문다.
    if (index < 0) return

    goToPage(Math.floor(index / perPage) + 1)

    // 페이지를 넘긴 결과가 그려진 다음에야 그 자리가 생긴다.
    // 배경을 밝히는 것도 같이 미룬다. 페이지가 바뀌는 렌더에 겹쳐 넣으면 렌더가 한 번 더 돈다.
    const scroll = window.setTimeout(() => {
      setFocusedId(focusCommentId)
      document.getElementById(commentAnchorId(focusCommentId))
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 80)
    // 밝힌 배경은 찾고 나면 걷어 낸다. 계속 켜 두면 읽는 데 방해가 된다.
    const fade = window.setTimeout(() => setFocusedId(null), 2600)

    return () => {
      window.clearTimeout(scroll)
      window.clearTimeout(fade)
    }
    /*
     * commentIds는 렌더마다 새 배열이라 의존성에 넣으면 매번 다시 돈다.
     * 찾아 들어온 순간 한 번만 맞추면 되므로 focusCommentId만 본다.
     */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusCommentId])

  return focusedId
}
