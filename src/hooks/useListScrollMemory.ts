import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { DEMO } from '../config/app'

/**
 * 목록에서 한 건을 열었다가 뒤로 돌아왔을 때, 보고 있던 자리로 되돌린다.
 *
 * 없으면 돌아올 때마다 목록 맨 위로 튄다. 아래쪽 항목을 확인하려면 매번 다시 내려야 해서,
 * 목록이 길수록 불편하다.
 *
 * 되돌리는 건 `뒤로 돌아온 경우`뿐이다. 메뉴에서 새로 들어왔을 때는 맨 위에서 시작해야 한다.
 * 그 구분은 `skipEnterMotion`으로 한다 — 되돌아가는 이동에만 붙는 표시라
 * (`hooks/useDetailSlide`, `CaseHeader`) 여기서도 같은 신호를 쓴다.
 *
 * 위치는 sessionStorage에 둔다. 탭을 닫으면 사라지고, 새로고침하면 `demoReset`이 비운다.
 *
 * @param key      목록을 구분하는 이름. 화면마다 다르게 준다.
 * @param enabled  목록이 그려졌을 때만 true. 빈 화면에서는 되돌릴 자리가 없다.
 * @returns 스크롤 컨테이너에 달 ref
 */
export default function useListScrollMemory(key: string, enabled = true) {
  const ref = useRef<HTMLDivElement>(null)
  const location = useLocation()
  const isReturning = (location.state as { skipEnterMotion?: boolean } | null)?.skipEnterMotion === true
  const storageKey = `${DEMO.storagePrefix}:list-scroll:${key}`

  /*
   * 스크롤할 때마다 적어 둔다.
   *
   * 화면을 떠나는 순간에 한 번만 적는 편이 알뜰해 보이지만, 그때는 이미 늦을 때가 있다.
   * 언마운트 정리는 부모가 먼저 사라진 뒤에 돌 수도 있어서 높이가 0으로 읽힌다.
   * 여기서 하는 일은 숫자 하나를 저장하는 것뿐이라 스크롤 중에 해도 부담이 없다.
   */
  useEffect(() => {
    const element = ref.current
    if (!element) return

    const remember = () => {
      try {
        window.sessionStorage.setItem(storageKey, String(element.scrollTop))
      } catch {
        // 저장소를 못 쓰면 다음에 맨 위에서 시작한다. 화면 자체에는 지장이 없다.
      }
    }

    element.addEventListener('scroll', remember, { passive: true })
    return () => element.removeEventListener('scroll', remember)
  }, [storageKey])

  /*
   * 되돌릴 때는 화면이 그려지기 전에 자리를 맞춰야 한다.
   * useEffect로 하면 맨 위가 한 프레임 보였다가 튀어 내려간다.
   *
   * 다음 프레임에 한 번 더 맞추는 이유는, 글꼴이 늦게 적용되면 이 시점의 목록이
   * 아직 짧아서 원하는 만큼 못 내려가기 때문이다. 브라우저가 알아서 최대치로 잘라 버린다.
   */
  useLayoutEffect(() => {
    if (!isReturning || !enabled) return
    const element = ref.current
    if (!element) return

    let saved = 0
    try {
      saved = Number(window.sessionStorage.getItem(storageKey))
    } catch {
      return
    }
    if (!Number.isFinite(saved) || saved <= 0) return

    element.scrollTop = saved
    const retry = window.requestAnimationFrame(() => {
      if (element.scrollTop < saved) element.scrollTop = saved
    })
    return () => window.cancelAnimationFrame(retry)
  }, [isReturning, enabled, storageKey])

  return ref
}
