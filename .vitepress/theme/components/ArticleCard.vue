<script setup lang="ts">
import type { PostItem } from '../data/posts.data'

defineProps<{
  post: PostItem
  compact?: boolean
  hideMeta?: boolean
}>()

function formatDate(date: string) {
  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return String(date).slice(0, 10)
  }

  return parsed.toISOString().slice(0, 10)
}
</script>

<template>
  <a class="article-card" :class="{ compact }" :href="post.url">
    <div class="article-cover" :data-category="post.categorySlug">
      <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" />
    </div>
    <div class="article-card-body">
      <div v-if="!hideMeta" class="article-card-meta">
        <span v-if="post.pinned" class="pinned">{{ post.locale === 'en' ? 'Pinned' : '置顶' }}</span>
        <time>{{ formatDate(post.date) }}</time>
      </div>
      <h3>{{ post.title }}</h3>
    </div>
  </a>
</template>
