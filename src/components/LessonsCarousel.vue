<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { lessonsMetaList } from '../data/lessonsRepository'

interface CarouselItem {
  number: number;
  title: string;
  status: 'passed' | 'active' | 'locked';
  buttonText: 'ПОВТОРИТЬ' | 'НАЧАТЬ';
}

const emit = defineEmits(['start-game'])

const totalLessons = 100
const lessons = ref<CarouselItem[]>(
  // ИСПРАВЛЕНО: Прямо используем meta.number без создания лишних переменных, код теперь 100% стабилен!
  lessonsMetaList.map((meta) => {
    if (meta.number === 1) {
      return { 
        number: meta.number, 
        title: meta.title, 
        status: 'active',
        buttonText: 'НАЧАТЬ'
      }
    }
    return { 
      number: meta.number, 
      title: meta.title, 
      status: 'locked',
      buttonText: 'НАЧАТЬ'
    }
  })
)

const carouselWrapperRef = ref<HTMLElement | null>(null)
const currentIndex = ref(0)
const diskWidth = 240 
const gap = 40        

onMounted(() => {
  setTimeout(() => {
    if (carouselWrapperRef.value) {
      carouselWrapperRef.value.scrollLeft = 0
    }
  }, 120)
})

const handleScroll = (event: Event) => {
  const container = event.target as HTMLElement
  if (!container) return
  
  const scrollPosition = container.scrollLeft
  const itemTotalWidth = diskWidth + gap
  const calculatedIndex = Math.round(scrollPosition / itemTotalWidth)
  
  if (calculatedIndex !== currentIndex.value && calculatedIndex >= 0 && calculatedIndex < totalLessons) {
    currentIndex.value = calculatedIndex
  }
}

const visibleLessons = computed(() => {
  const range = 2 
  const start = Math.max(0, currentIndex.value - range)
  const end = Math.min(totalLessons - 1, currentIndex.value + range)
  
  return lessons.value.map((lesson, index) => {
    if (index >= start && index <= end) {
      return { ...lesson, shouldRender: true }
    }
    return { ...lesson, shouldRender: false }
  })
})

const handleLessonClick = (lesson: CarouselItem) => {
  if (lesson.status === 'locked') return
  emit('start-game', `lesson_${lesson.number}`)
}
</script>

<template>
  <div class="carousel-wrapper" ref="carouselWrapperRef" @scroll="handleScroll">
    <div class="carousel-container">
      
      <template v-for="lesson in visibleLessons" :key="lesson.number">
        <div 
          v-if="lesson.shouldRender"
          class="lesson-disk"
          :class="lesson.status"
          @click="handleLessonClick(lesson)"
        >
          <div class="disk-content" @click.stop="handleLessonClick(lesson)">
            <span class="lesson-meta">Урок {{ lesson.number }}</span>
            <p class="lesson-title">{{ lesson.title }}</p>
            
            <div 
              v-if="lesson.status === 'passed' || lesson.status === 'active'" 
              class="action-btn"
              @click.stop="handleLessonClick(lesson)"
            >
              {{ lesson.buttonText }}
            </div>
          </div>
        </div>

        <div v-else class="lesson-disk-placeholder"></div>
      </template>

    </div>
  </div>
</template>

<style scoped>
@import '../assets/styles/carousel.css';
</style>
