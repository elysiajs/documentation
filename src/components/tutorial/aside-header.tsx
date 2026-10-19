import { useEffect, useRef, useState } from 'react';
import { IconBook, IconMoon, IconSchool, IconSun } from '@tabler/icons-react';
import { IconButton } from '../ui/icon-button';
import type { StarlightRouteData } from '@astrojs/starlight/route-data';
import Breadcrumb from '../breadcrumb';
import { Tabs } from '../ui/tabs';
import { chapters } from './lessons';
import { tutorialStore, useTutorialStore } from './store';
import { animateThemeChange } from '../../lib/theme-transition';

const tabs = [
	{ value: 'task', label: 'Task', icon: <IconSchool size={18} stroke={1.5} /> },
	{ value: 'docs', label: 'Docs', icon: <IconBook size={18} stroke={1.5} /> },
];

export default function AsideHeader({ lesson }: { lesson: string }) {
	const tab = useTutorialStore((state) => state.asideTab);
	const tabsRef = useRef<HTMLDivElement>(null);
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const href = lesson === 'index' ? '/tutorial/' : `/tutorial/${lesson}/`;
	const sidebar: StarlightRouteData['sidebar'] = chapters.map(({ title, lessons }) => ({
		type: 'group', label: title, collapsed: false, badge: undefined,
		entries: lessons.map(({ title, href: lessonHref }) => ({
			type: 'link', label: title, href: lessonHref, isCurrent: lessonHref === href,
			attrs: {}, badge: undefined,
		})),
	}));
	const current = chapters.flatMap(({ lessons }) => lessons).find((lesson) => lesson.href === href);

	useEffect(() => {
		setTheme(document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
	}, []);

	// The lesson document is static markup, so the island drives the two regions through the DOM.
	// `data-aside` on the shell also lets the aside shrink to the header when both are hidden.
	useEffect(() => {
		document.querySelector<HTMLElement>('[data-tutorial-shell]')?.setAttribute('data-aside', tab ?? 'none');
		const task = document.querySelector<HTMLElement>('[data-tutorial-task]');
		const docs = document.querySelector<HTMLElement>('[data-tutorial-docs]');
		if (task) task.hidden = tab !== 'task';
		if (docs) docs.hidden = tab !== 'docs';
	}, [tab]);

	// One delegated listener for every <DocLink> on the page — the links themselves ship no JS,
	// and keep working as ordinary navigation when a modifier key is held or hydration fails.
	useEffect(() => {
		const onClick = (event: MouseEvent) => {
			if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
			const link = (event.target as Element | null)?.closest?.('a[data-doc-link]');
			if (!(link instanceof HTMLAnchorElement)) return;
			event.preventDefault();
			const doc = link.getAttribute('href') || '/';
			const frame = document.querySelector<HTMLIFrameElement>('[data-tutorial-docs] iframe');
			if (frame) frame.src = doc;
			tutorialStore.set({ asideTab: 'docs', doc });
			tabsRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[1]?.focus();
		};
		document.addEventListener('click', onClick);
		return () => document.removeEventListener('click', onClick);
	}, []);

	const toggleTheme = () => {
		const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
		animateThemeChange(next, () => {
			document.documentElement.dataset.theme = next;
			try {
				localStorage.setItem('starlight-theme', next);
			} catch {
				// Theme changes still work when storage is blocked.
			}
			setTheme(next);
		});
	};

	return (
		<div className="spica-surface flex flex-none flex-col gap-2 border-b border-border pl-4 pr-2.5 pt-2.5 pb-1">
			<div className="flex items-center gap-2">
				<a href="/" className="mr-auto flex min-w-0 items-center gap-1.5 rounded-lg text-ink no-underline focus-ring">
					<img src="/assets/elysia.svg" alt="" width={22} height={22} className="flex-none" />
					<span className="truncate font-display text-[17px] leading-none">Elysia</span>
				</a>
				<Tabs
					ref={tabsRef}
					size="sm"
					tone="white"
					aria-label="Aside panel"
					className="flex-none"
					tabs={tabs}
					value={tab ?? 'none'}
					onChange={(value) => tutorialStore.set({ asideTab: value as 'task' | 'docs' })}
				/>
				<IconButton
					size="sm"
					variant="ghost"
					className="flex-none"
					label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
					onClick={toggleTheme}
				>
					<IconSun size={18} stroke={1.5} className="hidden light:block" />
					<IconMoon size={18} stroke={1.5} className="light:hidden" />
				</IconButton>
			</div>
			<Breadcrumb
				sidebar={sidebar}
				title={current?.title ?? 'Tutorial'}
				root={null}
				className="mb-0 text-ink-soft [&_[aria-current=page]]:text-ink -ml-2.5"
			/>
		</div>
	);
}
