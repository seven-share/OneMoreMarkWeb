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

onMounted(() => {
  window.location.replace(targetPath.value)
})
</script>
