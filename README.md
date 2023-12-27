## Elysia documentation

Written by VitePress

### How to add translations

#### Adding a net-new language

#### To the navigation

#### Translating docs

All the files and directories in `/docs` represent the `en` content, with the exception of any directory named after a locale (for example `/fr` for French). Any directory named after a locale contains docs specifically translated for that locale. If a doc doesn't exist for a specific locale, redirects are set up to serve fallback content.

Given the above, if a doc doesn't exist in the locale's directory:

1. Copy the doc
2. Create a file with the same name in the locale's directory
3. Paste the copied content and translate.
