<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

type ThemeMode = 'light' | 'dark'

const mode = ref<ThemeMode>('light')

const label = computed(() => (mode.value === 'dark' ? '切换到浅色模式' : '切换到深色模式'))
const icon = computed(() => (mode.value === 'dark' ? '☀' : '☾'))

function getPreferredMode(): ThemeMode {
  const savedMode = localStorage.getItem('om-theme')
  if (savedMode === 'light' || savedMode === 'dark') return savedMode

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyMode(nextMode: ThemeMode) {
  mode.value = nextMode
  document.documentElement.classList.toggle('dark', nextMode === 'dark')
  document.documentElement.style.colorScheme = nextMode
  localStorage.setItem('om-theme', nextMode)
}

function toggleMode() {
  applyMode(mode.value === 'dark' ? 'light' : 'dark')
}

onMounted(() => {
  applyMode(getPreferredMode())
})
</script>

<template>
  <button type="button" class="theme-toggle" :aria-label="label" :title="label" @click="toggleMode">
    <span aria-hidden="true">{{ icon }}</span>
  </button>
</template>
