# Quick Start
KingWorld is a library built for Bun. 

So the only prerequisite is that you need to have Bun installed.
```bash
curl https://bun.sh/install | bash
```

Start by using `bun create` to scaffold the project:
```bash
bun create kingworld hi-kingworld
```

Then you should see the folder name `hi-kingworld` in your directory.
```bash
cd hi-kingworld && bun install
```

Open `src/index.ts`, and you should see:
```typescript
import KingWorld from 'kingworld'

new KingWorld()
	.get('/', () => 'Hello KingWorld')
	.listen(8080)
	 
console.log('🦊 KINGWORLD is running at :3000')
```

Start a development server by:
```bash
bun run dev
```

Open your browser and go to `http://localhost:8080`.

You should see your server is running.

---

Congrats! You just create a new web server with KingWorld 🎉🎉
