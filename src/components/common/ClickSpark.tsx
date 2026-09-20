import { useCallback, useEffect, useRef } from 'react'
import type { MouseEvent, ReactNode } from 'react'
import './ClickSpark.css'

type Easing = 'linear' | 'ease-in' | 'ease-in-out' | 'ease-out'

interface Spark {
  x: number
  y: number
  angle: number
  startTime: number
}

interface ClickSparkProps {
  children: ReactNode
  sparkColor?: string
  sparkSize?: number
  sparkRadius?: number
  sparkCount?: number
  duration?: number
  easing?: Easing
  extraScale?: number
}

/** 앱 화면을 클릭할 때만 짧은 스파크를 그리는 공통 효과. */
function ClickSpark({
  children,
  sparkColor = '#374BFF',
  sparkSize = 10,
  sparkRadius = 15,
  sparkCount = 8,
  duration = 400,
  easing = 'ease-out',
  extraScale = 1,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sparksRef = useRef<Spark[]>([])
  const frameRef = useRef<number | null>(null)
  const drawRef = useRef<((timestamp: number) => void) | null>(null)
  const reducedMotionRef = useRef(false)

  const ease = useCallback((progress: number) => {
    switch (easing) {
      case 'linear': return progress
      case 'ease-in': return progress * progress
      case 'ease-in-out': return progress < .5
        ? 2 * progress * progress
        : 1 - ((-2 * progress + 2) ** 2) / 2
      default: return progress * (2 - progress)
    }
  }, [easing])

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const { width, height } = parent.getBoundingClientRect()
    const ratio = window.devicePixelRatio || 1
    const pixelWidth = Math.max(1, Math.round(width * ratio))
    const pixelHeight = Math.max(1, Math.round(height * ratio))

    if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
      canvas.width = pixelWidth
      canvas.height = pixelHeight
      canvas.getContext('2d')?.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    const parent = canvas?.parentElement
    if (!canvas || !parent) return

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => { reducedMotionRef.current = motionQuery.matches }
    updateMotionPreference()
    motionQuery.addEventListener('change', updateMotionPreference)

    const observer = new ResizeObserver(resizeCanvas)
    observer.observe(parent)
    resizeCanvas()

    return () => {
      observer.disconnect()
      motionQuery.removeEventListener('change', updateMotionPreference)
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
    }
  }, [resizeCanvas])

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const ratio = window.devicePixelRatio || 1
    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, canvas.width / ratio, canvas.height / ratio)
    context.lineWidth = 2
    context.lineCap = 'round'
    context.strokeStyle = sparkColor

    sparksRef.current = sparksRef.current.filter((spark) => {
      const elapsed = timestamp - spark.startTime
      if (elapsed >= duration) return false

      const eased = ease(elapsed / duration)
      const distance = eased * sparkRadius * extraScale
      const lineLength = sparkSize * (1 - eased)
      const cosine = Math.cos(spark.angle)
      const sine = Math.sin(spark.angle)

      context.beginPath()
      context.moveTo(spark.x + distance * cosine, spark.y + distance * sine)
      context.lineTo(spark.x + (distance + lineLength) * cosine, spark.y + (distance + lineLength) * sine)
      context.stroke()
      return true
    })

    frameRef.current = sparksRef.current.length > 0
      ? requestAnimationFrame((nextTimestamp) => drawRef.current?.(nextTimestamp))
      : null
  }, [duration, ease, extraScale, sparkColor, sparkRadius, sparkSize])

  useEffect(() => {
    drawRef.current = draw
  }, [draw])

  const handleClick = (event: MouseEvent<HTMLDivElement>) => {
    if (reducedMotionRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const bounds = canvas.getBoundingClientRect()
    const x = event.clientX - bounds.left
    const y = event.clientY - bounds.top
    const now = performance.now()

    sparksRef.current.push(...Array.from({ length: sparkCount }, (_, index) => ({
      x,
      y,
      angle: (Math.PI * 2 * index) / sparkCount,
      startTime: now,
    })))

    if (frameRef.current === null && drawRef.current) {
      frameRef.current = requestAnimationFrame(drawRef.current)
    }
  }

  return (
    <div className="click-spark" onClick={handleClick}>
      {children}
      <canvas ref={canvasRef} className="click-spark__canvas" />
    </div>
  )
}

export default ClickSpark
