---
title: Fullstack Dev Server - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: Fullstack Dev Server - ElysiaJS

    - - meta
      - name: 'description'
        content: Bun Fullstack Dev Server allows us to develop frontend and backend in a single project without any bundler. Learn how to use Elysia with Bun Fullstack Dev Server with HMR, and Tailwind support.

    - - meta
      - property: 'og:description'
        content: Bun Fullstack Dev Server allows us to develop frontend and backend in a single project without any bundler. Learn how to use Elysia with Bun Fullstack Dev Server with HMR, and Tailwind support.
---

# Elysia with Bun Fullstack Dev Server

Bun 1.3 introduce a [Fullstack Dev Server](https://bun.com/docs/bundler/fullstack) with HMR support.

This allows us to directly use React without any bundler like Vite or Webpack.

<video mute controls style="aspect-ratio: 3736/1630;">
  <source src="/assets/bun-fullstack.mp4" type="video/mp4" />
  Something went wrong trying to load video
</video>

You can use [this example](https://github.com/saltyaom/elysia-fullstack-example) to quickly try it out.

Otherwise, install it manually:

1. Install Elysia Static plugin
```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
	.use(staticPlugin())
	.listen(3000)
```

2. Create **public/index.html** and **index.tsx**

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React App</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

3. Navigate to `http://localhost:3000/public` and see the result.

This would allows us to develop frontend and backend in a single project without any bundler.

We have verified that Fullstack Dev Server works with HMR, [Tailwind](#tailwind), Tanstack Query, [Eden Treaty](/eden/overview), and path alias.

## Custom prefix path

We can change the default `/public` prefix by passing the `prefix` option to `staticPlugin`.

```ts
import { Elysia } from 'elysia'
import { staticPlugin } from '@elysiajs/static'

new Elysia()
  	.use(
  		staticPlugin({
  			prefix: '/' // [!code ++]
   		})
   )
  .listen(3000)
```

This would serve the static files at `/` instead of `/public`.

See [static plugin](/plugins/static) for more configuration options.

## Tailwind CSS
We can also use Tailwind CSS with Bun Fullstack Dev Server.

1. Install dependencies

```bash
bun add tailwindcss@4
bun add -d bun-plugin-tailwind
```

2. Create `bunfig.toml` with the following content:

```toml
[serve.static]
plugins = ["bun-plugin-tailwind"]
```

3. Create a CSS file with Tailwind directives

::: code-group

```css [public/global.css]
@tailwind base;
```

:::

4. Add Tailwind to your HTML or alternatively JavaScript/TypeScript file

::: code-group

```html [public/index.html]
<!doctype html>
<html lang="en">
	<head>
		<meta charset="UTF-8">
		<title>Elysia React App</title>

		<meta name="viewport" content="width=device-width, initial-scale=1.0">
  		<link rel="stylesheet" href="tailwindcss"> <!-- [!code ++] -->
	</head>
	<body>
		<div id="root"></div>
		<script type="module" src="./index.tsx"></script>
	</body>
</html>
```

```tsx [public/index.tsx]
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import './global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

:::

## Path Alias

We can also use path alias in Bun Fullstack Dev Server.

1. Add `paths` in `tsconfig.json`

```json
{
  "compilerOptions": {
	"baseUrl": ".", // [!code +=]
	"paths": { // [!code +=]
	  "@public/*": ["public/*"] // [!code +=]
	} // [!code +=]
  }
}
```

2. Use the alias in your code

```tsx
import { useState } from 'react'
import { createRoot } from 'react-dom/client'

import '@public/global.css' // [!code ++]

function App() {
	const [count, setCount] = useState(0)
	const increase = () => setCount((c) => c + 1)

	return (
		<main>
			<h2>{count}</h2>
			<button onClick={increase}>
				Increase
			</button>
		</main>
	)
}

const root = createRoot(document.getElementById('root')!)
root.render(<App />)
```

This would works out of the box without any additional configuration.

## Build for Production

You can build fullstack server as if it's a normal Elysia server.

```bash
bun build --compile --target bun --outfile server src/index.ts
```

This would create a single executable file **server**.

When running the **server** executable, make sure to include the **public** folder in similar to the development environment.

See [Deploy to Production](/patterns/deploy) for more information.
