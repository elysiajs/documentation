import * as monaco from 'monaco-editor';
import { dependencies } from '../../../package.json';
// Monaco 0.56 exports these paths to esm/vs/editor and esm/vs/language/typescript.
import EditorWorker from 'monaco-editor/editor/editor.worker?worker';
import TypeScriptWorker from 'monaco-editor/language/typescript/ts.worker?worker';
import { AutoTypings, LocalStorageCache, UnpkgSourceResolver } from 'monaco-editor-auto-typings';
import { shikiToMonaco } from '@shikijs/monaco';
import { createHighlighter } from 'shiki';
import { spicaLight, spicaDark } from '../../spica/code-themes.mjs';
import type { VirtualFS } from './testcases';

self.MonacoEnvironment = {
	getWorker(_workerId, label) {
		return label === 'typescript' || label === 'javascript' ? new TypeScriptWorker() : new EditorWorker();
	},
};

class Resolver extends UnpkgSourceResolver {
	override async resolveSourceFile(packageName: string, version: string | undefined, path: string): Promise<string | undefined> {
		const cached = monaco.editor.getModel(monaco.Uri.parse(`file:///node_modules/${packageName}/${path}`))?.getValue();
		if (cached) return cached;
		if (packageName === 'bun') return super.resolveSourceFile('@types/bun', version, 'index.d.ts');
		if (packageName === 'elysia') {
			switch (path) {
				case '..d.ts':
				case 'dist.d.ts': path = 'dist/index.d.ts'; break;
				case 'adapter.d.ts':
				case 'dist/adapter.d.ts': path = 'dist/adapter/index.d.ts'; break;
				case 'type.d.ts': path = 'dist/type/exports.d.ts'; break;
				case 'package.json': break;
				default: if (!path.startsWith('dist/')) path = `dist/${path}`;
			}
		}
		if (packageName === 'fs') return super.resolveSourceFile('@types/node', '24.5.2', 'files/fs.d.ts');
		if (packageName === 'zod' && ['..d.ts', 'dist.d.ts', 'index.d.cts.d.ts'].includes(path)) path = 'index.d.ts';
		return super.resolveSourceFile(packageName, version, path);
	}
}

let ready: Promise<void> | undefined;
export function prepare() {
	return ready ??= (async () => {
		const highlighter = await createHighlighter({
			langs: ['typescript', 'json'],
			themes: [spicaLight, spicaDark].map((theme) => {
				const dark = theme.type === 'dark';
				return { ...theme, colors: {
					...theme.colors,
					'editor.background': '#00000000',
					'editorGutter.background': '#00000000',
					'editor.lineHighlightBackground': dark ? '#141A3680' : '#F5F0F580',
					'editorLineNumber.foreground': dark ? '#A7AEDC' : '#9C96A6',
					'editorLineNumber.activeForeground': dark ? '#EDEAFB' : '#585563',
					'editor.selectionBackground': dark ? '#7E5BA866' : '#C9D2F280',
					'editor.inactiveSelectionBackground': dark ? '#7E5BA833' : '#C9D2F240',
					'scrollbarSlider.background': dark ? '#A7AEDC33' : '#9C96A633',
					'scrollbarSlider.hoverBackground': dark ? '#A7AEDC66' : '#9C96A666',
					'scrollbarSlider.activeBackground': dark ? '#A7AEDC99' : '#9C96A699',
					'scrollbar.shadow': '#00000000',
					'editorWidget.background': dark ? '#141A36' : '#FAF9FA',
					'editorWidget.border': dark ? '#585563' : '#E6DBE2',
					'editorSuggestWidget.background': dark ? '#141A36' : '#FAF9FA',
					'editorSuggestWidget.border': dark ? '#585563' : '#E6DBE2',
					'editorSuggestWidget.selectedBackground': dark ? '#7E5BA866' : '#E4E8FA',
				} };
			}),
		});
		shikiToMonaco(highlighter, monaco);
		monaco.typescript.typescriptDefaults.setCompilerOptions({
			strict: true,
			target: monaco.typescript.ScriptTarget.ESNext,
			module: monaco.typescript.ModuleKind.ESNext,
			moduleResolution: monaco.typescript.ModuleResolutionKind.NodeJs,
			noEmit: true,
			allowSyntheticDefaultImports: true,
			rootDir: 'file:///',
		});
	})();
}

