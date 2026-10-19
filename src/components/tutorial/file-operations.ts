import type { VirtualFS } from './testcases';

export interface ExplorerState {
	fs: VirtualFS;
	folders: string[];
	tabs: { active: number; files: string[] };
}

export interface ClipboardEntry {
	kind: 'file' | 'folder';
	name: string;
	sourcePath: string;
	fs: Record<string, string>;
	folders: string[];
}

const contains = (parent: string, path: string) => path === parent || path.startsWith(`${parent}/`);
const basename = (path: string) => path.slice(path.lastIndexOf('/') + 1);
const dirname = (path: string) => path.slice(0, Math.max(0, path.lastIndexOf('/')));
const join = (parent: string, name: string) => parent && name ? `${parent}/${name}` : parent || name;

export function folderPaths(state: ExplorerState): string[] {
	const folders = new Set(state.folders.filter(Boolean));
	for (const path of [...Object.keys(state.fs), ...state.folders]) {
		let parent = dirname(path);
		while (parent) {
			folders.add(parent);
			parent = dirname(parent);
		}
	}
	return [...folders].sort();
}

export function entryKind(state: ExplorerState, path: string): 'file' | 'folder' | undefined {
	if (Object.hasOwn(state.fs, path)) return 'file';
	if (path === '' || folderPaths(state).includes(path)) return 'folder';
}

function validName(name: string) {
	if (!name.trim() || name === '.' || name === '..' || /[/\\\x00-\x1f\x7f]/.test(name))
		throw new Error('Enter a name without slashes or control characters.');
}

export function restoreFolders(fs: VirtualFS, value: unknown): string[] {
	const folders = Array.isArray(value) ? value.filter((path): path is string => {
		if (typeof path !== 'string' || !path) return false;
		try {
			path.split('/').forEach(validName);
		} catch {
			return false;
		}
		return !Object.keys(fs).some((file) => contains(file, path));
	}) : [];
	return folderPaths({ fs, folders, tabs: { active: 0, files: [] } });
}

function destination(state: ExplorerState, parent: string, name: string) {
	validName(name);
	if (entryKind(state, parent) !== 'folder') throw new Error('The destination folder no longer exists.');
	const path = join(parent, name);
	if (entryKind(state, path)) throw new Error(`“${name}” already exists in this folder.`);
	return path;
}

function editable(state: ExplorerState, path: string) {
	if (!path) throw new Error('The project root cannot be changed.');
	if (path === 'index.ts') throw new Error('The lesson entry file index.ts cannot be moved, renamed, or deleted.');
	if (!entryKind(state, path)) throw new Error('This file or folder no longer exists.');
}

function updatedTabs(state: ExplorerState, map: (path: string) => string | undefined) {
	const active = map(state.tabs.files[state.tabs.active] ?? '');
	const files = state.tabs.files.map(map).filter((path): path is string => path !== undefined);
	const index = active === undefined ? -1 : files.indexOf(active);
	return { files, active: index >= 0 ? index : Math.max(0, Math.min(state.tabs.active, files.length - 1)) };
}

export function createEntry(state: ExplorerState, parent: string, name: string, kind: 'file' | 'folder'): ExplorerState {
	const path = destination(state, parent, name);
	if (kind === 'folder') return { ...state, folders: [...folderPaths(state), path] };
	return {
		...state,
		fs: { ...state.fs, [path]: '' },
		tabs: { files: [...state.tabs.files, path], active: state.tabs.files.length }
	};
}

function relocate(state: ExplorerState, path: string, parent: string, name: string): ExplorerState {
	editable(state, path);
	validName(name);
	if (entryKind(state, path) === 'folder' && contains(path, parent))
		throw new Error('A folder cannot be moved inside itself.');
	if (join(parent, name) === path) return state;
	const target = destination(state, parent, name);
	const remap = (value: string) => contains(path, value) ? target + value.slice(path.length) : value;
	return {
		fs: Object.fromEntries(Object.entries(state.fs).map(([key, value]) => [remap(key), value])) as VirtualFS,
		folders: [...new Set(folderPaths(state).map(remap))],
		tabs: updatedTabs(state, remap)
	};
}

export function renameEntry(state: ExplorerState, path: string, name: string): ExplorerState {
	return relocate(state, path, dirname(path), name);
}

export function moveEntry(state: ExplorerState, path: string, targetFolder: string): ExplorerState {
	return relocate(state, path, targetFolder, basename(path));
}

export function deleteEntry(state: ExplorerState, path: string): ExplorerState {
	editable(state, path);
	return {
		fs: Object.fromEntries(Object.entries(state.fs).filter(([key]) => !contains(path, key))) as VirtualFS,
		folders: folderPaths(state).filter((folder) => !contains(path, folder)),
		tabs: updatedTabs(state, (file) => contains(path, file) ? undefined : file)
	};
}

export function copyEntry(state: ExplorerState, path: string): ClipboardEntry {
	const kind = entryKind(state, path);
	if (!path || !kind) throw new Error('Choose a file or folder to copy.');
	return {
		kind,
		name: basename(path),
		sourcePath: path,
		fs: Object.fromEntries(Object.entries(state.fs)
			.filter(([key]) => contains(path, key))
			.map(([key, value]) => [key === path ? '' : key.slice(path.length + 1), value])),
		folders: kind === 'folder' ? folderPaths(state)
			.filter((folder) => contains(path, folder))
			.map((folder) => folder === path ? '' : folder.slice(path.length + 1)) : []
	};
}

export function pasteEntry(state: ExplorerState, snapshot: ClipboardEntry, targetFolder: string): ExplorerState {
	if (snapshot.kind === 'folder' && contains(snapshot.sourcePath, targetFolder))
		throw new Error('A folder cannot be pasted inside itself.');
	validName(snapshot.name);
	let name = snapshot.name;
	const dot = snapshot.kind === 'file' ? name.lastIndexOf('.') : -1;
	const stem = dot > 0 ? name.slice(0, dot) : name;
	const extension = dot > 0 ? name.slice(dot) : '';
	let count = 1;
	while (entryKind(state, join(targetFolder, name))) {
		name = `${stem} copy${count > 1 ? ` ${count}` : ''}${extension}`;
		count++;
	}
	const target = destination(state, targetFolder, name);
	return {
		...state,
		fs: { ...state.fs, ...Object.fromEntries(Object.entries(snapshot.fs).map(([path, value]) => [join(target, path), value])) },
		folders: [...new Set([...folderPaths(state), ...snapshot.folders.map((path) => join(target, path))])]
	};
}

export function reorderOpenTab(state: ExplorerState, source: string, target: string, side: 'before' | 'after'): ExplorerState {
	if (source === target || !state.tabs.files.includes(source) || !state.tabs.files.includes(target)) return state;
	const files = state.tabs.files.filter((file) => file !== source);
	files.splice(files.indexOf(target) + (side === 'after' ? 1 : 0), 0, source);
	if (files.every((file, index) => file === state.tabs.files[index])) return state;
	return { ...state, tabs: { files, active: files.indexOf(state.tabs.files[state.tabs.active]) } };
}
