import { useState } from 'react';
import { Collapsible } from '@base-ui/react/collapsible';
import { IconChevronDown } from '@tabler/icons-react';
import { TextMorph } from 'torph/react';

/** `html` is trusted Markdown compiled by the lesson document. */
export default function Answer({ html }: { html: string }) {
	const [open, setOpen] = useState(false);
	const [instant, setInstant] = useState(false);
	return (
		<Collapsible.Root open={open} onOpenChange={(next, details) => {
			setInstant(!(details.event instanceof MouseEvent) || details.event.detail === 0);
			setOpen(next);
		}} className="tutorial-answer border-t border-border pt-4">
			<h2 className="m-0">
				<Collapsible.Trigger className="group flex min-h-11 w-full cursor-pointer items-center justify-between gap-3 border-0 bg-transparent px-0 py-3 text-left font-display text-[1.375rem] leading-[1.15] font-normal text-ink focus-ring">
					<TextMorph as="span" duration={220} scale={false} disabled={instant}>{open ? 'Hide answer' : 'Show answer'}</TextMorph>
					<IconChevronDown size={16} stroke={1.5} aria-hidden="true" className="shrink-0 transition-transform duration-[220ms] ease-out group-data-[panel-open]:rotate-180 group-focus-visible:transition-none motion-reduce:transition-none" />
				</Collapsible.Trigger>
			</h2>
			<Collapsible.Panel hiddenUntilFound className="tutorial-answer-panel h-(--collapsible-panel-height) overflow-hidden transition-[height,opacity] duration-[220ms] ease-out data-[starting-style]:h-0 data-[starting-style]:opacity-0 data-[ending-style]:h-0 data-[ending-style]:opacity-0 motion-reduce:transition-none">
				<div className="sl-markdown-content pt-4" dangerouslySetInnerHTML={{ __html: html }} />
			</Collapsible.Panel>
		</Collapsible.Root>
	);
}
