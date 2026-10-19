import type * as React from 'react'
import { useState } from 'react'
import {
	IconCopy,
	IconLoader2,
	IconPencil,
	IconPlus,
	IconSearch,
	IconStar,
	IconTrash
} from '@tabler/icons-react'
import { cn } from '../lib/cn'
import { Button } from './ui/button'
import { Callout } from './ui/callout'
import { Card } from './ui/card'
import { Checkbox } from './ui/checkbox'
import { Dropdown } from './ui/dropdown'
import { FileTree, type FileTreeNode } from './ui/file-tree'
import { IconButton } from './ui/icon-button'
import { InputGroup } from './ui/input-group'
import { NumberedCards } from './ui/numbered-cards'
import { Select } from './ui/select'
import { SelectMenu } from './ui/select-menu'
import { Table, type TableColumn } from './ui/table'
import { Tabs } from './ui/tabs'
import { Tooltip } from './ui/tooltip'
import { DependencyStory } from './plugin-tree/dependency'

function Cell({
	name,
	span,
	children
}: {
	name: string
	span?: string
	children: React.ReactNode
}) {
	return (
		<section
			className={cn(
				'flex min-h-[20rem] flex-col border-t border-l border-border p-6',
				span
			)}
		>
			<h2 className="m-0 font-sans text-[15px] font-semibold text-ink">
				{name}
			</h2>
			<div className="flex flex-1 items-center justify-center">
				{children}
			</div>
		</section>
	)
}

const statusSwatch = {
	Healthy: 'var(--color-success)',
	Degraded: 'var(--color-warning)',
	Down: 'var(--color-danger)'
}

interface Deployment {
	id: string
	name: string
	status: keyof typeof statusSwatch
	region: string
	p95: number
}

const deployments: Deployment[] = [
	{
		id: 'd1',
		name: 'api-gateway',
		status: 'Healthy',
		region: 'iad1',
		p95: 42
	},
	{
		id: 'd2',
		name: 'auth-worker',
		status: 'Healthy',
		region: 'sin1',
		p95: 68
	},
	{ id: 'd3', name: 'billing', status: 'Degraded', region: 'fra1', p95: 214 },
	{ id: 'd4', name: 'docs-site', status: 'Healthy', region: 'cdg1', p95: 19 },
	{
		id: 'd5',
		name: 'image-resize',
		status: 'Down',
		region: 'hnd1',
		p95: 903
	},
	{
		id: 'd6',
		name: 'search-index',
		status: 'Healthy',
		region: 'iad1',
		p95: 87
	},
	{ id: 'd7', name: 'webhooks', status: 'Degraded', region: 'syd1', p95: 156 }
]

const deploymentColumns: TableColumn<Deployment>[] = [
	{ key: 'name', label: 'Name', sortable: true },
	{
		key: 'status',
		label: 'Status',
		render: (row) => (
			<span className="inline-flex items-center gap-2">
				<span
					aria-hidden
					className="size-2 shrink-0 rounded-full"
					style={{ background: statusSwatch[row.status] }}
				/>
				{row.status}
			</span>
		)
	},
	{ key: 'region', label: 'Region', mono: true, muted: true },
	{ key: 'p95', label: 'p95 ms', numeric: true }
]

const repo: FileTreeNode[] = [
	{
		id: 'src',
		name: 'src',
		children: [
			{ id: 'src/index.ts', name: 'index.ts' },
			{ id: 'src/routes', name: 'routes', badge: 'New', children: [] },
			{ id: 'src/types.ts', name: 'types.ts', meta: '1 kB' }
		]
	},
	{
		id: 'test',
		name: 'test',
		children: [{ id: 'test/index.test.ts', name: 'index.test.ts' }]
	},
	{ id: 'readme', name: 'readme.md', meta: '2 kB' },
	{ id: 'package', name: 'package.json' }
]

