import type { PropsWithChildren } from 'react'

import '@styles/global.sass'

export default function RootLayout({ children }: PropsWithChildren) {
    return (
        <html lang="en">
            <title>Hello World</title>
            <body>{children}</body>
        </html>
    )
}
