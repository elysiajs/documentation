import { defineConfig } from 'vitepress'
import { SearchPlugin } from 'vitepress-plugin-search'

export default defineConfig({
    vite: {
        plugins: [
            SearchPlugin({
                // preset: 'performance',
                // tokenize: 'full',
                previewLength: 10,
                buttonLabel: 'Find',
                placeholder: 'Find in Elysia'
            })
        ]
    }
})
