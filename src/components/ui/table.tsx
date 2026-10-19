import type * as React from 'react'
import { useState } from 'react'
import { cn } from '../../lib/cn'
import { Checkbox } from './checkbox'
import { IconButton } from './icon-button'

export interface TableColumn<T = any> {
	key: string
	label: React.ReactNode
	numeric?: boolean
	mono?: boolean
	muted?: boolean
	align?: 'left' | 'center' | 'right'
	width?: number | string
	sortable?: boolean
	render?: (row: T, index: number) => React.ReactNode
}

export interface TableProps<T = any>
	extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
	title?: React.ReactNode
	/** Small mono note top-right, e.g. '24 rows · updated 2m ago'. */
	meta?: React.ReactNode
	columns: TableColumn<T>[]
	rows: T[]
	rowKey?: (row: T, index: number) => React.Key
	footer?: React.ReactNode
	dense?: boolean
	/** Faint alternating rows. @default false */
	striped?: boolean
	hoverable?: boolean
	sortKey?: string
	sortDir?: 'asc' | 'desc'
	onSort?: (key: string, dir: 'asc' | 'desc') => void
	selectable?: boolean
	selected?: React.Key[]
	defaultSelected?: React.Key[]
	onSelectionChange?: (keys: React.Key[]) => void
	pagination?: boolean
	/** Controlled 1-based page. */
	page?: number
	defaultPage?: number
	/** @default 10 */
	pageSize?: number
	onPageChange?: (page: number) => void
	rowActions?: (row: T, index: number) => React.ReactNode
	actionsWidth?: number | string
	emptyState?: React.ReactNode
	stickyHeader?: boolean
	maxHeight?: number | string
	ref?: React.Ref<HTMLDivElement>
}

const SELECT_KEY = '__sel'
const ACTIONS_KEY = '__act'

const alignments = {
	left: 'text-left',
	center: 'text-center',
	right: 'text-right'
}

const separator =
	'[background-image:linear-gradient(var(--color-border-strong),var(--color-border-strong))] [background-repeat:no-repeat] [background-size:1px_55%] [background-position:left_40%]'

const sortButton =
	'inline-flex items-center border-0 bg-transparent p-0 [font:inherit] text-inherit cursor-pointer focus-ring'

const pageButton =
	'inline-flex h-7 min-w-7 items-center justify-center rounded-lg border-0 bg-transparent px-1.5 py-0 font-sans text-[12.5px] font-bold cursor-pointer transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none focus-ring'

