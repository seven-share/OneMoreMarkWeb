<script setup lang="ts">
import { Content, useData } from 'vitepress'
import HomePage from './components/HomePage.vue'
import CategoryPage from './components/CategoryPage.vue'
import PostPage from './components/PostPage.vue'
import SharePage from './components/SharePage.vue'

const { frontmatter } = useData()
</script>

<template>
  <HomePage v-if="frontmatter.layout === 'home'" />
  <CategoryPage v-else-if="frontmatter.layout === 'category'" />
  <SharePage v-else-if="frontmatter.layout === 'share'" />
  <PostPage v-else-if="frontmatter.layout === 'post'">
    <Content />
  </PostPage>
  <Content v-else />
</template>
