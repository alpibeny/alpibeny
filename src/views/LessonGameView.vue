<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { lessonsRepository } from '../data/lessonsRepository'
import type { LessonStep, QuizStep } from '../types/lesson'

const props = defineProps<{ lessonId: string }>()
const emit = defineEmits(['back'])

const steps = ref<LessonStep[]>([])
const currentStepIndex = ref(0)

// Игровые состояния для тестов
const selectedOptionIndex = ref<number | null>(null)
const isAnswerChecked = ref(false)
const isAnswerCorrect = ref(false)

onMounted(() => {
  steps.value = lessonsRepository[props.lessonId] || []
})

const currentStep = computed(() => steps.value[currentStepIndex.value])

const progressWidth = computed(() => {
  if (!steps.value.length) return 0
  return ((currentStepIndex.value + 1) / steps.value.length) * 100
})

const selectOption = (index: number) => {
  if (isAnswerChecked.value) return
  selectedOptionIndex.value = index
}

const handleNextAction = () => {
  if (currentStep.value.type === 'theory') {
    goToNextStep()
    return
  }
  
  if (currentStep.value.type === 'quiz') {
    if (selectedOptionIndex.value === null) return
    
    if (!isAnswerChecked.value) {
      const quiz = currentStep.value as QuizStep
      isAnswerCorrect.value = selectedOptionIndex.value === quiz.correctAnswerIndex
      isAnswerChecked.value = true
      return
    }
    
    goToNextStep()
  }
}

const goToNextStep = () => {
  selectedOptionIndex.value = null
  isAnswerChecked.value = false
  isAnswerCorrect.value = false

  if (currentStepIndex.value < steps.value.length - 1) {
    currentStepIndex.value++
  } else {
    emit('back')
  }
}
</script>

<template>
  <div class="game-screen" v-if="currentStep">
    
    <!-- 1. Верхняя панель (Прогресс + Крестик) -->
    <div class="game-top-bar">
      <div class="progress-container">
        <div class="progress-fill" :style="{ width: progressWidth + '%' }"></div>
      </div>
      <button class="close-btn" @click="emit('back')">×</button>
    </div>

    <!-- 2. Зона основного контента -->
    <div class="game-main-content">
      
      <!-- ТЕОРИЯ (ЭКРАН 1) -->
      <div v-if="currentStep.type === 'theory'" class="theory-view">
        <div class="theory-image-container">
          <img src="../assets/images/yurovichi-camp.png" alt="Стоянка первобытных людей" class="theory-image" />
        </div>
        
        <!-- Текст лекции упакован в красивую овальную карточку из Figma -->
        <div class="theory-card">
          <span class="theory-meta">Микроурок {{ currentStepIndex + 1 }}: Заселение земель и Ледниковый период</span>
          
          <p class="theory-paragraph">
            Первые люди — <span class="highlight-blue">кроманьонцы</span> — появились на юге Беларуси в эпоху позднего палеолита (<span class="highlight-blue">40–35 тысяч лет назад</span>), когда север Европы был скован ледником. Из-за сильного холода они селились исключительно на крайнем юге региона, основывая первые стоянки, такие как <span class="highlight-blue">Юровичи и Бердыж</span>.
          </p>
          <p class="theory-paragraph">
            В условиях сурового климата люди вели <span class="highlight-blue">присваивающее хозяйство</span>, занимаясь собирательством и охотой на мамонтов. Основным инструментом труда служило ручное рубило.
          </p>
        </div>
      </div>

      <!-- ТЕСТ (ЭКРАНЫ 2, 3) -->
      <div v-else-if="currentStep.type === 'quiz'" class="quiz-view">
        <h2 class="quiz-question">{{ currentStep.question }}</h2>
        <div class="quiz-options-list">
          <div 
            v-for="(option, idx) in currentStep.options" :key="idx"
            class="option-card"
            :class="{
              'selected': selectedOptionIndex === idx && !isAnswerChecked,
              'wrong': isAnswerChecked && selectedOptionIndex === idx && !isAnswerCorrect,
              'correct': isAnswerChecked && idx === currentStep.correctAnswerIndex
            }"
            @click="selectOption(idx)"
          >
            <div class="radio-circle"><div class="radio-inner-dot"></div></div>
            <span class="option-text">{{ option }}</span>
          </div>
        </div>
      </div>

    </div>

    <!-- 3. Нижний подвал (ЭКРАН 4) -->
    <div 
      class="game-bottom-zone" 
      :class="{ 
        'error-banner-active': isAnswerChecked && !isAnswerCorrect,
        'success-banner-active': isAnswerChecked && isAnswerCorrect 
      }"
    >
      <div v-if="isAnswerChecked && !isAnswerCorrect" class="error-explanation-block">
        <h3 class="error-title">НЕВЕРНО</h3>
        <p class="error-text">
          Именно огонь спасал от лютых ледниковых холодов, а кремнёвые наконечники помогали добывать мясо мамонтов. Без этого выжить было невозможно.
        </p>
      </div>

      <div v-if="isAnswerChecked && isAnswerCorrect" class="success-explanation-block">
        <h3 class="success-title">ВЕРНО</h3>
        <p class="success-text">
          Отличная работа! Исторический факт усвоен абсолютно правильно, двигаемся дальше.
        </p>
      </div>

      <button 
        class="game-primary-btn"
        :class="{
          'disabled': currentStep.type === 'quiz' && selectedOptionIndex === null,
          'active-blue': currentStep.type === 'theory' || (selectedOptionIndex !== null && !isAnswerChecked),
          'error-red-btn': isAnswerChecked && !isAnswerCorrect,
          'success-green-btn': isAnswerChecked && isAnswerCorrect
        }"
        @click="handleNextAction"
      >
        ПРОДОЛЖИТЬ
      </button>
    </div>

  </div>
</template>

<style scoped>
@import '../assets/styles/game.css';
</style>
