---
title: Getting Started - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Getting Start - ElysiaJS

  - - meta
    - name: 'description'
      content: Elysia is a library built for Bun and the only prerequisite. To start, boostrap a new project with "bun create elysia hi-elysia" and start development server with "bun dev". This is all it need to do a quick start or getting start with ElysiaJS

  - - meta
    - property: 'og:description'
      content: Elysia is a library built for Bun, and it's all you need to get started. Bootstrap a new project with "bun create elysia hi-elysia" and start the development server with "bun dev". That's all you need to work on Elysia.js!
---

# Bắt đầu nhanh
Elysia là một thư viện được xây dựng trên Bun.

Bun là tất cả những gì bạn cần để bắt đầu.
```bash
curl https://bun.sh/install | bash
```

Khởi động một dự án mới với `bun create`:
```bash
bun create elysia hi-elysia
```

Sau đó, bạn sẽ thấy tên thư mục `hi-elysia` trong thư mục của mình.
```bash
cd hi-elysia
```

Mở file `src/index.ts`, và bạn sẽ thấy mã như sau:
```typescript
import { Elysia } from "elysia";

const app = new Elysia().get("/", () => "Hello Elysia").listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
```

Khởi động máy chủ development như sau :
```bash
bun dev
```

Mở browser của bạn và nhập đường dẫn như sau: `http://localhost:3000`.

Bạn sẽ thấy máy chủ của bạn đang chạy.

---

Chúc mừng! Bạn vừa tạo một máy chủ web mới với Elysia 🎉🎉
