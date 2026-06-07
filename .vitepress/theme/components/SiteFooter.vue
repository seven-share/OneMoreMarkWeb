<script setup lang="ts">
defineProps<{
  locale: 'zh' | 'en'
}>()
</script>

<template>
  <footer class="site-footer">
    © 2024 OneMoreMark.
    <span>{{ locale === 'en' ? 'Make every saved bookmark valuable.' : '让每一次收藏都有价值。' }}</span>
  </footer>
</template>
