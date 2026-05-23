"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, BookOpen, Home, RotateCcw } from "lucide-react"

export default function ResultPage() {
  const router = useRouter()
  const { 
    studentName, 
    listeningScore, 
    speakingScore, 
    quizScore,
    resetProgress 
  } = useLearning()

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  if (!studentName) {
    return null
  }

  // Calculate final score (average of all scores)
  const finalScore = Math.round((listeningScore + speakingScore + quizScore) / 3)

  const getGrade = (score: number) => {
    if (score >= 90) return { grade: "A", text: "Luar Biasa!", color: "text-green-600" }
    if (score >= 80) return { grade: "B", text: "Sangat Bagus!", color: "text-blue-600" }
    if (score >= 70) return { grade: "C", text: "Bagus!", color: "text-yellow-600" }
    if (score >= 60) return { grade: "D", text: "Cukup", color: "text-orange-600" }
    return { grade: "E", text: "Perlu Belajar Lagi", color: "text-red-600" }
  }

  const gradeInfo = getGrade(finalScore)

  const handleReviewLesson = () => {
    router.push("/lesson")
  }

  const handleBackToDashboard = () => {
    router.push("/dashboard")
  }

  const handleRestart = () => {
    resetProgress()
    router.push("/lesson")
  }

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4 py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-foreground/10">
            <Trophy className="w-10 h-10 text-foreground" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Selamat!
          </h1>
          <p className="text-muted-foreground">
            Kamu telah menyelesaikan pelajaran
          </p>
        </div>

        {/* Lesson Completed Badge */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-block px-4 py-2 text-sm font-medium bg-foreground text-background rounded-full mb-2">
              じこしょうかい Completed
            </div>
            <CardTitle className="text-xl">Perkenalan Diri</CardTitle>
            <CardDescription>Jikoshoukai</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-lg font-medium text-foreground">{studentName}</p>
            <p className="text-sm text-muted-foreground mt-1">Siswa</p>
          </CardContent>
        </Card>

        {/* Scores Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Skor Kamu</CardTitle>
            <CardDescription>Hasil dari semua tantangan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Individual Scores */}
            <div className="space-y-4">
              {/* Listening Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Listening Score</span>
                  <span className="font-medium text-foreground">{listeningScore}%</span>
                </div>
                <Progress value={listeningScore} className="h-2" />
              </div>

              {/* Speaking Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Speaking Score</span>
                  <span className="font-medium text-foreground">{speakingScore}%</span>
                </div>
                <Progress value={speakingScore} className="h-2" />
              </div>

              {/* Quiz Score */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Quiz Score</span>
                  <span className="font-medium text-foreground">{quizScore}%</span>
                </div>
                <Progress value={quizScore} className="h-2" />
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-border" />

            {/* Final Score */}
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">Final Score</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-6xl font-bold text-foreground">{finalScore}</span>
                <span className="text-2xl text-muted-foreground">/ 100</span>
              </div>
              <div className={`text-xl font-medium ${gradeInfo.color}`}>
                Grade {gradeInfo.grade} — {gradeInfo.text}
              </div>
            </div>

            {/* Progress Complete */}
            <div className="bg-muted/30 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">Progress</p>
              <div className="flex items-center justify-center gap-2">
                <Progress value={100} className="h-3 flex-1" />
                <span className="text-sm font-medium text-foreground">100%</span>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Pelajaran Selesai!</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid gap-3">
          <Button
            onClick={handleReviewLesson}
            variant="outline"
            size="lg"
            className="w-full gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Review Lesson
          </Button>
          
          <Button
            onClick={handleBackToDashboard}
            size="lg"
            className="w-full gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Dashboard
          </Button>

          <Button
            onClick={handleRestart}
            variant="ghost"
            size="lg"
            className="w-full gap-2 text-muted-foreground"
          >
            <RotateCcw className="w-5 h-5" />
            Mulai Ulang
          </Button>
        </div>

        {/* Encouragement */}
        <div className="text-center py-4">
          <p className="text-sm text-muted-foreground">
            Terus berlatih untuk meningkatkan kemampuan bahasa Jepangmu!
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            KaiwaGo — Belajar Berbicara Bahasa Jepang
          </p>
        </div>
      </div>
    </main>
  )
}
