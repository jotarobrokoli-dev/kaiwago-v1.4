"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { lessonData } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, Volume2, Mic, MicOff } from "lucide-react"

export default function LessonPage() {
  const router = useRouter()
  const { 
    studentName, 
    currentLessonStep, 
    setCurrentLessonStep, 
    setLessonProgress,
    setIsLessonCompleted 
  } = useLearning()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  const currentLesson = lessonData[currentLessonStep - 1]
  const totalSteps = lessonData.length
  const progress = (currentLessonStep / totalSteps) * 100

  const playAudio = useCallback(() => {
    if (!currentLesson || isPlaying) return
    
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(currentLesson.japanese)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [currentLesson, isPlaying])

  const startRecording = useCallback(() => {
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      alert("Browser tidak mendukung Speech Recognition. Gunakan Chrome untuk fitur ini.")
      return
    }

    const SpeechRecognition = (window as unknown as { SpeechRecognition?: typeof window.SpeechRecognition; webkitSpeechRecognition?: typeof window.SpeechRecognition }).SpeechRecognition || (window as unknown as { webkitSpeechRecognition?: typeof window.SpeechRecognition }).webkitSpeechRecognition
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "ja-JP"
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsRecording(true)
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setSpokenText(transcript)
    }

    recognition.start()
  }, [])

  const handlePrevious = () => {
    if (currentLessonStep > 1) {
      setCurrentLessonStep(currentLessonStep - 1)
      setSpokenText("")
    }
  }

  const handleNext = () => {
    if (currentLessonStep < totalSteps) {
      setCurrentLessonStep(currentLessonStep + 1)
      setLessonProgress(((currentLessonStep) / totalSteps) * 100)
      setSpokenText("")
    } else {
      // Lesson completed
      setLessonProgress(100)
      setIsLessonCompleted(true)
      router.push("/listening")
    }
  }

  if (!studentName || !currentLesson) {
    return null
  }

  // Replace [name] placeholder with student name
  const displayJapanese = currentLesson.japanese.replace("[name]", studentName)
  const displayRomaji = currentLesson.romaji.replace("[name]", studentName)
  const displayTranslation = currentLesson.translation.replace("[name]", studentName)

  return (
    <main className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="text-muted-foreground">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Dashboard
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentLessonStep} / {totalSteps}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            じこしょうかい — Perkenalan Diri
          </p>
        </div>

        {/* Lesson Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              {currentLesson.type === "learn" ? "Materi" : currentLesson.type === "review" ? "Review" : "Ringkasan"}
            </div>
            <CardTitle className="text-lg">{currentLesson.title}</CardTitle>
            <CardDescription>Pelajaran {currentLessonStep}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Japanese Text */}
            <div className="text-center space-y-4 py-6 bg-muted/30 rounded-xl">
              <p className="text-3xl md:text-4xl font-medium text-foreground leading-relaxed">
                {displayJapanese}
              </p>
              <p className="text-lg text-muted-foreground italic">
                {displayRomaji}
              </p>
              <p className="text-base text-muted-foreground">
                {displayTranslation}
              </p>
            </div>

            {/* Audio Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={playAudio}
                disabled={isPlaying}
                className="gap-2"
              >
                <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                {isPlaying ? "Memutar..." : "Dengarkan"}
              </Button>
            </div>

            {/* Practice Prompt */}
            {currentLesson.practicePrompt && (
              <div className="bg-muted/50 rounded-lg p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">{currentLesson.practicePrompt}</p>
                <Button
                  variant={isRecording ? "destructive" : "secondary"}
                  onClick={startRecording}
                  disabled={isRecording}
                  className="gap-2"
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 animate-pulse" />
                      Merekam...
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      Latihan Bicara
                    </>
                  )}
                </Button>
                {spokenText && (
                  <p className="mt-3 text-sm text-foreground">
                    Kamu berkata: <span className="font-medium">{spokenText}</span>
                  </p>
                )}
              </div>
            )}

            {/* Review Content */}
            {currentLesson.type === "review" && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-foreground text-center mb-4">Ringkasan Materi:</p>
                {lessonData.slice(0, 8).map((lesson, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <span className="text-xs font-medium text-muted-foreground w-6">{index + 1}.</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{lesson.japanese}</p>
                      <p className="text-xs text-muted-foreground">{lesson.romaji}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Content */}
            {currentLesson.type === "summary" && (
              <div className="text-center space-y-4 py-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-foreground/10">
                  <span className="text-2xl">🎯</span>
                </div>
                <p className="text-muted-foreground">
                  Kamu telah mempelajari semua materi dasar perkenalan diri!
                </p>
                <p className="text-sm text-muted-foreground">
                  Selanjutnya, kamu akan mengerjakan tantangan Listening, Speaking, dan Quiz.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentLessonStep === 1}
            className="flex-1"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Sebelumnya
          </Button>
          <Button
            onClick={handleNext}
            className="flex-1"
          >
            {currentLessonStep === totalSteps ? "Lanjut ke Listening" : "Selanjutnya"}
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </main>
  )
}
