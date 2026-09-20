import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import './ConfirmDialog.css'

interface ConfirmDialogProps {
  title: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void
  onClose: () => void
}

/** 앱 기기 영역 안에서 표시되는 공통 확인 팝업. */
function ConfirmDialog({
  title,
  confirmLabel = '확인',
  cancelLabel = '취소',
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  const titleId = useId()
  const dialogRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const portalRoot = document.getElementById('app-overlay-root')

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog || !portalRoot) return

    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const background = Array.from(portalRoot.parentElement?.children ?? [])
      .filter((element): element is HTMLElement => element instanceof HTMLElement && element !== portalRoot)
      .map((element) => ({ element, inert: element.inert }))
    const scroll = portalRoot.parentElement?.querySelector<HTMLElement>('.main-layout__scroll')
    const previousOverflow = scroll?.style.overflowY ?? ''

    background.forEach(({ element }) => { element.inert = true })
    if (scroll) scroll.style.overflowY = 'hidden'
    cancelRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const buttons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
      const first = buttons[0]
      const last = buttons[buttons.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      background.forEach(({ element, inert }) => { element.inert = inert })
      if (scroll) scroll.style.overflowY = previousOverflow
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [onClose, portalRoot])

  if (!portalRoot) return null

  return createPortal(
    <div className="confirm-dialog__overlay" onClick={(event) => {
      if (event.target === event.currentTarget) onClose()
    }}>
      <div
        ref={dialogRef}
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <h2 id={titleId}>{title}</h2>
        <div className="confirm-dialog__actions">
          <button type="button" className="confirm-dialog__confirm" onClick={onConfirm}>{confirmLabel}</button>
          <button ref={cancelRef} type="button" className="confirm-dialog__cancel" onClick={onClose}>{cancelLabel}</button>
        </div>
      </div>
    </div>,
    portalRoot,
  )
}

export default ConfirmDialog
