import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { IconFolder, IconX } from '@tabler/icons-react';
import { Group, Panel, Separator, usePanelRef } from 'react-resizable-panels';
import { cn } from '../../lib/cn';
import { Button } from '../ui/button';
import { IconButton } from '../ui/icon-button';
import { FileExplorer } from './file-explorer';
import { reorderOpenTab, type ExplorerState } from './file-operations';

const tabDragType = 'application/x-elysia-tutorial-tab';
const treeMinWidth = 150;

interface EditorLayoutProps extends ExplorerState {
	onFilesChange(update: (current: ExplorerState) => ExplorerState): void;
	onReset(): void;
	children: ReactNode;
}

export default function EditorLayout({ fs, folders, tabs, onFilesChange, onReset, children }: EditorLayoutProps) {
	const [showTree, setShowTree] = useState(false);
	const [confirmReset, setConfirmReset] = useState(false);
	const [resetGeneration, setResetGeneration] = useState(0);
	const treePanel = usePanelRef();
	const treeTransition = useRef(false);
	const treeTransitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
	const treeOpen = useRef(false);
	const draggedTab = useRef<string | null>(null);
	const [tabDrop, setTabDrop] = useState<{ file: string; side: 'before' | 'after' } | null>(null);
	const group = useRef<HTMLDivElement>(null);
	const treeId = useId();
	useEffect(() => {
		if (!confirmReset) return;
		const timer = setTimeout(() => setConfirmReset(false), 3000);
		return () => clearTimeout(timer);
	}, [confirmReset]);

	useEffect(() => () => {
		if (treeTransitionTimer.current) clearTimeout(treeTransitionTimer.current);
	}, []);

	function finishTreeTransition() {
		if (treeTransitionTimer.current) clearTimeout(treeTransitionTimer.current);
		treeTransitionTimer.current = null;
		treeTransition.current = false;
		group.current?.removeAttribute('data-toggle-animation');
	}

	function toggleTree(pointer: boolean) {
		const open = !treeOpen.current;
		treeOpen.current = open;
		setShowTree(open);
		// Resize both panes together: content-only transforms make the editor jump ahead.
		// This short layout transition is intentional; manual resizing stays immediate.
		if (pointer && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
			treeTransition.current = true;
			group.current?.setAttribute('data-toggle-animation', '');
			if (treeTransitionTimer.current) clearTimeout(treeTransitionTimer.current);
			// A rapid toggle can leave the layout unchanged, without a transitionend.
			treeTransitionTimer.current = setTimeout(finishTreeTransition, 210);
		} else finishTreeTransition();
		open
			? treePanel.current?.resize(treeMinWidth + (group.current?.clientWidth ?? 0) * 0.025)
			: treePanel.current?.collapse();
	}

	function beginTreeResize() {
		finishTreeTransition();
		treeOpen.current = (treePanel.current?.getSize().asPercentage ?? 0) > 0;
		setShowTree(treeOpen.current);
	}

	return (
		<div className="spica-surface flex h-full min-h-0 flex-col bg-base text-ink">
			<header className="flex shrink-0 items-center gap-1 border-0 bg-base p-1">
				<IconButton label="Toggle file explorer" size="sm" variant='ghost' active={showTree} aria-expanded={showTree} aria-controls={treeId} onClick={(event) => toggleTree(event.detail > 0)}><IconFolder size={18} stroke={1.5} /></IconButton>
				<nav aria-label="Open files" className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto" onDragLeave={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setTabDrop(null); }}>
					{tabs.files.map((file, index) => (
						<div key={file}
							className={cn('relative flex shrink-0 select-none items-center rounded-lg bg-transparent hover:bg-surface-2 focus-within:bg-surface-2', index === tabs.active && 'bg-primary-soft text-primary-deep hover:bg-primary-soft focus-within:bg-primary-soft')}
							draggable
							onDragStart={(event) => { draggedTab.current = file; event.dataTransfer.setData(tabDragType, file); event.dataTransfer.effectAllowed = 'move'; }}
							onDragEnd={() => { draggedTab.current = null; setTabDrop(null); }}
							onDragOver={(event) => {
								if (!draggedTab.current || !event.dataTransfer.types.includes(tabDragType)) return;
								event.preventDefault(); event.dataTransfer.dropEffect = 'move';
								const bounds = event.currentTarget.getBoundingClientRect();
								setTabDrop(draggedTab.current === file ? null : { file, side: event.clientX < bounds.left + bounds.width / 2 ? 'before' : 'after' });
							}}
							onDrop={(event) => {
								const source = draggedTab.current;
								if (!source || !event.dataTransfer.types.includes(tabDragType)) return;
								event.preventDefault();
								const bounds = event.currentTarget.getBoundingClientRect();
								const side = event.clientX < bounds.left + bounds.width / 2 ? 'before' : 'after';
								draggedTab.current = null; setTabDrop(null);
								onFilesChange((current) => reorderOpenTab(current, source, file, side));
							}}
						>
							{tabDrop?.file === file && <span aria-hidden className={cn('pointer-events-none absolute inset-y-1 w-0.5 rounded-full bg-primary', tabDrop.side === 'before' ? 'left-0' : 'right-0')} />}
							<button type="button" title={`${file} — Alt+←/→ to reorder`} aria-keyshortcuts="Alt+ArrowLeft Alt+ArrowRight" onKeyDown={(event) => {
								if (!event.altKey || event.ctrlKey || event.metaKey || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
								event.preventDefault();
								onFilesChange((current) => {
									const index = current.tabs.files.indexOf(file);
									const target = current.tabs.files[index + (event.key === 'ArrowLeft' ? -1 : 1)];
									return target ? reorderOpenTab(current, file, target, event.key === 'ArrowLeft' ? 'before' : 'after') : current;
								});
							}} aria-current={index === tabs.active ? 'page' : undefined} onClick={() => onFilesChange((current) => ({ ...current, tabs: { ...current.tabs, active: current.tabs.files.indexOf(file) } }))} className="cursor-pointer rounded-lg border-0 bg-transparent px-2 py-1 font-mono text-xs text-inherit focus-ring">{file.split('/').at(-1)}</button>
							<IconButton label={`Close ${file}`} size="sm" onClick={() => onFilesChange((current) => {
								const activeFile = current.tabs.files[current.tabs.active];
								const files = current.tabs.files.filter((entry) => entry !== file);
								return { ...current, tabs: { files, active: files.includes(activeFile) ? files.indexOf(activeFile) : Math.min(current.tabs.active, files.length - 1) } };
							})}><IconX size={16} stroke={1.5} /></IconButton>
						</div>
					))}
				</nav>
				<Button variant="ghost" size="sm" className={cn(confirmReset && 'bg-danger-soft text-danger-deep hover:bg-danger-soft')} onClick={() => { if (confirmReset) { setConfirmReset(false); setResetGeneration((value) => value + 1); onReset(); } else setConfirmReset(true); }}>{confirmReset ? 'Confirm reset' : 'Reset'}</Button>
			</header>
			<Group elementRef={group} orientation="horizontal"
				onTransitionEnd={(event) => {
					if (event.propertyName === 'flex-grow' && (event.target as HTMLElement).parentElement === group.current)
						finishTreeTransition();
				}}
				className="min-h-0 flex-1 [&[data-toggle-animation]>[data-panel]]:transition-[flex-grow] [&[data-toggle-animation]>[data-panel]]:duration-[160ms] [&[data-toggle-animation]>[data-panel]]:ease-out motion-reduce:[&[data-toggle-animation]>[data-panel]]:transition-none">
				<Panel panelRef={treePanel} defaultSize="0%" minSize={`${treeMinWidth}px`} maxSize="65%" collapsible onResize={(size) => {
					if (treeTransition.current) return;
					treeOpen.current = size.asPercentage > 0;
					setShowTree(treeOpen.current);
				}} className="h-full min-h-0 bg-base">
					<div id={treeId} inert={!showTree} aria-hidden={!showTree} className="h-full"><FileExplorer key={resetGeneration} fs={fs} folders={folders} tabs={tabs} onFilesChange={onFilesChange} /></div>
				</Panel>
				<Separator onPointerDownCapture={beginTreeResize} onKeyDownCapture={beginTreeResize} className="relative w-px shrink-0 cursor-col-resize bg-transparent focus:[outline:var(--focus-outline)] focus:[outline-offset:var(--focus-offset)] hover:bg-primary focus:bg-primary active:bg-primary" aria-label="Resize file explorer and editor" />
				<Panel defaultSize="100%" minSize="25%" className="h-full min-h-0 bg-base">{children}</Panel>
			</Group>
		</div>
	);
}
