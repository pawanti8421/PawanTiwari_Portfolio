import { useState, useEffect } from 'react'

export function useTypewriter({ words, typeSpeed = 90, deleteSpeed = 45, pauseDuration = 2200 }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const current = words[wordIndex]
    let timeout

    if (!isDeleting && displayed.length < current.length) {
      timeout = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), typeSpeed)
    } else if (!isDeleting && displayed.length === current.length) {
      timeout = setTimeout(() => setIsDeleting(true), pauseDuration)
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), deleteSpeed)
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false)
      setWordIndex(i => (i + 1) % words.length)
    }

    return () => clearTimeout(timeout)
  }, [displayed, isDeleting, wordIndex, words, typeSpeed, deleteSpeed, pauseDuration])

  return { displayed, isDeleting, wordIndex }
}
