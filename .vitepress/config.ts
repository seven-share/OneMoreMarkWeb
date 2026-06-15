import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'OneMoreMark',
  description: '让每一次收藏都有价值。',
  cleanUrls: true,
  head: [
    ['link', { rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    ['link', { rel: 'apple-touch-icon', href: '/favicon.png' }]
  ],
  srcExclude: ['开发规划.md'],
  lastUpdated: false,
  themeConfig: {
    defaultLocale: 'zh',
    search: false
  },
  locales: {
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      title: 'OneMoreMark',
      description: '让每一次收藏都有价值。'
    },
    en: {
      label: 'English',
      lang: 'en-US',
      title: 'OneMoreMark',
      description: 'Make every saved bookmark valuable.'
    }
  },
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    }
  }
})
