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
      <img class="brand-logo" :src="'/logo.png'" alt="" width="38" height="38" />
      <span>OneMoreMark</span>
    </a>

    <nav class="site-nav" aria-label="Primary navigation">
      <a class="about-nav-link" :href="aboutLink">{{ isEnglish ? 'About' : '关于' }}</a>
      <LanguageSelect />
      <ThemeToggle />
    </nav>
  </header>
</template>
