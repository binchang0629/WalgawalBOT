import { useCallback, useEffect, useRef, useState } from 'react'
import type { DragEvent } from 'react'

/**
 * 가로 스크롤 영역을 마우스로 끌어서 넘길 수 있게 한다.
 *
 * ref 객체를 렌더 중에 읽지 않도록 callback ref를 반환한다. 터치·펜은 브라우저의
 * 기본 스와이프에 맡기고, 마우스 포인터일 때만 직접 스크롤을 제어한다.
 */
function useDragScroll<T extends HTMLElement>() {
  const [element, setElement] = useState<T | null>(null)
  const draggedRef = useRef(false)
  const attachRef = useCallback((node: T | null) => setElement(node), [])

  useEffect(() => {
    if (!element) return

    let startX = 0
    let startScrollLeft = 0
    let dragging = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (element.scrollWidth <= element.clientWidth) return

      dragging = true
      draggedRef.current = false
      startX = event.clientX
      startScrollLeft = element.scrollLeft
      element.setPointerCapture(event.pointerId)
      element.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const moved = event.clientX - startX
      if (Math.abs(moved) > 4) draggedRef.current = true
      element.scrollLeft = startScrollLeft - moved
      event.preventDefault()
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (element.hasPointerCapture(event.pointerId)) element.releasePointerCapture(event.pointerId)
      element.classList.remove('is-dragging')
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!draggedRef.current) return
      draggedRef.current = false
      event.preventDefault()
      event.stopPropagation()
    }

    element.addEventListener('pointerdown', onPointerDown)
    element.addEventListener('pointermove', onPointerMove)
    element.addEventListener('pointerup', endDrag)
    element.addEventListener('pointercancel', endDrag)
    element.addEventListener('click', onClickCapture, true)

    return () => {
      element.removeEventListener('pointerdown', onPointerDown)
      element.removeEventListener('pointermove', onPointerMove)
      element.removeEventListener('pointerup', endDrag)
      element.removeEventListener('pointercancel', endDrag)
      element.removeEventListener('click', onClickCapture, true)
    }
  }, [element])

  const onDragStart = useCallback((event: DragEvent<T>) => event.preventDefault(), [])
  return [attachRef, onDragStart] as const
}

export default useDragScroll