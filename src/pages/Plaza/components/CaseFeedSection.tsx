import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  caseCategories,
  categoryDotColor,
  plazaCases,
  plazaSortOptions,
} from '../../../data/common/plazaContent'
import type { CaseCategory } from '../../../types'
import Pagination from '../../../components/common/Pagination'
import { toCaseDetail } from '../../../routes/paths'
import searchIcon from '../../../assets/icons/search-field.svg'
import chevronDown from '../../../assets/icons/chevron-down.svg'

type CategoryFilter = CaseCategory | '전체'

const CASES_PER_PAGE = 4

function CaseFeedSection() {
  const [category, setCategory] = useState<CategoryFilter>('전체')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredCases =
    category === '전체' ? plazaCases : plazaCases.filter((item) => item.category === category)
  const totalPages = Math.max(1, Math.ceil(filteredCases.length / CASES_PER_PAGE))
  const pageCases = filteredCases.slice(
    (currentPage - 1) * CASES_PER_PAGE,
    currentPage * CASES_PER_PAGE,
  )

  const handleCategoryChange = (nextCategory: CategoryFilter) => {
    setCategory(nextCategory)
    setCurrentPage(1)
  }

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
                onClick={() => handleCategoryChange(item)}
              >
                {item}
              </button>
            ))}
          </div>

          <ul className="case-list">
            {pageCases.map((item) => {
              const cardContent = (
                <>
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
                </>
              )

              return (
                <li className="case-card" key={item.id}>
                  {item.id === 'case-company-874' ? (
                    <Link
                      className="case-card__link"
                      to={toCaseDetail(item.id)}
                      aria-label={item.title.replace('\n', ' ') + ' 사건 상세 보기'}
                    >
                      {cardContent}
                    </Link>
                  ) : (
                    <div className="case-card__content">{cardContent}</div>
                  )}
                </li>
              )
            })}
          </ul>

          {pageCases.length === 0 && (
            <p className="case-list__empty">아직 이 카테고리에 올라온 사건이 없어요.</p>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          ariaLabel="사건 목록 페이지"
        />
      </div>
    </section>
  )
}

export default CaseFeedSection
