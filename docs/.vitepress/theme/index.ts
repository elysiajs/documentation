// https://vitepress.dev/guide/custom-theme
import DefaultTheme from 'vitepress/theme'
import Layout from './layout.vue'
import './custom.css'
import { Theme } from 'vitepress'

export default {
    extends: DefaultTheme,
    Layout
} satisfies Theme
