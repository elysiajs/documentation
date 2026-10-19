import { useLayoutEffect, useRef, useState } from 'react';
import { Tabs, type TabsProps } from '../ui/tabs';

interface Props {
	label: string;
	tabs: { value: string; label: string; id: string; 'aria-controls': string }[];
	defaultValue: string;
	kind: 'page' | 'code';
}

export default function DocumentTabs({ label, tabs, defaultValue, kind }: Props) {
	const root = useRef<HTMLDivElement>(null);
	const [value, setValue] = useState(defaultValue);
	const panels = () => root.current?.closest('[data-document-tabs]')
		?.querySelectorAll<HTMLElement>(':scope > [role="tabpanel"]');

	useLayoutEffect(() => {
		const children = panels();
		if (!children) return;
		const sync = () => {
			const visible = Array.from(children).find((panel) => !panel.hidden);
			if (visible) setValue(visible.id);
		};
		const observer = new MutationObserver(sync);
		for (const panel of children)
			observer.observe(panel, { attributes: true, attributeFilter: ['hidden'] });
		sync();
		return () => observer.disconnect();
	}, []);

	const appearance: Pick<TabsProps, 'size' | 'variant' | 'tone'> = kind === 'code'
		? { size: 'sm', variant: 'ghost', tone: 'white' }
		: { size: 'md' };

	return <Tabs {...appearance} ref={root} tabs={tabs} value={value} aria-label={label}
		onChange={(next) => {
			for (const panel of panels() ?? []) panel.hidden = panel.id !== next;
			setValue(next);
		}} />;
}
