// docs/.vitepress/config.ts
import { defineConfig } from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/vitepress/dist/node/index.js";
import { transformerTwoslash } from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/@shikijs/vitepress-twoslash/dist/index.mjs";
import { createFileSystemTypesCache } from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/@shikijs/vitepress-twoslash/dist/cache-fs.mjs";
import tailwindcss from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/@tailwindcss/vite/dist/index.mjs";
import llmstxt from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/vitepress-plugin-llms/dist/index.js";
import {
  GitChangelog,
  GitChangelogMarkdownSection
} from "file:///Users/saltyaom/Documents/web/elysia/documentation/node_modules/@nolebase/vitepress-plugin-git-changelog/dist/vite/index.mjs";
var description = "Ergonomic Framework for Humans. TypeScript framework supercharged by Bun with End - to - End Type Safety, unified type system and outstanding developer experience";
var config_default = defineConfig({
  lang: "en-US",
  title: "ElysiaJS",
  // description,
  ignoreDeadLinks: true,
  lastUpdated: true,
  markdown: {
    theme: {
      light: "github-light",
      dark: "github-dark"
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache({
          dir: "./docs/.vitepress/cache/twoslash"
        })
      })
    ]
  },
  // ![INFO] uncomment for support hot reload on WSL - https://github.com/vitejs/vite/issues/1153#issuecomment-785467271
  vite: {
    server: {
      watch: {
        usePolling: true
      }
    },
    plugins: [
      tailwindcss(),
      process.env.NODE_ENV === "production" ? llmstxt() : [],
      GitChangelog({
        repoURL: () => "https://github.com/elysiajs/documentation"
      }),
      GitChangelogMarkdownSection()
    ]
  },
  head: [
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no"
      }
    ],
    [
      "link",
      {
        rel: "icon",
        href: "/assets/elysia.png"
      }
    ],
    [
      "meta",
      {
        property: "og:image",
        content: "https://elysiajs.com/assets/cover.jpg"
      }
    ],
    [
      "meta",
      {
        property: "og:image:width",
        content: "1920"
      }
    ],
    [
      "meta",
      {
        property: "og:image:height",
        content: "1080"
      }
    ],
    [
      "meta",
      {
        property: "twitter:card",
        content: "summary_large_image"
      }
    ],
    [
      "meta",
      {
        property: "twitter:image",
        content: "https://elysiajs.com/assets/cover.jpg"
      }
    ],
    [
      "meta",
      {
        property: "og:title",
        content: "ElysiaJS"
      }
    ],
    [
      "meta",
      {
        property: "og:description",
        content: description
      }
    ]
  ],
  themeConfig: {
    search: {
      provider: "local",
      options: {
        detailedView: true
      }
    },
    logo: "/assets/elysia.svg",
    nav: [
      {
        text: "Cheat Sheet",
        link: "/integrations/cheat-sheet"
      },
      {
        text: "Plugins",
        link: "/plugins/overview"
      },
      {
        text: "Blog",
        link: "/blog"
      }
    ],
    sidebar: [
      {
        text: "Getting Started",
        items: [
          {
            text: "At Glance",
            link: "/at-glance"
          },
          {
            text: "Quick Start",
            link: "/quick-start"
          },
          {
            text: "Tutorial",
            link: "/tutorial"
          },
          {
            text: "Key Concept",
            link: "/key-concept"
          },
          {
            text: "Table of Content",
            link: "/table-of-content"
          }
        ]
      },
      {
        text: "Essential",
        collapsed: true,
        items: [
          {
            text: "Route",
            link: "/essential/route"
          },
          {
            text: "Handler",
            link: "/essential/handler"
          },
          {
            text: "Life Cycle",
            link: "/essential/life-cycle"
          },
          {
            text: "Validation",
            link: "/essential/validation"
          },
          {
            text: "Plugin",
            link: "/essential/plugin"
          },
          {
            text: "Best Practice",
            link: "/essential/best-practice"
          }
        ]
      },
      {
        text: "Patterns",
        collapsed: true,
        items: [
          {
            text: "Configuration",
            link: "/patterns/configuration"
          },
          {
            text: "Type",
            link: "/patterns/type"
          },
          {
            text: "Macro",
            link: "/patterns/macro"
          },
          {
            text: "Cookie",
            link: "/patterns/cookie"
          },
          {
            text: "Web Socket",
            link: "/patterns/websocket"
          },
          {
            text: "Unit Test",
            link: "/patterns/unit-test"
          },
          {
            text: "Mount",
            link: "/patterns/mount"
          },
          {
            text: "Trace",
            link: "/patterns/trace"
          }
        ]
      },
      {
        text: "Recipe",
        collapsed: true,
        items: [
          {
            text: "Better Auth",
            link: "/recipe/better-auth"
          },
          {
            text: "Drizzle",
            link: "/recipe/drizzle"
          },
          {
            text: "OpenAPI",
            link: "/recipe/openapi"
          },
          {
            text: "Opentelemetry",
            link: "/recipe/opentelemetry"
          },
          {
            text: "React Email",
            link: "/recipe/react-email"
          }
        ]
      },
      {
        text: "Eden",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/eden/overview.md"
          },
          {
            text: "Installation",
            link: "/eden/installation.md"
          },
          {
            text: "Eden Treaty",
            collapsed: false,
            items: [
              {
                text: "Overview",
                link: "/eden/treaty/overview"
              },
              {
                text: "Parameters",
                link: "/eden/treaty/parameters"
              },
              {
                text: "Response",
                link: "/eden/treaty/response"
              },
              {
                text: "Web Socket",
                link: "/eden/treaty/websocket"
              },
              {
                text: "Config",
                link: "/eden/treaty/config"
              },
              {
                text: "Unit Test",
                link: "/eden/treaty/unit-test"
              },
              {
                text: "Legacy (Treaty 1)",
                link: "/eden/treaty/legacy.md"
              }
            ]
          },
          {
            text: "Eden Fetch",
            link: "/eden/fetch.md"
          }
        ]
      },
      {
        text: "Plugins",
        collapsed: true,
        items: [
          {
            text: "Overview",
            link: "/plugins/overview"
          },
          {
            text: "Bearer",
            link: "/plugins/bearer"
          },
          {
            text: "CORS",
            link: "/plugins/cors"
          },
          {
            text: "Cron",
            link: "/plugins/cron"
          },
          {
            text: "GraphQL Apollo",
            link: "/plugins/graphql-apollo"
          },
          {
            text: "GraphQL Yoga",
            link: "/plugins/graphql-yoga"
          },
          {
            text: "HTML",
            link: "/plugins/html"
          },
          {
            text: "JWT",
            link: "/plugins/jwt"
          },
          {
            text: "OpenTelemetry",
            link: "/plugins/opentelemetry"
          },
          {
            text: "Server Timing",
            link: "/plugins/server-timing"
          },
          {
            text: "Static",
            link: "/plugins/static"
          },
          {
            text: "Stream",
            link: "/plugins/stream"
          },
          {
            text: "Swagger",
            link: "/plugins/swagger"
          },
          {
            text: "trpc",
            link: "/plugins/trpc"
          }
        ]
      },
      {
        text: "Integration",
        collapsed: true,
        items: [
          {
            text: "Nextjs",
            link: "/integrations/nextjs"
          },
          {
            text: "Expo",
            link: "/integrations/expo"
          },
          {
            text: "Astro",
            link: "/integrations/astro"
          },
          {
            text: "SvelteKit",
            link: "/integrations/sveltekit"
          }
        ]
      }
    ],
    outline: {
      level: [2, 3],
      label: "Outline"
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/elysiajs/elysia" },
      { icon: "twitter", link: "https://twitter.com/elysiajs" },
      { icon: "discord", link: "https://discord.gg/eaFJ2KDJck" }
    ],
    editLink: {
      text: "Edit this page on GitHub",
      pattern: "https://github.com/elysiajs/documentation/edit/main/docs/:path"
    }
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiZG9jcy8udml0ZXByZXNzL2NvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9zYWx0eWFvbS9Eb2N1bWVudHMvd2ViL2VseXNpYS9kb2N1bWVudGF0aW9uL2RvY3MvLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL3NhbHR5YW9tL0RvY3VtZW50cy93ZWIvZWx5c2lhL2RvY3VtZW50YXRpb24vZG9jcy8udml0ZXByZXNzL2NvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc2FsdHlhb20vRG9jdW1lbnRzL3dlYi9lbHlzaWEvZG9jdW1lbnRhdGlvbi9kb2NzLy52aXRlcHJlc3MvY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xuXG5pbXBvcnQgeyB0cmFuc2Zvcm1lclR3b3NsYXNoIH0gZnJvbSAnQHNoaWtpanMvdml0ZXByZXNzLXR3b3NsYXNoJ1xuaW1wb3J0IHsgY3JlYXRlRmlsZVN5c3RlbVR5cGVzQ2FjaGUgfSBmcm9tICdAc2hpa2lqcy92aXRlcHJlc3MtdHdvc2xhc2gvY2FjaGUtZnMnXG5cbmltcG9ydCB0YWlsd2luZGNzcyBmcm9tICdAdGFpbHdpbmRjc3Mvdml0ZSdcblxuaW1wb3J0IGxsbXN0eHQgZnJvbSAndml0ZXByZXNzLXBsdWdpbi1sbG1zJ1xuXG5pbXBvcnQge1xuXHRHaXRDaGFuZ2Vsb2csXG5cdEdpdENoYW5nZWxvZ01hcmtkb3duU2VjdGlvblxufSBmcm9tICdAbm9sZWJhc2Uvdml0ZXByZXNzLXBsdWdpbi1naXQtY2hhbmdlbG9nL3ZpdGUnXG5cbmNvbnN0IGRlc2NyaXB0aW9uID1cblx0J0VyZ29ub21pYyBGcmFtZXdvcmsgZm9yIEh1bWFucy4gVHlwZVNjcmlwdCBmcmFtZXdvcmsgc3VwZXJjaGFyZ2VkIGJ5IEJ1biB3aXRoIEVuZCAtIHRvIC0gRW5kIFR5cGUgU2FmZXR5LCB1bmlmaWVkIHR5cGUgc3lzdGVtIGFuZCBvdXRzdGFuZGluZyBkZXZlbG9wZXIgZXhwZXJpZW5jZSdcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcblx0bGFuZzogJ2VuLVVTJyxcblx0dGl0bGU6ICdFbHlzaWFKUycsXG5cdC8vIGRlc2NyaXB0aW9uLFxuXHRpZ25vcmVEZWFkTGlua3M6IHRydWUsXG5cdGxhc3RVcGRhdGVkOiB0cnVlLFxuXHRtYXJrZG93bjoge1xuXHRcdHRoZW1lOiB7XG5cdFx0XHRsaWdodDogJ2dpdGh1Yi1saWdodCcsXG5cdFx0XHRkYXJrOiAnZ2l0aHViLWRhcmsnXG5cdFx0fSxcblx0XHRjb2RlVHJhbnNmb3JtZXJzOiBbXG5cdFx0XHR0cmFuc2Zvcm1lclR3b3NsYXNoKHtcblx0XHRcdFx0dHlwZXNDYWNoZTogY3JlYXRlRmlsZVN5c3RlbVR5cGVzQ2FjaGUoe1xuXHRcdFx0XHRcdGRpcjogJy4vZG9jcy8udml0ZXByZXNzL2NhY2hlL3R3b3NsYXNoJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0XHRdXG5cdH0sXG5cblx0Ly8gIVtJTkZPXSB1bmNvbW1lbnQgZm9yIHN1cHBvcnQgaG90IHJlbG9hZCBvbiBXU0wgLSBodHRwczovL2dpdGh1Yi5jb20vdml0ZWpzL3ZpdGUvaXNzdWVzLzExNTMjaXNzdWVjb21tZW50LTc4NTQ2NzI3MVxuXHR2aXRlOiB7XG5cdFx0c2VydmVyOiB7XG5cdFx0XHR3YXRjaDoge1xuXHRcdFx0XHR1c2VQb2xsaW5nOiB0cnVlXG5cdFx0XHR9XG5cdFx0fSxcblx0XHRwbHVnaW5zOiBbXG5cdFx0XHR0YWlsd2luZGNzcygpIGFzIGFueSxcblx0XHRcdHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAncHJvZHVjdGlvbicgPyBsbG1zdHh0KCkgOiBbXSxcblx0XHRcdEdpdENoYW5nZWxvZyh7XG5cdFx0XHRcdHJlcG9VUkw6ICgpID0+ICdodHRwczovL2dpdGh1Yi5jb20vZWx5c2lhanMvZG9jdW1lbnRhdGlvbidcblx0XHRcdH0pLFxuXHRcdFx0R2l0Q2hhbmdlbG9nTWFya2Rvd25TZWN0aW9uKClcblx0XHRdXG5cdH0sXG5cdGhlYWQ6IFtcblx0XHRbXG5cdFx0XHQnbWV0YScsXG5cdFx0XHR7XG5cdFx0XHRcdG5hbWU6ICd2aWV3cG9ydCcsXG5cdFx0XHRcdGNvbnRlbnQ6ICd3aWR0aD1kZXZpY2Utd2lkdGgsaW5pdGlhbC1zY2FsZT0xLHVzZXItc2NhbGFibGU9bm8nXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRbXG5cdFx0XHQnbGluaycsXG5cdFx0XHR7XG5cdFx0XHRcdHJlbDogJ2ljb24nLFxuXHRcdFx0XHRocmVmOiAnL2Fzc2V0cy9lbHlzaWEucG5nJ1xuXHRcdFx0fVxuXHRcdF0sXG5cdFx0W1xuXHRcdFx0J21ldGEnLFxuXHRcdFx0e1xuXHRcdFx0XHRwcm9wZXJ0eTogJ29nOmltYWdlJyxcblx0XHRcdFx0Y29udGVudDogJ2h0dHBzOi8vZWx5c2lhanMuY29tL2Fzc2V0cy9jb3Zlci5qcGcnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRbXG5cdFx0XHQnbWV0YScsXG5cdFx0XHR7XG5cdFx0XHRcdHByb3BlcnR5OiAnb2c6aW1hZ2U6d2lkdGgnLFxuXHRcdFx0XHRjb250ZW50OiAnMTkyMCdcblx0XHRcdH1cblx0XHRdLFxuXHRcdFtcblx0XHRcdCdtZXRhJyxcblx0XHRcdHtcblx0XHRcdFx0cHJvcGVydHk6ICdvZzppbWFnZTpoZWlnaHQnLFxuXHRcdFx0XHRjb250ZW50OiAnMTA4MCdcblx0XHRcdH1cblx0XHRdLFxuXHRcdFtcblx0XHRcdCdtZXRhJyxcblx0XHRcdHtcblx0XHRcdFx0cHJvcGVydHk6ICd0d2l0dGVyOmNhcmQnLFxuXHRcdFx0XHRjb250ZW50OiAnc3VtbWFyeV9sYXJnZV9pbWFnZSdcblx0XHRcdH1cblx0XHRdLFxuXHRcdFtcblx0XHRcdCdtZXRhJyxcblx0XHRcdHtcblx0XHRcdFx0cHJvcGVydHk6ICd0d2l0dGVyOmltYWdlJyxcblx0XHRcdFx0Y29udGVudDogJ2h0dHBzOi8vZWx5c2lhanMuY29tL2Fzc2V0cy9jb3Zlci5qcGcnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRbXG5cdFx0XHQnbWV0YScsXG5cdFx0XHR7XG5cdFx0XHRcdHByb3BlcnR5OiAnb2c6dGl0bGUnLFxuXHRcdFx0XHRjb250ZW50OiAnRWx5c2lhSlMnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRbXG5cdFx0XHQnbWV0YScsXG5cdFx0XHR7XG5cdFx0XHRcdHByb3BlcnR5OiAnb2c6ZGVzY3JpcHRpb24nLFxuXHRcdFx0XHRjb250ZW50OiBkZXNjcmlwdGlvblxuXHRcdFx0fVxuXHRcdF1cblx0XSxcblx0dGhlbWVDb25maWc6IHtcblx0XHRzZWFyY2g6IHtcblx0XHRcdHByb3ZpZGVyOiAnbG9jYWwnLFxuXHRcdFx0b3B0aW9uczoge1xuXHRcdFx0XHRkZXRhaWxlZFZpZXc6IHRydWVcblx0XHRcdH1cblx0XHR9LFxuXHRcdGxvZ286ICcvYXNzZXRzL2VseXNpYS5zdmcnLFxuXHRcdG5hdjogW1xuXHRcdFx0e1xuXHRcdFx0XHR0ZXh0OiAnQ2hlYXQgU2hlZXQnLFxuXHRcdFx0XHRsaW5rOiAnL2ludGVncmF0aW9ucy9jaGVhdC1zaGVldCdcblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHRleHQ6ICdQbHVnaW5zJyxcblx0XHRcdFx0bGluazogJy9wbHVnaW5zL292ZXJ2aWV3J1xuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0dGV4dDogJ0Jsb2cnLFxuXHRcdFx0XHRsaW5rOiAnL2Jsb2cnXG5cdFx0XHR9XG5cdFx0XSxcblx0XHRzaWRlYmFyOiBbXG5cdFx0XHR7XG5cdFx0XHRcdHRleHQ6ICdHZXR0aW5nIFN0YXJ0ZWQnLFxuXHRcdFx0XHRpdGVtczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdBdCBHbGFuY2UnLFxuXHRcdFx0XHRcdFx0bGluazogJy9hdC1nbGFuY2UnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnUXVpY2sgU3RhcnQnLFxuXHRcdFx0XHRcdFx0bGluazogJy9xdWljay1zdGFydCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdUdXRvcmlhbCcsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3R1dG9yaWFsJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0tleSBDb25jZXB0Jyxcblx0XHRcdFx0XHRcdGxpbms6ICcva2V5LWNvbmNlcHQnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnVGFibGUgb2YgQ29udGVudCcsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3RhYmxlLW9mLWNvbnRlbnQnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHR0ZXh0OiAnRXNzZW50aWFsJyxcblx0XHRcdFx0Y29sbGFwc2VkOiB0cnVlLFxuXHRcdFx0XHRpdGVtczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdSb3V0ZScsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL2Vzc2VudGlhbC9yb3V0ZSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdIYW5kbGVyJyxcblx0XHRcdFx0XHRcdGxpbms6ICcvZXNzZW50aWFsL2hhbmRsZXInXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnTGlmZSBDeWNsZScsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL2Vzc2VudGlhbC9saWZlLWN5Y2xlJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ1ZhbGlkYXRpb24nLFxuXHRcdFx0XHRcdFx0bGluazogJy9lc3NlbnRpYWwvdmFsaWRhdGlvbidcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdQbHVnaW4nLFxuXHRcdFx0XHRcdFx0bGluazogJy9lc3NlbnRpYWwvcGx1Z2luJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0Jlc3QgUHJhY3RpY2UnLFxuXHRcdFx0XHRcdFx0bGluazogJy9lc3NlbnRpYWwvYmVzdC1wcmFjdGljZSdcblx0XHRcdFx0XHR9XG5cdFx0XHRcdF1cblx0XHRcdH0sXG5cdFx0XHR7XG5cdFx0XHRcdHRleHQ6ICdQYXR0ZXJucycsXG5cdFx0XHRcdGNvbGxhcHNlZDogdHJ1ZSxcblx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnQ29uZmlndXJhdGlvbicsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BhdHRlcm5zL2NvbmZpZ3VyYXRpb24nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnVHlwZScsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BhdHRlcm5zL3R5cGUnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnTWFjcm8nLFxuXHRcdFx0XHRcdFx0bGluazogJy9wYXR0ZXJucy9tYWNybydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdDb29raWUnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wYXR0ZXJucy9jb29raWUnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnV2ViIFNvY2tldCcsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BhdHRlcm5zL3dlYnNvY2tldCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdVbml0IFRlc3QnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wYXR0ZXJucy91bml0LXRlc3QnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnTW91bnQnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wYXR0ZXJucy9tb3VudCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdUcmFjZScsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BhdHRlcm5zL3RyYWNlJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0dGV4dDogJ1JlY2lwZScsXG5cdFx0XHRcdGNvbGxhcHNlZDogdHJ1ZSxcblx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnQmV0dGVyIEF1dGgnLFxuXHRcdFx0XHRcdFx0bGluazogJy9yZWNpcGUvYmV0dGVyLWF1dGgnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnRHJpenpsZScsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3JlY2lwZS9kcml6emxlJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ09wZW5BUEknLFxuXHRcdFx0XHRcdFx0bGluazogJy9yZWNpcGUvb3BlbmFwaSdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdPcGVudGVsZW1ldHJ5Jyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcmVjaXBlL29wZW50ZWxlbWV0cnknXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnUmVhY3QgRW1haWwnLFxuXHRcdFx0XHRcdFx0bGluazogJy9yZWNpcGUvcmVhY3QtZW1haWwnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHR0ZXh0OiAnRWRlbicsXG5cdFx0XHRcdGNvbGxhcHNlZDogdHJ1ZSxcblx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnT3ZlcnZpZXcnLFxuXHRcdFx0XHRcdFx0bGluazogJy9lZGVuL292ZXJ2aWV3Lm1kJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0luc3RhbGxhdGlvbicsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL2VkZW4vaW5zdGFsbGF0aW9uLm1kJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0VkZW4gVHJlYXR5Jyxcblx0XHRcdFx0XHRcdGNvbGxhcHNlZDogZmFsc2UsXG5cdFx0XHRcdFx0XHRpdGVtczogW1xuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ092ZXJ2aWV3Jyxcblx0XHRcdFx0XHRcdFx0XHRsaW5rOiAnL2VkZW4vdHJlYXR5L292ZXJ2aWV3J1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1BhcmFtZXRlcnMnLFxuXHRcdFx0XHRcdFx0XHRcdGxpbms6ICcvZWRlbi90cmVhdHkvcGFyYW1ldGVycydcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdSZXNwb25zZScsXG5cdFx0XHRcdFx0XHRcdFx0bGluazogJy9lZGVuL3RyZWF0eS9yZXNwb25zZSdcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdXZWIgU29ja2V0Jyxcblx0XHRcdFx0XHRcdFx0XHRsaW5rOiAnL2VkZW4vdHJlYXR5L3dlYnNvY2tldCdcblx0XHRcdFx0XHRcdFx0fSxcblx0XHRcdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0XHRcdHRleHQ6ICdDb25maWcnLFxuXHRcdFx0XHRcdFx0XHRcdGxpbms6ICcvZWRlbi90cmVhdHkvY29uZmlnJ1xuXHRcdFx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHRcdFx0dGV4dDogJ1VuaXQgVGVzdCcsXG5cdFx0XHRcdFx0XHRcdFx0bGluazogJy9lZGVuL3RyZWF0eS91bml0LXRlc3QnXG5cdFx0XHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdFx0XHR0ZXh0OiAnTGVnYWN5IChUcmVhdHkgMSknLFxuXHRcdFx0XHRcdFx0XHRcdGxpbms6ICcvZWRlbi90cmVhdHkvbGVnYWN5Lm1kJ1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRdXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnRWRlbiBGZXRjaCcsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL2VkZW4vZmV0Y2gubWQnXG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRdXG5cdFx0XHR9LFxuXHRcdFx0e1xuXHRcdFx0XHR0ZXh0OiAnUGx1Z2lucycsXG5cdFx0XHRcdGNvbGxhcHNlZDogdHJ1ZSxcblx0XHRcdFx0aXRlbXM6IFtcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnT3ZlcnZpZXcnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wbHVnaW5zL292ZXJ2aWV3J1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0JlYXJlcicsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BsdWdpbnMvYmVhcmVyJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0NPUlMnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wbHVnaW5zL2NvcnMnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnQ3JvbicsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BsdWdpbnMvY3Jvbidcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdHcmFwaFFMIEFwb2xsbycsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BsdWdpbnMvZ3JhcGhxbC1hcG9sbG8nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnR3JhcGhRTCBZb2dhJyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcGx1Z2lucy9ncmFwaHFsLXlvZ2EnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnSFRNTCcsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BsdWdpbnMvaHRtbCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdKV1QnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wbHVnaW5zL2p3dCdcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdPcGVuVGVsZW1ldHJ5Jyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcGx1Z2lucy9vcGVudGVsZW1ldHJ5J1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ1NlcnZlciBUaW1pbmcnLFxuXHRcdFx0XHRcdFx0bGluazogJy9wbHVnaW5zL3NlcnZlci10aW1pbmcnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnU3RhdGljJyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcGx1Z2lucy9zdGF0aWMnXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnU3RyZWFtJyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcGx1Z2lucy9zdHJlYW0nXG5cdFx0XHRcdFx0fSxcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHR0ZXh0OiAnU3dhZ2dlcicsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL3BsdWdpbnMvc3dhZ2dlcidcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICd0cnBjJyxcblx0XHRcdFx0XHRcdGxpbms6ICcvcGx1Z2lucy90cnBjJ1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fSxcblx0XHRcdHtcblx0XHRcdFx0dGV4dDogJ0ludGVncmF0aW9uJyxcblx0XHRcdFx0Y29sbGFwc2VkOiB0cnVlLFxuXHRcdFx0XHRpdGVtczogW1xuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdOZXh0anMnLFxuXHRcdFx0XHRcdFx0bGluazogJy9pbnRlZ3JhdGlvbnMvbmV4dGpzJ1xuXHRcdFx0XHRcdH0sXG5cdFx0XHRcdFx0e1xuXHRcdFx0XHRcdFx0dGV4dDogJ0V4cG8nLFxuXHRcdFx0XHRcdFx0bGluazogJy9pbnRlZ3JhdGlvbnMvZXhwbydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdBc3RybycsXG5cdFx0XHRcdFx0XHRsaW5rOiAnL2ludGVncmF0aW9ucy9hc3Rybydcblx0XHRcdFx0XHR9LFxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdHRleHQ6ICdTdmVsdGVLaXQnLFxuXHRcdFx0XHRcdFx0bGluazogJy9pbnRlZ3JhdGlvbnMvc3ZlbHRla2l0J1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XVxuXHRcdFx0fVxuXHRcdF0sXG5cdFx0b3V0bGluZToge1xuXHRcdFx0bGV2ZWw6IFsyLCAzXSxcblx0XHRcdGxhYmVsOiAnT3V0bGluZSdcblx0XHR9LFxuXHRcdHNvY2lhbExpbmtzOiBbXG5cdFx0XHR7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL2VseXNpYWpzL2VseXNpYScgfSxcblx0XHRcdHsgaWNvbjogJ3R3aXR0ZXInLCBsaW5rOiAnaHR0cHM6Ly90d2l0dGVyLmNvbS9lbHlzaWFqcycgfSxcblx0XHRcdHsgaWNvbjogJ2Rpc2NvcmQnLCBsaW5rOiAnaHR0cHM6Ly9kaXNjb3JkLmdnL2VhRkoyS0RKY2snIH1cblx0XHRdLFxuXHRcdGVkaXRMaW5rOiB7XG5cdFx0XHR0ZXh0OiAnRWRpdCB0aGlzIHBhZ2Ugb24gR2l0SHViJyxcblx0XHRcdHBhdHRlcm46XG5cdFx0XHRcdCdodHRwczovL2dpdGh1Yi5jb20vZWx5c2lhanMvZG9jdW1lbnRhdGlvbi9lZGl0L21haW4vZG9jcy86cGF0aCdcblx0XHR9XG5cdH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQThXLFNBQVMsb0JBQW9CO0FBRTNZLFNBQVMsMkJBQTJCO0FBQ3BDLFNBQVMsa0NBQWtDO0FBRTNDLE9BQU8saUJBQWlCO0FBRXhCLE9BQU8sYUFBYTtBQUVwQjtBQUFBLEVBQ0M7QUFBQSxFQUNBO0FBQUEsT0FDTTtBQUVQLElBQU0sY0FDTDtBQUVELElBQU8saUJBQVEsYUFBYTtBQUFBLEVBQzNCLE1BQU07QUFBQSxFQUNOLE9BQU87QUFBQTtBQUFBLEVBRVAsaUJBQWlCO0FBQUEsRUFDakIsYUFBYTtBQUFBLEVBQ2IsVUFBVTtBQUFBLElBQ1QsT0FBTztBQUFBLE1BQ04sT0FBTztBQUFBLE1BQ1AsTUFBTTtBQUFBLElBQ1A7QUFBQSxJQUNBLGtCQUFrQjtBQUFBLE1BQ2pCLG9CQUFvQjtBQUFBLFFBQ25CLFlBQVksMkJBQTJCO0FBQUEsVUFDdEMsS0FBSztBQUFBLFFBQ04sQ0FBQztBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0Y7QUFBQSxFQUNEO0FBQUE7QUFBQSxFQUdBLE1BQU07QUFBQSxJQUNMLFFBQVE7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNOLFlBQVk7QUFBQSxNQUNiO0FBQUEsSUFDRDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsWUFBWTtBQUFBLE1BQ1osUUFBUSxJQUFJLGFBQWEsZUFBZSxRQUFRLElBQUksQ0FBQztBQUFBLE1BQ3JELGFBQWE7QUFBQSxRQUNaLFNBQVMsTUFBTTtBQUFBLE1BQ2hCLENBQUM7QUFBQSxNQUNELDRCQUE0QjtBQUFBLElBQzdCO0FBQUEsRUFDRDtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0w7QUFBQSxNQUNDO0FBQUEsTUFDQTtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sU0FBUztBQUFBLE1BQ1Y7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLE1BQ0M7QUFBQSxNQUNBO0FBQUEsUUFDQyxLQUFLO0FBQUEsUUFDTCxNQUFNO0FBQUEsTUFDUDtBQUFBLElBQ0Q7QUFBQSxJQUNBO0FBQUEsTUFDQztBQUFBLE1BQ0E7QUFBQSxRQUNDLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxNQUNWO0FBQUEsSUFDRDtBQUFBLElBQ0E7QUFBQSxNQUNDO0FBQUEsTUFDQTtBQUFBLFFBQ0MsVUFBVTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1Y7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLE1BQ0M7QUFBQSxNQUNBO0FBQUEsUUFDQyxVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDVjtBQUFBLElBQ0Q7QUFBQSxJQUNBO0FBQUEsTUFDQztBQUFBLE1BQ0E7QUFBQSxRQUNDLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxNQUNWO0FBQUEsSUFDRDtBQUFBLElBQ0E7QUFBQSxNQUNDO0FBQUEsTUFDQTtBQUFBLFFBQ0MsVUFBVTtBQUFBLFFBQ1YsU0FBUztBQUFBLE1BQ1Y7QUFBQSxJQUNEO0FBQUEsSUFDQTtBQUFBLE1BQ0M7QUFBQSxNQUNBO0FBQUEsUUFDQyxVQUFVO0FBQUEsUUFDVixTQUFTO0FBQUEsTUFDVjtBQUFBLElBQ0Q7QUFBQSxJQUNBO0FBQUEsTUFDQztBQUFBLE1BQ0E7QUFBQSxRQUNDLFVBQVU7QUFBQSxRQUNWLFNBQVM7QUFBQSxNQUNWO0FBQUEsSUFDRDtBQUFBLEVBQ0Q7QUFBQSxFQUNBLGFBQWE7QUFBQSxJQUNaLFFBQVE7QUFBQSxNQUNQLFVBQVU7QUFBQSxNQUNWLFNBQVM7QUFBQSxRQUNSLGNBQWM7QUFBQSxNQUNmO0FBQUEsSUFDRDtBQUFBLElBQ0EsTUFBTTtBQUFBLElBQ04sS0FBSztBQUFBLE1BQ0o7QUFBQSxRQUNDLE1BQU07QUFBQSxRQUNOLE1BQU07QUFBQSxNQUNQO0FBQUEsTUFDQTtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sTUFBTTtBQUFBLE1BQ1A7QUFBQSxNQUNBO0FBQUEsUUFDQyxNQUFNO0FBQUEsUUFDTixNQUFNO0FBQUEsTUFDUDtBQUFBLElBQ0Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNSO0FBQUEsUUFDQyxNQUFNO0FBQUEsUUFDTixPQUFPO0FBQUEsVUFDTjtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsTUFDQTtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ047QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsTUFDQTtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ047QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLE1BQ0E7QUFBQSxRQUNDLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNOO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsUUFDRDtBQUFBLE1BQ0Q7QUFBQSxNQUNBO0FBQUEsUUFDQyxNQUFNO0FBQUEsUUFDTixXQUFXO0FBQUEsUUFDWCxPQUFPO0FBQUEsVUFDTjtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLFdBQVc7QUFBQSxZQUNYLE9BQU87QUFBQSxjQUNOO0FBQUEsZ0JBQ0MsTUFBTTtBQUFBLGdCQUNOLE1BQU07QUFBQSxjQUNQO0FBQUEsY0FDQTtBQUFBLGdCQUNDLE1BQU07QUFBQSxnQkFDTixNQUFNO0FBQUEsY0FDUDtBQUFBLGNBQ0E7QUFBQSxnQkFDQyxNQUFNO0FBQUEsZ0JBQ04sTUFBTTtBQUFBLGNBQ1A7QUFBQSxjQUNBO0FBQUEsZ0JBQ0MsTUFBTTtBQUFBLGdCQUNOLE1BQU07QUFBQSxjQUNQO0FBQUEsY0FDQTtBQUFBLGdCQUNDLE1BQU07QUFBQSxnQkFDTixNQUFNO0FBQUEsY0FDUDtBQUFBLGNBQ0E7QUFBQSxnQkFDQyxNQUFNO0FBQUEsZ0JBQ04sTUFBTTtBQUFBLGNBQ1A7QUFBQSxjQUNBO0FBQUEsZ0JBQ0MsTUFBTTtBQUFBLGdCQUNOLE1BQU07QUFBQSxjQUNQO0FBQUEsWUFDRDtBQUFBLFVBQ0Q7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsTUFDQTtBQUFBLFFBQ0MsTUFBTTtBQUFBLFFBQ04sV0FBVztBQUFBLFFBQ1gsT0FBTztBQUFBLFVBQ047QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxRQUNEO0FBQUEsTUFDRDtBQUFBLE1BQ0E7QUFBQSxRQUNDLE1BQU07QUFBQSxRQUNOLFdBQVc7QUFBQSxRQUNYLE9BQU87QUFBQSxVQUNOO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFVBQ0E7QUFBQSxZQUNDLE1BQU07QUFBQSxZQUNOLE1BQU07QUFBQSxVQUNQO0FBQUEsVUFDQTtBQUFBLFlBQ0MsTUFBTTtBQUFBLFlBQ04sTUFBTTtBQUFBLFVBQ1A7QUFBQSxVQUNBO0FBQUEsWUFDQyxNQUFNO0FBQUEsWUFDTixNQUFNO0FBQUEsVUFDUDtBQUFBLFFBQ0Q7QUFBQSxNQUNEO0FBQUEsSUFDRDtBQUFBLElBQ0EsU0FBUztBQUFBLE1BQ1IsT0FBTyxDQUFDLEdBQUcsQ0FBQztBQUFBLE1BQ1osT0FBTztBQUFBLElBQ1I7QUFBQSxJQUNBLGFBQWE7QUFBQSxNQUNaLEVBQUUsTUFBTSxVQUFVLE1BQU0scUNBQXFDO0FBQUEsTUFDN0QsRUFBRSxNQUFNLFdBQVcsTUFBTSwrQkFBK0I7QUFBQSxNQUN4RCxFQUFFLE1BQU0sV0FBVyxNQUFNLGdDQUFnQztBQUFBLElBQzFEO0FBQUEsSUFDQSxVQUFVO0FBQUEsTUFDVCxNQUFNO0FBQUEsTUFDTixTQUNDO0FBQUEsSUFDRjtBQUFBLEVBQ0Q7QUFDRCxDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
