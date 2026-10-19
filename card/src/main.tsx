import { StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { barWidths } from './bars';
import { BenchmarkCard } from './card';
import { CodeBlock } from './code';
import { download } from './export';
import { type Lang, backgrounds, defaults, languages, load, maxRows, row, save, washVar } from './state';
import './index.css';

type Theme = 'light' | 'dark';

function savedTheme(): Theme {
	try {
		return localStorage.getItem('card:theme') === 'dark' ? 'dark' : 'light';
	} catch {
		return 'light';
	}
}

const button =
	'cursor-pointer rounded-[12px] border border-border-strong bg-surface-raised px-3 py-1.5 text-sm font-bold text-ink hover:bg-surface-2 focus-ring disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted';
const primary =
	'cursor-pointer rounded-[12px] border border-transparent bg-primary px-[18px] py-[9px] text-sm leading-none font-bold text-on-primary shadow-primary transition-[background-color,scale] duration-(--dur-base) ease-out hover:bg-primary-cta-deep active:scale-[0.98] motion-reduce:transition-none focus-ring disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-ink-muted disabled:shadow-none';
const heading = 'text-[13px] font-bold text-ink-soft';

const overflows = (artboard: HTMLElement) =>
	[artboard, ...artboard.querySelectorAll<HTMLElement>('[data-clip]')].some(
		(el) => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1,
	);

function App() {
	const [card, setCard] = useState(load);
	const [saved, setSaved] = useState(true);
	const [theme, setTheme] = useState(savedTheme);
	const [overflow, setOverflow] = useState(false);
	const [exporting, setExporting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => setSaved(save(card)), [card]);

	useLayoutEffect(() => {
		document.documentElement.dataset.theme = theme;
		try {
			localStorage.setItem('card:theme', theme);
		} catch {
			setSaved(false);
		}
	}, [theme]);

	useLayoutEffect(() => {
		const artboard = document.getElementById('artboard')!;
		const measure = () => setOverflow(overflows(artboard));
		measure();
		document.fonts.ready.then(measure);
	}, [card]);

	function removeRow(id: string) {
		setCard((c) => {
			const rows = c.rows.filter((r) => r.id !== id);
			if (!rows.length) return c;
			return { ...c, rows, featured: c.featured.filter((f) => f !== id) };
		});
	}

	function addRow() {
		setCard((c) => {
			const last = c.rows[c.rows.length - 1];
			return c.rows.length < maxRows ? { ...c, rows: [...c.rows, row('New row', last.value, last.sub)] } : c;
		});
	}

	async function exportPng() {
		setError('');
		setExporting(true);
		try {
			await download(theme);
		} catch (e) {
			setError(`Export didn't work: ${e instanceof Error ? e.message : String(e)}`);
		} finally {
			setExporting(false);
		}
	}

	const warnings = [
		overflow && "Some text doesn't fit the card, so the export would cut it off. Shorten it or remove a row.",
		!barWidths(card.rows) && 'The values use different units, so no bars are drawn. Give every row the same unit.',
		!saved && "This browser won't save edits, so they'll be gone after a reload.",
	].filter((w) => typeof w === 'string');

	return (
		<div className="flex h-dvh">
			<aside className="flex w-72 shrink-0 flex-col border-r border-border bg-base text-sm">
				<div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-5">
					<section className="flex flex-col gap-2">
						<h2 className={heading}>Theme</h2>
						<div className="flex gap-2">
							{(['light', 'dark'] as const).map((t) => (
								<button key={t} type="button" aria-pressed={theme === t} className={`${button} flex-1 aria-pressed:border-primary-line aria-pressed:bg-primary-soft aria-pressed:text-primary-deep`} onClick={() => setTheme(t)}>
									{t === 'light' ? 'Light' : 'Dark'}
								</button>
							))}
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<h2 className={heading}>Background</h2>
						<div className="flex gap-2">
							{backgrounds.map(([value, name]) => (
								<button
									key={value}
									type="button"
									aria-label={`${name} wash`}
									title={`${name} wash`}
									aria-pressed={card.background === value}
									className={`${button} h-9 flex-1 hover:border-primary-line aria-pressed:border-primary`}
									style={{ background: washVar(value) }}
									onClick={() => setCard((c) => ({ ...c, background: value }))}
								/>
							))}
						</div>
					</section>

					<section className="flex flex-col gap-2">
						<h2 className={heading}>Rows, and which are featured</h2>
						{card.rows.map((r, i) => {
							const name = r.label || `row ${i + 1}`;
							return (
								<div key={r.id} className="flex items-center gap-2">
									<label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2">
										<input
											type="checkbox"
											aria-label={`Feature ${name}`}
											checked={card.featured.includes(r.id)}
											className="accent-primary"
											onChange={(e) => {
												const on = e.target.checked;
												setCard((c) => ({ ...c, featured: on ? [...c.featured, r.id] : c.featured.filter((f) => f !== r.id) }));
											}}
										/>
										<span className="truncate">{name}</span>
									</label>
									<button type="button" className={button} disabled={card.rows.length === 1} aria-label={`Remove row ${i + 1}`} onClick={() => removeRow(r.id)}>
										Remove
									</button>
								</div>
							);
						})}
						<button type="button" className={button} disabled={card.rows.length >= maxRows} onClick={addRow}>
							Add row
						</button>
					</section>

					<section className="flex flex-col gap-2">
						<h2 className={heading}>Code block</h2>
						<label htmlFor="show-code" className="flex cursor-pointer items-center gap-2">
							<input id="show-code" type="checkbox" checked={card.code.enabled} className="accent-primary" onChange={(e) => setCard((c) => ({ ...c, code: { ...c.code, enabled: e.target.checked } }))} />
							Show code
						</label>
						<select aria-label="Code language" value={card.code.lang} disabled={!card.code.enabled} className={button} onChange={(e) => setCard((c) => ({ ...c, code: { ...c.code, lang: e.target.value as Lang } }))}>
							{languages.map(([value, name]) => (
								<option key={value} value={value}>{name}</option>
							))}
						</select>
					</section>
				</div>

				<div className="flex flex-col gap-2 border-t border-border p-5">
					{warnings.map((w) => (
						<p key={w} role="status" className="rounded-[12px] border border-warning bg-warning-soft px-3 py-2 text-warning-deep">{w}</p>
					))}
					{error && <p role="alert" className="rounded-[12px] border border-danger bg-danger-soft px-3 py-2 text-danger-deep">{error}</p>}
					<button type="button" className={button} onClick={() => setCard(defaults())}>Reset</button>
					<button type="button" className={primary} disabled={exporting} onClick={exportPng}>
						{exporting ? 'Exporting…' : 'Export PNG'}
					</button>
				</div>
			</aside>
			<Stage>
				<BenchmarkCard
					card={card}
					onChange={setCard}
					code={card.code.enabled && <CodeBlock code={card.code} onChange={(patch) => setCard((c) => ({ ...c, code: { ...c.code, ...patch } }))} />}
				/>
			</Stage>
		</div>
	);
}

function Stage({ children }: { children: React.ReactNode }) {
	const stage = useRef<HTMLDivElement>(null);
	const [scale, setScale] = useState(1);

	useLayoutEffect(() => {
		const observer = new ResizeObserver(([entry]) =>
			setScale(Math.min(entry.contentRect.width / 1000, entry.contentRect.height / 562.5)),
		);
		observer.observe(stage.current!);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={stage} className="relative m-8 min-w-0 flex-1">
			<div className="absolute inset-0 grid place-items-center">
				<div className="overflow-hidden shadow-md" style={{ width: 1000 * scale, height: 562.5 * scale }}>
					<div className="origin-top-left" style={{ transform: `scale(${scale})` }}>
						{children}
					</div>
				</div>
			</div>
		</div>
	);
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
