import path from 'node:path'

import { defineConfig } from '@rspress/core'
import { pluginSitemap } from '@rspress/plugin-sitemap'
import tailwindcss from '@tailwindcss/postcss'

const description =
    'Ergonomic Framework for Humans. TypeScript framework supercharged by Bun with end-to-end type safety, a unified type system, and an outstanding developer experience.'

type SidebarItem = { text: string; link: string }

const labels: Record<string, string> = {
    'at-glance': 'At Glance',
    'quick-start': 'Quick Start',
    'table-of-content': 'Table of Content',
    'key-concept': 'Key Concept',
    'life-cycle': 'Life Cycle',
    'best-practice': 'Best Practice',
    'fullstack-dev-server': 'Fullstack Dev Server',
    'error-handling': 'Error Handling',
    'extends-context': 'Extends Context',
    openapi: 'OpenAPI',
    opentelemetry: 'OpenTelemetry',
    typebox: 'TypeBox (Elysia.t)',
    typescript: 'TypeScript',
    'unit-test': 'Unit Test',
    websocket: 'Web Socket',
    overview: 'Overview',
    installation: 'Installation',
    parameters: 'Parameters',
    response: 'Response',
    config: 'Config',
    legacy: 'Legacy (Treaty 1)',
    fetch: 'Eden Fetch',
    bearer: 'Bearer',
    cors: 'CORS',
    cron: 'Cron',
    'graphql-apollo': 'GraphQL Apollo',
    'graphql-yoga': 'GraphQL Yoga',
    html: 'HTML',
    jwt: 'JWT',
    static: 'Static',
    'ai-sdk': 'AI SDK',
    astro: 'Astro',
    'better-auth': 'Better Auth',
    'cloudflare-worker': 'Cloudflare Worker',
    deno: 'Deno',
    drizzle: 'Drizzle',
    expo: 'Expo',
    netlify: 'Netlify',
    nextjs: 'Next.js',
    node: 'Node.js',
    nuxt: 'Nuxt',
    prisma: 'Prisma',
    'react-email': 'React Email',
    sveltekit: 'SvelteKit',
    'tanstack-start': 'TanStack Start',
    vercel: 'Vercel',
    'jit-compiler': 'JIT Compiler'
}

const item = (link: string, text?: string): SidebarItem => {
    const slug = link.split('/').filter(Boolean).at(-1) ?? link
    return { text: text ?? labels[slug] ?? slug, link }
}

const group = (text: string, links: Array<string | [string, string]>) => ({
    text,
    collapsible: true,
    collapsed: false,
    items: links.map((entry) =>
        Array.isArray(entry) ? item(entry[0], entry[1]) : item(entry)
    )
})

const sidebar = [
    group('Getting Started', [
        '/at-glance',
        '/quick-start',
        '/table-of-content',
        '/key-concept'
    ]),
    group('Essential', [
        '/essential/route',
        '/essential/handler',
        '/essential/plugin',
        '/essential/life-cycle',
        '/essential/validation',
        '/essential/best-practice'
    ]),
    group('Patterns', [
        '/patterns/configuration',
        '/patterns/cookie',
        ['/patterns/deploy', 'Deploy to Production'],
        '/patterns/error-handling',
        '/patterns/extends-context',
        '/patterns/fullstack-dev-server',
        '/patterns/macro',
        '/patterns/mount',
        '/patterns/openapi',
        '/patterns/opentelemetry',
        '/patterns/trace',
        '/patterns/typebox',
        '/patterns/typescript',
        '/patterns/unit-test',
        '/patterns/websocket'
    ]),
    group('Eden', [
        '/eden/overview',
        '/eden/installation',
        ['/eden/treaty/overview', 'Treaty Overview'],
        ['/eden/treaty/parameters', 'Treaty Parameters'],
        ['/eden/treaty/response', 'Treaty Response'],
        ['/eden/treaty/websocket', 'Treaty Web Socket'],
        ['/eden/treaty/config', 'Treaty Config'],
        ['/eden/treaty/unit-test', 'Treaty Unit Test'],
        '/eden/treaty/legacy',
        '/eden/fetch'
    ]),
    group('Plugins', [
        '/plugins/overview',
        '/plugins/bearer',
        '/plugins/cors',
        '/plugins/cron',
        '/plugins/graphql-apollo',
        '/plugins/graphql-yoga',
        '/plugins/html',
        '/plugins/jwt',
        '/plugins/openapi',
        '/plugins/opentelemetry',
        ['/plugins/server-timing', 'Server Timing'],
        '/plugins/static'
    ]),
    group('Integration', [
        '/integrations/ai-sdk',
        '/integrations/astro',
        '/integrations/better-auth',
        '/integrations/cloudflare-worker',
        '/integrations/deno',
        '/integrations/drizzle',
        '/integrations/expo',
        '/integrations/netlify',
        '/integrations/nextjs',
        '/integrations/node',
        '/integrations/nuxt',
        '/integrations/prisma',
        '/integrations/react-email',
        '/integrations/sveltekit',
        '/integrations/tanstack-start',
        '/integrations/vercel'
    ]),
    group('Internal', ['/internal/jit-compiler'])
]

