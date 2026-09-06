// Описываем структуру одного элемента в глобальной карусели уроков
export interface LessonMeta {
  number: number;
  title: string;
}

// Описываем структуру шага ТЕОРИИ (Конспекта)
export interface TheoryStep {
  type: 'theory';
  title: string;
  text: string;
  image?: string; 
}

// Описываем структуру шага ТЕСТА (Квиза)
export interface QuizStep {
  type: 'quiz';
  question: string;
  options: string[]; 
  correctAnswerIndex: number; 
}

// Универсальный тип шага урока
export type LessonStep = TheoryStep | QuizStep;

// ИСПРАВЛЕНО: Добавлен обязательный экспорт для репозитория
export interface LessonsRepository {
  [lessonId: string]: LessonStep[];
}
