# Translating the docs

English is the source of truth. Translations live next to it, mirroring the same path:

```
src/content/docs/essential/route.mdx      English
src/content/docs/ja/essential/route.mdx   Japanese
```

Open locales: `es`, `zh-cn`, `ja`, `th`. A page without a translation falls back to English, so partial translations are fine to ship.

## What needs work

The [translation status page](https://next.elysiajs.com/i18n/) lists every page per locale:

- **Missing**: no translation yet. The link opens a new file on GitHub at the right path.
- **Outdated**: English changed after the translation was last updated. The link lists only the English commits since then, so you can see exactly what to update.
- **Done**: up to date.

Status comes from git history: a translation is outdated when its English source has a newer commit than the translation itself.

## Workflow

1. Pick a locale and one or more pages from the status page.
2. Translate, or update only what the listed English commits changed.
3. Keep frontmatter keys, code blocks, components and link targets as they are. Translate prose, headings and `title`/`description`.
   - Translated files sit one folder deeper, so add one `../` to every relative import: `'../../components/ui/card'` becomes `'../../../components/ui/card'`. The build fails with `Could not resolve` if you miss one.
   - Commit the file before running `bun run build` locally, otherwise the status page is skipped.
4. Open a PR to `next` branch. One locale per PR keeps review easy.

### Voice and terminology

Translate the meaning and voice, not each word. Spica's docs sound warm, playful, and quietly confident. Imagine a helpful older sister or mentor who's genuinely glad the reader is here, then use the closest natural equivalent in your language. Speak directly to the reader and follow conversational patterns that feel natural in your language. Keep playful or warm asides brief. Never sound smug, condescending, corporate, or like an official manual. Use personality lightly. Clarity and technical accuracy always come first.

Keep API identifiers such as `beforeHandle`, `derive`, and `status` unchanged. If a technical term is unfamiliar, you can ask AI to clarify what it means. Use the explanation to choose the wording developers naturally use in your language. Treat AI as a clarification tool, not a source of truth. If it conflicts with the current English docs, follow the docs.

## For English editors

Every commit to an English page marks its translations outdated. For changes that don't affect meaning (typos, formatting), put `lunaria-ignore` or `fix typo` in the commit message to skip that.
