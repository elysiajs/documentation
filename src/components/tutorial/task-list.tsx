import { memo, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Confetti } from '@neoconfetti/react';
import { IconCircle, IconCircleCheck } from '@tabler/icons-react';
import NumberFlow from '@number-flow/react';
import { tutorialStore, useTutorialStore } from './store';

export interface TaskRow {
	title: string;
	description: string;
}

// The confetti package restarts on render; keep a burst stable as store results update.
const ConfettiBurst = memo(Confetti);
const confettiColors = ['var(--color-primary)', 'var(--color-harmony-left)', 'var(--color-harmony-right)'];
const numberTiming = { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' };

export default function TaskList({ testcases }: { testcases: TaskRow[] }) {
	const results = useTutorialStore((state) => state.testcasesResult);
	const passedAll = testcases.length > 0 && results.length === testcases.length && results.every(Boolean);
	const passedCount = testcases.filter((_, index) => results[index] === true).length;
	const section = useRef<HTMLElement>(null);
	const previousPassed = useRef<boolean | undefined>(undefined);
	const [emitter, setEmitter] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
	const [reduced, setReduced] = useState(true);

	useEffect(() => {
		const query = matchMedia('(prefers-reduced-motion: reduce)');
		const sync = () => setReduced(query.matches);
		sync();
		query.addEventListener('change', sync);
		return () => query.removeEventListener('change', sync);
	}, []);

	useEffect(() => {
		// Hydration can first show the server snapshot, then an already-passed client store.
		const current = tutorialStore.get().testcasesResult;
		const currentPassed = testcases.length > 0 && current.length === testcases.length && current.every(Boolean);
		if (previousPassed.current === undefined) {
			previousPassed.current = currentPassed;
			return;
		}
		if (passedAll !== currentPassed) return;
		const newlyPassed = passedAll && !previousPassed.current;
		previousPassed.current = passedAll;
		setEmitter(null);
		if (!newlyPassed || reduced) return;
		let expiry: ReturnType<typeof setTimeout>;
		const timer = setTimeout(() => {
			const element = section.current;
			if (!element || document.visibilityState === 'hidden' || !element.getClientRects().length || getComputedStyle(element).visibility !== 'visible') return;
			const bounds = element.getBoundingClientRect();
			const pane = element.closest('[data-tutorial-task]')?.getBoundingClientRect();
			const left = Math.max(0, bounds.left, pane?.left ?? 0);
			const right = Math.min(innerWidth, bounds.right, pane?.right ?? innerWidth);
			const top = Math.max(0, bounds.top, pane?.top ?? 0);
			const bottom = Math.min(innerHeight, bounds.bottom, pane?.bottom ?? innerHeight);
			if (right <= left || bottom <= top) return;
			setEmitter({ x: (left + right) / 2, y: bottom, width: innerWidth, height: Math.max(1, innerHeight - bottom) });
			expiry = setTimeout(() => setEmitter(null), 2500);
		}, 400);
		return () => { clearTimeout(timer); clearTimeout(expiry); };
	}, [passedAll, reduced]);

	if (!testcases.length) return null;

	return (
		<section ref={section} aria-label="Assignments">
			{emitter && !reduced ? createPortal(
				<div data-tutorial-confetti className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true">
					<div className="absolute" style={{ left: emitter.x, top: emitter.y }}>
						<ConfettiBurst particleCount={90} particleSize={6} force={0.6} duration={2500} stageWidth={emitter.width} stageHeight={emitter.height} colors={confettiColors} />
					</div>
				</div>, document.body
			) : null}
			<div className="flex items-center justify-between gap-3 pb-1">
				<h2 className="m-0 font-sans text-xs font-semibold text-ink-soft">Assignments</h2>
				<p className="m-0 text-xs text-ink-soft" aria-live="polite" aria-atomic="true">
					<span className="sr-only">{`${passedCount} of ${testcases.length} assignments passed`}</span>
					<span aria-hidden="true"><NumberFlow value={passedCount} suffix={` of ${testcases.length} assignments passed`} animated={!reduced} transformTiming={numberTiming} spinTiming={numberTiming} /></span>
				</p>
			</div>
			<ol className="m-0 list-none p-0">
				{testcases.map(({ title, description }, index) => {
					const passed = results[index] === true;
					return (
						<li key={title} className="flex items-start gap-2.5 border-0 border-b border-solid border-border py-3 last:border-b-0">
							{passed ? <IconCircleCheck aria-hidden size={18} stroke={1.5} className="mt-0.5 shrink-0 text-success-deep" /> : <IconCircle aria-hidden size={18} stroke={1.5} className="mt-0.5 shrink-0 text-ink-muted" />}
							<div className="min-w-0 flex-1">
								<div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
									<h3 className="m-0 font-sans text-sm font-semibold text-ink">{title}</h3>
									<span className={passed ? 'text-xs text-success-deep' : 'sr-only'}>{passed ? 'Passed' : 'Not passed yet'}</span>
								</div>
								<p className="m-0 mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>
							</div>
						</li>
					);
				})}
			</ol>
		</section>
	);
}
