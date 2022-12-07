import { defineConfig } from 'vite'
import { SearchPlugin } from 'vitepress-plugin-search'

export default defineConfig({
    plugins: [
        SearchPlugin({
            preset: 'performance',
            tokenize: 'full',
            previewLength: 24,
            buttonLabel: 'Search',
            placeholder: 'Find in docs'
        })
    ]
})
