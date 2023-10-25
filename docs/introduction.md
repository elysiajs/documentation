---
title: Introduction - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Introduction - ElysiaJS

  - - meta
    - name: 'description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.

  - - meta
    - property: 'og:description'
      content: ElysiaJS is a fast and friendly bun web framework. Building on top of 3 philosophies, performance, simplicity, flexibility. Designed with TypeScript in mind. Elysia understands what you want and automatically infers the type from your code.
---

# Giới thiệu
ElysiaJS là một khung web [Bun](https://bun.sh) nhanh và thân thiện.

> <small>Phát âm là "eh-LIHZ-iy-ah"・ エリシア ・ เอลิเซีย</small>

Xây dựng trên 3 triết lý:
- Hiệu suất
    - Bạn sẽ không phải lo lắng về hiệu suất.
- Sự đơn giản
    - Các khối xây dựng đơn giản để tạo ra một trừu tượng, tránh lặp lại chính mình.
- Uyển chuyển
    - Bạn sẽ có thể tùy chỉnh hầu hết thư viện để phù hợp với nhu cầu của bạn

Được thiết kế dành cho TypeScript, bạn không cần phải hiểu TypeScript để tận dụng Elysia. Thư viện hiểu những gì bạn muốn và tự động suy ra loại từ mã của bạn.

Hãy xem này:
```typescript
new Elysia()
    .get('/id/:id', (({ params: { id }}) => id))
    .listen(8080)
```

Elysia hiểu rằng bạn muốn có tên tham số đường dẫn `id`. Sau đó, thư viện sẽ đăng ký `id` làm loại trong `params`.

--- 
Bạn có thể xác định loại tùy chỉnh cho nhiều thứ, ví dụ: nội dung của yêu cầu đến.
```typescript
import { Elysia, t } from 'elysia'

new Elysia()
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)
```

Bạn nói rõ ràng với Elysia rằng nội dung yêu cầu gửi đến phải có cấu trúc như bạn xác định.

Sau đó Elysia sẽ suy ra loại từ mã bạn viết. Xác thực nội dung từ yêu cầu đến để đảm bảo an toàn cho loại.

Sau đó, với [plugins](/plugins/overview), Elysia có thể tạo ngay tài liệu API bằng Swagger chỉ bằng một dòng mã.
```typescript
import { Elysia, t } from 'elysia'
/* [!code ++] */import { swagger } from '@elysiajs/swagger'

new Elysia()
/* [!code ++] */    .use(swagger())
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)
```

Và cuối cùng, bạn có thể tạo một ứng dụng khách hoàn toàn an toàn về loại để sử dụng API Elysia với Eden (tùy chọn).

```typescript
// server.ts
import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'

/* [!code ++] */const app = new Elysia()
    .use(swagger())
    .post('/sign-in', ({ body }) => signIn(body), {
        body: t.Object({
            username: t.String(),
            password: t.String()
        })
    })
    .listen(8080)

/* [!code ++] */export type App = typeof app
```

Và trên máy khách:
```typescript
// client.ts
import { edenTreaty } from '@elysiajs/eden'
import type { App } from './server'

const app = edenTreaty<App>('http://localhost:8080')

app.signIn.post({
    username: 'saltyaom',
    password: 12345678
}).then(console.log)
```

Tạo một nguồn sự thật duy nhất cho cấu trúc dữ liệu của bạn, loại bỏ mọi xung đột `type` có thể xảy ra giữa TypeScript, các yêu cầu thực tế thông qua xác thực, tài liệu API và ứng dụng khách.

Đảm bảo rằng không có sai sót nào xảy ra trong quá trình phát triển, di chuyển và sản xuất.
