import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import ToastContext from './toastContext'
import './Toast.css'

interface ToastState {
  id: number
  message: string
  duration: number
}

const DEFAULT_DURATION = 3000

/**
 * 앱 전체에서 하나의 토스트만 관리한다.
 * 새 메시지가 들어오면 기존 메시지를 교체하고 노출 시간을 처음부터 다시 센다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null)
  const nextId = useRef(0)

  const hideToast = useCallback(() => setToast(null), [])
  const showToast = useCallback((message: string, duration = DEFAULT_DURATION) => {
    nextId.current += 1
    setToast({ id: nextId.current, message, duration })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(hideToast, toast.duration)
    return () => window.clearTimeout(timer)
  }, [hideToast, toast])

  const value = useMemo(() => ({ showToast, hideToast }), [hideToast, showToast])
  const overlayRoot = typeof document === 'undefined' ? null : document.getElementById('app-overlay-root')

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && overlayRoot && createPortal(
        <div className="app-toast-layer" aria-live="polite" aria-atomic="true">
          <div key={toast.id} className="app-toast" role="status">
            <span className="app-toast__icon" aria-hidden="true" />
            <span className="app-toast__message">{toast.message}</span>
          </div>
        </div>,
        overlayRoot,
      )}
    </ToastContext.Provider>
  )
}
