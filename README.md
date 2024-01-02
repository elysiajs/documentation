## Elysia documentation

Written by VitePress

### How to add translations

#### Adding a net-new language

To add a net-new language:

1. Add the locale to the exported object in `/intl/locales.ts`. Use other languages as examples for what you need to add.
2. The new language object should have a `label` (the native name of the language), `lang` (the ISO language code), and a `themeConfig` where you pass the language code to the `generateThemeConfig` helper function.

By default this new language will have all English content as a fallback. Follow the steps below to translate docs or the navigation.

#### To the navigation/sidebar

1. In `/menus` find the `text` string you want to translate in either `nav.ts` or `sidebar.ts`
2. Copy that string exactly as it appears in that object.
3. In `/intl/strings.ts` CMD+F for the string you want to translate. If it does not exist create a new object.
4. Add the lang code to the object with your translation.
5. Run the site locally to confirm your changes in the new language as well as checking nothing changed in the 'en' version.

#### Translating docs

All the files and directories in `/docs` represent the `en` content, with the exception of any directory named after a locale (for example `/fr` for French). Any directory named after a locale contains docs specifically translated for that locale. If a doc doesn't exist for a specific locale, redirects are set up to serve fallback content.

Given the above, if a doc doesn't exist in the locale's directory:

1. Copy the doc
2. Create a file with the same name in the locale's directory
3. Paste the copied content and translate.
