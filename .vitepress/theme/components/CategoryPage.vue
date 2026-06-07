<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { data as posts } from '../data/posts.data'
import { getCategory } from '../data/categories'
import { data as categories } from '../data/categories.data'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import ArticleCard from './ArticleCard.vue'
import SidebarCategories from './SidebarCategories.vue'
import SidebarPosts from './SidebarPosts.vue'

const route = useRoute()
const { frontmatter } = useData()
const locale = computed(() => (route.path.startsWith('/en/') ? 'en' : 'zh'))
const categorySlug = computed(() => String(frontmatter.value.categorySlug || ''))
const localeCategories = computed(() => categories.filter((category) => category.locale === locale.value))
const currentCategory = computed(() => getCategory(localeCategories.value, categorySlug.value))
const pageSize = 10
const currentPage = ref(1)

const localePosts = computed(() => posts.filter((post) => post.locale === locale.value))
const categoryPosts = computed(() =>
  localePosts.value
    .filter((post) => post.categorySlug === categorySlug.value)
    .sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
)
const pageCount = computed(() => Math.max(1, Math.ceil(categoryPosts.value.length / pageSize)))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return categoryPosts.value.slice(start, start + pageSize)
})
const hotPosts = computed(() => localePosts.value.filter((post) => post.hot).slice(0, 5))
const currentCategoryIcon = computed(() =>
  currentCategory.value ? `/icons/category/${currentCategory.value.icon}.svg` : ''
)

function readPageFromUrl() {
  if (typeof window === 'undefined') return

  const page = Number(new URLSearchParams(window.location.search).get('page') || 1)
  currentPage.value = clampPage(page)
}

function clampPage(page: number) {
  if (!Number.isFinite(page)) return 1
  return Math.min(Math.max(1, Math.trunc(page)), pageCount.value)
}

function goToPage(page: number) {
  currentPage.value = clampPage(page)

  if (typeof window === 'undefined') return

  const url = new URL(window.location.href)
  if (currentPage.value === 1) {
    url.searchParams.delete('page')
  } else {
    url.searchParams.set('page', String(currentPage.value))
  }
  window.history.pushState({}, '', url)
}

onMounted(() => {
  readPageFromUrl()
  window.addEventListener('popstate', readPageFromUrl)
})

onUnmounted(() => {
  window.removeEventListener('popstate', readPageFromUrl)
})

watch([categorySlug, locale], () => {
  currentPage.value = 1
})

watch(pageCount, () => {
  currentPage.value = clampPage(currentPage.value)
})
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main class="content-layout">
      <section class="category-content">
        <div class="category-title">
          <span>
            <img v-if="currentCategoryIcon" :src="currentCategoryIcon" alt="" aria-hidden="true" />
          </span>
          <div>
            <h1>{{ currentCategory?.name || frontmatter.title }}</h1>
            <p>
              {{
                locale === 'en'
                  ? `${categoryPosts.length} curated articles`
                  : `共 ${categoryPosts.length} 篇精选文章`
              }}
            </p>
          </div>
        </div>

        <div class="category-post-grid">
          <ArticleCard v-for="post in paginatedPosts" :key="post.url" :post="post" />
        </div>

        <div v-if="pageCount > 1" class="pagination" aria-label="Pagination">
          <button type="button" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
            {{ locale === 'en' ? 'Prev' : '上一页' }}
          </button>
          <button
            v-for="page in pageCount"
            :key="page"
            type="button"
            :class="{ active: page === currentPage }"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
          <button type="button" :disabled="currentPage === pageCount" @click="goToPage(currentPage + 1)">
            {{ locale === 'en' ? 'Next' : '下一页' }}
          </button>
        </div>
      </section>

      <aside class="sidebar-stack">
        <SidebarCategories :posts="posts" :locale="locale" />
        <SidebarPosts :title="locale === 'en' ? 'Popular Articles' : '热门文章'" :posts="hotPosts" />
      </aside>
    </main>

    <SiteFooter :locale="locale" />
  </div>
</template>