export function DesignSystemGallery() {
	const [sort, setSort] = useState<{ key: string; dir: 'asc' | 'desc' }>({
		key: 'name',
		dir: 'asc'
	})
	const sortedDeployments = [...deployments].sort((a, b) => {
		const direction = sort.dir === 'asc' ? 1 : -1
		const left = a[sort.key as keyof Deployment]
		const right = b[sort.key as keyof Deployment]
		return typeof left === 'number' && typeof right === 'number'
			? (left - right) * direction
			: String(left).localeCompare(String(right)) * direction
	})

	return (
		<div className="spica-surface not-content grid grid-flow-row-dense grid-cols-1 border-r border-b border-border font-sans text-ink md:grid-cols-2 xl:grid-cols-3">
			<Cell name="Button">
				<div className="flex flex-col items-stretch gap-2.5">
					<Button variant="secondary">
						<IconPlus size={16} aria-hidden />
						Create worker
					</Button>
					<Button>
						<IconPlus size={16} aria-hidden />
						Create worker
					</Button>
					<Button disabled>
						<IconLoader2
							size={16}
							aria-hidden
							className="animate-spica-spin motion-reduce:animate-none"
						/>
						Create worker
					</Button>
				</div>
			</Cell>

			<Cell name="IconButton">
				<div className="flex items-center gap-2.5">
					<IconButton label="Rename">
						<IconPencil size={18} aria-hidden />
					</IconButton>
					<IconButton label="Duplicate" variant="outline">
						<IconCopy size={18} aria-hidden />
					</IconButton>
					<IconButton label="Star" variant="surface">
						<IconStar size={18} aria-hidden />
					</IconButton>
					<IconButton label="Create worker" variant="primary">
						<IconPlus size={18} aria-hidden />
					</IconButton>
				</div>
			</Cell>

			<Cell name="Tabs">
				<Tabs
					aria-label="Worker sections"
					tabs={[
						'Overview',
						{ value: 'routes', label: 'Routes', count: 3 },
						'Settings'
					]}
				/>
			</Cell>

			<Cell name="Waveform timing" span="md:col-span-2 xl:col-span-3">
				<div className="w-full min-w-0 max-w-3xl">
					<DependencyStory />
				</div>
			</Cell>

			<Cell name="Checkbox">
				<div className="flex flex-col items-start gap-3.5">
					<Checkbox label="Email me updates" defaultChecked />
					<Checkbox indeterminate label="Select all" />
				</div>
			</Cell>

			<Cell name="Select">
				<Select
					label="Version"
					options={['1.4.28', '1.3.0', '1.2.0']}
					style={{ width: '100%', maxWidth: '15rem' }}
				/>
			</Cell>

			<Cell name="SelectMenu">
				<SelectMenu
					label="Status"
					defaultValue="healthy"
					style={{ width: '100%', maxWidth: '15rem' }}
					options={[
						{
							value: 'healthy',
							label: 'Healthy',
							swatch: 'var(--color-success)'
						},
						{
							value: 'degraded',
							label: 'Degraded',
							swatch: 'var(--color-warning)'
						},
						{
							value: 'down',
							label: 'Down',
							swatch: 'var(--color-danger)'
						}
					]}
				/>
			</Cell>

			<Cell name="Dropdown">
				<Dropdown
					trigger={<Button variant="secondary">Actions</Button>}
					items={[
						{
							label: 'Rename',
							icon: <IconPencil size={15} aria-hidden />,
							shortcut: '⌘R'
						},
						{
							label: 'Duplicate',
							icon: <IconCopy size={15} aria-hidden />,
							shortcut: '⌘D'
						},
						'divider',
						{
							label: 'Delete',
							icon: <IconTrash size={15} aria-hidden />,
							danger: true
						}
					]}
				/>
			</Cell>

			<Cell name="InputGroup">
				<InputGroup
					label="Search"
					prefix={<IconSearch size={16} aria-hidden />}
					placeholder="Search docs…"
					style={{ width: '100%', maxWidth: '17rem' }}
				/>
			</Cell>

			<Cell name="Tooltip">
				<Tooltip label="Runs the next hook.">
					<Button variant="ghost">Hover me</Button>
				</Tooltip>
			</Cell>

			<Cell name="Callout">
				<Callout tone="tip" className="w-full max-w-[22rem]">
					Hooks you add before a route only apply to the routes below
					it.
				</Callout>
			</Cell>

			<Cell name="Card">
				<Card
					eyebrow="Essential"
					title="Routing"
					wash
					className="w-full max-w-[22rem]"
				>
					Map a method and a path to a handler, and Elysia does the
					rest.
				</Card>
			</Cell>

			<Cell name="NumberedCards" span="md:col-span-2 xl:col-span-3">
				<div className="w-full">
					<NumberedCards
						items={[
							{
								title: 'Install',
								children:
									'Run bun create elysia and you have a server in one command.'
							},
							{
								title: 'Add a route',
								children:
									'Chain .get, .post, and friends — types follow you all the way to the client.'
							}
						]}
					/>
				</div>
			</Cell>

			<Cell name="FileTree">
				<FileTree
					mono
					nodes={repo}
					defaultExpanded={['src']}
					defaultSelected="src/index.ts"
					className="w-full max-w-[20rem]"
				/>
			</Cell>

			<Cell name="Table" span="md:col-span-2 xl:col-span-3">
				<Table
					title="Deployments"
					meta="7 rows"
					columns={deploymentColumns}
					rows={sortedDeployments}
					rowKey={(row) => row.id}
					sortKey={sort.key}
					sortDir={sort.dir}
					onSort={(key, dir) => setSort({ key, dir })}
					selectable
					pagination
					pageSize={4}
					className="w-full"
				/>
			</Cell>
		</div>
	)
}
