import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DEMO_ACCOUNTS } from '../../../data/personas'
import type { PersonaId } from '../../../types'
import seoaPhoto from '../../../assets/my/account-seoa.png'
import jihunPhoto from '../../../assets/my/account-jihun.png'
import closeIcon from '../../../assets/my/account-close.svg'
import infoIcon from '../../../assets/my/account-info.svg'
import selectedIcon from '../../../assets/my/account-selected.svg'
import profileCloseIcon from '../../../assets/my/profile-close.svg'
import './AccountSwitchSheet.css'

const accountPhotos = { A: seoaPhoto, B: jihunPhoto }

interface Props {
  currentPersona: PersonaId
  onClose: () => void
  onConfirm: (persona: PersonaId) => void
  onLogout: () => void
}

/** Selection stays local until the user confirms the account change. */
function AccountSwitchSheet({ currentPersona, onClose, onConfirm, onLogout }: Props) {
  const [selected, setSelected] = useState<PersonaId | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const closingRef = useRef(false)
  const exitAnimations = useRef<Animation[]>([])
  const dialogRef = useRef<HTMLDivElement>(null)
  const current = DEMO_ACCOUNTS[currentPersona]
  const otherId = currentPersona === 'A' ? 'B' : 'A'
  const other = DEMO_ACCOUNTS[otherId]
  const portalRoot = document.getElementById('app-overlay-root')

  // 입장 중 닫아도 현재 위치에서 이어서 내려가며, 완료 후에만 부모에서 제거한다.
  const dismiss = useCallback((afterClose: () => void = onClose) => {
    if (closingRef.current) return
    closingRef.current = true
    const dialog = dialogRef.current
    const overlay = dialog?.parentElement
    if (!dialog || !overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      afterClose()
      return
    }
    setIsClosing(true)
    const style = getComputedStyle(dialog)
    const isSheet = dialog.classList.contains('account-switch-sheet')
    const options: KeyframeAnimationOptions = { duration: 240, easing: 'cubic-bezier(.4, 0, 1, 1)', fill: 'forwards' }
    const animations = [
      dialog.animate([
        { transform: style.transform, opacity: style.opacity },
        { transform: isSheet ? 'translateY(100%)' : 'translateY(8px) scale(.98)', opacity: isSheet ? 1 : 0 },
      ], options),
      overlay.animate([
        { backgroundColor: getComputedStyle(overlay).backgroundColor },
        { backgroundColor: 'rgb(0 0 0 / 0%)' },
      ], { ...options, easing: 'ease-out' }),
    ]
    exitAnimations.current = animations
    // 라우트 이동 등으로 먼저 사라지면 cancel()이 완료 콜백 실행도 막는다.
    void Promise.all(animations.map((animation) => animation.finished)).then(afterClose).catch(() => {})
  }, [onClose])

  useEffect(() => () => {
    exitAnimations.current.forEach((animation) => animation.cancel())
  }, [])

  useEffect(() => {
    if (confirming) dialogRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
  }, [confirming])

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
    dialog.querySelector<HTMLButtonElement>('button')?.focus({ preventScroll: true })

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        dismiss()
      }
      if (closingRef.current) return
      if (event.key !== 'Tab') return
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), [tabindex="0"]'))
      const first = controls[0]
      const last = controls[controls.length - 1]
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
      previousFocus?.focus()
    }
  }, [dismiss, portalRoot])

  if (!portalRoot) return null

  return createPortal(
    <div className={`account-switch-overlay${confirming ? ' account-switch-overlay--center' : ''}`} onClick={(event) => { if (event.target === event.currentTarget) dismiss() }}>
      <div ref={dialogRef} className={confirming ? 'profile-switch-confirm' : 'account-switch-sheet'} inert={isClosing} role="dialog" aria-modal="true" aria-labelledby="account-switch-title">
        {confirming && selected ? (
          <>
            <header className="profile-switch-confirm__header">
              <h2 id="account-switch-title">프로필</h2>
              <button type="button" onClick={() => dismiss()} aria-label="프로필 전환 팝업 닫기"><img src={profileCloseIcon} alt="" width={14} height={14} /></button>
            </header>
            <div className="profile-switch-confirm__profile">
              <p>프로필을 전환하시겠습니까?</p>
              <span className={`account-switch-sheet__avatar account-switch-sheet__avatar--${selected}`}><img src={accountPhotos[selected]} alt="" /></span>
              <strong>{DEMO_ACCOUNTS[selected].name}</strong>
              <span className="profile-switch-confirm__email">계정 ｜ {DEMO_ACCOUNTS[selected].email}</span>
            </div>
            <div className="profile-switch-confirm__actions">
              <button type="button" className="profile-switch-confirm__submit" onClick={() => dismiss(() => onConfirm(selected))}>확인</button>
              <button type="button" className="profile-switch-confirm__logout" onClick={() => dismiss(onLogout)}>로그아웃</button>
            </div>
          </>
        ) : (
          <>
        <div className="account-switch-sheet__handle" aria-hidden="true" />
        <header className="account-switch-sheet__header">
          <h2 id="account-switch-title">계정 전환</h2>
          <button type="button" onClick={() => dismiss()} aria-label="계정 전환 팝업 닫기"><img src={closeIcon} alt="" width={24} height={24} /></button>
        </header>
        <div className="account-switch-sheet__body">
          <section aria-labelledby="current-account-label">
            <h3 id="current-account-label">현재 계정</h3>
            <div className="account-switch-sheet__account">
              <span className={`account-switch-sheet__avatar account-switch-sheet__avatar--${currentPersona}`}><img src={accountPhotos[currentPersona]} alt="" /></span>
              <span className="account-switch-sheet__identity"><strong>{current.name}</strong><span>{current.email}</span></span>
              <span className="account-switch-sheet__current">현재 사용중</span>
            </div>
          </section>
          <section aria-labelledby="available-account-label">
            <h3 id="available-account-label">전환 가능한 계정</h3>
            <label className={`account-switch-sheet__account account-switch-sheet__option${selected === otherId ? ' is-selected' : ''}`}>
              <span className={`account-switch-sheet__avatar account-switch-sheet__avatar--${otherId}`}><img src={accountPhotos[otherId]} alt="" /></span>
              <span className="account-switch-sheet__identity"><strong>{other.name}</strong><span>{other.email}</span></span>
              <span className="account-switch-sheet__radio">
                <input type="radio" name="switch-account" value={otherId} checked={selected === otherId} onChange={() => setSelected(otherId)} aria-label={`${other.name} 계정 선택`} />
                <span className="account-switch-sheet__radio-art" aria-hidden="true">
                  {selected === otherId && <img src={selectedIcon} alt="" width={15} height={15} />}
                </span>
              </span>
            </label>
          </section>
          <aside className="account-switch-sheet__notice">
            <img src={infoIcon} alt="" width={20} height={20} />
            <p>계정을 전환하면 작성 중인 사건의 임시 저장 내역과 설정이 각 프로필에 맞게 분리되어 유지됩니다.</p>
          </aside>
        </div>
        <footer className="account-switch-sheet__footer">
          <button type="button" aria-disabled={!selected} onClick={() => {
            if (selected) setConfirming(true)
            else dialogRef.current?.querySelector<HTMLInputElement>('input')?.focus()
          }}>프로필 전환하기</button>
        </footer>
          </>
        )}
      </div>
    </div>,
    portalRoot,
  )
}

export default AccountSwitchSheet
