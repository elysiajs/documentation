import { expect, test } from 'bun:test';
import {
	copyEntry, createEntry, deleteEntry, entryKind, folderPaths, moveEntry,
	pasteEntry, renameEntry, reorderOpenTab, restoreFolders, type ExplorerState
} from './file-operations';

const project = (): ExplorerState => ({
	fs: { 'index.ts': 'lesson', 'routes/user.ts': 'unsaved user content', 'notes.ts': 'notes' },
	folders: ['routes/empty', 'archive'],
	tabs: { active: 1, files: ['index.ts', 'routes/user.ts', 'notes.ts'] }
});

test('folders include hierarchy and empty directories; file creation opens its tab', () => {
	const state = project();
	expect(folderPaths(state)).toEqual(['archive', 'routes', 'routes/empty']);
	expect(entryKind(state, '')).toBe('folder');
	const folder = createEntry(state, 'routes/empty', 'nested', 'folder');
	const file = createEntry(folder, 'routes/empty/nested', 'new.ts', 'file');
	expect(file.fs['routes/empty/nested/new.ts']).toBe('');
	expect(file.tabs.files[file.tabs.active]).toBe('routes/empty/nested/new.ts');
	expect(state).toEqual(project());
});

test('folder rename and move preserve contents, empty descendants, and active tabs', () => {
	const original = project();
	const renamed = renameEntry(original, 'routes', 'api');
	expect(renamed.fs['api/user.ts']).toBe('unsaved user content');
	expect(renamed.folders).toContain('api/empty');
	expect(renamed.tabs.files[renamed.tabs.active]).toBe('api/user.ts');
	const moved = moveEntry(renamed, 'api', 'archive');
	expect(moved.fs['archive/api/user.ts']).toBe('unsaved user content');
	expect(moved.folders).toContain('archive/api/empty');
	expect(moved.tabs.files[moved.tabs.active]).toBe('archive/api/user.ts');
	expect(original).toEqual(project());
});

test('deleting folders closes descendant tabs and preserves active surviving files', () => {
	const state = project();
	state.tabs.active = 2;
	const removed = deleteEntry(state, 'routes');
	expect(removed.fs).toEqual({ 'index.ts': 'lesson', 'notes.ts': 'notes' });
	expect(removed.folders).toEqual(['archive']);
	expect(removed.tabs).toEqual({ active: 1, files: ['index.ts', 'notes.ts'] });
	const activeRemoved = deleteEntry(project(), 'routes');
	expect(activeRemoved.tabs.files[activeRemoved.tabs.active]).toBe('notes.ts');
});

test('clipboard is a content snapshot and repeated paste never overwrites files', () => {
	const state = project();
	const snapshot = copyEntry(state, 'notes.ts');
	state.fs['notes.ts'] = 'changed after copy';
	const pasted = pasteEntry(state, snapshot, '');
	const twice = pasteEntry(pasted, snapshot, '');
	expect(twice.fs['notes.ts']).toBe('changed after copy');
	expect(twice.fs['notes copy.ts']).toBe('notes');
	expect(twice.fs['notes copy 2.ts']).toBe('notes');
	expect(twice.tabs).toEqual(state.tabs);
	expect(pasteEntry(state, copyEntry(state, 'index.ts'), '').fs['index copy.ts']).toBe('lesson');
});

test('folder paste preserves hierarchy and empty directories without changing the source', () => {
	const state = project();
	const snapshot = copyEntry(state, 'routes');
	const copied = pasteEntry(state, snapshot, 'archive');
	expect(copied.fs['archive/routes/user.ts']).toBe('unsaved user content');
	expect(copied.folders).toContain('archive/routes/empty');
	expect(pasteEntry(state, copyEntry(state, 'routes/empty'), 'archive').folders).toContain('archive/empty');
	expect(state).toEqual(project());
});

