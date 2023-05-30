---
title: File Upload - Elysia.js
head:
  - - meta
    - property: 'og:title'
      content: File Upload - Elysia.js

  - - meta
    - name: 'description'
      content: Elysia handle attachment of request with content-type of "multipart/form-data" headers, and parse the body to `Context.body` by default. `t.File`, and `t.Files` is use to strictly validate files.

  - - meta
    - property: 'og:description'
      content: Elysia handle attachment of request with content-type of "multipart/form-data" headers, and parse the body to `Context.body` by default. `t.File`, and `t.Files` is use to strictly validate files.
---

# File Upload
Elysia handle attachment of `multipart/form-data` to `Context.body` by default.

```typescript
import { Elysia, t } from '../src'

const app = new Elysia()
	.post('/single', ({ body: { file } }) => file, {
		body: t.Object({
			file: t.File()
		})
	})
	.listen(8080)
```

## File validation
You can use `t.File`, and `t.Files` to strictly validate files:
- `t.File`: validate single file as `Blob`
- `t.Files`: validate multiple files (array) as `Blob[]`

```typescript
import { Elysia, t } from '../src'

const app = new Elysia()
	.post(
		'/multiple',
		({ body: { files } }) => files[0],
		{
			body: t.Object({
				files: t.Files({
					type: ['image', 'video']
				})
			})
		}
	)
```

Validation for `t.File` consists of:
- type: content type of the files using `String.includes`
- minSize: minimum file size
- maxSize: maximum file size

And for `t.Files` extends `t.File` with:
- minItems: minimum array size of files
- maxItems: maximum array size of files