export default defineConfig({
    root: 'docs',
    title: 'ElysiaJS',
    description,
    lang: 'en-US',
    siteOrigin: 'https://elysiajs.com',
    icon: '/assets/elysia.png',
    logo: '/assets/elysia.svg',
    logoText: 'ElysiaJS',
    outDir: 'docs/.rspress/dist',
    llms: true,
    mediumZoom: { selector: '.rspress-doc [data-zoomable], .rspress-doc img' },
    route: {
        extensions: ['.md', '.mdx'],
        exclude: ['migrate/**'],
        cleanUrls: true
    },
    head: [
        ['meta', { name: 'viewport', content: 'width=device-width,initial-scale=1,user-scalable=no' }],
        ['meta', { property: 'og:image', content: 'https://elysiajs.com/assets/cover.webp' }],
        ['meta', { property: 'og:image:width', content: '2560' }],
        ['meta', { property: 'og:image:height', content: '1440' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:image', content: 'https://elysiajs.com/assets/cover.webp' }],
        ['meta', { property: 'og:title', content: 'ElysiaJS' }],
        ['meta', { property: 'og:description', content: description }],
        ['link', { rel: 'preload', as: 'image', href: '/assets/elysia_v.webp', fetchpriority: 'high' }],
        ['link', { rel: 'preload', as: 'image', href: '/assets/elysia.svg', fetchpriority: 'high' }],
        ['link', { rel: 'canonical', href: 'https://elysiajs.com' }]
    ],
    plugins: [pluginSitemap()],
    markdown: {
        link: { checkDeadLinks: false },
        shiki: {
            themes: { light: 'github-light', dark: 'github-dark' },
            langs: ['js', 'ts', 'javascript', 'typescript', 'jsx', 'tsx', 'prisma', 'bash', 'vue', 'json', 'yml']
        }
    },
    builderConfig: {
        resolve: {
            alias: {
                '@site/components': path.join(import.meta.dirname, 'theme/site-components.ts')
            }
        },
        tools: {
            postcss: (_, { addPlugins }) => addPlugins(tailwindcss())
        }
    },
    themeConfig: {
        nav: [
            { text: 'Docs', link: '/table-of-content' },
            { text: 'Blog', link: '/blog' },
            { text: 'Illust', link: '/illust' }
        ],
        sidebar: { '/': sidebar },
        lastUpdated: true,
        darkMode: 'auto',
        enableAppearanceAnimation: true,
        search: true,
        llmsUI: {
            viewOptions: ['markdownLink', 'chatgpt', 'claude'],
            placement: 'title'
        },
        socialLinks: [
            { icon: 'github', mode: 'link', content: 'https://github.com/elysiajs/elysia' },
            { icon: 'x', mode: 'link', content: 'https://twitter.com/elysiajs' },
            { icon: 'discord', mode: 'link', content: 'https://discord.gg/eaFJ2KDJck' }
        ],
        editLink: {
            docRepoBaseUrl: 'https://github.com/elysiajs/documentation/edit/main/docs'
        }
    }
})
