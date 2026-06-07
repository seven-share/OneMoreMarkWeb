<script setup lang="ts">
import type { PostItem } from '../data/posts.data'

defineProps<{
  post: PostItem
}>()
</script>

<template>
  <a class="article-list-item" :href="post.url">
    <div class="list-cover" :data-category="post.categorySlug">
      <img v-if="post.cover" :src="post.cover" :alt="post.title" loading="lazy" />
    </div>
    <div>
      <h3>{{ post.title }}</h3>
    </div>
  </a>
</template>
