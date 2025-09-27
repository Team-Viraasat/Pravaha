"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [typedText, setTypedText] = useState("")
  const [isRegisterMode, setIsRegisterMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fullText = "Pravaha"
    let i = 0
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1))
      i++
      if (i === fullText.length) clearInterval(interval)
    }, 120)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      router.push("/")
    }
  }, [router])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (isRegisterMode && password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const endpoint = isRegisterMode ? "/api/register" : "/api/login"
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()

      if (res.ok) {
        localStorage.setItem("user", JSON.stringify(data.user))
        router.push("/")
      } else {
        setError(data.error)
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background page-transition">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              {typedText}
            </span>
          </h1>
          <p className="text-muted-foreground">
            {isRegisterMode ? "Create your account to start blogging" : "Sign in to access your blog dashboard"}
          </p>
        </div>

        <div className="glass-card p-8 rounded-2xl shadow-2xl border border-border/50">
          <div className="flex mb-6 p-1 bg-muted/30 rounded-lg">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false)
                setError("")
                setConfirmPassword("")
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                !isRegisterMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true)
                setError("")
              }}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                isRegisterMode
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 
                          text-foreground placeholder-muted-foreground
                          focus:ring-2 focus:ring-primary focus:border-primary 
                          transition-all duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 
                          text-foreground placeholder-muted-foreground
                          focus:ring-2 focus:ring-primary focus:border-primary 
                          transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {isRegisterMode && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background/50 
                            text-foreground placeholder-muted-foreground
                            focus:ring-2 focus:ring-primary focus:border-primary 
                            transition-all duration-200"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-lg font-semibold text-white
                        bg-gradient-to-r from-indigo-500 to-purple-500
                        hover:from-indigo-600 hover:to-purple-600
                        focus:ring-2 focus:ring-primary focus:ring-offset-2
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all duration-200 transform hover:scale-[1.02]
                        shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isRegisterMode ? "Creating account..." : "Signing in..."}
                </div>
              ) : isRegisterMode ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {!isRegisterMode && (
            <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-sm text-muted-foreground text-center">
                <strong>Demo Credentials:</strong>
                <br />
                Username: <code className="bg-muted px-1 rounded">admin</code>
                <br />
                Password: <code className="bg-muted px-1 rounded">password</code>
              </p>
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">Secure login powered by Pravaha</p>
        </div>
      </div>
    </div>
  )
}
