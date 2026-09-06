<!-- src/views/LessonGameView.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import type { LessonStep, TheoryStep, QuizStep } from '../types/lesson'
import { lessonsRepository } from '../data/lessonsRepository'

// Импорт глобальных стилей игрового процесса
import '../assets/styles/game.css'

interface Props {
  lessonId: number | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

// Получаем массив шагов по строковому ключу 'lesson_1'
const stepsList = computed<LessonStep[]>(() => {
  const id = Number(props.lessonId) || 1
  const key = `lesson_${id}`
  return lessonsRepository[key] || []
})

// Навигация по шагам внутри урока
const currentStepIndex = ref<number>(0)
const selectedAnswerIndex = ref<number | null>(null)
const isChecked = ref<boolean>(false)

// Безопасное получение текущего шага общего типа
const currentStep = computed<LessonStep | null>(() => {
  if (stepsList.value.length === 0) return null
  return stepsList.value[currentStepIndex.value]
})

// Вычисляемые свойства для сужения типов специально ДЛЯ ШАБЛОНА
const theoryStep = computed<TheoryStep | null>(() => {
  const step = currentStep.value
  return step && step.type === 'theory' ? step : null
})

const quizStep = computed<QuizStep | null>(() => {
  const step = currentStep.value
  return step && step.type === 'quiz' ? step : null
})

// Подсчет процентов прогресса (Заполнение видно сразу с 1 шага)
const progressPercent = computed<number>(() => {
  const totalSteps = stepsList.value.length
  if (totalSteps === 0) return 0
  return Math.round(((currentStepIndex.value + 1) / totalSteps) * 100)
})

// Безопасное получение URL картинки из локальной папки ресурсов
const getArtUrl = (imagePath: string) => {
  const filename = imagePath.split('/').pop() || ''
  return new URL(`../assets/images/${filename}`, import.meta.url).href
}

// Логика игрового процесса
const selectOption = (index: number) => {
  if (isChecked.value) return
  selectedAnswerIndex.value = index
}

const handleAction = () => {
  if (theoryStep.value) {
    goToNextStep()
  } else {
    if (!isChecked.value) {
      isChecked.value = true
    } else {
      goToNextStep()
    }
  }
}

const goToNextStep = () => {
  isChecked.value = false
  selectedAnswerIndex.value = null
  
  if (currentStepIndex.value < stepsList.value.length - 1) {
    currentStepIndex.value++
  } else {
    // Урок полностью завершен
    emit('back')
  }
}

// Безопасная проверка правильности ответа
const isCorrectAnswer = computed<boolean>(() => {
  const step = quizStep.value
  if (!step || selectedAnswerIndex.value === null) {
    return false
  }
  return selectedAnswerIndex.value === step.correctAnswerIndex
})

// Динамический текст для главной кнопки управления
const buttonText = computed<string>(() => {
  if (theoryStep.value) return 'ПРОДОЛЖИТЬ'
  return isChecked.value ? 'ПРОДОЛЖИТЬ' : 'ПРОВЕРИТЬ'
})

// Логика блокировки кнопки
const isButtonDisabled = computed<boolean>(() => {
  if (theoryStep.value) return false
  if (isChecked.value) return false
  return selectedAnswerIndex.value === null
})
</script>

<template>
  <div class="game-screen has-header-line">
    <!-- ВЕРХНЯЯ ПАНЕЛЬ: Прогресс и Выход (ЗАФИКСИРОВАНА) -->
    <header class="game-header">
      <div class="game-progress-track">
        <div class="game-progress-fill" :style="{ width: progressPercent + '%' }"></div>
      </div>
      <button class="close-btn" @click="emit('back')">✕</button>
    </header>

    <!-- ТА САМАЯ КРАСНАЯ ОБЛАСТЬ: скроллится целиком сверху вниз -->
    <main class="game-content">
      <div v-if="currentStep" class="step-wrapper">
        
        <!-- Отрисовка ШАГА ТЕОРИИ -->
        <div v-if="theoryStep" class="theory-container">
          <!-- Арт и карточка лежат в одном потоке прокрутки -->
          <div v-if="theoryStep.image" class="art-container">
            <img 
              :src="getArtUrl(theoryStep.image)" 
              alt="Историческая панорама" 
              class="theory-art-image"
            />
          </div>

          <!-- Карточка теории растет свободно по высоте контента -->
          <div class="theory-card">
            <div class="theory-title-badge">Микроурок 1: {{ theoryStep.title }}</div>
            <p class="theory-text" v-html="theoryStep.text"></p>
          </div>

          <!-- НЕВИДИМАЯ РАСПОРКА: выталкивает нижний закругленный край карточки НАД кнопкой -->
          <div class="scroll-spacer"></div>
        </div>

        <!-- Отрисовка ШАГА ТЕСТА -->
        <div v-else-if="quizStep" class="quiz-container">
          <div class="question-card">
            <p class="question-text">{{ quizStep.question }}</p>
          </div>

          <div class="options-list">
            <button
              v-for="(option, index) in quizStep.options"
              :key="index"
              class="option-item"
              :class="{
                'is-selected': selectedAnswerIndex === index,
                'is-correct': isChecked && index === quizStep.correctAnswerIndex,
                'is-wrong': isChecked && selectedAnswerIndex === index && selectedAnswerIndex !== quizStep.correctAnswerIndex
              }"
              :disabled="isChecked"
              @click="selectOption(index)"
            >
              <div class="radio-indicator"></div>
              <span class="option-text">{{ option }}</span>
            </button>
          </div>
        </div>

      </div>
    </main>

    <!-- ФИКСИРОВАННЫЙ НИЖНИЙ ПОДВАЛ (КНОПКА ЗАФИКСИРОВАНА) -->
    <footer 
      class="game-footer"
      :class="{ 
        'banner-correct': isChecked && quizStep && isCorrectAnswer, 
        'banner-wrong': isChecked && quizStep && !isCorrectAnswer 
      }"
    >
      <div class="footer-inner">
        <div v-if="isChecked && quizStep" class="banner-info-block">
          <div class="banner-status-text">
            {{ isCorrectAnswer ? 'ВЕРНО!' : 'НЕВЕРНО' }}
          </div>
          <p class="banner-explanation-text">
            {{ quizStep.explanation }}
          </p>
        </div>
        
        <button 
          class="action-btn"
          :disabled="isButtonDisabled"
          @click="handleAction"
        >
          {{ buttonText }}
        </button>
      </div>
    </footer>
  </div>
</template>
