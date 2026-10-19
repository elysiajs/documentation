import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { ContextMenu } from '@base-ui/react/context-menu'
import { Menu } from '@base-ui/react/menu'
import {
	IconCopy,
	IconCut,
	IconFile,
	IconFilePlus,
	IconFolder,
	IconFolderOpen,
	IconFolderPlus,
	IconPencil,
	IconClipboard,
	IconTrash
} from '@tabler/icons-react'
import { cn } from '../../lib/cn'
import { IconButton } from '../ui/icon-button'
import { menuPanel, menuRow, menuScroll } from '../ui/menu-styles'
import { MenuIndicator } from '../ui/menu-indicator'
import {
	copyEntry,
	createEntry,
	deleteEntry,
	entryKind,
	folderPaths,
	moveEntry,
	pasteEntry,
	renameEntry,
	type ClipboardEntry,
	type ExplorerState
} from './file-operations'

interface Props extends ExplorerState {
	onFilesChange(update: (state: ExplorerState) => ExplorerState): void
}
type Editing = {
	path?: string
	parent: string
	kind: 'file' | 'folder'
	value: string
	error?: string
}
const parentPath = (path: string) => path.split('/').slice(0, -1).join('/')
const basename = (path: string) => path.split('/').at(-1) ?? ''
const dragType = 'application/x-elysia-tutorial-entry'

