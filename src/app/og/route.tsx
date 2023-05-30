import { ImageResponse } from '@vercel/og'

export const runtime = 'experimental-edge'

export async function GET() {
    return new ImageResponse(
        (
            <main
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    textAlign: 'center',
                    background: '#fff'
                }}
            >
                <img
                    style={{
                        width: 256,
                        borderRadius: 9999,
                        // boxShadow: '0 12px 40px rgba(0,0,0,.25)'
                    }}
                    src="https://avatars.githubusercontent.com/u/35027979?s=400&u=ca51dabe3c3b9e8905eb4fdf18e8c3ca5e050a41&v=4"
                    alt="Aris"
                />
                <h1
                    style={{
                        fontSize: 60,
                        color: '#212121',
                        margin: '32px 0 16px 0',
                    }}
                >
                    SaltyAom
                </h1>
                <p
                    style={{
                        fontSize: 24,
                        margin: 0,
                        color: '#aaa'
                    }}
                >
                    SaltyAom&apos;s Next.js Starter template
                </p>
            </main>
        ),
        {
            width: 1920,
            height: 1080
        }
    )
}
