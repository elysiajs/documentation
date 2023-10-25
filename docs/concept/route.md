---
title: Route - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Route - ElysiaJS

  - - meta
    - name: 'description'
      content: Declaraing Elysia route has similiar syntax to Express and Fastify. By calling `.[method name](path, callback, hook?)`, for example "app.get('/', () => 'hi')", then Elysia will handle the routing and execute the callback if matched.

  - - meta
    - property: 'og:description'
      content: Declaraing Elysia route has similiar syntax to Express and Fastify. By calling `.[method name](path, callback, hook?)`, for example "app.get('/', () => 'hi')", then Elysia will handle the routing and execute the callback if matched.
---

# Route (Định tuyến)
Giống như Express và Fastify.

Bạn có thể sử dụng phương thức `route` để định tuyến tạo thành khối thành phần trong máy chủ.

Bằng cách gọi `.[method name](path, callback, hook?)`, bạn đính kèm tuyến đường đến Elysia và thư viện sẽ xử lý việc định tuyến cho bạn.

Ví dụ như sau:
```typescript
new Elysia()
    .get('/ping', () => 'pong')
    .listen(8080)
```

Chạy đoạn mã khi yêu cầu từ client khớp với đừng dẫn

Có nghĩa là khi yêu cầu [GET] có đường dẫn '/ping' sẽ trả về 'pong' dưới dạng phản hồi.

## Custom Method (Phương pháp tùy chỉnh)
Bạn có thể xác định bằng nhiều phương thức tích hợp bao gồm:
- post
- put
- patch
- delete
- options
- head
- trace
- connect
- all (ánh xạ bất kỳ phương pháp nào)

Các phương pháp khác có thể được xác định bằng cách sử dụng `.route`:
```typescript
new Elysia()
    // custom method should be all uppercased
    .route('M-SEARCH', () => 'From M Search')
    .listen(8080)
```

## Path Parameters (Tham số đường dẫn)
Tham số đường dẫn có thể lấy dữ liệu từ URL.

Ví dụ: lấy id người dùng từ đường dẫn (giống như nhiều phương tiện truyền thông xã hội) là lúc bạn có thể cần tham số đường dẫn.
```typescript
new Elysia()
    .get('/id/:id', ({ params: { id } }) => getUserById(id))
    .listen(8080)
```

Tham số đường dẫn là một biến trong đường dẫn.

Khi mẫu khớp, đường dẫn bạn đặt tên sẽ có sẵn trong `context.params` và bạn có thể truy xuất giá trị của nó.

## Wildcard(Ký tự đại diện)
Đôi khi các tham số đường dẫn là không đủ.

Bắt buộc phải khớp bất kỳ thứ gì sau một số mẫu và bạn không thể xác định tất cả chúng hoặc nó quá dư thừa.

Bạn có thể sử dụng `*` để khớp với phần còn lại.
```typescript
new Elysia()
    .get('/user/*', () => doSomething())
    .listen(8080)
```