export function FileExplorer({ fs, folders, tabs, onFilesChange }: Props) {
	const state = { fs, folders, tabs }
	const allFolders = folderPaths(state)
	const [expanded, setExpanded] = useState<string[]>(() => allFolders)
	const [selected, setSelected] = useState('')
	const [editing, setEditing] = useState<Editing | null>(null)
	const [clipboard, setClipboard] = useState<
		{ copy: ClipboardEntry } | { cut: string } | null
	>(null)
	const [message, setMessage] = useState('')
	const [contextPath, setContextPath] = useState('')
	const [contextKeyboard, setContextKeyboard] = useState(false)
	const [dropTarget, setDropTarget] = useState<string | null>(null)
	const dragging = useRef<string | null>(null)
	const tree = useRef<HTMLDivElement>(null)
	const input = useRef<HTMLInputElement>(null)
	const errorId = useId()
	const groupId = useId()
	const activeFile = tabs.files[tabs.active]
	const paths = [...allFolders, ...Object.keys(fs)].sort(
		(a, b) =>
			Number(entryKind(state, b) === 'folder') -
				Number(entryKind(state, a) === 'folder') || a.localeCompare(b)
	)
	const children = (parent: string) =>
		paths.filter((path) => parentPath(path) === parent)
	const visible: string[] = []
	function flatten(parent: string) {
		for (const path of children(parent)) {
			visible.push(path)
			if (expanded.includes(path)) flatten(path)
		}
	}
	flatten('')
	const focusPath = visible.includes(selected) ? selected : visible[0]

	useEffect(() => {
		if (editing) {
			input.current?.focus()
			if (editing.path)
				input.current?.setSelectionRange(
					0,
					editing.kind === 'file' && editing.value.includes('.')
						? editing.value.lastIndexOf('.')
						: editing.value.length
				)
		}
	}, [editing?.path, editing?.parent, editing?.kind, !!editing])
	useEffect(() => {
		if (activeFile) {
			setSelected(activeFile)
			setExpanded((current) => [
				...new Set([
					...current,
					...allFolders.filter((folder) =>
						activeFile.startsWith(folder + '/')
					)
				])
			])
		}
	}, [activeFile])

	useEffect(() => {
		if (clipboard && 'cut' in clipboard && !entryKind(state, clipboard.cut))
			setClipboard(null)
	}, [fs, folders])

	function invalidateCut(path: string) {
		if (
			clipboard &&
			'cut' in clipboard &&
			(clipboard.cut === path ||
				clipboard.cut.startsWith(path + '/') ||
				path.startsWith(clipboard.cut + '/'))
		)
			setClipboard(null)
	}
	function remapExpanded(path: string, nextPath: string) {
		setExpanded((current) => [
			...new Set([
				...current.map((folder) =>
					folder === path || folder.startsWith(path + '/')
						? nextPath + folder.slice(path.length)
						: folder
				),
				parentPath(nextPath)
			])
		])
	}
	function focus(path: string) {
		path ||= visible[0] ?? ''
		setSelected(path)
		requestAnimationFrame(() => {
			const row = [
				...(tree.current?.querySelectorAll<HTMLElement>(
					'[role="treeitem"]'
				) ?? [])
			].find((element) => element.dataset.path === path)
			row?.focus()
		})
	}
	function run(update: (current: ExplorerState) => ExplorerState) {
		try {
			onFilesChange(update)
			setMessage('')
			return true
		} catch (error) {
			setMessage(
				error instanceof Error
					? error.message
					: 'Could not update files.'
			)
			return false
		}
	}
	function targetFolder(path: string) {
		return entryKind(state, path) === 'folder' ? path : parentPath(path)
	}
	function begin(kind: 'file' | 'folder', path = selected) {
		const parent = targetFolder(path)
		setExpanded((current) => [...new Set([...current, parent])])
		setEditing({ parent, kind, value: '' })
	}
	function rename(path: string) {
		if (!path || path === 'index.ts') return
		setEditing({
			path,
			parent: parentPath(path),
			kind: entryKind(state, path) ?? 'file',
			value: basename(path)
		})
	}
	function save() {
		if (!editing) return
		try {
			onFilesChange((current) =>
				editing.path
					? renameEntry(current, editing.path, editing.value)
					: createEntry(
							current,
							editing.parent,
							editing.value,
							editing.kind
						)
			)
			const nextPath = [editing.parent, editing.value]
				.filter(Boolean)
				.join('/')
			if (editing.path) {
				remapExpanded(editing.path, nextPath)
				invalidateCut(editing.path)
			}
			setEditing(null)
			setMessage('')
			focus(nextPath)
		} catch (error) {
			setEditing({
				...editing,
				error:
					error instanceof Error
						? error.message
						: 'Could not save this name.'
			})
		}
	}
	function remove(path: string) {
		if (!path || path === 'index.ts') return
		if (
			!window.confirm(
				`Delete “${basename(path)}”${entryKind(state, path) === 'folder' ? ' and everything inside it' : ''}? This cannot be undone.`
			)
		)
			return
		if (run((current) => deleteEntry(current, path))) {
			invalidateCut(path)
			focus(
				parentPath(path) ||
					visible.find(
						(item) => item !== path && !item.startsWith(path + '/')
					) ||
					''
			)
		}
	}
	function copy(path: string, cut = false) {
		if (!path || (cut && path === 'index.ts')) return
		run((current) => {
			const snapshot = copyEntry(current, path)
			setClipboard(cut ? { cut: path } : { copy: snapshot })
			return current
		})
	}
	function paste(path: string) {
		if (!clipboard) return
		const folder = targetFolder(path)
		if (
			run((current) =>
				'cut' in clipboard
					? moveEntry(current, clipboard.cut, folder)
					: pasteEntry(current, clipboard.copy, folder)
			)
		) {
			if ('cut' in clipboard) {
				const nextPath = [folder, basename(clipboard.cut)]
					.filter(Boolean)
					.join('/')
				remapExpanded(clipboard.cut, nextPath)
				focus(nextPath)
				setClipboard(null)
			}
			setExpanded((current) => [...new Set([...current, folder])])
		}
	}
	function open(path: string) {
		setSelected(path)
		if (entryKind(state, path) === 'folder')
			setExpanded((current) =>
				current.includes(path)
					? current.filter((item) => item !== path)
					: [...current, path]
			)
		else
			run((current) => {
				const files = current.tabs.files.includes(path)
					? current.tabs.files
					: [...current.tabs.files, path]
				return {
					...current,
					tabs: { files, active: files.indexOf(path) }
				}
			})
	}
	function keyDown(event: KeyboardEvent, path: string) {
		if (
			event.target instanceof HTMLInputElement ||
			event.target !== event.currentTarget
		)
			return
		const index = visible.indexOf(path),
			folder = entryKind(state, path) === 'folder'
		if (
			(event.metaKey || event.ctrlKey) &&
			['c', 'x', 'v'].includes(event.key.toLowerCase())
		) {
			event.preventDefault()
			if (event.key.toLowerCase() === 'v') paste(path)
			else copy(path, event.key.toLowerCase() === 'x')
			return
		}
		switch (event.key) {
			case 'ArrowDown':
				focus(visible[Math.min(index + 1, visible.length - 1)])
				break
			case 'ArrowUp':
				focus(visible[Math.max(index - 1, 0)])
				break
			case 'Home':
				focus(visible[0])
				break
			case 'End':
				focus(visible.at(-1)!)
				break
			case 'ArrowRight':
				if (folder) {
					if (!expanded.includes(path))
						setExpanded([...expanded, path])
					else if (children(path)[0]) focus(children(path)[0])
				}
				break
			case 'ArrowLeft':
				if (folder && expanded.includes(path))
					setExpanded(expanded.filter((item) => item !== path))
				else if (parentPath(path)) focus(parentPath(path))
				break
			case 'Enter':
			case ' ':
				open(path)
				break
			case 'F2':
				rename(path)
				break
			case 'Delete':
				remove(path)
				break
			case 'Escape':
				setClipboard(null)
				break
			default:
				return
		}
		event.preventDefault()
		event.stopPropagation()
	}
	function menuItems(path: string) {
		const protectedEntry = !path || path === 'index.ts'
		const itemClass = cn(
			menuRow,
			'border-0 data-[disabled]:cursor-default data-[disabled]:opacity-40'
		)
		return (
			<>
				<Menu.Item
					className={itemClass}
					onClick={() => begin('file', path)}
				>
					<IconFilePlus size={16} stroke={1.5} />
					New file
				</Menu.Item>
				<Menu.Item
					className={itemClass}
					onClick={() => begin('folder', path)}
				>
					<IconFolderPlus size={16} stroke={1.5} />
					New folder
				</Menu.Item>
				<Menu.Separator className="my-1 h-px bg-border" />
				<Menu.Item
					className={itemClass}
					disabled={protectedEntry}
					onClick={() => rename(path)}
				>
					<IconPencil size={16} stroke={1.5} />
					Rename
				</Menu.Item>
				<Menu.Item
					className={itemClass}
					disabled={protectedEntry}
					onClick={() => copy(path, true)}
				>
					<IconCut size={16} stroke={1.5} />
					Cut
				</Menu.Item>
				<Menu.Item
					className={itemClass}
					disabled={!path}
					onClick={() => copy(path)}
				>
					<IconCopy size={16} stroke={1.5} />
					Copy
				</Menu.Item>
				<Menu.Item
					className={itemClass}
					disabled={!clipboard}
					onClick={() => paste(path)}
				>
					<IconClipboard size={16} stroke={1.5} />
					Paste
				</Menu.Item>
				<Menu.Separator className="my-1 h-px bg-border" />
				<Menu.Item
					className={cn(itemClass, 'text-danger-deep')}
					disabled={protectedEntry}
					onClick={() => remove(path)}
				>
					<IconTrash size={16} stroke={1.5} />
					Delete
				</Menu.Item>
			</>
		)
	}
	function nameInput(depth: number) {
		if (!editing) return null
		return (
			<div
				className="min-w-0 flex-1 py-1 pr-2"
				style={{ paddingLeft: editing.path ? 0 : 10 + depth * 16 }}
			>
				<div className="flex items-center gap-1.5">
					{editing.kind === 'folder' ? (
						<IconFolder
							size={16}
							stroke={1.5}
							className="shrink-0 text-ink-soft"
						/>
					) : (
						<IconFile
							size={16}
							stroke={1.5}
							className="shrink-0 text-ink-soft"
						/>
					)}
					<input
						ref={input}
						size={12}
						aria-label={
							editing.path
								? `Rename ${basename(editing.path)}`
								: `New ${editing.kind} name`
						}
						aria-invalid={!!editing.error}
						aria-describedby={editing.error ? errorId : undefined}
						value={editing.value}
						autoComplete="off"
						autoCapitalize="off"
						spellCheck={false}
						className="box-border w-full min-w-0 rounded-md border border-solid border-primary bg-base px-1.5 py-1 font-mono text-xs text-ink focus-ring"
						onChange={(event) =>
							setEditing({
								...editing,
								value: event.target.value,
								error: undefined
							})
						}
						onKeyDown={(event) => {
							event.stopPropagation()
							if (event.key === 'Enter') {
								event.preventDefault()
								save()
							}
							if (event.key === 'Escape') {
								setEditing(null)
								focus(editing.path ?? editing.parent)
							}
						}}
					/>
				</div>
				{editing.error && (
					<p
						id={errorId}
						role="alert"
						className="m-0 pt-1 text-xs text-danger-deep"
					>
						{editing.error}
					</p>
				)}
			</div>
		)
	}
	function renderChildren(parent: string, depth: number): React.ReactNode {
		return (
			<>
				{editing && !editing.path && editing.parent === parent && (
					<li role="none">{nameInput(depth)}</li>
				)}
				{children(parent).map((path) => {
					const folder = entryKind(state, path) === 'folder',
						isOpen = expanded.includes(path),
						FolderIcon = isOpen ? IconFolderOpen : IconFolder
					return (
						<li key={path} role="none">
							<div
								role="treeitem"
								aria-label={basename(path)}
								aria-level={depth + 1}
								aria-selected={selected === path}
								aria-expanded={folder ? isOpen : undefined}
								aria-owns={
									folder && isOpen
										? `${groupId}-${encodeURIComponent(path)}`
										: undefined
								}
								tabIndex={focusPath === path ? 0 : -1}
								data-path={path}
								title={
									path === 'index.ts'
										? 'index.ts — tutorial entry point'
										: path
								}
								className={cn(
									'ml-1 flex min-h-8 cursor-pointer select-none items-center gap-1 rounded-md pr-2 text-xs outline-none focus-ring hover:bg-surface-2',
									folder
										? 'font-sans font-semibold'
										: 'font-mono',
									selected === path
										? 'bg-primary-soft font-semibold text-primary-deep hover:bg-primary-soft'
										: folder
											? 'text-ink'
											: 'text-ink-soft',
									clipboard &&
										'cut' in clipboard &&
										(path === clipboard.cut ||
											path.startsWith(
												clipboard.cut + '/'
											)) &&
										'opacity-50',
									dropTarget === path &&
										'bg-primary-soft outline-solid outline-1 -outline-offset-1 outline-primary'
								)}
								style={{ paddingLeft: 6 + depth * 16 }}
								onFocus={(event) => {
									if (event.target === event.currentTarget)
										setSelected(path)
								}}
								onClick={() => {
									if (editing?.path !== path) open(path)
								}}
								onKeyDown={(event) => keyDown(event, path)}
								draggable={path !== 'index.ts' && !editing}
								onDragStart={(event) => {
									dragging.current = path
									event.dataTransfer.setData(dragType, path)
									event.dataTransfer.effectAllowed = 'move'
								}}
								onDragEnd={() => {
									dragging.current = null
									setDropTarget(null)
								}}
							>
								{editing?.path === path ? (
									nameInput(0)
								) : (
									<>
										{folder ? (
											<FolderIcon
												aria-hidden
												size={16}
												stroke={1.5}
												className="shrink-0"
											/>
										) : (
											<IconFile
												aria-hidden
												size={15}
												stroke={1.5}
												className="shrink-0"
											/>
										)}
										<span className="whitespace-nowrap">
											{basename(path)}
										</span>
										{path === 'index.ts' && (
											<span className="ml-auto font-sans text-[10px] font-normal text-ink-soft">
												entry
											</span>
										)}
									</>
								)}
							</div>
							{folder && isOpen && (
								<ul
									id={`${groupId}-${encodeURIComponent(path)}`}
									role="group"
									className="m-0 list-none p-0"
								>
									{renderChildren(path, depth + 1)}
								</ul>
							)}
						</li>
					)
				})}
			</>
		)
	}

	return (
		<div className="flex h-full min-h-0 flex-col text-ink">
			<header className="flex shrink-0 items-center gap-0.5 py-1.5 pl-3">
				<span className="min-w-0 flex-1 truncate text-xs font-semibold text-ink-soft">
					Files
				</span>
				<IconButton
					label="New file"
					size="sm"
					onClick={() => begin('file')}
				>
					<IconFilePlus size={16} stroke={1.5} />
				</IconButton>
				<IconButton
					label="New folder"
					size="sm"
					onClick={() => begin('folder')}
				>
					<IconFolderPlus size={16} stroke={1.5} />
				</IconButton>
			</header>
			<ContextMenu.Root onOpenChange={(open, details) => {
				if (open) setContextKeyboard(details.event.type === 'keydown')
			}}>
				<ContextMenu.Trigger
					className={cn(
						'min-h-12 flex-1 overflow-auto pb-8',
						dropTarget === '' &&
							'bg-primary-soft outline-solid outline-1 -outline-offset-1 outline-primary'
					)}
					onContextMenuCapture={(event) => {
						const row = (
							event.target as Element
						).closest<HTMLElement>('[data-path]')
						const path = row?.dataset.path ?? ''
						setContextPath(path)
						setSelected(path)
					}}
					onTouchStartCapture={(event) => {
						const row = (
							event.target as Element
						).closest<HTMLElement>('[data-path]')
						setContextPath(row?.dataset.path ?? '')
					}}
					onClick={(event) => {
						if (
							!(event.target as Element).closest(
								'[data-path], input'
							)
						)
							setSelected('')
					}}
					onDragOver={(event) => {
						if (
							!dragging.current ||
							!event.dataTransfer.types.includes(dragType)
						) {
							event.preventDefault()
							event.dataTransfer.dropEffect = 'none'
							return
						}
						event.preventDefault()
						event.dataTransfer.dropEffect = 'move'
						const row = (
							event.target as Element
						).closest<HTMLElement>('[data-path]')
						setDropTarget(targetFolder(row?.dataset.path ?? ''))
					}}
					onDragLeave={(event) => {
						if (
							!event.currentTarget.contains(
								event.relatedTarget as Node
							)
						)
							setDropTarget(null)
					}}
					onDrop={(event) => {
						event.preventDefault()
						const path = dragging.current
						if (
							!path ||
							!event.dataTransfer.types.includes(dragType)
						)
							return
						const row = (
							event.target as Element
						).closest<HTMLElement>('[data-path]')
						const folder = targetFolder(row?.dataset.path ?? '')
						if (
							run((current) => moveEntry(current, path, folder))
						) {
							const nextPath = [folder, basename(path)]
								.filter(Boolean)
								.join('/')
							remapExpanded(path, nextPath)
							invalidateCut(path)
							focus(nextPath)
						}
						dragging.current = null
						setDropTarget(null)
					}}
				>
					<div
						ref={tree}
						role="tree"
						aria-label="Tutorial files"
						className="min-w-full w-max"
					>
						<ul role="none" className="m-0 list-none p-0">
							{renderChildren('', 0)}
						</ul>
					</div>
				</ContextMenu.Trigger>
				<ContextMenu.Portal>
					<ContextMenu.Positioner sideOffset={4} className="z-50">
						<ContextMenu.Popup
							finalFocus={() => input.current ?? true}
							className={cn(
								menuPanel,
								'min-w-40',
								!contextKeyboard && 'data-[instant=click]:transition-[opacity,scale,translate] data-[instant=click]:[transition-timing-function:var(--ease-out),var(--ease-spring),var(--ease-spring)] motion-reduce:data-[instant=click]:transition-none'
							)}
						>
							<div className={cn(menuScroll, 'max-h-[calc(var(--available-height)_-_14px)]')}>
								<MenuIndicator />
								{menuItems(contextPath)}
							</div>
						</ContextMenu.Popup>
					</ContextMenu.Positioner>
				</ContextMenu.Portal>
			</ContextMenu.Root>
			<p
				role="status"
				aria-live="polite"
				className={cn(
					'm-0 shrink-0 px-3 text-xs text-danger-deep',
					message && 'py-2'
				)}
			>
				{message}
			</p>
		</div>
	)
}
