import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import IconCloseButton from './IconCloseButton'
import letterPaper from '../../assets/afterstory/figma/letter-paper.png'
import './LetterPreview.css'

/**
 * 편지지 위에 글 전문을 띄우는 미리보기.
 *
 * 후일담 게시 확인 화면에서 쓰던 모습을 그대로 옮겨 공통 컴포넌트로 뺐다.
 * 사건 접수 완료 화면에서도 같은 동작이 필요해, 두 곳이 같은 컴포넌트를 쓴다.
 *
 * 기기 안에서만 덮어야 하므로 `#app-overlay-root`에 portal로 붙인다.
 * 브라우저 전체를 덮으면 PC 목업 바깥까지 어두워진다. (PROJECT_SPEC.md §2)
 */

interface Props {
  /** 편지 위쪽 작은 문구. 예: `게시할 후일담` · `접수한 사건` */
  eyebrow: string
  title: string
  /** 글 전문. 줄바꿈은 그대로 살린다. */
  body: string
  /** 내용이 비어 있을 때 대신 보여줄 문구. */
  emptyText?: string
  closeLabel: string
  onClose: () => void
}

function LetterPreview({ eyebrow, title, body, emptyText = '작성한 내용이 없습니다.', closeLabel, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const overlayRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    closeRef.current?.focus()

    // 편지가 떠 있는 동안에는 초점이 뒤 화면으로 새지 않게 닫기 버튼에 묶어 둔다.
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      } else if (event.key === 'Tab') {
        event.preventDefault()
        closeRef.current?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!overlayRoot) return null

  return createPortal(
    <div
      className="letter-preview"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="letter-preview__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="letter-preview-title"
      >
        <div className="letter-preview__sheet">
          <img className="letter-preview__paper" src={letterPaper} alt="" aria-hidden="true" />
          <div className="letter-preview__contents">
            <span className="letter-preview__eyebrow">{eyebrow}</span>
            <h2 id="letter-preview-title">{title}</h2>
            <div className="letter-preview__body">{body || emptyText}</div>
          </div>
        </div>
        <IconCloseButton
          ref={closeRef}
          className="letter-preview__close"
          onClick={onClose}
          aria-label={closeLabel}
        />
      </section>
    </div>,
    overlayRoot,
  )
}

export default LetterPreview
