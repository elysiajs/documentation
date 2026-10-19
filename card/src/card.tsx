import { useLayoutEffect, useRef } from 'react';
// ?url: the docs' tsconfig also checks card/, and Astro types a bare .svg import as a component
import logo from '../../public/assets/elysia_v.svg?url';
import { barWidths } from './bars';
import { type Benchmark, type Row, washVar } from './state';

type Update = (update: (card: Benchmark) => Benchmark) => void;
type TextField = 'title' | 'claim' | 'claimRest' | 'caption' | 'method';

function Editable({ value, onChange, label, className = '' }: {
	value: string;
	onChange: (value: string) => void;
	label: string;
	className?: string;
}) {
	const ref = useRef<HTMLSpanElement>(null);

	useLayoutEffect(() => {
		if (ref.current!.textContent !== value) ref.current!.textContent = value;
	}, [value]);

	return (
		<span
			ref={ref}
			role="textbox"
			aria-label={label}
			data-editable=""
			contentEditable="plaintext-only"
			spellCheck={false}
			className={`inline-block min-w-[1ch] ${className}`}
			onInput={(e) => onChange(e.currentTarget.textContent ?? '')}
			onKeyDown={(e) => {
				if (e.key !== 'Enter' || e.nativeEvent.isComposing) return;
				e.preventDefault();
				e.currentTarget.blur();
			}}
			onPaste={(e) => {
				e.preventDefault();
				document.execCommand('insertText', false, e.clipboardData.getData('text/plain').replace(/\s*[\r\n]+\s*/g, ' '));
			}}
		/>
	);
}

// drop-shadow, not box-shadow: it traces the clipped fill instead of being clipped with it
const glow =
	'drop-shadow(0 4px 9px color-mix(in oklab, var(--color-bloom) 45%, transparent)) drop-shadow(0 8px 14px color-mix(in oklab, var(--color-harmony-center) 30%, transparent))';

const sparkle ='M12.5 1Q15 10 24 12.5Q15 15 12.5 24Q10 15 1 12.5Q10 10 12.5 1Z';

function StarChart() {
	return (
		<svg aria-hidden="true" width="1000" height="200" viewBox="0 0 1000 200" className="absolute top-0 left-0 -z-10 opacity-45">
			<path d={sparkle} className="fill-harmony-left" transform="translate(600 104) scale(.5)" />
			<path d={sparkle} className="fill-harmony-center" transform="translate(744 146) scale(.36)" />
			<path d={sparkle} className="fill-harmony-right" transform="translate(972 42) scale(.44)" />
		</svg>
	);
}

export function BenchmarkCard({ card, onChange, code }: { card: Benchmark; onChange: Update; code?: React.ReactNode }) {
	const text = (field: TextField) => ({
		value: card[field],
		onChange: (value: string) => onChange((c) => ({ ...c, [field]: value })),
	});
	const setRow = (id: string, patch: Partial<Row>) =>
		onChange((c) => ({ ...c, rows: c.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) }));
	const widths = barWidths(card.rows);
	const dense = card.rows.length > 5;
	const compact = !!code && card.rows.length >= 5;

	return (
		<div
			id="artboard"
			className="relative isolate flex h-[562.5px] w-[1000px] flex-col overflow-clip text-ink"
			style={{ background: washVar(card.background) }}
		>
			<StarChart />
			<div className="flex min-h-0 flex-1 flex-col px-12 pt-6 pb-6">
				<header className="flex items-center gap-5">
					<h1 className="font-display text-[36px] leading-none text-ink-muted">
						<Editable label="Title" {...text('title')} />
					</h1>
					<img src={logo} alt="" width={115} height={64} className="ml-auto h-16 w-auto shrink-0" />
				</header>

				<div
					data-clip=""
					className={`mt-0 min-h-0 flex-1 overflow-clip [overflow-clip-margin:36px] ${code ? 'grid grid-cols-[58fr_42fr] grid-rows-[auto_minmax(0,1fr)] gap-x-8' : 'flex flex-col'}`}
				>
					{/* wrap-anywhere goes on the spans: Chrome's contenteditable forces overflow-wrap: break-word there */}
					<p className="w-fit whitespace-nowrap -translate-y-4 bg-linear-to-r from-primary to-harmony-right-deep bg-clip-text font-display text-[64px] leading-[1.05] text-transparent caret-primary">
						<Editable label="Claim highlight" className={`text-[108px] mr-2 ${code ? 'wrap-anywhere' : ''}`} {...text('claim')} />{' '}
						<Editable label="Claim text" className={code ? 'wrap-anywhere' : ''} {...text('claimRest')} />
					</p>
					<div className={`${dense || compact ? '' : 'mt-3'} grid min-h-0 flex-1 gap-8`}>
						{/* minmax(auto, …), not 0: rows that can't fit overflow and warn instead of overlapping */}
						<div className={`grid min-h-0 content-start ${compact ? 'auto-rows-[minmax(auto,50px)] grid-cols-[1fr_max-content] gap-x-4 gap-y-2' : code ? 'auto-rows-[minmax(auto,76px)] grid-cols-[1fr_max-content] gap-x-4 gap-y-4' : 'auto-rows-[minmax(auto,72px)] grid-cols-[max-content_1fr_max-content] gap-x-5 gap-y-1.5'}`}>
							{card.rows.map((r, i) => {
								const featured = card.featured.includes(r.id);
								return (
									<div key={r.id} className={`col-span-full grid grid-cols-subgrid items-center ${code ? 'content-center' : ''}`}>
										<span className={`text-[17px] font-bold ${code ? 'col-span-full leading-tight' : ''} ${featured ? 'text-primary-deep' : 'text-ink-soft'}`}>
											<Editable label={`Row ${i + 1} label`} value={r.label} onChange={(label) => setRow(r.id, { label })} />
										</span>
										<div className={`rounded-full border border-border bg-base p-[3px] ${compact ? 'h-7' : code ? 'h-9' : 'h-full max-h-10'}`}>
											{!!widths?.[i] && (
												<div className="h-full" style={featured ? { filter: glow } : undefined}>
													<div className="relative h-full overflow-hidden rounded-full [container-type:size]">
														<div
															className={`absolute inset-y-0 rounded-full ${featured ? 'bg-linear-to-r from-bloom to-harmony-right' : 'bg-harmony-center-line'}`}
															style={{ left: 0, width: `max(${widths[i]}%, 100cqh)` }}
														/>
													</div>
												</div>
											)}
										</div>
										<div className="text-right">
											<div className={`font-display leading-none ${dense ? 'text-[24px]' : 'text-[28px]'}`}>
												<Editable label={`Row ${i + 1} value`} value={r.value} onChange={(value) => setRow(r.id, { value })} />
											</div>
											<div className={`leading-tight text-ink-muted mt-0.5 ${dense ? 'text-[12px]' : 'text-[13px]'}`}>
												<Editable label={`Row ${i + 1} detail`} value={r.sub} onChange={(sub) => setRow(r.id, { sub })} />
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
					{code && <div className="self-end col-start-2 row-span-2 row-start-1 flex min-w-0 flex-col mb-3">{code}</div>}
				</div>

				<div className="mt-4 flex items-baseline justify-between gap-8 text-ink-muted">
					<p className="text-[18px] font-bold">
						<Editable label="Caption" {...text('caption')} />
					</p>
					<p className="text-right text-[14px] text-ink-soft">
						<Editable label="Method" {...text('method')} />
					</p>
				</div>
			</div>
		</div>
	);
}
