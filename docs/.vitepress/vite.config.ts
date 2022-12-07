import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'

export default defineConfig({
    vite: {
        plugins: [
            SearchPlugin({
                preset: 'score',
                tokenize: 'full',
                previewLength: 10,
                buttonLabel: 'Find',
                placeholder: 'Find in Elysia'
            })
        ]
    }
})
