<script setup lang="ts">
import { computed } from 'vue'
import type { PostItem } from '../data/posts.data'
import { data as categories } from '../data/categories.data'

const props = defineProps<{
  posts: PostItem[]
  locale: 'zh' | 'en'
}>()

const visibleCategories = computed(() =>
  categories.filter((category) => category.locale === props.locale)
)

function countPosts(slug: string) {
  return props.posts.filter((post) => post.locale === props.locale && post.categorySlug === slug).length
}
</script>

<template>
  <aside class="sidebar-panel">
    <h2>{{ locale === 'en' ? 'Categories' : '分类目录' }}</h2>
    <a
      v-for="category in visibleCategories"
      :key="category.slug"
      class="sidebar-row"
      :href="locale === 'en' ? `/en/category/${category.slug}` : `/zh/category/${category.slug}`"
    >
      <span>{{ category.name }}</span>
      <strong>{{ countPosts(category.slug) }}</strong>
    </a>
  </aside>
</template>
