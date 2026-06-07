<script setup lang="ts">
import type { PostItem } from '../data/posts.data'

defineProps<{
  title: string
  posts: PostItem[]
}>()
</script>

<template>
  <aside class="sidebar-panel">
    <h2>{{ title }}</h2>
    <a v-for="post in posts" :key="post.url" class="sidebar-post" :href="post.url">
      <div class="sidebar-thumb" :data-category="post.categorySlug">
        <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" />
      </div>
      <span>{{ post.title }}</span>
    </a>
  </aside>
</template>
