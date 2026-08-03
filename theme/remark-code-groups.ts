type MarkdownNode = {
    type: string
    name?: string
    lang?: string
    meta?: string | null
    value?: string
    children?: MarkdownNode[]
    attributes?: Array<{
        type: 'mdxJsxAttribute'
        name: string
        value: string
    }>
}

const LABEL_SEPARATOR = '\u001f'
const LABEL_PATTERN = /\s*\[([^\]]+)]\s*$/

function transformCodeGroups(parent: MarkdownNode) {
    if (!parent.children) return

    const transformed: MarkdownNode[] = []

    for (let index = 0; index < parent.children.length; index++) {
        const node = parent.children[index]

        if (isCodeGroupStart(node)) {
            const codeBlocks: MarkdownNode[] = []
            let cursor = index + 1

            while (cursor < parent.children.length && !isContainerEnd(parent.children[cursor])) {
                if (parent.children[cursor].type === 'code')
                    codeBlocks.push(parent.children[cursor])
                cursor++
            }

            if (cursor < parent.children.length) {
                transformed.push(createCodeGroup(codeBlocks))
                index = cursor
                continue
            }
        }

        if (node.type !== 'containerDirective' || node.name !== 'code-group') {
            transformCodeGroups(node)
            transformed.push(node)
            continue
        }

        transformed.push(createCodeGroup((node.children ?? []).filter(
            (child) => child.type === 'code'
        )))
    }

    parent.children = transformed
}

function paragraphText(node: MarkdownNode) {
    if (node.type !== 'paragraph') return ''

    return (node.children ?? [])
        .filter((child) => child.type === 'text')
        .map((child) => child.value ?? '')
        .join('')
        .trim()
}

function isCodeGroupStart(node: MarkdownNode) {
    return /^:::\s*code-group\s*$/.test(paragraphText(node))
}

function isContainerEnd(node: MarkdownNode) {
    return paragraphText(node) === ':::'
}

function createCodeGroup(codeBlocks: MarkdownNode[]): MarkdownNode {
    const labels = codeBlocks.map((codeBlock, index) => {
            const match = codeBlock.meta?.match(LABEL_PATTERN)
            codeBlock.meta = codeBlock.meta?.replace(LABEL_PATTERN, '').trim() || null

            return match?.[1] ?? codeBlock.lang ?? `Code ${index + 1}`
        })

    return {
        type: 'mdxJsxFlowElement',
        name: 'CodeGroup',
        attributes: [
            {
                type: 'mdxJsxAttribute',
                name: 'labels',
                value: labels.join(LABEL_SEPARATOR)
            }
        ],
        children: codeBlocks
    }
}

export default function remarkCodeGroups() {
    return transformCodeGroups
}
