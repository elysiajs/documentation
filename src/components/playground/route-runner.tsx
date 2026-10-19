import { useState } from 'react';
import { SelectMenu } from '../ui/select-menu';

export interface PlaygroundExample {
	method: string;
	displayPath: string;
	response: string;
}

export function RouteRunner({ routes }: { routes: PlaygroundExample[] }) {
	const [selected, setSelected] = useState('0');
	const options = routes.map(({ method, displayPath }, index) => ({ value: String(index), label: `${method} ${displayPath}` }));
	return <div className="spica-surface not-content playground mt-1.5 min-w-0 text-ink [--preview-surface:var(--color-base)]" data-playground aria-label="Route playground" role="region">
		<header className="flex items-end p-0">
			<div className="playground__tab relative z-1 -mb-px max-w-[calc(100%-1rem-1px)] rounded-t-[0.875rem] border border-b-0 border-border bg-(--preview-surface) p-0.5">
				<SelectMenu aria-label="Route" variant="ghost" value={selected} onChange={value => { if (value !== null) setSelected(value); }} options={options} style={{ width: `${Math.max(...options.map(option => option.label.length)) + 6}ch`, maxWidth: '100%' }} />
			</div>
		</header>
		<pre className="m-0 box-border min-h-48 max-h-[32rem] overflow-auto rounded-[0_1rem_1rem_1rem] border border-border [background:var(--surface-wash-iris)] px-3.5 py-1 font-mono text-sm leading-[1.6] whitespace-pre-wrap [overflow-wrap:anywhere] focus-visible:[outline:var(--focus-outline)] focus-visible:outline-offset-[-4px]" tabIndex={0} role="region" aria-label="Response" aria-live="polite" aria-atomic="true" data-playground-response>{routes[Number(selected)].response}</pre>
	</div>;
}