test('invalid names, collisions, cycles, and protected entry changes fail atomically', () => {
	const state = project();
	for (const name of ['', ' ', '.', '..', 'a/b', 'a\\b', 'a\n']) {
		expect(() => createEntry(state, '', name, 'file')).toThrow();
	}
	for (const action of [
		() => createEntry(state, '', 'routes', 'file'),
		() => createEntry(state, '', 'notes.ts', 'folder'),
		() => createEntry(state, 'notes.ts', 'nested', 'file'),
		() => createEntry(state, 'missing', 'nested', 'file'),
		() => renameEntry(state, 'notes.ts', 'index.ts'),
		() => renameEntry(state, 'routes', 'notes.ts'),
		() => moveEntry(state, 'routes', 'routes/empty'),
		() => pasteEntry(state, copyEntry(state, 'routes'), 'routes/empty'),
		() => deleteEntry(state, ''),
		() => deleteEntry(state, 'index.ts'),
		() => renameEntry(state, 'index.ts', 'main.ts'),
		() => moveEntry(state, 'index.ts', 'archive')
	]) expect(action).toThrow();
	expect(state).toEqual(project());
});

test('own-property filenames work without touching object prototypes', () => {
	let state = createEntry(project(), '', '__proto__', 'file');
	state = renameEntry(state, '__proto__', 'constructor');
	expect(entryKind(state, 'constructor')).toBe('file');
	expect(entryKind(state, '__proto__')).toBeUndefined();
	state = pasteEntry(state, copyEntry(state, 'constructor'), 'archive');
	expect(Object.hasOwn(state.fs, 'archive/constructor')).toBe(true);
});

test('persisted folders reject malformed paths and files used as folders', () => {
	const { fs } = project();
	expect(restoreFolders(fs, ['empty/nested', '', 42, '../escape', 'a//b', 'a\\b', 'notes.ts', 'notes.ts/child', 'a\n', 'routes/user.ts/child']))
		.toEqual(['empty', 'empty/nested', 'routes']);
	expect(restoreFolders(fs, null)).toEqual(['routes']);
});

test('move collisions keep both source and destination trees intact', () => {
	const state = createEntry(project(), 'archive', 'routes', 'folder');
	expect(() => moveEntry(state, 'routes', 'archive')).toThrow('already exists');
	expect(state.fs['routes/user.ts']).toBe('unsaved user content');
	expect(state.folders).toContain('archive/routes');
	expect(state.tabs.files[state.tabs.active]).toBe('routes/user.ts');
	const emptyMoved = moveEntry(state, 'routes/empty', 'archive');
	expect(emptyMoved.folders).toContain('archive/empty');
	expect(emptyMoved.folders).not.toContain('routes/empty');
	expect(renameEntry(state, 'notes.ts', 'notes.ts')).toBe(state);
});

test('tab reordering preserves the active document and its unsaved contents in both directions', () => {
	const state = project();
	const before = reorderOpenTab(state, 'notes.ts', 'index.ts', 'before');
	expect(before.tabs).toEqual({ files: ['notes.ts', 'index.ts', 'routes/user.ts'], active: 2 });
	const after = reorderOpenTab(state, 'index.ts', 'notes.ts', 'after');
	expect(after.tabs).toEqual({ files: ['routes/user.ts', 'notes.ts', 'index.ts'], active: 0 });
	const activeMoved = reorderOpenTab(state, 'routes/user.ts', 'notes.ts', 'after');
	expect(activeMoved.tabs.files[activeMoved.tabs.active]).toBe('routes/user.ts');
	for (const next of [before, after, activeMoved]) {
		expect(next.fs).toBe(state.fs);
		expect(next.folders).toBe(state.folders);
		expect(next.fs['routes/user.ts']).toBe('unsaved user content');
	}
	for (const [source, target, side] of [
		['index.ts', 'routes/user.ts', 'before'],
		['notes.ts', 'routes/user.ts', 'after'],
		['index.ts', 'index.ts', 'after'],
		['missing.ts', 'index.ts', 'before'],
		['index.ts', 'missing.ts', 'after']
	] as const) expect(reorderOpenTab(state, source, target, side)).toBe(state);
	expect(state).toEqual(project());
});
