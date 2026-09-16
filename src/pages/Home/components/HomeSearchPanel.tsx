import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import searchIcon from '../../../assets/icons/search-primary.svg'
import useSession from '../../../hooks/useSession'
import { PATHS } from '../../../routes/paths'

interface HomeSearchPanelProps {
  onClose: () => void
}

const JIHOON_RECENT_SEARCHES = ['외주 잔금', '수정 요청', '프리랜서 계약'] as const
const JIHOON_RECENT_SEARCHES_KEY = 'wgwb:jihoon-recent-searches'

function readJihoonRecentSearches() {
  try {
    const savedSearches = window.sessionStorage.getItem(JIHOON_RECENT_SEARCHES_KEY)
    if (!savedSearches) return [...JIHOON_RECENT_SEARCHES]

    const parsedSearches: unknown = JSON.parse(savedSearches)
    return Array.isArray(parsedSearches)
      ? parsedSearches.filter((keyword): keyword is string => typeof keyword === 'string')
      : [...JIHOON_RECENT_SEARCHES]
  } catch {
    return [...JIHOON_RECENT_SEARCHES]
  }
}

/** 홈 상단에서 펼쳐지는 큰 사건 검색창. 결과는 광장의 기존 데모 검색으로 연결한다. */
function HomeSearchPanel({ onClose }: HomeSearchPanelProps) {
  const navigate = useNavigate()
  const { personaId } = useSession()
  const panelRef = useRef<HTMLElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState(readJihoonRecentSearches)

  useEffect(() => {
    const scrollRoot = panelRef.current?.closest<HTMLElement>('.main-layout__scroll')
    const previousOverflow = scrollRoot?.style.overflowY ?? ''
    if (scrollRoot) scrollRoot.style.overflowY = 'hidden'

    const frameId = window.requestAnimationFrame(() => inputRef.current?.focus())
    return () => {
      window.cancelAnimationFrame(frameId)
      if (scrollRoot) scrollRoot.style.overflowY = previousOverflow
    }
  }, [])

  const openSearchResult = (searchQuery: string) => {
    const normalizedQuery = searchQuery.trim()
    if (!normalizedQuery) {
      inputRef.current?.focus()
      return
    }

    navigate(`${PATHS.plaza}?section=cases&q=${encodeURIComponent(normalizedQuery)}`)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    openSearchResult(query)
  }

  const removeRecentSearch = (keywordToRemove: string) => {
    setRecentSearches((currentSearches) => {
      const nextSearches = currentSearches.filter((keyword) => keyword !== keywordToRemove)
      window.sessionStorage.setItem(JIHOON_RECENT_SEARCHES_KEY, JSON.stringify(nextSearches))
      return nextSearches
    })
  }

  return (
    <section ref={panelRef} id="home-global-search" className="home-search" aria-label="사건 검색">
      <button type="button" className="home-search__backdrop" aria-label="검색창 닫기" onClick={onClose} />
      <form className="home-search__field" role="search" onSubmit={handleSubmit}>
        <button type="submit" className="home-search__submit" aria-label="검색 실행">
          <img src={searchIcon} alt="" width={24} height={24} />
        </button>
        <input
          ref={inputRef}
          type="search"
          value={query}
          placeholder="사연, 사건 키워드 또는 AI 추천 검색..."
          aria-label="사연이나 사건 키워드 검색"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Escape') onClose()
          }}
        />
        <button type="button" className="home-search__close" aria-label="검색창 닫기" onClick={onClose}>
          <span className="search-close-mark" aria-hidden="true" />
        </button>
      </form>
      {personaId === 'B' && recentSearches.length > 0 && (
        <div className="home-search__recent" aria-label="최근 검색어">
          <span>최근 검색어</span>
          <div>
            {recentSearches.map((keyword) => (
              <span key={keyword} className="home-search__recent-chip">
                <button type="button" className="home-search__recent-keyword" onClick={() => openSearchResult(keyword)}>
                  {keyword}
                </button>
                <button
                  type="button"
                  className="home-search__recent-remove"
                  aria-label={`${keyword} 최근 검색어 삭제`}
                  onClick={() => removeRecentSearch(keyword)}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default HomeSearchPanel
