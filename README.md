# SaltyAom's Next Starter
Starter template for blazing fast Next.js app:

## Featuring
- EsBuild
    - Configured with esbuild loader, with faster build time.
- Starting at 40KB 
    - With Preact configuration reduce initial size to just 28KB.
- TypeScript
    - Type-safe code base for faster and easier maintainance.
- Sass and CSS Module
    - Configured Sass to use with CSS module
- Dynamic Path Alias
    - Easier manage and maintaining between module, no more import path hell.
- ESLint
    - Configured linter for most suitable React environment
- Testing
    - Using Jest and React Testing Library for testing.
- Github Action
    - Run linter and test for every Pull Request 

## Dynamic Path alias
List of path aliased:
- `@pages` - src/pages
- `@layouts` - src/layouts
- `@components` - src/components
- `@styles` - src/styles
- `@services` - src/services
- `@models` - src/models
- `@stores` - src/stores
- `@tailwind` - src/services/tailwind/index.ts
- `@atoms` - src/components/atoms
- `@molecules` - src/components/molecules
- `@organisms` - src/components/organisms

## Test Environment
Test suite is set up with Jest and React Testing Library with configured for using `next/dynamic`

The structure for test is illustrated as the following:
* __tests__ - Contains test file.
* __mocks__ - Mockup file like | `css`, `sass` and `less` is set. (Can be changed at `jest.config.js`)
