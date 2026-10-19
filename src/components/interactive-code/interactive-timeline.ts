import { curvedRail, type RailPoint } from './curved-rail';

export function timelinePath(trunkX: number, markers: RailPoint[], intro?: { x: number; gap: number; radius: number }) {
	if (!markers.length) return { path: '', top: 0, height: 0 };
	const top = intro ? -intro.gap : markers[0].y;
	const points = markers.map(({ x, y }) => ({ x, y: y - top }));
	let path = curvedRail(points);
	if (intro) {
		const direction = Math.sign(trunkX - intro.x);
		const r = Math.max(0, Math.min(intro.radius, Math.abs(intro.x - trunkX) / 2, intro.gap, markers[0].y));
		const start = { x: trunkX, y: intro.gap + r };
		path = `M ${intro.x},0 V ${intro.gap - r} Q ${intro.x},${intro.gap} ${intro.x + direction * r},${intro.gap} H ${trunkX - direction * r} Q ${trunkX},${intro.gap} ${trunkX},${intro.gap + r}`;
		path += curvedRail([start, ...points]).slice(curvedRail([start]).length);
	}
	return { path, top, height: points.at(-1)!.y };
}

let timelineId = 0;

export function enhanceTimeline(root: HTMLElement, signal: AbortSignal) {
	const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-code-step]'));
	if (signal.aborted || !sections.length) return;
	const previous = root.previousElementSibling;
	const intro = previous?.matches('.content-layout') ? previous : undefined;
	const track = document.createElement('div');
	track.dataset.timeline = '';
	track.setAttribute('aria-hidden', 'true');
	const id = `interactive-timeline-${timelineId++}`;
	track.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" x2="0" gradientUnits="userSpaceOnUse"><stop stop-color="var(--color-harmony-left)"/><stop offset="0.5" stop-color="var(--color-harmony-center)"/><stop offset="1" stop-color="var(--color-harmony-right)"/></linearGradient></defs><path stroke="var(--color-border)"/><path data-timeline-progress stroke="url(#${id})" stroke-width="2"/></svg>`;
	root.prepend(track);
	const svg = track.querySelector('svg')!;
	const paths = track.querySelectorAll('path');
	const gradient = track.querySelector('linearGradient')!;

	const update = () => {
		if (signal.aborted) return;
		const bounds = root.getBoundingClientRect();
		const rem = Number.parseFloat(getComputedStyle(document.documentElement).fontSize);
		const markers = sections.map((section) => {
			const box = section.getBoundingClientRect();
			const marker = getComputedStyle(section, '::after');
			return {
				x: box.left - bounds.left + Number.parseFloat(marker.left) + Number.parseFloat(marker.width) / 2,
				y: box.top - bounds.top + Number.parseFloat(marker.top) + Number.parseFloat(marker.height) / 2,
			};
		});
		const trunkX = sections[0].getBoundingClientRect().left - bounds.left + rem / 2;
		const introBox = intro?.getBoundingClientRect();
		const geometry = timelinePath(trunkX, markers, introBox ? {
			x: introBox.left - bounds.left + 2 * rem,
			gap: bounds.top - introBox.bottom,
			radius: rem,
		} : undefined);
		if (!Number.isFinite(geometry.height) || geometry.height <= 0) return;
		const colors = ['left', 'center', 'right'];
		for (const [index, marker] of markers.entries()) {
			const position = (marker.y - geometry.top) / geometry.height * 2;
			const segment = Math.min(Math.floor(position), 1);
			sections[index].style.setProperty('--timeline-marker-color', `color-mix(in srgb, var(--color-harmony-${colors[segment]}), var(--color-harmony-${colors[segment + 1]}) ${(position - segment) * 100}%)`);
		}
		track.style.top = `${geometry.top}px`;
		track.style.width = `${bounds.width}px`;
		track.style.height = `${geometry.height}px`;
		svg.setAttribute('viewBox', `0 0 ${bounds.width} ${geometry.height}`);
		gradient.setAttribute('y1', '0');
		gradient.setAttribute('y2', String(geometry.height));
		for (const path of paths) path.setAttribute('d', geometry.path);
		root.setAttribute('data-timeline-ready', '');
	};

	const observer = new ResizeObserver(update);
	observer.observe(root);
	for (const section of sections) observer.observe(section);
	if (intro) observer.observe(intro);
	root.addEventListener('interactive-doc:enhanced', update, { signal });
	signal.addEventListener('abort', () => {
		observer.disconnect();
		track.remove();
		root.removeAttribute('data-timeline-ready');
	}, { once: true });
	void document.fonts.ready.then(update);
	update();
}
