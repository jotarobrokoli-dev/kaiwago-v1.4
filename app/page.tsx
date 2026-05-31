"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function LandingPage() {
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { setStudentName, studentName } = useLearning()

  const handleStart = () => {
    if (!name.trim()) {
      setError("Silakan masukkan nama kamu terlebih dahulu.")
      return
    }
    setStudentName(name.trim())
    router.push("/dashboard")
  }

  const handleContinue = () => {
    router.push("/dashboard")
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-foreground text-background text-3xl font-bold">
            ペラペラ
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            PeraPeraGo
          </h1>
          <p className="text-lg text-muted-foreground">
            Belajar Berbicara Bahasa Jepang
          </p>
        </div>

        {/* Description Card */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground leading-relaxed">
              Media pembelajaran kaiwa bahasa Jepang untuk siswa SMA/SMK pemula.
            </p>
          </CardContent>
        </Card>

        {/* Input Section */}
        <div className="space-y-4">
          {studentName ? (
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Selamat datang kembali, <span className="font-medium text-foreground">{studentName}</span>!
              </p>
              <Button 
                onClick={handleContinue} 
                className="w-full h-12 text-base font-medium"
              >
                Lanjutkan Belajar
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">atau</span>
                </div>
              </div>
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Masukkan nama baru"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  className="h-12 text-base"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <Button 
                  onClick={handleStart} 
                  variant="outline"
                  className="w-full h-12 text-base font-medium"
                >
                  Mulai Baru
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-foreground">
                  Nama Siswa
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama kamu"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    setError("")
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStart()
                  }}
                  className="h-12 text-base"
                />
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
              </div>
              <Button 
                onClick={handleStart} 
                className="w-full h-12 text-base font-medium"
              >
                Mulai Belajar
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          がんばって!!!
        </p>
      </div>
    </main>
  )
}
