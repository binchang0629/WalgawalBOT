import { forwardRef } from 'react'
import type { ButtonHTMLAttributes } from 'react'
import closeIcon from '../../assets/my/account-close.svg'
import './IconCloseButton.css'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { 'aria-label': string }

const IconCloseButton = forwardRef<HTMLButtonElement, Props>(function IconCloseButton(
  { className = '', ...props },
  ref,
) {
  return (
    <button ref={ref} type="button" className={`icon-close-button ${className}`.trim()} {...props}>
      <img src={closeIcon} alt="" aria-hidden="true" width={24} height={24} />
    </button>
  )
})

export default IconCloseButton
