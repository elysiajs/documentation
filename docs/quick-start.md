# Quick Start
Elysia is a library built for Bun. 

So the only prerequisite is that you need to have Bun installed.
```bash
curl https://bun.sh/install | bash
```

Start by using `bun create` to scaffold the project:
```bash
bun create elysia hi-elysia
```

Then you should see the folder name `hi-elysia` in your directory.
```bash
cd hi-elysia
```

Sometime Bun cached the `latest` version field, so let's state the latest version explictly:
```bash
bun add elysia
```

Open `src/index.ts`, and you should see:
```typescript
import { Elysia } from 'elysia'

const app = new Elysia()
	.get('/', () => 'Hello Elysia')
	.listen(8080)
	 
console.log(`🦊 Elysia is running at ${app.server.hostname}:${app.server.port}`)
```

Start a development server by:
```bash
bun run dev
```

Open your browser and go to `http://localhost:8080`.

You should see your server is running.

---

Congrats! You just create a new web server with Elysia 🎉🎉
