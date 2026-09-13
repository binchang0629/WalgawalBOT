import { useEffect, useId, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import './AuthSelect.css'

/**
 * 회원가입의 펼침 선택 상자. Figma `2264:13030`.
 *
 * 브라우저 기본 `select`는 목록 모양을 시안대로 만들 수 없어 직접 그린다.
 * 닫혀 있을 때는 값 한 줄과 아래 화살표, 누르면 같은 자리에서 상자가 커지며
 * 맨 윗줄에 현재 값과 위 화살표, 그 아래에 나머지 선택지가 놓인다.
 *
 * 펼친 목록은 absolute로 띄운다. 상자가 실제로 커지면 옆 칸과 아래 내용이 밀린다.
 *
 * 키보드로도 쓸 수 있게 `listbox` 규칙을 따른다.
 * 위·아래로 이동, Enter로 선택, Esc로 닫기.
 */

export interface AuthSelectOption {
  value: string
  label: string
}

interface Props {
  options: AuthSelectOption[]
  value: string
  onChange: (value: string) => void
  /** 닫혀 있을 때 보여줄 내용. 월 칸처럼 단위 글자가 붙는 경우가 있다. */
  closedLabel: ReactNode
  ariaLabel: string
  /** 화살표 바로 앞에 붙는 글자. 월 칸의 `월` 같은 단위다. */
  suffix?: ReactNode
  /** 선택지가 많아 190px을 넘으면 목록 안에서 스크롤한다. */
  scrollable?: boolean
  className?: string
}

function AuthSelect({ options, value, onChange, closedLabel, ariaLabel, suffix, scrollable, className }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const rootRef = useRef<HTMLDivElement>(null)
  const listId = useId()

  // 바깥을 누르면 닫는다. 열려 있을 때만 듣는다.
  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [isOpen])

  const open = () => {
    const current = options.findIndex((option) => option.value === value)
    setActiveIndex(current >= 0 ? current : 0)
    setIsOpen(true)
  }

  const choose = (next: string) => {
    onChange(next)
    setIsOpen(false)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (isOpen) event.stopPropagation()
      setIsOpen(false)
      return
    }

    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        open()
      }
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => Math.min(index + 1, options.length - 1))
      return
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(index - 1, 0))
      return
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      const option = options[activeIndex]
      if (option) choose(option.value)
    }
  }

  // 펼친 목록에는 현재 값을 뺀 나머지만 놓는다. 현재 값은 맨 윗줄이 보여준다.
  const rest = options.filter((option) => option.value !== value)

  return (
    <div
      ref={rootRef}
      className={className ? `authSelect ${className}` : 'authSelect'}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="authSelectButton"
        onClick={() => (isOpen ? setIsOpen(false) : open())}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listId : undefined}
        aria-label={ariaLabel}
      >
        <span className="authSelectValue">{closedLabel}</span>
        <span className="authSelectTail">
          {suffix}
          <span className="authSelectChevron" aria-hidden="true" />
        </span>
      </button>

      {isOpen && (
        <div className={scrollable ? 'authSelectPanel authSelectPanelScroll' : 'authSelectPanel'}>
          {/* 맨 윗줄은 현재 값이다. 누르면 다시 접힌다. */}
          <button
            type="button"
            className="authSelectCurrent"
            onClick={() => setIsOpen(false)}
            aria-label={`${ariaLabel} 목록 접기`}
          >
            <span className="authSelectValue">{closedLabel}</span>
            <span className="authSelectTail">
              {suffix}
              <span className="authSelectChevron authSelectChevronOpen" aria-hidden="true" />
            </span>
          </button>

          <ul className="authSelectList" id={listId} role="listbox" aria-label={ariaLabel}>
            {rest.map((option) => {
              const index = options.indexOf(option)
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    className={
                      index === activeIndex ? 'authSelectOption authSelectOptionActive' : 'authSelectOption'
                    }
                    role="option"
                    aria-selected={option.value === value}
                    onClick={() => choose(option.value)}
                    onMouseEnter={() => setActiveIndex(index)}
                  >
                    {option.label}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </div>
  )
}

export default AuthSelect
