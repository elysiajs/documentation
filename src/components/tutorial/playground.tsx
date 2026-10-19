import { useCallback, useEffect, useRef, useState } from 'react'
import { Group, Panel, Separator } from 'react-resizable-panels'
import Editor, { type EditorHandle } from './editor'
import EditorLayout from './editor-layout'
import { restoreFolders, type ExplorerState } from './file-operations'
import Result, {
	type Input,
	type Response,
	type ResultState,
	type ResultTab
} from './result'
import { load, save } from './storage'
import { tutorialStore } from './store'
import {
	buildUserRequest,
	runTestcases,
	type Testcases,
	type TutorialRoute,
	type VirtualFS
} from './testcases'

type LessonData = { code: string; testcases: Testcases }

const modules = import.meta.glob<LessonData>('/src/pages/tutorial/**/_data.ts')
const emptyResponse: Response = { body: null, status: null, headers: {} }

export default function Playground({ lesson }: { lesson: string }) {
	const [data, setData] = useState<LessonData | null>(null)
	const [loadError, setLoadError] = useState<string | null>(null)
	const [storageError, setStorageError] = useState<string | null>(null)
	const [files, setFiles] = useState<ExplorerState>({
		fs: { 'index.ts': '' },
		folders: [],
		tabs: { active: 0, files: ['index.ts'] }
	})
	const editor = useRef<EditorHandle>(null)
	const [input, setInput] = useState<Input>({
		path: '/',
		method: 'GET',
		body: '',
		headers: [],
		cookie: []
	})
	const [response, setResponse] = useState<Response>(emptyResponse)
	const [routes, setRoutes] = useState<TutorialRoute[]>([])
	const [result, setResult] = useState<ResultState>({
		console: [],
		error: null,
		isHTML: false
	})
	const [resultTab, setResultTab] = useState<ResultTab>('preview')
	const latest = useRef({ files, input, data })
	latest.current = { files, input, data }
	const mounted = useRef(false)
	const resetting = useRef(false)
	const runId = useRef('')
	const runController = useRef<AbortController | null>(null)
	const needsTests = useRef(true)
	const clearTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined
	)

	const persist = useCallback(() => {
		const current = latest.current
		if (!current.data) return false
		try {
			save({
				fs: current.files.fs,
				folders: current.files.folders,
				...current.input,
				cookies: current.input.cookie
			})
			return true
		} catch {
			if (mounted.current)
				setStorageError("Couldn't save your progress in this browser.")
			return false
		}
	}, [])

	useEffect(() => {
		mounted.current = true
		let cancelled = false
		setData(null)
		setLoadError(null)
		setRoutes([])
		const key =
			lesson === 'index'
				? '/src/pages/tutorial/_data.ts'
				: `/src/pages/tutorial/${lesson}/_data.ts`
		const module = modules[key]
		if (!module)
			setLoadError(
				"This lesson's code is missing — refresh, or tell us on GitHub."
			)
		else
			void module()
				.then((loaded) => {
					if (cancelled) return
					let fs: VirtualFS = { 'index.ts': loaded.code }
					let folders: string[] = []
					let savedInput: Input = {
						path: '/',
						method: 'GET',
						body: '',
						headers: [],
						cookie: []
					}
					try {
						const savedFS = load('fs')
						if (
							savedFS &&
							typeof savedFS === 'object' &&
							!Array.isArray(savedFS) &&
							typeof savedFS['index.ts'] === 'string' &&
							Object.values(savedFS).every(
								(value) => typeof value === 'string'
							)
						)
							fs = savedFS
						folders = restoreFolders(fs, load('folders'))
						savedInput = {
							path: load('path') ?? '/',
							method: load('method') ?? 'GET',
							body: load('body') ?? '',
							headers: load('headers') ?? [],
							cookie: load('cookies') ?? []
						}
					} catch {
						setStorageError("Couldn't load your saved progress.")
					}
					needsTests.current = true
					setFiles({
						fs,
						folders,
						tabs: { active: 0, files: ['index.ts'] }
					})
					setInput(savedInput)
					setData(loaded)
					tutorialStore.set({
						testcasesResult: loaded.testcases.map(() => false)
					})
				})
				.catch((error: unknown) => {
					if (!cancelled)
						setLoadError(
							`Could not load lesson data: ${String(error)}`
						)
				})
		window.addEventListener('beforeunload', persist)
		return () => {
			cancelled = true
			mounted.current = false
			runId.current = ''
			runController.current?.abort()
			clearTimeout(clearTimer.current)
			persist()
			window.removeEventListener('beforeunload', persist)
		}
	}, [lesson, persist])

	useEffect(() => {
		if (!data) return
		const frame = requestAnimationFrame(persist)
		return () => cancelAnimationFrame(frame)
	}, [files.fs, files.folders, input, data, persist])

	const run = useCallback(async () => {
		const {
			files: { fs },
			input: requestInput,
			data: lessonData
		} = latest.current
		if (!mounted.current || !lessonData) return
		runController.current?.abort()
		const controller = new AbortController()
		runController.current = controller
		const id = Math.random().toString(36).slice(2)
		runId.current = id
		const isCancelled = () =>
			!mounted.current ||
			runId.current !== id ||
			latest.current.files.fs !== fs
		// Request changes can supersede a test run; keep testing pending until a current run finishes.
		const test = needsTests.current
		let logged = false
		setResult((value) => ({ ...value, error: null }))
		clearTimeout(clearTimer.current)
		clearTimer.current = setTimeout(() => {
			if (isCancelled()) return
			setResponse(emptyResponse)
			if (!logged) setResult((value) => ({ ...value, console: [] }))
			if (test)
				tutorialStore.set({
					testcasesResult: lessonData.testcases.map(() => false)
				})
		}, 300)
		try {
			const { execute } = await import('./runner')
			if (isCancelled()) return
			const request = buildUserRequest(requestInput)
			const [body, { status, headers, routes: registeredRoutes }] = await execute(
				fs,
				request.url,
				{ ...request.init, signal: controller.signal },
				(values) => {
					if (isCancelled()) return
					const entries = values.map((value) => {
						let text: string
						try {
							text =
								typeof value === 'object'
									? (JSON.stringify(value, null, 2) ??
										String(value))
									: String(value)
						} catch {
							text = String(value)
						}
						return { data: text, time: Date.now() }
					})
					const first = !logged
					logged = true
					setResult((value) => ({
						...value,
						console: [...(first ? [] : value.console), ...entries]
					}))
				}
			)
			if (isCancelled()) return
			clearTimeout(clearTimer.current)
			setResponse({ body, status, headers })
			setRoutes(registeredRoutes ?? [])
			setResult((value) => ({
				...value,
				isHTML: /<[^>]+>/.test(body),
				console: logged ? value.console : []
			}))
			if (test) {
				const testcasesResult = await runTestcases(
					(files, url, init) =>
						execute(files, url, {
							...init,
							signal: controller.signal
						}),
					fs,
					lessonData.testcases,
					isCancelled
				)
				if (isCancelled()) return
				needsTests.current = false
				tutorialStore.set({ testcasesResult })
			}
		} catch (error) {
			if (isCancelled()) return
			clearTimeout(clearTimer.current)
			const failure = error as {
				name?: string
				syntax?: Error
				stack?: string
				message?: string
			} | null
			if (failure?.name === 'AbortError') return
			setRoutes([])
			setResult((value) => ({
				...value,
				error:
					failure?.syntax?.stack ??
					failure?.stack ??
					failure?.message ??
					String(error)
			}))
			if (test)
				tutorialStore.set({
					testcasesResult: lessonData.testcases.map(() => false)
				})
		}
	}, [])

	useEffect(() => {
		needsTests.current = true
		setRoutes([])
		const timer = setTimeout(() => {
			void run()
		}, 8)
		return () => clearTimeout(timer)
	}, [files.fs, data, run])
	useEffect(() => {
		void run()
	}, [input.method, run])
	useEffect(() => {
		const timer = setTimeout(() => {
			void run()
		}, 300)
		return () => clearTimeout(timer)
	}, [input.path, run])
	useEffect(() => {
		const timer = setTimeout(() => {
			void run()
		}, 500)
		return () => clearTimeout(timer)
	}, [input.body, run])
	useEffect(() => {
		const timer = setTimeout(() => {
			void run()
		}, 8)
		return () => clearTimeout(timer)
	}, [input.headers, input.cookie, run])

	const reset = () => {
		if (!data) return
		const resetFiles = {
			fs: { 'index.ts': data.code },
			folders: [],
			tabs: { active: 0, files: ['index.ts'] }
		}
		const previous = latest.current
		resetting.current = true
		latest.current = { ...latest.current, files: resetFiles }
		if (persist()) {
			setFiles(resetFiles)
			window.location.reload()
		} else {
			latest.current = previous
			resetting.current = false
		}
	}
	const activeFile = files.tabs.files[files.tabs.active]

	return (
		<div className="spica-surface flex h-full min-h-0 w-full flex-col text-ink">
			{storageError && (
				<p
					role="status"
					className="m-0 px-4 py-2 text-sm text-ink-soft"
				>
					{storageError}
				</p>
			)}
			{loadError ? (
				<p role="alert" className="m-0 p-4 text-sm">
					{loadError}
				</p>
			) : !data ? (
				<div role="status" className="p-4 text-sm text-ink-soft">
					One sec, warming things up…
				</div>
			) : (
				<Group orientation="vertical" className="h-full min-h-0 flex-1">
					<Panel
						defaultSize="60%"
						minSize="10%"
						collapsible
						className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-base border border-border-strong"
					>
						<EditorLayout
							fs={files.fs}
							folders={files.folders}
							tabs={files.tabs}
							onFilesChange={(update) => {
								// Commit debounced typing before an operation reads, renames, or removes its file.
								editor.current?.flush()
								const current = latest.current.files
								const next = update(current)
								if (next === current) return
								latest.current = {
									...latest.current,
									files: next
								}
								setFiles(next)
							}}
							onReset={reset}
						>
							{activeFile ? (
								<Editor
									ref={editor}
									fs={files.fs}
									activeFile={activeFile}
									onChange={(value, file) => {
										if (resetting.current) return
										const current = latest.current.files
										if (
											!Object.hasOwn(current.fs, file) ||
											current.fs[file] === value
										)
											return
										const next = {
											...current,
											fs: { ...current.fs, [file]: value }
										}
										latest.current = {
											...latest.current,
											files: next
										}
										setFiles(next)
									}}
								/>
							) : (
								<div className="p-4 text-sm text-ink-soft">
									Select a file to edit
								</div>
							)}
						</EditorLayout>
					</Panel>
					<Separator
						className="relative h-2 shrink-0 cursor-row-resize rounded-full focus-ring before:absolute before:inset-x-3 before:top-1/2 before:h-px before:-translate-y-1/2 before:rounded-full before:transition-[height,background-color] before:duration-(--dur-fast) before:ease-out hover:before:h-0.5 hover:before:bg-primary focus-visible:before:h-0.5 focus-visible:before:bg-primary active:before:h-0.5 active:before:bg-primary motion-reduce:before:transition-none"
						aria-label="Resize editor and result"
					/>
					<Panel minSize="10%" className="flex min-h-0 flex-col">
						<Result
							input={input}
							routes={routes}
							onInputChange={(patch) =>
								setInput((value) => ({ ...value, ...patch }))
							}
							response={response}
							result={result}
							resultTab={resultTab}
							onResultTabChange={setResultTab}
						/>
					</Panel>
				</Group>
			)}
		</div>
	)
}
