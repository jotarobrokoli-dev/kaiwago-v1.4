"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"

const lockedLessons = [
  { title: "がっこう", subtitle: "Sekolah" },
  { title: "しゅみ", subtitle: "Hobi" },
  { title: "れすとらん", subtitle: "Restoran" },
  { title: "かいもの", subtitle: "Belanja" },
]

export default function DashboardPage() {
  const router = useRouter()
  const { studentName, lessonProgress, isLessonCompleted, isListeningCompleted, isSpeakingCompleted, isQuizCompleted } = useLearning()

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  if (!studentName) {
    return null
  }

  const calculateOverallProgress = () => {
    let progress = 0
    if (isLessonCompleted) progress += 25
    if (isListeningCompleted) progress += 25
    if (isSpeakingCompleted) progress += 25
    if (isQuizCompleted) progress += 25
    return progress
  }

  const overallProgress = calculateOverallProgress()

  const handleStartLesson = () => {
    if (isQuizCompleted) {
      router.push("/result")
    } else if (isSpeakingCompleted) {
      router.push("/quiz")
    } else if (isListeningCompleted) {
      router.push("/speaking")
    } else if (isLessonCompleted) {
      router.push("/listening")
    } else {
      router.push("/lesson")
    }
  }

  const getButtonText = () => {
    if (isQuizCompleted) return "Lihat Hasil"
    if (isSpeakingCompleted) return "Lanjut ke Quiz"
    if (isListeningCompleted) return "Lanjut ke Speaking"
    if (isLessonCompleted) return "Lanjut ke Listening"
    if (lessonProgress > 0) return "Lanjutkan Belajar"
    return "Mulai Belajar"
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            こんにちは, {studentName}!
          </h1>
          <p className="text-muted-foreground">
            Selamat datang di KaiwaGo
          </p>
        </div>

        {/* Progress Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress Belajar</CardTitle>
            <CardDescription>じこしょうかい — Perkenalan Diri</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Kemajuan</span>
                <span className="font-medium text-foreground">{overallProgress}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className={`p-2 rounded-lg ${isLessonCompleted ? "bg-foreground/10" : "bg-muted"}`}>
                <span className={isLessonCompleted ? "text-foreground" : "text-muted-foreground"}>
                  {isLessonCompleted ? "✓" : "○"} Materi
                </span>
              </div>
              <div className={`p-2 rounded-lg ${isListeningCompleted ? "bg-foreground/10" : "bg-muted"}`}>
                <span className={isListeningCompleted ? "text-foreground" : "text-muted-foreground"}>
                  {isListeningCompleted ? "✓" : "○"} Listening
                </span>
              </div>
              <div className={`p-2 rounded-lg ${isSpeakingCompleted ? "bg-foreground/10" : "bg-muted"}`}>
                <span className={isSpeakingCompleted ? "text-foreground" : "text-muted-foreground"}>
                  {isSpeakingCompleted ? "✓" : "○"} Speaking
                </span>
              </div>
              <div className={`p-2 rounded-lg ${isQuizCompleted ? "bg-foreground/10" : "bg-muted"}`}>
                <span className={isQuizCompleted ? "text-foreground" : "text-muted-foreground"}>
                  {isQuizCompleted ? "✓" : "○"} Quiz
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Lesson Card */}
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={handleStartLesson}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-xl">じこしょうかい</CardTitle>
                <p className="text-sm text-muted-foreground">Jikoshoukai</p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 text-xs font-medium bg-foreground text-background rounded-full">
                  Aktif
                </span>
              </div>
            </div>
            <CardDescription className="pt-2">
              Perkenalan Diri — Belajar memperkenalkan diri dalam bahasa Jepang.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" size="lg">
              {getButtonText()}
            </Button>
          </CardContent>
        </Card>

        {/* Locked Lessons */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Pelajaran Lainnya</h2>
          <div className="grid gap-3">
            {lockedLessons.map((lesson, index) => (
              <Card key={index} className="border-border/30 bg-muted/30 opacity-60">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Lock className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium text-muted-foreground">{lesson.title}</p>
                      <p className="text-sm text-muted-foreground/70">{lesson.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">Terkunci</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div className="pt-4">
          <Button variant="ghost" onClick={() => router.push("/")} className="text-muted-foreground">
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    </main>
  )
}