export function createEditor(element: HTMLElement, initialFS: VirtualFS, initialFile: string, onChange: (value: string, file: string) => void) {
	let fs = initialFS;
	let active = initialFile;
	let disposed = false;
	let syncing = false;
	let pending: { file: string; value: string } | undefined;
	let changeTimer: ReturnType<typeof setTimeout> | undefined;
	const models = new Map<string, monaco.editor.ITextModel>();
	const getModel = (file: string) => {
		let model = models.get(file);
		if (!model) {
			model = monaco.editor.createModel(fs[file] ?? '', file.endsWith('.json') ? 'json' : 'typescript', monaco.Uri.parse(`file:///${file}`));
			models.set(file, model);
		}
		return model;
	};
	for (const file of Object.keys(fs)) getModel(file);
	const editor = monaco.editor.create(element, {
		model: getModel(active),
		fontSize: window.innerWidth < 568 ? 14 : 16,
		minimap: { enabled: false },
		wordWrap: 'off',
		renderWhitespace: 'none',
		automaticLayout: true,
		fontFamily: 'var(--font-mono)',
		fontLigatures: true,
		lineNumbersMinChars: 4,
		stickyScroll: { enabled: false },
		cursorSmoothCaretAnimation: 'on',
		cursorBlinking: 'blink',
	});
	const flush = () => {
		clearTimeout(changeTimer);
		if (!pending) return;
		const change = pending;
		pending = undefined;
		onChange(change.value, change.file);
	};
	const contentListener = editor.onDidChangeModelContent(() => {
		if (syncing) return;
		pending = { file: active, value: editor.getValue() };
		clearTimeout(changeTimer);
		changeTimer = setTimeout(flush, 280);
	});
	const blurListener = editor.onDidBlurEditorWidget(flush);
	window.addEventListener('beforeunload', flush, true);
	const updateTheme = () => monaco.editor.setTheme(document.documentElement.dataset.theme === 'dark' ? 'spica-dark' : 'spica-light');
	updateTheme();
	const observer = new MutationObserver(updateTheme);
	observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
	let typings: Awaited<ReturnType<typeof AutoTypings.create>> | undefined;
	let resolveTimer: ReturnType<typeof setTimeout> | undefined;
	let resolvedPackage = false;
	void AutoTypings.create(editor, {
		monaco,
		// AutoTypings otherwise uses the removed monaco.languages.typescript API.
		dontAdaptEditorOptions: true,
		dontRefreshModelValueAfterResolvement: true,
		sourceCache: new LocalStorageCache(),
		sourceResolver: new Resolver(),
		fileRootPath: 'file:///',
		versions: { elysia: dependencies.elysia, typebox: '1.3.30', '@elysia/eden': '2.0.0-beta.6', '@elysia/openapi': '2.0.0-beta.4' },
		preloadPackages: true,
		onUpdate() {
			if (disposed || resolvedPackage) return;
			clearTimeout(resolveTimer);
			resolveTimer = setTimeout(() => {
				resolvedPackage = true;
				const model = editor.getModel();
				if (!model) return;
				syncing = true;
				try { model.setValue(model.getValue()); }
				finally { syncing = false; }
			}, 2000);
		},
	}).then((instance) => {
		if (disposed) instance.dispose();
		else typings = instance;
	}).catch((error: unknown) => console.error('Unable to load editor typings', error));

	return {
		flush,
		update(nextFS: VirtualFS, nextFile: string) {
			if (active !== nextFile) flush();
			const previousFS = fs;
			fs = nextFS;
			syncing = true;
			try {
				if (active !== nextFile) {
					active = nextFile;
					editor.setModel(getModel(active));
				}
				for (const [file, model] of models) {
					if (!(file in fs)) { model.dispose(); models.delete(file); }
					else if (fs[file] !== previousFS[file] && pending?.file !== file && model.getValue() !== fs[file]) model.setValue(fs[file]);
				}
				for (const file of Object.keys(fs)) if (!(file in previousFS)) getModel(file);
			} finally { syncing = false; }
		},
		dispose() {
			disposed = true;
			flush();
			clearTimeout(resolveTimer);
			window.removeEventListener('beforeunload', flush, true);
			contentListener.dispose();
			blurListener.dispose();
			observer.disconnect();
			typings?.dispose();
			editor.dispose();
			for (const model of models.values()) model.dispose();
			models.clear();
		},
	};
}
