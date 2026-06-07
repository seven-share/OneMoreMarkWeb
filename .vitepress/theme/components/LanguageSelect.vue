<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vitepress'

const route = useRoute()
const isEnglish = computed(() => route.path.startsWith('/en/'))
const isOpen = ref(false)
const menuRef = ref<HTMLElement | null>(null)

const chinesePath = computed(() => {
  if (route.path === '/') return '/zh/'
  if (!isEnglish.value) return route.path
  return route.path.replace(/^\/en(?=\/|$)/, '/zh') || '/zh/'
})

const englishPath = computed(() => {
  if (isEnglish.value) return route.path
  if (route.path === '/') return '/en/'
  return route.path.replace(/^\/zh(?=\/|$)/, '/en') || '/en/'
})

function switchLanguage(value: 'zh' | 'en') {
  window.location.href = value === 'en' ? englishPath.value : chinesePath.value
}

function toggleMenu() {
  isOpen.value = !isOpen.value
}

function closeOnOutsideClick(event: MouseEvent) {
  if (!menuRef.value?.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', closeOnOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('click', closeOnOutsideClick)
})
</script>

<template>
  <div ref="menuRef" class="language-select">
    <span class="sr-only">{{ isEnglish ? 'Language' : '语言' }}</span>
    <button
      type="button"
      class="language-trigger"
      :aria-label="isEnglish ? 'Language' : '语言'"
      :aria-expanded="isOpen"
      @click.stop="toggleMenu"
    >
      {{ isEnglish ? 'English' : '简体中文' }}
    </button>

    <div v-if="isOpen" class="language-menu" role="menu">
      <button type="button" role="menuitem" @click="switchLanguage('zh')">简体中文</button>
      <button type="button" role="menuitem" @click="switchLanguage('en')">English</button>
    </div>
  </div>
</template>
