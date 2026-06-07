<script setup lang="ts">
defineProps<{
  title: string
  link?: string
  linkText?: string
}>()
</script>

<template>
  <div class="section-heading">
    <h2>{{ title }}</h2>
    <a v-if="link" :href="link">{{ linkText }}</a>
  </div>
</template>
