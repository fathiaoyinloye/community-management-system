import { useEffect, useRef } from 'react'

/**
 * Attaches an IntersectionObserver that adds the `is-visible` class the first
 * time the element scrolls into view, driving the `.hover-lift` reveal
 * animation defined in index.html's embedded stylesheet.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          node.classList.add('is-visible')
          observer.disconnect()
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return ref
}
