"use client"

import { useEffect, useState } from "react"

interface TypingTextProps {
  text: string
  speed?: number // ms per character
}

export default function TypingText({ text, speed = 120 }: TypingTextProps) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(i))
      i++
      if (i >= text.length) clearInterval(interval)
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <span className="relative font-extrabold bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
      {displayed}
      <span className="absolute -right-1 top-0 animate-pulse text-primary">|</span>
    </span>
  )
}
