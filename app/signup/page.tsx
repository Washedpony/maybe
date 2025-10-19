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
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle2, Loader2, Info } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, hasRequiredEnvVars } from "@/lib/firebase"
import { userService } from "@/lib/db-service"
import { demoAuth } from "@/lib/demo-auth"
import { useAuth } from "@/lib/auth-context"

const PARISHES = [
  "Kingston",
  "St. Andrew",
  "St. Thomas",
  "Portland",
  "St. Mary",
  "St. Ann",
  "Trelawny",
  "St. James",
  "Hanover",
  "Westmoreland",
  "Manchester",
  "Clarendon",
]

export default function SignUpPage() {
  const router = useRouter()
  const { isDemoMode, setUser } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    parish: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!formData.fullName.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!formData.phone.trim()) {
      setError("Please enter your phone number")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service")
      return
    }

    if (!formData.parish) {
      setError("Please select your parish")
      return
    }

    setIsLoading(true)

    try {
      // Use demo auth if Firebase is not configured
      if (isDemoMode) {
        const user = await demoAuth.signup(formData.email, formData.password, {
          email: formData.email,
          name: formData.fullName,
          phone: formData.phone,
          parish: formData.parish,
          role: "citizen",
          skills: [],
        })
        console.log("[v0] Demo user created:", formData.email)
        setUser({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          parish: user.parish,
          skills: user.skills,
          createdAt: new Date(user.createdAt),
        })
        router.push("/")
        return
      }

      // Use Firebase auth
      if (!hasRequiredEnvVars) {
        setError("Firebase is not configured. Please add your Firebase credentials to environment variables.")
        setIsLoading(false)
        return
      }

      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const uid = userCredential.user.uid
      console.log("[v0] User created:", uid)

      await userService.createUser(uid, {
        id: uid,
        email: formData.email,
        name: formData.fullName,
        phone: formData.phone,
        parish: formData.parish,
        role: "citizen",
        skills: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      console.log("[v0] User profile created")

      router.push("/")
    } catch (err) {
      console.log("[v0] Signup error:", err)
      const errorMessage = err instanceof Error ? err.message : "Signup failed"

      if (errorMessage.includes("auth/email-already-in-use")) {
        setError("This email is already registered. Please sign in instead.")
      } else if (errorMessage.includes("auth/invalid-email")) {
        setError("Please enter a valid email address.")
      } else if (errorMessage.includes("auth/weak-password")) {
        setError("Password is too weak. Please use a stronger password.")
      } else if (errorMessage.includes("auth/invalid-api-key")) {
        setError("Firebase is not properly configured. Please check your environment variables.")
      } else {
        setError(errorMessage)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const passwordStrength = () => {
    const password = formData.password
    if (password.length === 0) return { strength: 0, label: "", color: "" }
    if (password.length < 6) return { strength: 1, label: "Weak", color: "bg-red-500" }
    if (password.length < 10) return { strength: 2, label: "Medium", color: "bg-yellow-500" }
    return { strength: 3, label: "Strong", color: "bg-green-500" }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Image
            src="/images/jobync-logo.png"
            alt="Jobsync"
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
            <CardTitle className="text-3xl font-bold text-center">Create Account</CardTitle>
            <CardDescription className="text-center text-lg">Join to access government opportunities</CardDescription>
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
                    Demo mode active. Create a test account or use existing demo accounts.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-base">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="pl-10 h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

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
                <Label htmlFor="phone" className="text-base">
                  Phone Number
                </Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (876) 123-4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="pl-10 h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="parish" className="text-base">
                  Parish
                </Label>
                <Select
                  value={formData.parish}
                  onValueChange={(value) => setFormData({ ...formData, parish: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger className="h-12 text-base" disabled={isLoading}>
                    <SelectValue placeholder="Select your parish" />
                  </SelectTrigger>
                  <SelectContent>
                    {PARISHES.map((parish) => (
                      <SelectItem key={parish} value={parish} className="text-base">
                        {parish}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    placeholder="Create a strong password"
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
                {formData.password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            level <= strength.strength ? strength.color : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">Password strength: {strength.label}</p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-base">
                  Confirm Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="pl-10 pr-10 h-12 text-base"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <CheckCircle2 className="absolute right-10 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                  className="w-4 h-4 rounded border-border mt-1"
                  required
                  disabled={isLoading}
                />
                <span className="text-muted-foreground text-base leading-relaxed">
                  I agree to the{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 rounded-lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
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
                <span className="bg-card px-2 text-muted-foreground text-base">Already have an account?</span>
              </div>
            </div>

            <Link href="/login" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-semibold rounded-lg bg-transparent">
                Sign In
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
