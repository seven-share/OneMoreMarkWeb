<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../data/posts.data'
import { data as categories } from '../data/categories.data'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import SectionTitle from './SectionTitle.vue'
import ArticleCard from './ArticleCard.vue'
import ArticleListItem from './ArticleListItem.vue'
import CategoryCard from './CategoryCard.vue'

const route = useRoute()
const locale = computed(() => (route.path.startsWith('/en/') ? 'en' : 'zh'))
const localePosts = computed(() => posts.filter((post) => post.locale === locale.value))
const recommendPosts = computed(() => localePosts.value.filter((post) => post.categorySlug === 'recommend').slice(0, 5))
const featuredPosts = computed(() => localePosts.value.filter((post) => post.categorySlug === 'featured').slice(0, 5))
const browseCategories = computed(() =>
  categories.filter((category) => category.locale === locale.value && !['recommend', 'featured'].includes(category.slug))
)

function countPosts(slug: string) {
  return localePosts.value.filter((post) => post.categorySlug === slug).length
}
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main class="home-main">
      <section class="page-section">
        <SectionTitle
          :title="locale === 'en' ? `Today's Picks` : '今日推荐'"
          :link="locale === 'en' ? '/en/category/recommend' : '/zh/category/recommend'"
          :link-text="locale === 'en' ? 'View all →' : '查看全部 →'"
        />
        <div class="recommend-grid">
          <ArticleCard v-for="post in recommendPosts" :key="post.url" :post="post" compact hide-meta />
        </div>
      </section>

      <section class="page-section">
        <SectionTitle
          :title="locale === 'en' ? 'Featured Articles' : '精选文章'"
          :link="locale === 'en' ? '/en/category/featured' : '/zh/category/featured'"
          :link-text="locale === 'en' ? 'View all →' : '查看全部 →'"
        />
        <div class="featured-grid">
          <ArticleListItem v-for="post in featuredPosts" :key="post.url" :post="post" />
        </div>
      </section>

      <section class="page-section">
        <SectionTitle :title="locale === 'en' ? 'Browse Categories' : '分类浏览'" />
        <div class="category-grid">
          <CategoryCard
            v-for="category in browseCategories"
            :key="category.slug"
            :category="category"
            :locale="locale"
            :count="countPosts(category.slug)"
          />
        </div>
      </section>
    </main>

    <SiteFooter :locale="locale" />
  </div>
</template>
