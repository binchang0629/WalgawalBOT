import { createContext } from 'react'

export interface ToastContextValue {
  showToast: (message: string, duration?: number) => void
  hideToast: () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export default ToastContext
