# Elysia v2 documentation

## Setup

```sh
bun install
bun dev
```

## Commands

`bun run build` also exports each documentation page as Markdown, writes the page index to `dist/llms.txt`, and combines the same pages into `dist/llms-full.txt`. Both text files are available at the site root after deployment.

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun dev`                 | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun preview`             | Preview your build locally, before deploying     |
| `bun astro ...`           | Run CLI commands like `astro add`, `astro check` |
| `bun astro -- --help`     | Get help using the Astro CLI                     |
