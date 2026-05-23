"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface LearningState {
  studentName: string
  lessonProgress: number
  currentLessonStep: number
  listeningScore: number
  speakingScore: number
  quizScore: number
  isLessonCompleted: boolean
  isListeningCompleted: boolean
  isSpeakingCompleted: boolean
  isQuizCompleted: boolean
}

interface LearningContextType extends LearningState {
  setStudentName: (name: string) => void
  setLessonProgress: (progress: number) => void
  setCurrentLessonStep: (step: number) => void
  setListeningScore: (score: number) => void
  setSpeakingScore: (score: number) => void
  setQuizScore: (score: number) => void
  setIsLessonCompleted: (completed: boolean) => void
  setIsListeningCompleted: (completed: boolean) => void
  setIsSpeakingCompleted: (completed: boolean) => void
  setIsQuizCompleted: (completed: boolean) => void
  resetProgress: () => void
}

const defaultState: LearningState = {
  studentName: "",
  lessonProgress: 0,
  currentLessonStep: 1,
  listeningScore: 0,
  speakingScore: 0,
  quizScore: 0,
  isLessonCompleted: false,
  isListeningCompleted: false,
  isSpeakingCompleted: false,
  isQuizCompleted: false,
}

const LearningContext = createContext<LearningContextType | undefined>(undefined)

export function LearningProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<LearningState>(defaultState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("kaiwago-learning-state")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setState(parsed)
      } catch {
        // Invalid data, use default
      }
    }
    setIsHydrated(true)
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("kaiwago-learning-state", JSON.stringify(state))
    }
  }, [state, isHydrated])

  const setStudentName = (name: string) => setState((prev) => ({ ...prev, studentName: name }))
  const setLessonProgress = (progress: number) => setState((prev) => ({ ...prev, lessonProgress: progress }))
  const setCurrentLessonStep = (step: number) => setState((prev) => ({ ...prev, currentLessonStep: step }))
  const setListeningScore = (score: number) => setState((prev) => ({ ...prev, listeningScore: score }))
  const setSpeakingScore = (score: number) => setState((prev) => ({ ...prev, speakingScore: score }))
  const setQuizScore = (score: number) => setState((prev) => ({ ...prev, quizScore: score }))
  const setIsLessonCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isLessonCompleted: completed }))
  const setIsListeningCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isListeningCompleted: completed }))
  const setIsSpeakingCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isSpeakingCompleted: completed }))
  const setIsQuizCompleted = (completed: boolean) => setState((prev) => ({ ...prev, isQuizCompleted: completed }))
  
  const resetProgress = () => {
    setState((prev) => ({
      ...defaultState,
      studentName: prev.studentName,
    }))
  }

  if (!isHydrated) {
    return null
  }

  return (
    <LearningContext.Provider
      value={{
        ...state,
        setStudentName,
        setLessonProgress,
        setCurrentLessonStep,
        setListeningScore,
        setSpeakingScore,
        setQuizScore,
        setIsLessonCompleted,
        setIsListeningCompleted,
        setIsSpeakingCompleted,
        setIsQuizCompleted,
        resetProgress,
      }}
    >
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (context === undefined) {
    throw new Error("useLearning must be used within a LearningProvider")
  }
  return context
}
