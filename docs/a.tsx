import { Elysia } from 'elysia'

new Elysia()
    .get('/', ({ query: { name } }) => {
        return (
            <h1>hello {name}</h1>
        )
    })
