<!-- src/App.vue -->
<script setup lang="ts">
import { ref } from 'vue'

// Импорт твоих оригинальных компонентов интерфейса
import HeaderTitle from './components/HeaderTitle.vue'
import SectionProgressBar from './components/SectionProgressBar.vue'
import LessonsCarousel from './components/LessonsCarousel.vue'
import SectionsListView from './views/SectionsListView.vue'
import LessonGameView from './views/LessonGameView.vue'
import BottomMenuBar from './components/BottomMenuBar.vue' // Твоё оригинальное меню

// Описание типов для глобальной навигации
type AppView = 'home' | 'sections' | 'game'
type AppTab = 'main' | 'training' | 'library' | 'rating'

// Строго типизированные реактивные переменные
const currentView = ref<AppView>('home')
const currentTab = ref<AppTab>('main')
const userFinishedLessonsCount = ref<number>(0)
const selectedLessonId = ref<number | null>(null)

// Навигационные методы обработки событий
const startLesson = (lessonId: number) => {
  selectedLessonId.value = lessonId
  currentView.value = 'game'
}

const closeLesson = () => {
  selectedLessonId.value = null
  currentView.value = 'home'
}

const handleTabChange = (tab: AppTab) => {
  currentTab.value = tab
}
</script>

<template>
  <div class="app-container">
    <!-- ВАРИАНТ 1: Игровой движок (Полноэкранный оверлей) -->
    <LessonGameView 
      v-if="currentView === 'game'" 
      :lessonId="selectedLessonId"
      @back="closeLesson"
    />

    <!-- ВАРИАНТ 2: Экран выбора глобальных разделов истории -->
    <SectionsListView 
      v-else-if="currentView === 'sections'" 
      :user-finished-lessons-count="userFinishedLessonsCount"
      @back="closeLesson"
    />

    <!-- ВАРИАНТ 3: ТВОЙ РОДНОЙ ИСХОДНЫЙ ГЛАВНЫЙ ЭКРАН -->
    <div v-else class="main-layout">
      <header class="app-header">
        <HeaderTitle />
        <SectionProgressBar 
          :lessons-count="userFinishedLessonsCount" 
          @click="currentView = 'sections'"
        />
      </header>

      <!-- Контентная зона текущей вкладки -->
      <main class="tab-content">
        <!-- Лента уроков (Карусель) на главной вкладке -->
        <LessonsCarousel 
          v-if="currentTab === 'main'" 
          @start-game="startLesson" 
        />

        <!-- Заглушка вкладки "Тренировка" -->
        <div v-else-if="currentTab === 'training'" class="placeholder-screen">
          <h2>Интенсивные тренировки</h2>
          <p>Случайные блиц-опросы по всем открытым эпохам.</p>
        </div>

        <!-- Заглушка вкладки "Учебник" -->
        <div v-else-if="currentTab === 'library'" class="placeholder-screen">
          <h2>Исторический учебник</h2>
          <p>Архив лекций и интерактивные хронологические карты.</p>
        </div>

        <!-- Заглушка вкладки "Рейтинг" -->
        <div v-else-if="currentTab === 'rating'" class="placeholder-screen">
          <h2>Таблица лидеров</h2>
          <p>Рейтинг знатоков истории среди пользователей.</p>
        </div>
      </main>

      <!-- ТВОЁ НАСТРОЕННОЕ МЕНЮ -->
      <BottomMenuBar 
        :active-tab="currentTab" 
        @change-tab="handleTabChange"
      />
    </div>
  </div>
</template>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  min-height: 100vh;
  overflow: hidden;
  background-color: var(--bg-main);
  color: #ffffff;
  font-family: system-ui, -apple-system, sans-serif;
}

.main-layout {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* Опускаем верхнее меню и историю Беларуси пониже от статус-бара */
.app-header {
  flex-shrink: 0;
  padding-top: calc(24px + env(safe-area-inset-bottom, 0px));
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* Идеальная математическая центровка диска между шапкой и нижним меню */
.tab-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* Центрирует карусель строго по вертикали в свободном окне */
  align-items: center;
  width: 100%;
  /* Компенсируем высоту нижнего меню, чтобы фактический центр не смещался визуально вверх */
  padding-bottom: 70px; 
  box-sizing: border-box;
}

/* Стили для будущих экранов-заглушек внутри вкладок */
.placeholder-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  padding: 0 24px;
  text-align: center;
}

.placeholder-screen h2 {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.placeholder-screen p {
  font-size: 15px;
  color: #a1a1aa;
  line-height: 1.5;
}
</style>

