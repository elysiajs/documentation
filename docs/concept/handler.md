---
title: Handler - ElysiaJS
head:
  - - meta
    - property: 'og:title'
      content: Handler - ElysiaJS

  - - meta
    - name: 'description'
      content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.

  - - meta
    - property: 'og:description'
      content: Handler is a callback function which accept "Context", helping you access powerful API for accessing data and modifying the response. Context is consists of HTTP Request, body, parsed querystring, path parameters and store.
---

# Handler
Định tuyến là cho biết chức năng nào sẽ trả về phản hồi.

Hàm trả về một Phản hồi là `Handler`.

---
Handler là một hàm gọi lại chấp nhận `Context`, giúp bạn truy cập API mạnh mẽ để truy cập dữ liệu và sửa đổi phản hồi.

The `params` trong ví dụ trước cũng đến từ `Handler`
```typescript
// Structure
app.get(path, handler, hook?)

// Usage
app.get('/id/:id', (context) => context.params.id)
```

## Context
Các thuộc tính của bối cảnh bao gồm
- `request`:`Request` thô để truy cập dữ liệu dưới dạng loại tiêu chuẩn web
- `body`: Nội dung đi kèm với yêu cầu
- `query`: Truy vấn đường dẫn được phân tích cú pháp dưới dạng một đối tượng đơn giản
- `params`: Tham số đường dẫn như một đối tượng đơn giản
- `store`: Một cửa hàng có thể thay đổi toàn cầu cho phiên bản Elysia
- `set`: Đại diện phản hồi
    - `status`: trạng thái phản hồi
    - `headers`: tiêu đề phản hồi
    - `redirect`: chuyển hướng đến đường dẫn mới

Bạn có thể truy cập `Context` trong hàm `Handler`:
```typescript
app.post('/', ({ body, set }) => {
    const signed = signIn(body)
    
    if(signed)
        return 'Welcome back'

    set.status = 403
    return 'Invalid username or password'
})
```

::: Mẹo
Elysia khuyến khích việc phá hủy đối tượng, nhưng `set` là một ngoại lệ.
Vì giá trị nguyên thủy bị hủy cấu trúc không được liên kết với đối tượng, để làm cho `set` hoạt động bình thường, chúng ta cần sử dụng `set.value`
:::

## Response
Trả về giá trị từ `Handler`, Elysia sẽ cố gắng ánh xạ giá trị trả về vào `Response`.

Ví dụ: để trả về một đối tượng, trước tiên bạn nên xâu chuỗi nội dung rồi đặt tiêu đề phản hồi của `Content-Type` thành `application/json`.

Trông giống như thế này:
```typescript
new Response(JSON.stringify({
    'vtuber': [
        'Shirakami Fubuki',
        'Inugami Korone'
    ]
}), {
    headers: {
        'Content-Type': 'application/json'
    }
})
```

Nhưng Elysia sẽ giải quyết việc đó cho bạn.

Bạn chỉ cần trả về một đối tượng và Elysia sẽ ánh xạ giá trị của bạn thành phản hồi chính xác cho bạn.
```typescript
app.get('/', () => ({
    'vtuber': [
        'Shirakami Fubuki',
        'Inugami Korone'
    ]
}))
```

Tất nhiên, khi Elysia ánh xạ giá trị tới `Response`.

Nhưng bạn cũng có thể trả về `Response` nếu bạn thực sự muốn.
```typescript
app.get('/', () => new Response(
    JSON.stringify({
        'vtuber': [
            'Shirakami Fubuki',
            'Inugami Korone'
        ]
    }), {
        headers: {
            'Content-Type': 'application/json'
        }
    })
)
```
