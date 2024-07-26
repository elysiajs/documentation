---
title: After Response - ElysiaJS
head:
    - - meta
      - property: 'og:title'
        content: On After Response - ElysiaJS

    - - meta
      - name: 'description'
        content: Executed after the response sent to the client. It's recommended to use **On After Response** in the following situations. Clean up response. Logging and analytics.

    - - meta
      - property: 'og:description'
        content: Executed after the response sent to the client. It's recommended to use **On After Response** in the following situations. Clean up response. Logging and analytics.
---

# After Response
Executed after the response sent to the client.

It's recommended to use **After Response** in the following situations:
- Clean up response
- Logging and analytics

## Example
Below is an example of using the response handle to check for user sign-in.

```typescript twoslash
import { Elysia } from 'elysia'

new Elysia()
	.onAfterResponse(() => {
		console.log('Response', performance.now())
	})
	.listen(3000)
```

Console should log as the following:

```bash
Response 0.0000
Response 0.0001
Response 0.0002
```
