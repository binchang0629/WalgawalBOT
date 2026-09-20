import { PATHS } from '../../routes/paths'

/*
 * 오른쪽 아래에 떠 있는 두 버튼(맨 위로 · 챗봇)이 같은 기준으로 자리를 잡도록 모은 규칙.
 * 두 버튼은 항상 세로로 쌓인다. 챗봇이 아래, 맨 위로 버튼이 그 위다.
 */

/**
 * 버튼이 따라가는 스크롤 영역.
 * 공통 영역 외에, 헤더를 고정하고 본문만 스크롤하는 화면의 영역을 더한다.
 * 새 화면이 자체 스크롤 영역을 쓰면 여기에 추가해야 맨 위로 버튼이 나타난다.
 */
export const FLOATING_SCROLL_SELECTOR = [
  '.main-layout__scroll',
  '.afterstory-detail__scroll', // 후일담 상세
  '.my-cases-page__content', // MY > 내가 접수한 사건 · 배심 참여 · 내가 쓴 댓글
  '.my-case-result-page__content', // MY > 내 사건 결과
].join(', ')

/**
 * 하단 내비게이션이 있는 화면인지.
 * 있으면 두 버튼을 내비 위로 올린다. 빠뜨리면 버튼이 `MY` 같은 메뉴를 가린다.
 */
export function hasBottomNavigation(pathname: string) {
  return [
    PATHS.home,
    PATHS.plaza,
    PATHS.afterStory,
    PATHS.afterStoryMine,
    PATHS.afterStoryMineStories,
    PATHS.my,
  ].some((route) => route === pathname)
    // 공개 후일담 상세도 MainLayout의 하단 내비게이션을 사용한다.
    || /^\/afterstory\/[^/]+$/.test(pathname)
    || /^\/cases\/[^/]+(?:\/result)?$/.test(pathname)
}
