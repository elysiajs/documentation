import { Children, isValidElement } from 'react'
import { Tab, Tabs } from '@rspress/core/theme-original'

const LABEL_SEPARATOR = '\u001f'

export default function CodeGroup({
    children,
    labels = ''
}: {
    children: React.ReactNode
    labels?: string
}) {
    const codeBlocks = Children.toArray(children).filter(isValidElement)
    const tabLabels = labels.split(LABEL_SEPARATOR)

    return (
        <Tabs className="elysia-code-group">
            {codeBlocks.map((codeBlock, index) => (
                <Tab
                    key={`${tabLabels[index] ?? 'Code'}-${index}`}
                    label={tabLabels[index] ?? `Code ${index + 1}`}
                    value={String(index)}
                >
                    {codeBlock}
                </Tab>
            ))}
        </Tabs>
    )
}
