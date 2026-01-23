export interface Node {
    title: string
    path: string
    children?: Node[]
}

export function buildTree(structure: Record<string, any>): Node[] {
    const paths = Object.keys(structure).map((p) => p.replace(/^\.\//, ''))

    function insert(nodes: Node[], parts: string[], basePath = ''): void {
        if (parts.length === 0) return

        const [head, ...rest] = parts
        const fullPath = basePath ? `${basePath}/${head}` : head

        let node = nodes.find((n) => n.title === head)

        if (!node) {
            node = { title: head, path: fullPath }
            nodes.push(node)
        }

        if (rest.length > 0) {
            node.children ??= []
            insert(node.children, rest, fullPath)
        }
    }

    const tree: Node[] = []
    for (const path of paths) insert(tree, path.split('/'))

    tree.sort((a, b) => a.title.localeCompare(b.title))

    return tree
}
