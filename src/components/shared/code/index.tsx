import { Highlight, themes } from 'prism-react-renderer'

export default function Code({
    code,
    noLine = false
}: {
    code: string
    noLine?: boolean
}) {
    return (
        <Highlight theme={themes.github} code={code} language="tsx">
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className="p-4 rounded-lg overflow-auto" style={style}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            {!noLine && (
                                <span className="mr-4 opacity-30 select-none">
                                    {i + 1}
                                </span>
                            )}
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    )
}
