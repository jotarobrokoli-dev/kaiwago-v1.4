"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useLearning } from "@/lib/learning-context"
import { quizQuestions } from "@/lib/lesson-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, Volume2, Mic, MicOff, CheckCircle, XCircle } from "lucide-react"

function calculateSimilarity(spoken: string, target: string): number {
  const normalize = (str: string) => str.toLowerCase().replace(/[。、！？\s]/g, "")
  const spokenNorm = normalize(spoken)
  const targetNorm = normalize(target)
  
  if (spokenNorm === targetNorm) return 100
  if (spokenNorm.length === 0) return 0
  
  let matches = 0
  const spokenChars = spokenNorm.split("")
  const targetChars = targetNorm.split("")
  
  for (const char of spokenChars) {
    if (targetChars.includes(char)) {
      matches++
    }
  }
  
  const baseSimilarity = (matches / Math.max(spokenChars.length, targetChars.length)) * 100
  const boostedScore = Math.min(100, baseSimilarity * 1.3)
  
  return Math.round(boostedScore)
}

export default function QuizPage() {
  const router = useRouter()
  const { studentName, setQuizScore, setIsQuizCompleted } = useLearning()

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [spokenText, setSpokenText] = useState("")
  const [speakingScore, setSpeakingScore] = useState<number | null>(null)

  useEffect(() => {
    if (!studentName) {
      router.push("/")
    }
  }, [studentName, router])

  const question = quizQuestions[currentQuestion]
  const totalQuestions = quizQuestions.length
  const progress = ((currentQuestion + 1) / totalQuestions) * 100

  // Replace [name] with student name
  const displayJapanese = question?.japanese?.replace("[name]", studentName) || ""

  const playAudio = useCallback(() => {
    if (!question?.audioText || isPlaying) return
    
    setIsPlaying(true)
    const utterance = new SpeechSynthesisUtterance(question.audioText)
    utterance.lang = "ja-JP"
    utterance.rate = 0.8
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(utterance)
  }, [question, isPlaying])

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

    recognition.onstart = () => {
      setIsRecording(true)
      setSpokenText("")
      setSpeakingScore(null)
    }
    
    recognition.onend = () => setIsRecording(false)
    recognition.onerror = () => setIsRecording(false)

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript
      setSpokenText(transcript)
      
      const sim = calculateSimilarity(transcript, displayJapanese)
      setSpeakingScore(sim)
    }

    recognition.start()
  }, [displayJapanese])

  const handleAnswerSelect = (index: number) => {
    if (showResult) return
    setSelectedAnswer(index)
  }

  const handleSubmitMultipleChoice = () => {
    if (selectedAnswer === null) return
    
    const isCorrect = selectedAnswer === question.correctAnswer
    if (isCorrect) {
      setScore((prev) => prev + 1)
    }
    setShowResult(true)
  }

  const handleSubmitSpeaking = () => {
    if (speakingScore === null) return
    
    // Consider 60% or higher as correct
    if (speakingScore >= 60) {
      setScore((prev) => prev + 1)
    }
    setShowResult(true)
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setSpokenText("")
      setSpeakingScore(null)
    } else {
      // Calculate final score as percentage
      const finalScore = Math.round((score / totalQuestions) * 100)
      setQuizScore(finalScore)
      setIsQuizCompleted(true)
      router.push("/result")
    }
  }

  if (!studentName || !question) {
    return null
  }

  const isMultipleChoice = question.type === "multiple-choice" || question.type === "listening"
  const isSpeaking = question.type === "speaking"

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
            Soal {currentQuestion + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">
            Quiz じこしょうかい
          </p>
        </div>

        {/* Question Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="text-center pb-4">
            <div className="inline-block px-3 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-full mb-2">
              {question.type === "multiple-choice" ? "Pilihan Ganda" : 
               question.type === "listening" ? "Listening" : "Speaking"}
            </div>
            <CardTitle className="text-lg">Pertanyaan {currentQuestion + 1}</CardTitle>
            <CardDescription>{question.question}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Japanese Text Display (if applicable) */}
            {question.japanese && !isSpeaking && (
              <div className="text-center py-4 bg-muted/30 rounded-xl">
                <p className="text-2xl md:text-3xl font-medium text-foreground">
                  {question.japanese}
                </p>
              </div>
            )}

            {/* Audio Button for Listening Questions */}
            {question.type === "listening" && question.audioText && (
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={playAudio}
                  disabled={isPlaying}
                  className="gap-2"
                >
                  <Volume2 className={`w-5 h-5 ${isPlaying ? "animate-pulse" : ""}`} />
                  {isPlaying ? "Memutar..." : "Putar Audio"}
                </Button>
              </div>
            )}

            {/* Multiple Choice Options */}
            {isMultipleChoice && question.choices && (
              <div className="space-y-3">
                {question.choices.map((choice, index) => {
                  const isSelected = selectedAnswer === index
                  const isCorrect = index === question.correctAnswer
                  
                  let buttonStyle = "border-border hover:border-foreground/50"
                  if (showResult) {
                    if (isCorrect) {
                      buttonStyle = "border-green-500 bg-green-50 dark:bg-green-950/20"
                    } else if (isSelected && !isCorrect) {
                      buttonStyle = "border-red-500 bg-red-50 dark:bg-red-950/20"
                    }
                  } else if (isSelected) {
                    buttonStyle = "border-foreground bg-foreground/5"
                  }

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${buttonStyle}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 flex items-center justify-center rounded-full bg-muted text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-foreground">{choice}</span>
                        </div>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {showResult && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Speaking Challenge */}
            {isSpeaking && (
              <div className="space-y-6">
                {/* Target Sentence */}
                <div className="text-center py-6 bg-muted/30 rounded-xl">
                  <p className="text-2xl md:text-3xl font-medium text-foreground">
                    {displayJapanese}
                  </p>
                </div>

                {/* Recording Section */}
                {!showResult && (
                  <div className="text-center space-y-4">
                    <Button
                      variant={isRecording ? "destructive" : "default"}
                      size="lg"
                      onClick={startRecording}
                      disabled={isRecording}
                      className="gap-2"
                    >
                      {isRecording ? (
                        <>
                          <MicOff className="w-5 h-5 animate-pulse" />
                          Merekam...
                        </>
                      ) : (
                        <>
                          <Mic className="w-5 h-5" />
                          Mulai Speaking
                        </>
                      )}
                    </Button>
                  </div>
                )}

                {/* Speaking Result */}
                {spokenText && (
                  <div className="space-y-4">
                    <div className="p-4 bg-muted/50 rounded-lg text-center">
                      <p className="text-sm text-muted-foreground mb-2">Kamu berkata:</p>
                      <p className="text-xl font-medium text-foreground">{spokenText}</p>
                    </div>

                    {speakingScore !== null && (
                      <div className={`p-4 rounded-lg text-center ${
                        speakingScore >= 60 
                          ? "bg-green-50 dark:bg-green-950/20" 
                          : "bg-orange-50 dark:bg-orange-950/20"
                      }`}>
                        <p className="text-sm text-muted-foreground mb-1">Kemiripan:</p>
                        <p className={`text-3xl font-bold ${
                          speakingScore >= 60 ? "text-green-600" : "text-orange-600"
                        }`}>
                          {speakingScore}%
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Result Feedback for Multiple Choice */}
            {showResult && isMultipleChoice && (
              <div className={`p-4 rounded-lg text-center ${
                selectedAnswer === question.correctAnswer 
                  ? "bg-green-50 dark:bg-green-950/20" 
                  : "bg-red-50 dark:bg-red-950/20"
              }`}>
                <p className={`font-medium ${
                  selectedAnswer === question.correctAnswer ? "text-green-600" : "text-red-600"
                }`}>
                  {selectedAnswer === question.correctAnswer ? "Benar!" : "Kurang tepat"}
                </p>
                {selectedAnswer !== question.correctAnswer && question.choices && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Jawaban yang benar: {question.choices[question.correctAnswer as number]}
                  </p>
                )}
              </div>
            )}

            {/* Result Feedback for Speaking */}
            {showResult && isSpeaking && (
              <div className={`p-4 rounded-lg text-center ${
                (speakingScore ?? 0) >= 60 
                  ? "bg-green-50 dark:bg-green-950/20" 
                  : "bg-orange-50 dark:bg-orange-950/20"
              }`}>
                <p className={`font-medium ${
                  (speakingScore ?? 0) >= 60 ? "text-green-600" : "text-orange-600"
                }`}>
                  {(speakingScore ?? 0) >= 60 ? "Bagus!" : "Perlu latihan lagi"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-end gap-4">
          {!showResult ? (
            isMultipleChoice ? (
              <Button
                onClick={handleSubmitMultipleChoice}
                disabled={selectedAnswer === null}
                className="min-w-32"
              >
                Jawab
              </Button>
            ) : (
              <Button
                onClick={handleSubmitSpeaking}
                disabled={speakingScore === null}
                className="min-w-32"
              >
                Kirim Jawaban
              </Button>
            )
          ) : (
            <Button onClick={handleNext} className="min-w-32">
              {currentQuestion === totalQuestions - 1 ? "Lihat Hasil" : "Selanjutnya"}
            </Button>
          )}
        </div>

        {/* Score Display */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Skor sementara: {score} / {currentQuestion + (showResult ? 1 : 0)}
          </p>
        </div>
      </div>
    </main>
  )
}
