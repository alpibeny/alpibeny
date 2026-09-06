// src/types/lesson.ts

export interface LessonMeta {
  number: number
  title: string
}

export interface TheoryStep {
  type: 'theory'
  title: string
  text: string
  image: string
}

export interface QuizStep {
  type: 'quiz'
  question: string
  options: string[]
  correctAnswerIndex: number
  explanation: string
}

export type LessonStep = TheoryStep | QuizStep

// Экспортируем строгий тип репозитория (с буквой S на конце)
export type LessonsRepository = Record<string, LessonStep[]>
