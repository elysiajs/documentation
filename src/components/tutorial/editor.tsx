import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react';
import type { VirtualFS } from './testcases';
import type { createEditor } from './playground-monaco';

interface Props {
	ref?: Ref<EditorHandle>;
	fs: VirtualFS;
	activeFile: string;
	onChange(value: string, file: string): void;
}

export type EditorHandle = { flush(): void };

export default function Editor(props: Props) {
	const element = useRef<HTMLDivElement>(null);
	const latest = useRef(props);
	latest.current = props;
	const controller = useRef<ReturnType<typeof createEditor> | null>(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(true);
	useImperativeHandle(props.ref, () => ({ flush: () => controller.current?.flush() }), []);

	useEffect(() => {
		let cancelled = false;
		void import('./playground-monaco').then(async (module) => {
			await module.prepare();
			if (cancelled || !element.current) return;
			controller.current = module.createEditor(element.current, latest.current.fs, latest.current.activeFile,
				(value, file) => latest.current.onChange(value, file));
			setLoading(false);
		}).catch((cause: unknown) => {
			if (!cancelled) setError(cause instanceof Error ? cause.message : String(cause));
		});
		return () => {
			cancelled = true;
			controller.current?.dispose();
			controller.current = null;
		};
	}, []);

	useEffect(() => {
		controller.current?.update(props.fs, props.activeFile);
	}, [props.fs, props.activeFile]);

	return (
		<div className="spica-surface relative h-full min-h-0 w-full">
			<div ref={element} className="h-full w-full" aria-label="Code editor" />
			{loading && !error && <p role="status" className="pointer-events-none absolute inset-0 m-0 p-4 text-sm text-ink-soft">Loading editor…</p>}
			{error && <p role="alert" className="absolute inset-0 m-0 bg-surface p-4 text-danger-deep">Unable to load editor: {error}</p>}
		</div>
	);
}
