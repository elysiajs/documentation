import { useRef, useState, type KeyboardEvent } from 'react'
import {
	IconAlertTriangle,
	IconCode,
	IconChevronDown,
	IconCompass,
	IconSearch,
	IconSettings,
	IconX
} from '@tabler/icons-react'
import { Popover } from '@base-ui/react/popover'
import { Combobox } from '@base-ui/react/combobox'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/icon-button'
import { SelectMenu } from '../ui/select-menu'
import { Tabs } from '../ui/tabs'
import { menuPanel, menuScroll, menuRow } from '../ui/menu-styles'
import type { TutorialRoute } from './testcases'
import { previewDocument } from './preview-document'

export interface Input {
	path: string
	method: string
	body: string
	headers: string[][]
	cookie: string[][]
}

export interface Response {
	body: string | null
	status: number | null
	headers: Record<string, string>
}

export interface ResultState {
	console: { data: string; time: number }[]
	error: string | null
	isHTML: boolean
}

export type ResultTab = 'preview' | 'response' | 'console'

interface ResultProps {
	input: Input
	routes: TutorialRoute[]
	onInputChange(patch: Partial<Input>): void
	response: Response
	result: ResultState
	resultTab: ResultTab
	onResultTabChange(tab: ResultTab): void
}

const field =
	'box-border m-0 min-w-0 appearance-none rounded-xl border bg-transparent px-2 py-1 font-mono text-sm text-ink outline-none focus-ring'

export function requestPaths(routes: TutorialRoute[], method: string): string[] {
	return [...new Set(routes
		.filter((route) => route.method === method || route.method === 'ALL' || route.method === '*')
		.map((route) => route.path))]
}

/** Names the pane a view is showing, so "Network" and "Console" are not left to the tab icon alone. */
const viewLabel =
	'm-0 px-3 pt-2 pb-1 font-sans text-xs font-normal text-ink-soft'

