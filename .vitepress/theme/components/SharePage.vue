<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vitepress'
import { data as posts } from '../data/posts.data'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'
import SectionTitle from './SectionTitle.vue'
import ArticleCard from './ArticleCard.vue'

type SharedCategory = {
  id: string
  name: string
  order: number
}

type SharedBookmark = {
  id: string
  title: string
  url: string
  icon: string
  categoryId: string
  order: number
}

type CategoryShareJson = {
  schemaVersion: 1
  category: SharedCategory
  bookmarks: SharedBookmark[]
  updatedAt: number
}

type PublicShareResponse =
  | {
      status: 'active'
      shareId: string
      message: string
      data: CategoryShareJson
      createdAt: number
      updatedAt: number
    }
  | {
      status: 'cancelled'
      shareId?: string
      cancelledAt?: number | null
      updatedAt?: number
    }
  | {
      status: 'not_found'
    }

const API_BASE_URL = import.meta.env.VITE_CLOUDFLARE_SYNC_API_URL?.replace(/\/+$/, '') ?? ''

const route = useRoute()
const locale = computed(() => (route.path.startsWith('/en/') ? 'en' : 'zh'))
const loading = ref(true)
const error = ref(false)
const share = ref<PublicShareResponse | null>(null)
const iconIndexByBookmarkId = reactive<Record<string, number>>({})

const shareId = computed(() => {
  if (typeof window === 'undefined') return ''
  return new URLSearchParams(window.location.search).get('id')?.trim() ?? ''
})

const activeShare = computed(() => (share.value?.status === 'active' ? share.value : null))
const category = computed(() => activeShare.value?.data.category ?? null)
const bookmarks = computed(() =>
  [...(activeShare.value?.data.bookmarks ?? [])].sort((a, b) => a.order - b.order)
)
const message = computed(() => activeShare.value?.message.trim() ?? '')
const recommendPosts = computed(() =>
  posts
    .filter((post) => post.locale === locale.value && post.categorySlug === 'recommend')
    .slice(0, 5)
)
const titleText = computed(() => {
  if (loading.value) return locale.value === 'en' ? 'Opening share' : '正在打开分享'
  if (error.value) return locale.value === 'en' ? 'Share unavailable' : '分享暂时无法打开'
  if (!shareId.value || share.value?.status === 'not_found') {
    return locale.value === 'en' ? 'Share not found' : '分享不存在或已失效'
  }
  if (share.value?.status === 'cancelled') {
    return locale.value === 'en' ? 'Share cancelled' : '分享已取消'
  }
  return category.value?.name ?? (locale.value === 'en' ? 'Shared category' : '分享分类')
})
const statusText = computed(() => {
  if (loading.value) return locale.value === 'en' ? 'Loading...' : '加载中...'
  if (error.value) return locale.value === 'en' ? 'Please try again later.' : '请稍后再试。'
  if (!shareId.value || share.value?.status === 'not_found') {
    return locale.value === 'en'
      ? 'The link may be incorrect or expired.'
      : '链接可能不正确，或分享已失效。'
  }
  if (share.value?.status === 'cancelled') {
    return locale.value === 'en'
      ? 'The sharer has cancelled this share.'
      : '分享者已取消这个分享。'
  }
  return ''
})

function isHttpUrl(value: string) {
  return /^https?:\/\//i.test(value.trim())
}

function getOrigin(url: string) {
  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

function getDisplayUrl(url: string) {
  try {
    const parsed = new URL(url)
    return parsed.hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function getIconCandidates(bookmark: SharedBookmark) {
  const candidates: string[] = []
  const icon = bookmark.icon.trim()
  if (icon && isHttpUrl(icon)) {
    candidates.push(icon)
  }

  const origin = getOrigin(bookmark.url)
  if (origin) {
    candidates.push(`${origin}/favicon.ico`)
  }

  return candidates
}

function getCurrentIcon(bookmark: SharedBookmark) {
  const candidates = getIconCandidates(bookmark)
  const index = iconIndexByBookmarkId[bookmark.id] ?? 0
  return candidates[index] ?? ''
}

function handleIconError(bookmark: SharedBookmark) {
  const candidates = getIconCandidates(bookmark)
  const nextIndex = (iconIndexByBookmarkId[bookmark.id] ?? 0) + 1
  if (nextIndex < candidates.length) {
    iconIndexByBookmarkId[bookmark.id] = nextIndex
  } else {
    iconIndexByBookmarkId[bookmark.id] = candidates.length
  }
}

async function loadShare() {
  loading.value = true
  error.value = false
  share.value = null

  if (!shareId.value || !API_BASE_URL) {
    loading.value = false
    share.value = { status: 'not_found' }
    return
  }

  try {
    const response = await fetch(`${API_BASE_URL}/public/shares/${encodeURIComponent(shareId.value)}`)
    const data = (await response.json()) as PublicShareResponse
    share.value = data
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
}

watch(
  () => shareId.value,
  () => {
    void loadShare()
  }
)

onMounted(() => {
  void loadShare()
})
</script>

<template>
  <div class="site-shell">
    <SiteHeader />

    <main class="share-main">
      <section v-if="message" class="share-message-card">
        <p>{{ message }}</p>
      </section>

      <section class="share-panel">
        <div class="share-title">
          <h1>{{ titleText }}</h1>
          <p v-if="statusText">{{ statusText }}</p>
        </div>

        <div v-if="activeShare" class="share-bookmark-grid">
          <a
            v-for="bookmark in bookmarks"
            :key="bookmark.id"
            class="share-bookmark-card"
            :href="bookmark.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span class="share-bookmark-icon" aria-hidden="true">
              <img
                v-if="getCurrentIcon(bookmark)"
                :src="getCurrentIcon(bookmark)"
                alt=""
                loading="lazy"
                @error="handleIconError(bookmark)"
              />
              <svg
                v-else
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </span>
            <span class="share-bookmark-text">
              <strong>{{ bookmark.title }}</strong>
              <small>{{ getDisplayUrl(bookmark.url) }}</small>
            </span>
          </a>
        </div>
      </section>

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
    </main>

    <SiteFooter :locale="locale" />
  </div>
</template>
