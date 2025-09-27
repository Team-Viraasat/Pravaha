"use client"

import { useState, useEffect } from "react"

export default function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("")

  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(interval)
      }
    }, 100) // typing speed
    return () => clearInterval(interval)
  }, [text])

  return (
    <span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent font-extrabold">
      {displayed}
    </span>
  )
}
