import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import OneMoreMarkLayout from './Layout.vue'
import RootRedirect from './components/RootRedirect.vue'
import './style.css'

export default {
  extends: DefaultTheme,
  Layout: OneMoreMarkLayout,
  enhanceApp({ app }) {
    app.component('RootRedirect', RootRedirect)
  }
} satisfies Theme
