<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useData } from 'vitepress'

const supportedLocales = ['zh', 'en'] as const
type SupportedLocale = (typeof supportedLocales)[number]

const { theme } = useData()

const defaultLocale = computed<SupportedLocale>(() => {
  const configuredLocale = theme.value.defaultLocale
  return supportedLocales.includes(configuredLocale) ? configuredLocale : 'zh'
})

const targetPath = computed(() => `/${defaultLocale.value}/`)
const linkText = computed(() => (defaultLocale.value === 'en' ? 'Enter English site' : '进入中文版'))

onMounted(() => {
  window.location.replace(targetPath.value)
})
</script>

<template>
  <meta http-equiv="refresh" :content="`0; url=${targetPath}`">
  <a :href="targetPath">{{ linkText }}</a>
</template>
