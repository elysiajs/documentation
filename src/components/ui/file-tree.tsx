import type * as React from 'react'
import { useState } from 'react'
import { cn } from '../../lib/cn'

export interface FileTreeNode {
	id: string
	name: string
	kind?: 'folder' | 'file'
	children?: FileTreeNode[]
	icon?: React.ReactNode
	badge?: React.ReactNode
	/** Small mono note on the right, e.g. '2 kB' · '3'. */
	meta?: React.ReactNode
}

export interface FileTreeProps
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
	nodes: FileTreeNode[]
	/** Controlled selected node id. */
	selected?: string
	defaultSelected?: string
	onSelect?: (node: FileTreeNode) => void
	/** Controlled list of expanded folder ids. */
	expanded?: string[]
	defaultExpanded?: string[]
	onExpandedChange?: (ids: string[]) => void
	dense?: boolean
	mono?: boolean
	indent?: number
	variant?: 'plain' | 'card'
	wash?: 'soft' | 'rose' | 'cool' | 'iris' | 'dawn'
	ref?: React.Ref<HTMLDivElement>
}

interface TreeRow {
	node: FileTreeNode
	depth: number
	open: boolean
	folder: boolean
	/** Index of the parent row, or -1 at root. */
	parent: number
	emptyOpen: boolean
}

const X0 = 16
const SQ = 20
const R = 8

const row =
	'relative flex w-full box-border items-center gap-2 border-0 bg-transparent py-0 pr-2.5 text-left font-sans cursor-pointer transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none focus-ring group-data-[selected]:font-bold group-data-[selected]:text-primary-deep'

const pill =
	'absolute top-[3px] right-1 bottom-[3px] -z-10 rounded-lg bg-transparent transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none group-hover:bg-surface-2/70 group-data-[selected]:bg-primary-soft'

const ring =
	'group-data-[selected]:shadow-[0_0_0_3px_var(--color-primary-soft),0_0_0_4.25px_var(--color-primary)]'

const square =
	'absolute inline-flex size-5 box-border items-center justify-center rounded-[6px] border border-border-strong bg-surface p-0 text-ink-soft cursor-pointer transition-[background-color,border-color,color,box-shadow] duration-(--dur-fast) ease-out motion-reduce:transition-none focus-ring group-hover:border-[color-mix(in_oklab,var(--color-primary)_40%,var(--color-border-strong))] group-data-[selected]:border-primary group-data-[selected]:bg-base group-data-[selected]:text-primary'

const washes = {
	soft: 'var(--surface-wash)',
	rose: 'var(--surface-wash-rose)',
	cool: 'var(--surface-wash-cool)',
	iris: 'var(--surface-wash-iris)',
	dawn: 'var(--surface-wash-dawn)'
}

const dot =
	'absolute size-2 box-border rounded-full border-[1.5px] border-border-strong bg-base transition-[background-color,border-color,box-shadow] duration-(--dur-fast) ease-out motion-reduce:transition-none group-data-[selected]:border-primary group-data-[selected]:bg-primary'

