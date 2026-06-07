<script setup lang="ts">
import type { Category } from '../data/categories'

defineProps<{
  category: Category
  count: number
  locale: 'zh' | 'en'
}>()

function getCategoryIcon(category: Category) {
  return `/icons/category/${category.icon}.svg`
}
</script>

<template>
  <a class="category-card" :href="locale === 'en' ? `/en/category/${category.slug}` : `/zh/category/${category.slug}`">
    <span class="category-icon">
      <img :src="getCategoryIcon(category)" alt="" loading="lazy" aria-hidden="true" />
    </span>
    <span>
      <strong>{{ category.name }}</strong>
      <small>{{ count }} {{ locale === 'en' ? 'articles' : '篇文章' }}</small>
    </span>
  </a>
</template>
