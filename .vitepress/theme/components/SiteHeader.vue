<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import LanguageSelect from './LanguageSelect.vue'
import ThemeToggle from './ThemeToggle.vue'

const route = useRoute()
const isEnglish = computed(() => route.path.startsWith('/en/'))
const aboutLink = computed(() => (isEnglish.value ? '/en/posts/about' : '/zh/posts/about'))
</script>

<template>
  <header class="site-header">
    <a class="brand" :href="isEnglish ? '/en/' : '/zh/'">
      <span class="brand-mark" aria-hidden="true"></span>
      <span>OneMoreMark</span>
    </a>

    <nav class="site-nav" aria-label="Primary navigation">
      <a :href="aboutLink">{{ isEnglish ? 'About' : '关于' }}</a>
      <LanguageSelect />
      <ThemeToggle />
    </nav>
  </header>
</template>
