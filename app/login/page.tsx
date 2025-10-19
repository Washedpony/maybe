"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, AlertCircle, Loader2, Info } from "lucide-react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth, hasRequiredEnvVars } from "@/lib/firebase"
import { demoAuth } from "@/lib/demo-auth"
import { useAuth } from "@/lib/auth-context"

export default function LoginPage() {
  const router = useRouter()
  const { isDemoMode } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!formData.email || !formData.password) {
        setError("Please enter both email and password")
        setIsLoading(false)
        return
      }

      // Use demo auth if Firebase is not configured
      if (isDemoMode) {
        await demoAuth.signin(formData.email, formData.password)
        router.push("/")
        return
      }

      // Use Firebase auth
      if (!hasRequiredEnvVars) {
        setError("Firebase is not configured. Please add your Firebase credentials to environment variables.")
        setIsLoading(false)
        return
      }

      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password)
      console.log("[v0] User logged in:", userCredential.user.uid)

      router.push("/")
    } catch (err) {
      console.log("[v0] Login error:", err)
      const errorMessage = err instanceof Error ? err.message : "Login failed"

      if (errorMessage.includes("auth/invalid-credential")) {
        setError("Invalid email or password. Please try again.")
      } else if (errorMessage.includes("auth/user-not-found")) {
        setError("No account found with this email. Please sign up first.")
      } else if (errorMessage.includes("auth/invalid-api-key")) {
        setError("Firebase is not properly configured. Please check your environment variables.")
      } else if (errorMessage.includes("auth/too-many-requests")) {
        setError("Too many login attempts. Please try again later.")
      } else if (errorMessage.includes("auth/invalid-email")) {
        setError("Please enter a valid email address.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/joust-logo.png"
            alt="Joust Inc"
            width={200}
            height={80}
            className="invert brightness-110 contrast-125"
            style={{
              filter: "invert(1) brightness(1.1) contrast(1.25)",
              mixBlendMode: "screen",
            }}
          />
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl font-bold text-center">Welcome Back</CardTitle>
            <CardDescription className="text-center text-lg">Sign in to access your account</CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-base">{error}</AlertDescription>
                </Alert>
              )}

              {isDemoMode && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-base">
                    Demo mode active. Try: citizen@demo.com, admin@demo.com, or employer@demo.com (any password)
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10 h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground text-base">Don't have an account?</span>
              </div>
            </div>

            <Link href="/signup" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-lg bg-transparent">
                Create Account
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <p className="text-center text-muted-foreground mt-6 text-base">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-primary hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
