<script setup lang="ts">
import { ref, computed } from 'vue'
import imgAncient from '../assets/images/section-ancient.png'
import imgMedieval from '../assets/images/section-medieval.png'
import imgModern from '../assets/images/section-modern.png'
import imgRecent from '../assets/images/section-recent.png'
import imgCurrent from '../assets/images/section-current.png'

const emit = defineEmits(['back'])

const userFinishedLessonsCount = ref(0) 

const rawSections = [
  { id: 'sec_1', title: 'Древний мир', description: 'Первобытное общество, первые стоянки человека и расселение племен.', image: imgAncient, targetLessons: 100 },
  { id: 'sec_2', title: 'Средние века', description: 'Полоцкое княжество и становление Великого Княжества Литовского.', image: imgMedieval, targetLessons: 100 },
  { id: 'sec_3', title: 'Новое время', description: 'Речь Посполитая, разделы и период в составе Российской империи.', image: imgModern, targetLessons: 100 },
  { id: 'sec_4', title: 'Новейшее время', description: 'Создание БССР, Великая Отечественная война и советский период.', image: imgRecent, targetLessons: 100 },
  { id: 'sec_5', title: 'Современность', description: 'Распад СССР, обретение суверенитета и развитие независимой Беларуси.', image: imgCurrent, targetLessons: 100 }
]

const sections = computed(() => {
  return rawSections.map((sec, index) => {
    let status: 'passed' | 'active' | 'available' = 'available'
    let buttonText: 'Повторить' | 'Продолжить' | 'Изучить' = 'Изучить'
    let progressPercent = 0 
    
    if (index === 0) {
      if (userFinishedLessonsCount.value >= sec.targetLessons) {
        status = 'passed'
        buttonText = 'Повторить'
        progressPercent = 100
      } else {
        status = 'active'
        buttonText = 'Продолжить'
        progressPercent = userFinishedLessonsCount.value 
      }
    }
    else if (index === 1 && userFinishedLessonsCount.value >= 100) {
      status = 'active'
      buttonText = 'Продолжить'
      progressPercent = Math.min(userFinishedLessonsCount.value - 100, 100)
    }
    else {
      status = 'available'
      buttonText = 'Изучить'
      progressPercent = 0 
    }

    return { ...sec, status, buttonText, progressPercent }
  })
})

// Функция обработки нажатия на кнопку внутри карточки
const handleSectionAction = (secStatus: 'passed' | 'active' | 'available') => {
  // ИСПРАВЛЕНО: При клике на активный или пройденный раздел — возвращаем на главный экран к урокам
  if (secStatus === 'active' || secStatus === 'passed') {
    emit('back')
  }
}
</script>

<template>
  <div class="sections-screen">
    
    <!-- Закрепленная верхняя панель -->
    <div class="fixed-top-bar">
      <header class="sections-header">
        <button class="back-btn" @click="emit('back')">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </button>
        <h1 class="header-title">ВЫБОР РАЗДЕЛА</h1>
        <div class="header-spacer"></div>
      </header>
      <div class="header-divider"></div>
    </div>

    <!-- Список карточек -->
    <div class="sections-list-scroll">
      <div 
        v-for="sec in sections" 
        :key="sec.id"
        class="section-card"
        :class="sec.status"
      >
        <div class="card-bg-image" :style="{ backgroundImage: `url(${sec.image})` }"></div>
        <div class="card-overlay"></div>

        <div class="card-content-stack">
          <h2 class="card-title">{{ sec.title }}</h2>
          <p class="card-desc">{{ sec.description }}</p>
          
          <div v-if="sec.status === 'active'" class="mini-progress-track">
            <div class="mini-progress-fill" :style="{ width: sec.progressPercent + '%' }"></div>
          </div>
          
          <!-- ИСПРАВЛЕНО: Добавлен клик @click для возврата на главный экран -->
          <button class="action-button" @click="handleSectionAction(sec.status)">
            {{ sec.buttonText }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Подключаем ИСКЛЮЧИТЕЛЬНО личный файл стилей этого экрана */
@import '../assets/styles/sections.css';
</style>