function Chevron({ back }: { back?: boolean }) {
	return (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
		>
			<path d={back ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
		</svg>
	)
}

export function Table<T = any>({
	title,
	meta,
	columns = [],
	rows = [],
	rowKey,
	footer,
	dense = false,
	striped = false,
	sortKey,
	sortDir = 'asc',
	onSort,
	hoverable = true,
	selectable = false,
	selected,
	defaultSelected = [],
	onSelectionChange,
	pagination = false,
	page,
	defaultPage = 1,
	pageSize = 10,
	onPageChange,
	rowActions,
	actionsWidth = 76,
	emptyState = 'Nothing here yet — go on, add the first one.',
	stickyHeader = false,
	maxHeight,
	className,
	ref,
	...rest
}: TableProps<T>) {
	const keyOf = (row: T, index: number) =>
		rowKey ? rowKey(row, index) : index

	const [selInner, setSelInner] = useState<React.Key[]>(defaultSelected)
	const sel = selected !== undefined ? selected : selInner
	const setSel = (next: React.Key[]) => {
		if (selected === undefined) setSelInner(next)
		onSelectionChange?.(next)
	}

	const [pageInner, setPageInner] = useState(defaultPage)
	const cur = page !== undefined ? page : pageInner
	const pages = pagination
		? Math.max(1, Math.ceil(rows.length / pageSize))
		: 1

	const go = (p: number) => {
		const n = Math.min(pages, Math.max(1, p))
		if (page === undefined) setPageInner(n)
		onPageChange?.(n)
	}

	const offset = pagination ? (cur - 1) * pageSize : 0
	const visible = pagination ? rows.slice(offset, cur * pageSize) : rows
	const visibleKeys = visible.map((row, i) => keyOf(row, offset + i))
	const allOn =
		visibleKeys.length > 0 && visibleKeys.every((k) => sel.includes(k))

	const someOn = !allOn && visibleKeys.some((k) => sel.includes(k))
	const toggleAll = () =>
		setSel(
			allOn
				? sel.filter((k) => !visibleKeys.includes(k))
				: Array.from(new Set([...sel, ...visibleKeys]))
		)

	const toggleOne = (k: React.Key) =>
		setSel(sel.includes(k) ? sel.filter((x) => x !== k) : [...sel, k])

	const cols: TableColumn<T>[] = [
		...(selectable ? [{ key: SELECT_KEY, label: '', width: 44 }] : []),
		...columns,
		...(rowActions
			? [{ key: ACTIONS_KEY, label: '', width: actionsWidth }]
			: [])
	]

	const alignOf = (c: TableColumn<T>) =>
		alignments[c.align ?? (c.numeric ? 'right' : 'left')]

	const tableClass = cn(
		'w-full table-fixed border-separate border-spacing-0',
		dense ? 'text-[13px]' : 'text-sm',
		'leading-[1.45]'
	)

	const colgroup = (
		<colgroup>
			{cols.map((c) => (
				<col key={c.key} style={{ width: c.width }} />
			))}
		</colgroup>
	)

	const headCell = (c: TableColumn<T>, i: number) => {
		const th = cn(
			'overflow-hidden font-sans text-[12.5px] font-bold text-ink-soft text-ellipsis whitespace-nowrap select-none',
			dense ? 'px-3 pt-[3px] pb-1.5' : 'px-3.5 pt-1 pb-[7px]',
			alignOf(c),
			i > 0 && c.key !== SELECT_KEY && c.key !== ACTIONS_KEY && separator
		)

		if (c.key === SELECT_KEY)
			return (
				<th
					key={c.key}
					scope="col"
					style={{ width: c.width }}
					className={cn(th, 'pr-0')}
				>
					<Checkbox
						checked={allOn}
						indeterminate={someOn}
						onChange={toggleAll}
						aria-label="Select all rows"
						className="align-middle"
					/>
				</th>
			)

		const active = sortKey === c.key
		const glyph =
			onSort && c.sortable ? (
				<span
					aria-hidden
					className={cn(
						'ml-[5px] inline-block text-[10px] transition-transform duration-(--dur-base) ease-spring motion-reduce:transition-none',
						active ? 'text-primary-deep' : 'text-ink-muted',
						active && sortDir === 'desc' && 'rotate-180'
					)}
				>
					{active ? '▲' : '↕'}
				</span>
			) : null

		return (
			<th
				key={c.key}
				scope="col"
				style={{ width: c.width }}
				className={th}
				aria-sort={
					active
						? sortDir === 'desc'
							? 'descending'
							: 'ascending'
						: undefined
				}
			>
				{onSort && c.sortable ? (
					// A button, not an onClick on the <th>: the sort has to be keyboard-operable
					<button
						type="button"
						className={sortButton}
						onClick={() =>
							onSort(
								c.key,
								active && sortDir === 'asc' ? 'desc' : 'asc'
							)
						}
					>
						{c.label}
						{glyph}
					</button>
				) : (
					<>
						{c.label}
						{glyph}
					</>
				)}
			</th>
		)
	}

	const headTable = (
		<table
			role="presentation"
			className={cn(tableClass, !title && !meta && 'mt-0.5')}
		>
			{colgroup}
			<thead>
				<tr>{cols.map(headCell)}</tr>
			</thead>
		</table>
	)

	const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1).filter(
		(p) => pages <= 7 || Math.abs(p - cur) <= 1 || p === 1 || p === pages
	)
	const pageItems: React.ReactNode[] = []
	pageNumbers.forEach((p, i) => {
		const prev = pageNumbers[i - 1]
		if (prev !== undefined && p - prev > 1)
			pageItems.push(
				<span key={`ellipsis-${p}`} className="px-0.5 text-ink-muted">
					…
				</span>
			)
		pageItems.push(
			<button
				key={p}
				type="button"
				onClick={() => go(p)}
				aria-current={p === cur ? 'page' : undefined}
				className={cn(
					pageButton,
					p === cur
						? 'bg-primary-soft text-primary-deep'
						: 'text-ink-soft'
				)}
			>
				{p}
			</button>
		)
	})

	const pager = pagination ? (
		<div className="ml-auto flex items-center gap-1">
			<span className="mr-1.5 font-mono text-[11.5px] text-ink-muted">
				{`${offset + 1}–${Math.min(cur * pageSize, rows.length)} of ${rows.length}`}
			</span>
			<IconButton
				label="Previous page"
				size="sm"
				variant="surface"
				disabled={cur <= 1}
				onClick={() => go(cur - 1)}
			>
				<Chevron back />
			</IconButton>
			{pageItems}
			<IconButton
				label="Next page"
				size="sm"
				variant="surface"
				disabled={cur >= pages}
				onClick={() => go(cur + 1)}
			>
				<Chevron />
			</IconButton>
		</div>
	) : null

	const selectedNote =
		selectable && sel.length ? (
			<span className="font-bold text-primary-deep">{`${sel.length} selected`}</span>
		) : null

	return (
		<div
			{...rest}
			ref={ref}
			className={cn(
				'spica-surface rounded-3xl border border-border bg-surface p-1.5 font-sans text-ink shadow-xs',
				className
			)}
		>
			{title || meta ? (
				<div className="flex items-baseline gap-[9px] px-2 pt-1 pb-1.5">
					{title ? (
						<span className="text-sm font-bold whitespace-nowrap text-ink">
							{title}
						</span>
					) : null}
					{meta ? (
						<span className="ml-auto font-mono text-[11.5px] whitespace-nowrap text-ink-muted">
							{meta}
						</span>
					) : null}
				</div>
			) : null}
			{stickyHeader ? null : headTable}
			<div
				style={stickyHeader ? { maxHeight } : undefined}
				className={cn(
					'relative overflow-x-auto rounded-2xl border border-border [background:var(--surface-wash-cool)]',
					stickyHeader && 'overflow-y-auto'
				)}
			>
				{stickyHeader ? (
					<div className="sticky top-0 z-2 rounded-t-2xl border-b border-border bg-surface">
						{headTable}
					</div>
				) : null}
				{visible.length === 0 ? (
					<div
						className={cn(
							'rounded-2xl text-center text-sm text-ink-soft [background-image:var(--gradient-magic)]',
							dense ? 'px-4 py-7' : 'px-4 py-10'
						)}
					>
						<span
							aria-hidden
							className="mr-2 inline-block text-primary animate-spica-twinkle motion-reduce:animate-none"
						>
							✦
						</span>
						{emptyState}
					</div>
				) : (
					<table className={tableClass}>
						{colgroup}
						<tbody>
							{visible.map((row, i) => {
								const k = visibleKeys[i]!
								const index = offset + i
								const last = i === visible.length - 1
								const isSelected = selectable && sel.includes(k)
								return (
									<tr
										key={k}
										aria-selected={isSelected || undefined}
										data-selected={isSelected || undefined}
										className={cn(
											'group transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none',
											striped &&
												i % 2 === 1 &&
												'bg-surface-2/55',
											hoverable &&
												'not-data-selected:hover:bg-primary-soft/55 not-data-selected:focus-within:bg-primary-soft/55',
											'data-selected:bg-primary-soft/85'
										)}
									>
										{cols.map((c) => {
											const td = cn(
												'overflow-hidden align-middle text-ellipsis tabular-nums',
												dense
													? 'px-3 py-[7px]'
													: 'px-3.5 py-[11px]',
												alignOf(c),
												c.muted
													? 'text-ink-soft'
													: 'text-ink',
												!last &&
													'border-b border-border',
												c.mono || c.numeric
													? cn(
															'font-mono',
															dense
																? 'text-[12.5px]'
																: 'text-[13px]'
														)
													: 'font-sans'
											)

											if (c.key === ACTIONS_KEY)
												return (
													<td
														key={c.key}
														className={cn(
															td,
															'py-0 pr-2 pl-0 text-right whitespace-nowrap'
														)}
													>
														<div className="inline-flex gap-0.5 opacity-0 transition-opacity duration-(--dur-fast) ease-out group-hover:opacity-100 group-focus-within:opacity-100 group-data-selected:opacity-100 motion-reduce:transition-none">
															{rowActions?.(
																row,
																index
															)}
														</div>
													</td>
												)

											if (c.key === SELECT_KEY)
												return (
													<td
														key={c.key}
														className={cn(
															td,
															'pr-0'
														)}
													>
														<Checkbox
															checked={sel.includes(
																k
															)}
															onChange={() =>
																toggleOne(k)
															}
															aria-label="Select row"
															className="align-middle"
														/>
													</td>
												)

											return (
												<td key={c.key} className={td}>
													{c.render
														? c.render(row, index)
														: ((
																row as Record<
																	string,
																	unknown
																>
															)[
																c.key
															] as React.ReactNode)}
												</td>
											)
										})}
									</tr>
								)
							})}
						</tbody>
					</table>
				)}
			</div>
			{footer || pager || selectedNote ? (
				<div className="flex items-center gap-[9px] px-2 pt-2 pb-0.5 text-[12.5px] text-ink-soft">
					{selectedNote}
					{footer}
					{pager}
				</div>
			) : null}
		</div>
	)
}
