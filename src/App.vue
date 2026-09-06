<script setup lang="ts">
import { ref } from 'vue'

// 1. Импортируем компоненты главного экрана
import HeaderTitle from './components/HeaderTitle.vue'
import SectionProgressBar from './components/SectionProgressBar.vue'
import LessonsCarousel from './components/LessonsCarousel.vue'
import BottomMenuBar from './components/BottomMenuBar.vue'

// 2. Импортируем экраны Разделов и самого Урока (Движка игры)
import SectionsListView from './views/SectionsListView.vue'
import LessonGameView from './views/LessonGameView.vue'

// Управляет текущим отображением экрана: 
// 'home'     ➔ Главное меню с планетами
// 'sections' ➔ Список глобальных разделов истории
// 'game'     ➔ Игровой процесс прохождения урока (теория + 8 тестов)
const currentView = ref<'home' | 'sections' | 'game'>('home')

// Храним ID запущенного урока, чтобы передать его внутрь движка
const selectedLessonId = ref('lesson_1')

// Функции для навигации экрана разделов
const openSections = () => currentView.value = 'sections'
const closeSections = () => currentView.value = 'home'

// ИСПРАВЛЕНО: Функции для запуска игрового движка урока и возврата назад
const startLesson = (lessonId: string) => {
  selectedLessonId.value = lessonId
  currentView.value = 'game' // Мгновенно переключаем видимую зону на игру!
}
const closeLesson = () => {
  currentView.value = 'home' // Возвращаем из урока обратно на главную
}
</script>

<template>
  <!-- ВАРИАНТ 1: Главный экран курса (Карусель уроков) -->
  <main v-if="currentView === 'home'" class="main-layout">
    
    <div class="top-fixed-zone">
      <HeaderTitle />
      <div class="spacer-gap"></div>
      <SectionProgressBar @click="openSections" class="clickable-bar" />
    </div>

    <div class="center-adaptive-zone">
      <!-- ИСПРАВЛЕНО: Перехватываем событие запуска из карусели и вызываем старт игры -->
      <LessonsCarousel @start-game="startLesson" />
    </div>

    <div class="bottom-fixed-zone">
      <BottomMenuBar />
    </div>

  </main>

  <!-- ВАРИАНТ 2: Экран выбора глобальных разделов истории -->
  <SectionsListView 
    v-else-if="currentView === 'sections'" 
    @back="closeSections"
  />

  <!-- ИСПРАВЛЕНО: ВАРИАНТ 3: Экран прохождения самого урока (Теория + 8 Тестов) -->
  <LessonGameView 
    v-else-if="currentView === 'game'" 
    :lessonId="selectedLessonId"
    @back="closeLesson"
  />
</template>

<style scoped>
.main-layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--bg-main);
}

.top-fixed-zone {
  position: absolute;
  top: 24px;
  left: 0;
  right: 0;
  z-index: 5;
}

.spacer-gap {
  height: 24px;
}

.clickable-bar {
  cursor: pointer;
}

.center-adaptive-zone {
  position: absolute;
  top: 55%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  z-index: 2;
}

.bottom-fixed-zone {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 120px;
  z-index: 5;
}
</style>
