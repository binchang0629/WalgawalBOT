import { useCallback, useEffect, useRef } from 'react'

/**
 * 가로 스크롤 영역을 마우스로 끌어서 넘길 수 있게 한다.
 *
 * 터치 기기는 브라우저가 알아서 손가락 스와이프를 처리하지만,
 * 마우스에는 그런 동작이 없다. PC 목업으로 시연할 때 카드가 안 넘어가는 이유다.
 * 그래서 포인터가 마우스일 때만 직접 처리하고, 터치·펜은 기본 동작에 맡긴다.
 *
 * 반환한 ref를 스크롤 컨테이너에 달면 된다.
 */
function useDragScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  /** 드래그 도중 눌린 카드가 클릭으로 이어지지 않게 하는 표시 */
  const draggedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    let startX = 0
    let startScrollLeft = 0
    let dragging = false

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return
      if (el.scrollWidth <= el.clientWidth) return

      dragging = true
      draggedRef.current = false
      startX = event.clientX
      startScrollLeft = el.scrollLeft
      el.setPointerCapture(event.pointerId)
      el.classList.add('is-dragging')
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return
      const moved = event.clientX - startX
      // 몇 px 흔들린 건 클릭으로 본다. 그 이상 움직여야 드래그로 친다.
      if (Math.abs(moved) > 4) draggedRef.current = true
      el.scrollLeft = startScrollLeft - moved
      event.preventDefault()
    }

    const endDrag = (event: PointerEvent) => {
      if (!dragging) return
      dragging = false
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
      el.classList.remove('is-dragging')
    }

    // 드래그로 끝난 포인터라면 카드의 클릭을 막는다. 캡처 단계라 자식보다 먼저 걸린다.
    const onClickCapture = (event: MouseEvent) => {
      if (!draggedRef.current) return
      draggedRef.current = false
      event.preventDefault()
      event.stopPropagation()
    }

    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('click', onClickCapture, true)

    return () => {
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('click', onClickCapture, true)
    }
  }, [])

  /** 드래그 중 텍스트가 파랗게 선택되는 것을 막는다. */
  const onDragStart = useCallback((event: React.DragEvent) => event.preventDefault(), [])

  return { ref, onDragStart }
}

export default useDragScroll
