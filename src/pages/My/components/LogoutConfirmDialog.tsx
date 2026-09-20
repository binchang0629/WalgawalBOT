import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import './AccountSwitchSheet.css'

interface Props {
  onClose: () => void
  onConfirm: () => void
}

/** MY의 계정 전환 팝업과 같은 기기 내부 오버레이 및 키보드 동작을 사용한다. */
function LogoutConfirmDialog({ onClose, onConfirm }: Props) {
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
        event.stopPropagation()
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const controls = Array.from(dialog.querySelectorAll<HTMLButtonElement>('button:not(:disabled)'))
      const first = controls[0]
      const last = controls[controls.length - 1]
      const outside = !dialog.contains(document.activeElement)
      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
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
    <div
      className="account-switch-overlay account-switch-overlay--center"
      onClick={(event) => { if (event.target === event.currentTarget) onClose() }}
    >
      <div ref={dialogRef} className="profile-switch-confirm profile-switch-confirm--message" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header className="profile-switch-confirm__header">
          <h2 id={titleId}>로그아웃 하시겠습니까?</h2>
        </header>
        <div className="profile-switch-confirm__actions">
          <button type="button" className="profile-switch-confirm__submit" onClick={onConfirm}>확인</button>
          <button ref={cancelRef} type="button" className="profile-switch-confirm__logout" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>,
    portalRoot,
  )
}

export default LogoutConfirmDialog
