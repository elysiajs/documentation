// https://vitepress.dev/guide/custom-theme
import { h } from 'vue'
import DefaultTheme from 'vitepress/theme'
// @ts-ignore
import Layout from '../../.vitepress/theme/Layout.vue'
import './custom.css'

export default {
    extends: DefaultTheme,
    Layout
}