function KeyValueRows({
	label,
	value,
	onChange
}: {
	label: string
	value: string[][]
	onChange(value: string[][]): void
}) {
	const table = useRef<HTMLTableElement>(null)
	const rows = [...value, ['', '']]
	function move(
		event: KeyboardEvent<HTMLInputElement>,
		row: number,
		column: number
	) {
		const input = event.currentTarget
		let nextRow = row
		let nextColumn = column
		if (event.key === 'ArrowUp') nextRow--
		else if (event.key === 'ArrowDown') nextRow++
		else if (
			event.key === 'ArrowLeft' &&
			input.selectionStart === 0 &&
			input.selectionEnd === 0
		)
			nextColumn--
		else if (
			event.key === 'ArrowRight' &&
			input.selectionStart === input.value.length &&
			input.selectionEnd === input.value.length
		)
			nextColumn++
		else return
		if (
			nextRow < 0 ||
			nextRow >= rows.length ||
			nextColumn < 0 ||
			nextColumn > 1
		)
			return
		event.preventDefault()
		table.current
			?.querySelector<HTMLInputElement>(
				`[data-cell="${nextRow}-${nextColumn}"]`
			)
			?.focus()
	}
	return (
		<table
			ref={table}
			className="w-full table-fixed border-collapse text-left font-mono text-sm"
		>
			<thead>
				<tr>
					{[label, 'Value'].map((heading) => (
						<th
							key={heading}
							scope="col"
							className="px-2 py-1 text-xs font-normal text-ink-soft"
						>
							{heading}
						</th>
					))}
				</tr>
			</thead>
			<tbody>
				{rows.map((row, rowIndex) => (
					<tr key={rowIndex}>
						{[0, 1].map((column) => (
							<td
								key={column}
								className="border border-solid border-control-border light:border-border p-0"
							>
								<input
									type="text"
									aria-label={`${label} ${rowIndex + 1} ${column === 0 ? 'name' : 'value'}`}
									data-cell={`${rowIndex}-${column}`}
									value={row[column] ?? ''}
									className={cn(field, 'w-full border-transparent')}
									onKeyDown={(event) =>
										move(event, rowIndex, column)
									}
									onChange={(event) => {
										const next = rows.map((row) => [...row])
										next[rowIndex][column] =
											event.target.value
										while (
											next.length &&
											next[next.length - 1].every(
												(cell) => !cell
											)
										)
											next.pop()
										onChange(next)
									}}
								/>
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	)
}

function formatTime(time: number) {
	const date = new Date(time)
	return `${[date.getHours(), date.getMinutes(), date.getSeconds()].map((value) => String(value).padStart(2, '0')).join(':')}.${String(date.getMilliseconds()).padStart(3, '0')}`
}

export default function Result({
	input,
	routes,
	onInputChange,
	response,
	result,
	resultTab,
	onResultTabChange
}: ResultProps) {
	const [advanced, setAdvanced] = useState(false)
	const [advancedTab, setAdvancedTab] = useState('body')
	const paths = requestPaths(routes, input.method)

	return (
		<Popover.Root open={advanced} onOpenChange={setAdvanced} modal={false}>
			<section
				aria-label="Request and result"
				className="spica-surface relative box-border flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-solid border-border-strong bg-surface text-ink "
			>
				<div className="flex shrink-0 flex-wrap items-center gap-1 border-0 border-b border-solid border-border p-2">
					<div className="flex min-w-0 flex-1 basis-64 items-center gap-1">
						<SelectMenu
							aria-label="Request method"
							variant="ghost"
							options={[
								'GET',
								'POST',
								'PUT',
								'DELETE',
								'PATCH',
								'OPTIONS',
								'HEAD'
							]}
							value={input.method}
							onChange={(method) => {
								if (method) onInputChange({ method })
							}}
							className="h-9 px-2 font-mono text-sm"
						/>
						<Combobox.Root
							items={paths}
							value={paths.includes(input.path) ? input.path : null}
							inputValue={input.path}
							onInputValueChange={(path, details) => {
								if (details.reason === 'input-change' || details.reason === 'item-press')
									onInputChange({ path })
								else details.cancel()
							}}
							onValueChange={(path) => {
								if (path !== null) onInputChange({ path })
							}}
						>
							<div className="relative min-w-0 flex-1">
								<Combobox.Input
									aria-label="Request path"
									className={cn(field, 'h-9 w-full border-control-border pr-8 light:border-transparent')}
									spellCheck={false}
								/>
								<Combobox.Trigger
									aria-label="Show registered routes"
									className="absolute inset-y-1 right-1 box-border flex w-7 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-ink-soft hover:bg-surface-2 focus-ring"
								>
									<IconChevronDown size={15} stroke={1.5} aria-hidden />
								</Combobox.Trigger>
							</div>
							<Combobox.Portal>
								<Combobox.Positioner sideOffset={6} align="start" collisionPadding={8} className="z-50">
									<Combobox.Popup className={cn(menuPanel, 'w-(--anchor-width)')}>
										<Combobox.Empty className="px-2 py-1 text-sm text-ink-soft empty:hidden">No matching routes</Combobox.Empty>
										<Combobox.List className={menuScroll}>
											{(path: string) => <Combobox.Item key={path} value={path} className={cn(menuRow, 'font-mono data-[highlighted]:bg-primary-soft data-[highlighted]:text-primary-deep')}>
												{path}
												</Combobox.Item>}
										</Combobox.List>
									</Combobox.Popup>
								</Combobox.Positioner>
							</Combobox.Portal>
						</Combobox.Root>
						<Popover.Trigger
							render={
								<IconButton
									label="Request settings"
									className="group"
									active={advanced}
								/>
							}
						>
							<span aria-hidden="true" className="pointer-events-none relative size-[18px]">
								<IconSettings
									size={18}
									stroke={1.5}
									className={cn(
										'absolute inset-0 transition-[transform,opacity] duration-(--dur-fast) ease-out group-focus-visible:transition-none motion-reduce:transform-none motion-reduce:transition-none',
										advanced ? '[transform:rotate(45deg)_scale(.95)] opacity-0' : '[transform:rotate(0deg)_scale(1)] opacity-100'
									)}
								/>
								<IconX
									size={18}
									stroke={1.5}
									className={cn(
										'absolute inset-0 transition-[transform,opacity] duration-(--dur-fast) ease-out group-focus-visible:transition-none motion-reduce:transform-none motion-reduce:transition-none',
										advanced ? '[transform:rotate(0deg)_scale(1)] opacity-100' : '[transform:rotate(-45deg)_scale(.95)] opacity-0'
									)}
								/>
							</span>
						</Popover.Trigger>
					</div>
					<Tabs
						aria-label="Result view"
						tone="white"
						iconOnly
						size="sm"
						value={resultTab}
						onChange={(tab) => onResultTabChange(tab as ResultTab)}
						tabs={[
							{
								value: 'preview',
								label: 'Preview',
								tooltip: 'Preview',
								icon: <IconCompass size={18} stroke={1.5} />
							},
							{
								value: 'response',
								label: 'Response',
								tooltip: 'Response',
								icon: <IconSearch size={18} stroke={1.5} />
							},
							{
								value: 'console',
								label: 'Console',
								tooltip: 'Console',
								icon: <IconCode size={18} stroke={1.5} />
							}
						]}
					/>
				</div>
				<div className="relative min-h-0 flex-1 overflow-auto font-mono text-sm">
					{resultTab === 'preview' &&
						(result.isHTML ? (
							<iframe
								key={response.body ?? ''}
								title="Preview"
								sandbox="allow-scripts"
								srcDoc={previewDocument(response.body ?? '')}
								className="block h-full w-full border-0 bg-surface"
							/>
						) : (
							<pre className="m-0 whitespace-pre-wrap break-words p-3 font-mono text-sm">
								{response.body}
							</pre>
						))}
					{resultTab === 'preview' && result.error && (
						<div
							role="alert"
							className="absolute inset-0 overflow-auto bg-surface/95 text-danger-deep"
						>
							<p
								className={cn(
									viewLabel,
									'flex items-center gap-1.5 text-danger-deep'
								)}
							>
								<IconAlertTriangle
									size={16}
									stroke={1.5}
									aria-hidden="true"
								/>
								Error
							</p>
							<pre className="m-0 whitespace-pre-wrap break-words px-3 pb-3 font-mono text-sm">
								{result.error}
							</pre>
						</div>
					)}
					{resultTab === 'response' && response.body !== null && (
						<>
							<p className={viewLabel}>Network</p>
							<pre className="m-0 whitespace-pre-wrap break-words px-3 pb-3 font-mono text-sm">{`HTTP/1.1 ${response.status ?? ''}\n${Object.entries(
								response.headers
							)
								.map(([name, value]) => `${name}: ${value}`)
								.join('\n')}\n\n${response.body}`}</pre>
						</>
					)}
					{resultTab === 'console' && (
						<>
							<p className={viewLabel}>Console</p>
							<div className="px-3 pb-3">
								{result.error ? (
									<pre className="m-0 whitespace-pre-wrap break-words font-mono text-sm text-danger-deep">
										{result.error}
									</pre>
								) : (
									result.console.map(
										({ data, time }, index) => (
											<div
												key={index}
												className="flex items-start gap-3 rounded-xl px-1 py-0.5 hover:bg-surface-2"
											>
												<pre className="m-0 min-w-0 flex-1 whitespace-pre-wrap break-words font-mono text-sm">
													{data}
												</pre>
												<time className="shrink-0 pt-0.5 text-xs text-ink-soft">
													{formatTime(time)}
												</time>
											</div>
										)
									)
								)}
							</div>
						</>
					)}
				</div>
				<Popover.Portal>
					<Popover.Positioner
						side="top"
						align="end"
						sideOffset={8}
						collisionPadding={8}
						className="spica-surface z-50"
					>
						<Popover.Popup className="spica-surface flex h-72 max-h-(--available-height) w-[min(32rem,calc(100vw-1rem))] max-w-(--available-width) flex-col overflow-hidden rounded-2xl border border-solid border-border-strong bg-glass light:bg-surface [backdrop-filter:var(--glass-blur-small)] font-sans text-ink shadow-lg focus-ring [transform-origin:var(--transform-origin)] transition-[opacity,scale,translate] duration-[240ms] [transition-timing-function:var(--ease-out),var(--ease-spring),var(--ease-spring)] data-[starting-style]:scale-[.96] data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-100 data-[ending-style]:ease-out data-[instant]:transition-none motion-reduce:transition-none">
							<Popover.Title className="sr-only">
								Request settings
							</Popover.Title>
							<div className="flex shrink-0 items-center justify-between gap-2 border-0 border-b border-solid border-border p-2">
								<Tabs
									aria-label="Request settings fields"
									tone="white"
									size="sm"
									value={advancedTab}
									onChange={setAdvancedTab}
									tabs={[
										{ value: 'body', label: 'Body' },
										{ value: 'headers', label: 'Headers' },
										{ value: 'cookie', label: 'Cookie' }
									]}
								/>
								<Popover.Close
									render={
										<IconButton
											label="Close request settings"
											size="sm"
										/>
									}
								>
									<IconX size={18} stroke={1.5} />
								</Popover.Close>
							</div>
							<div className="min-h-0 flex-1 overflow-auto p-2">
								{advancedTab === 'body' ? (
									<textarea
										aria-label="Request body"
										value={input.body}
										onChange={(event) =>
											onInputChange({
												body: event.target.value
											})
										}
										spellCheck={false}
										className={cn(
											field,
											'h-full min-h-16 w-full resize-none align-top border-control-border light:border-transparent'
										)}
									/>
								) : (
									<KeyValueRows
										key={advancedTab}
										label={
											advancedTab === 'headers'
												? 'Header'
												: 'Cookie'
										}
										value={
											input[
												advancedTab === 'headers'
													? 'headers'
													: 'cookie'
											]
										}
										onChange={(value) =>
											onInputChange({
												[advancedTab]: value
											})
										}
									/>
								)}
							</div>
						</Popover.Popup>
					</Popover.Positioner>
				</Popover.Portal>
			</section>
		</Popover.Root>
	)
}
