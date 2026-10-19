import { useEffect, useRef, useState } from 'react';
import { IconChevronDown } from '@tabler/icons-react';
import { Button } from '../ui/button';
import { Dropdown } from '../ui/dropdown';

export default function TitleNavigation({ labels }: { labels: string[] }) {
	const container = useRef<HTMLDivElement>(null);
	const [active, setActive] = useState(0);

	useEffect(() => {
		const root = container.current?.closest<HTMLElement>('[data-interactive-doc]');
		if (!root) return;
		const update = () => {
			const section = root.querySelector<HTMLElement>('[data-code-step][data-active]');
			setActive(Number(section?.dataset.codeStep ?? 0));
		};
		root.addEventListener('interactive-doc:step-change', update);
		update();
		return () => root.removeEventListener('interactive-doc:step-change', update);
	}, []);

	return (
		<Dropdown
			ref={container}
			className="m-0 min-w-0"
			data-code-navigation
			trigger={
				<Button variant="ghost" size="sm" className="max-w-full gap-1 px-2 text-xs font-normal">
					<span className="sr-only">In this example: </span>
					<span className="min-w-0 truncate" data-code-title>{labels[active]}</span>
					<IconChevronDown size={14} stroke={1.5} className="shrink-0" aria-hidden="true" />
				</Button>
			}
			items={labels.map((label, index) => ({
				label: <span aria-current={index === active ? 'location' : undefined} className="aria-[current=location]:font-semibold aria-[current=location]:text-primary">{label}</span>,
				onSelect: () => {
					const root = container.current?.closest<HTMLElement>('[data-interactive-doc]');
					const heading = root?.querySelector<HTMLElement>(`[data-code-step="${index}"] :is(h2, h3)[id]`);
					if (!heading) return;
					history.pushState(null, '', `#${encodeURIComponent(heading.id)}`);
					heading.scrollIntoView({ block: 'center' });
				},
			}))}
		/>
	);
}
