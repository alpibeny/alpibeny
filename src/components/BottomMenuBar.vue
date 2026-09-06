<script setup lang="ts">
import { ref } from 'vue'

// Создаём переменную текущей активной вкладки. По умолчанию активна 'home'
const activeTab = ref<'home' | 'train' | 'book' | 'rank'>('home')

// Функция для изменения активной вкладки при клике
const selectTab = (tabName: 'home' | 'train' | 'book' | 'rank') => {
  activeTab.value = tabName
}
</script>

<template>
  <div class="bottom-menu-container">
    <nav class="bottom-menu-bar">
      
      <!-- 1. Вкладка: Главная (Домик) -->
      <button 
        class="menu-item" 
        :class="{ active: activeTab === 'home' }"
        @click="selectTab('home')"
      >
        <img v-if="activeTab === 'home'" src="../assets/icons/menu-home-active.svg" alt="Главная" class="icon" />
        <img v-else src="../assets/icons/menu-home.svg" alt="Главная" class="icon" />
      </button>

      <!-- 2. Вкладка: Тренировки (Гантель) -->
      <button 
        class="menu-item" 
        :class="{ active: activeTab === 'train' }"
        @click="selectTab('train')"
      >
        <img v-if="activeTab === 'train'" src="../assets/icons/menu-train-active.svg" alt="Тренировки" class="icon" />
        <img v-else src="../assets/icons/menu-train.svg" alt="Тренировки" class="icon" />
      </button>

      <!-- 3. Вкладка: Учебник (Книга) -->
      <button 
        class="menu-item" 
        :class="{ active: activeTab === 'book' }"
        @click="selectTab('book')"
      >
        <img v-if="activeTab === 'book'" src="../assets/icons/menu-book-active.svg" alt="Учебник" class="icon" />
        <img v-else src="../assets/icons/menu-book.svg" alt="Учебник" class="icon" />
      </button>

      <!-- 4. Вкладка: Статистика (Рейтинг) -->
      <button 
        class="menu-item" 
        :class="{ active: activeTab === 'rank' }"
        @click="selectTab('rank')"
      >
        <img v-if="activeTab === 'rank'" src="../assets/icons/menu-rank-active.svg" alt="Рейтинг" class="icon" />
        <img v-else src="../assets/icons/menu-rank.svg" alt="Рейтинг" class="icon" />
      </button>

    </nav>
  </div>
</template>

<style scoped>
.bottom-menu-container {
  position: fixed;
  bottom: 24px;
  left: 0;
  right: 0;
  padding: 0 24px;
  z-index: 10;
}

.bottom-menu-bar {
  height: 76px;
  background-color: var(--bg-main);
  border: 2px solid var(--stroke-main);
  border-radius: 24px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 16px;
}

.menu-item {
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 16px;
  transition: opacity 0.2s ease;
}

/* Все неактивные вкладки приглушены на 50% и показывают контурные SVG */
.menu-item:not(.active) {
  opacity: 0.5;
}

/* Активная вкладка горит на 100% яркости и показывает залитый SVG */
.menu-item.active {
  opacity: 1;
}

.icon {
  width: 28px;
  height: 28px;
  display: block;
}
</style>