export function FileTree({
	nodes = [],
	selected,
	defaultSelected,
	onSelect,
	expanded,
	defaultExpanded = [],
	onExpandedChange,
	dense = false,
	mono = false,
	indent = 19,
	variant = 'plain',
	wash = 'cool',
	className,
	ref,
	...rest
}: FileTreeProps) {
	const [selInner, setSelInner] = useState(defaultSelected)
	const sel = selected !== undefined ? selected : selInner
	const pick = (n: FileTreeNode) => {
		if (selected === undefined) setSelInner(n.id)
		onSelect?.(n)
	}

	const [expInner, setExpInner] = useState(defaultExpanded)
	const exp = expanded !== undefined ? expanded : expInner
	const setExp = (next: string[]) => {
		if (expanded === undefined) setExpInner(next)
		onExpandedChange?.(next)
	}
	const toggle = (id: string) =>
		setExp(exp.includes(id) ? exp.filter((x) => x !== id) : [...exp, id])

	const H = dense ? 32 : 36
	const isFolder = (n: FileTreeNode) =>
		n.kind === 'folder' || Array.isArray(n.children)

	const rows: TreeRow[] = []
	const walk = (list: FileTreeNode[], depth: number, parent: number) =>
		list.forEach((n) => {
			const open = isFolder(n) && exp.includes(n.id)
			rows.push({
				node: n,
				depth,
				open,
				folder: isFolder(n),
				parent,
				emptyOpen: open && !n.children?.length
			})
			if (open && n.children) walk(n.children, depth + 1, rows.length - 1)
		})
	walk(nodes, 0, -1)

	const cx = (d: number) => X0 + d * indent
	const cy = (i: number) => i * H + H / 2

	/** Half the marker plus its hairline — where a connector must stop. */
	const half = (r: TreeRow) => (r.folder ? SQ / 2 : 4) + 1

	// Draw the connectors as a single path, so that the SVG is one element and doesn't interfere with pointer events on the rows.
	const paths = rows
		.map((r, i) => {
			if (r.parent < 0) {
				let j = i - 1
				while (j >= 0 && rows[j].parent >= 0) j--
				if (j < 0) return ''
				const x = cx(r.depth)
				return `M${x} ${cy(j) + half(rows[j])} L${x} ${cy(i) - half(r)}`
			}

			const p = rows[r.parent]
			const px = cx(p.depth)
			const py = cy(r.parent) + half(p)
			const y = cy(i)

			return `M${px} ${py} L${px} ${y - R} Q${px} ${y} ${px + R} ${y} L${cx(r.depth) - half(r) + 1} ${y}`
		})
		.filter(Boolean)
		.join(' ')

	const card = variant === 'card'
	const tree = (
		<div
			{...(card ? {} : rest)}
			ref={card ? undefined : ref}
			role="tree"
			className={cn(
				'spica-surface relative select-none font-sans text-ink',
				dense ? 'text-sm' : 'text-[15px]',
				!card && className
			)}
		>
			<svg
				aria-hidden
				width="100%"
				height={rows.length * H}
				className="pointer-events-none absolute inset-0 overflow-visible stroke-border-strong"
			>
				<path
					d={paths}
					fill="none"
					strokeWidth={1.5}
					strokeLinecap="round"
				/>
			</svg>
			<ul role="none" className="relative m-0 list-none p-0">
				{rows.map((r) => (
					<Row
						key={r.node.id}
						r={r}
						h={H}
						x={cx(r.depth)}
						dense={dense}
						mono={mono}
						selected={sel === r.node.id}
						onPick={() => {
							pick(r.node)
							if (r.folder && !r.open) toggle(r.node.id)
						}}
						onToggle={(e) => {
							e.stopPropagation()
							toggle(r.node.id)
						}}
						onKey={(e) => {
							if (!r.folder) return
							if (e.key === 'ArrowRight' && !r.open) {
								e.preventDefault()
								toggle(r.node.id)
							}
							if (e.key === 'ArrowLeft' && r.open) {
								e.preventDefault()
								toggle(r.node.id)
							}
						}}
					/>
				))}
			</ul>
		</div>
	)

	if (!card) return tree

	return (
		<div
			{...rest}
			ref={ref}
			className={cn(
				'spica-surface rounded-3xl border border-border bg-surface p-1.5 font-sans text-ink shadow-xs',
				className
			)}
		>
			<div
				style={{ background: washes[wash] }}
				className="rounded-2xl border border-border p-2"
			>
				{tree}
			</div>
		</div>
	)
}

interface RowProps {
	r: TreeRow
	h: number
	x: number
	dense: boolean
	mono: boolean
	selected: boolean
	onPick: () => void
	onToggle: (event: React.MouseEvent<HTMLButtonElement>) => void
	onKey: (event: React.KeyboardEvent<HTMLButtonElement>) => void
}

function Row({
	r,
	h,
	x,
	dense,
	mono,
	selected,
	onPick,
	onToggle,
	onKey
}: RowProps) {
	const n = r.node
	const file = !r.folder

	return (
		<li
			role="treeitem"
			aria-level={r.depth + 1}
			aria-expanded={r.folder ? r.open : undefined}
			aria-selected={selected}
			data-selected={selected || undefined}
			className="group relative isolate"
		>
			<span className={pill} style={{ left: x + SQ / 2 + 4 }} />
			<button
				type="button"
				onClick={onPick}
				onKeyDown={onKey}
				style={{ paddingLeft: x + SQ / 2 + 10 }}
				className={cn(
					row,
					dense ? 'h-8' : 'h-9',
					r.folder
						? 'font-semibold text-ink'
						: 'font-medium text-ink-soft',
					mono && file ? 'font-mono text-[0.9em]' : 'text-[1em]'
				)}
			>
				<span className="min-w-0 truncate">{n.name}</span>
				{r.emptyOpen && (
					<span className="font-sans text-xs font-normal italic text-ink-muted">
						— empty, for now
					</span>
				)}
				{n.meta ? (
					<span className="flex-none font-mono text-[11px] text-ink-muted">
						{n.meta}
					</span>
				) : null}
				{n.badge ? (
					<span className="flex-none rounded-full bg-primary-soft px-[7px] py-px text-[11px] font-bold text-primary-deep">
						{n.badge}
					</span>
				) : null}
			</button>
			{r.folder ? (
				<button
					type="button"
					aria-label={r.open ? 'Collapse' : 'Expand'}
					onClick={onToggle}
					style={{ left: x - SQ / 2, top: h / 2 - SQ / 2 }}
					className={cn(square, ring)}
				>
					<svg
						aria-hidden
						width="11"
						height="11"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth={2.6}
						strokeLinecap="round"
						strokeLinejoin="round"
						className={cn(
							'transition-transform duration-(--dur-base) ease-spring motion-reduce:transition-none',
							r.open && 'rotate-90'
						)}
					>
						<path d="M9 6l6 6-6 6" />
					</svg>
				</button>
			) : (
				<span
					aria-hidden
					style={{ left: x - 4, top: h / 2 - 4 }}
					className={cn(dot, ring)}
				/>
			)}
		</li>
	)
}
