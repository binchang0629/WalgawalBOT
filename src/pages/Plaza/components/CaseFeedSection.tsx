import { useState } from 'react'
import {
  caseCategories,
  casePagination,
  categoryDotColor,
  plazaCases,
  plazaSortOptions,
} from '../../../data/common/plazaContent'
import type { CaseCategory } from '../../../types'
import searchIcon from '../../../assets/icons/search-field.svg'
import chevronDown from '../../../assets/icons/chevron-down.svg'
import pagePrev from '../../../assets/icons/page-prev.svg'
import pageNext from '../../../assets/icons/page-next.svg'

/**
 * 전체 사건 목록.
 * Figma `CaseFeedSection` (1301:9196) 기준.
 *
 * 카테고리 필터는 화면 로컬 상태로 동작한다.
 * 새로고침·공유해도 유지돼야 하는 조건은 URL 쿼리로 옮겨야 하지만(§7-7),
 * 사건 상세 화면이 아직 없어 목록 → 상세 → 뒤로가기 흐름을 만들 수 없다.
 * 상세가 확정되면 useSearchParams로 옮긴다.
 *
 * 정렬·검색·페이지네이션은 시안에 동작이 정의돼 있지 않아 표시만 한다.
 * 눌러도 상태가 변하지 않는 형식적 구현을 하지 않기 위해, 아직 비활성으로 둔다. (PROJECT_SPEC.md §6)
 */

type CategoryFilter = CaseCategory | '전체'

function CaseFeedSection() {
  const [category, setCategory] = useState<CategoryFilter>('전체')

  const visibleCases =
    category === '전체' ? plazaCases : plazaCases.filter((item) => item.category === category)

  return (
    <section className="case-feed">
      <div className="case-feed__header">
        <div>
          <h2 className="case-feed__title">전체 사건</h2>
          <p className="case-feed__description">다른 배심원들의 판단을 기다리는 이야기</p>
        </div>
        <button type="button" className="case-feed__sort" disabled title="정렬 동작은 시안 확정 후 연결됩니다">
          {plazaSortOptions[0].label}
          <img src={chevronDown} alt="" width={18} height={18} />
        </button>
      </div>

      <div className="case-search">
        <img src={searchIcon} alt="" width={24} height={24} />
        <input
          type="search"
          className="case-search__input"
          placeholder="사연, 사건 키워드 또는 AI 추천 검색..."
          disabled
          title="검색 동작은 시안 확정 후 연결됩니다"
        />
      </div>

      <div className="case-feed__body">
        <div className="case-feed__list-wrap">
          <div className="category-filter" role="group" aria-label="카테고리 필터">
            {caseCategories.map((item) => (
              <button
                key={item}
                type="button"
                className={category === item ? 'category-chip is-active' : 'category-chip'}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <ul className="case-list">
            {visibleCases.map((item) => (
              <li className="case-card" key={item.id}>
                <div className="case-card__meta">
                  <span className="case-card__category">
                    <i style={{ background: categoryDotColor[item.category] }} aria-hidden="true" />
                    <span style={{ color: categoryDotColor[item.category] }}>{item.tag}</span>
                  </span>
                  <span
                    className={
                      item.isVerdictAligned
                        ? 'case-card__verdict is-aligned'
                        : 'case-card__verdict'
                    }
                  >
                    AI와 배심원 의견 {item.isVerdictAligned ? '일치' : '불일치'}
                  </span>
                </div>

                <h3 className="case-card__title">
                  {item.title.split('\n').map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <p className="case-card__summary">{item.summary}</p>

                <div className="case-card__info">
                  <span>조회수 {item.viewCount}명</span>
                  <span>댓글 {item.commentCount}</span>
                </div>
              </li>
            ))}
          </ul>

          {visibleCases.length === 0 && (
            <p className="case-list__empty">아직 이 카테고리에 올라온 사건이 없어요.</p>
          )}
        </div>

        <nav className="case-pagination" aria-label="사건 목록 페이지">
          <button type="button" className="case-pagination__arrow" disabled aria-label="이전 페이지">
            <img src={pagePrev} alt="" width={24} height={24} />
          </button>
          <span className="case-pagination__pages">
            {Array.from({ length: casePagination.total }, (_, index) => index + 1).map((page) => (
              <button
                key={page}
                type="button"
                className={
                  page === casePagination.current
                    ? 'case-pagination__page is-active'
                    : 'case-pagination__page'
                }
                disabled
                aria-current={page === casePagination.current ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </span>
          <button type="button" className="case-pagination__arrow" disabled aria-label="다음 페이지">
            <img src={pageNext} alt="" width={24} height={24} />
          </button>
        </nav>
      </div>
    </section>
  )
}

export default CaseFeedSection
