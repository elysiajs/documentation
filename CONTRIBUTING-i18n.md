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
4. Open a PR. One locale per PR keeps review easy.

## For English editors

Every commit to an English page marks its translations outdated. For changes that don't affect meaning (typos, formatting), put `lunaria-ignore` or `fix typo` in the commit message to skip that.
