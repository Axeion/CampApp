import { useRef } from 'react'
import type { TouchEvent } from 'react'

export function useSwipe(
  onSwipeLeft: () => void,
  onSwipeRight: () => void,
  threshold = 50,
) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  const onTouchEnd = (e: TouchEvent) => {
    if (startX.current === null || startY.current === null) return
    const dx = e.changedTouches[0].clientX - startX.current
    const dy = e.changedTouches[0].clientY - startY.current
    // Ignore if the gesture is more vertical than horizontal (scrolling)
    if (Math.abs(dy) > Math.abs(dx)) return
    if (Math.abs(dx) >= threshold) {
      if (dx < 0) onSwipeLeft()
      else onSwipeRight()
    }
    startX.current = null
    startY.current = null
  }

  return { onTouchStart, onTouchEnd }
}
